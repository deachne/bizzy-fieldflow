import { useState } from 'react';

interface ProcessedNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  suggestedActions: string[];
  timestamp: number;
}

export function useAIProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processNote = async (content: string, title: string): Promise<ProcessedNote> => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // AI Processing Logic
      const cleanedContent = cleanupContent(content);
      const extractedTags = extractAITags(cleanedContent);
      const suggestedActions = generateSuggestedActions(cleanedContent, extractedTags);
      const cleanedTitle = cleanupTitle(title);

      const processedNote: ProcessedNote = {
        id: `processed_${Date.now()}`,
        title: cleanedTitle,
        content: cleanedContent,
        tags: extractedTags,
        suggestedActions,
        timestamp: Date.now()
      };

      // Send to inbox
      const existingInboxItems = JSON.parse(localStorage.getItem('inbox_items') || '[]');
      const inboxItem = {
        id: Date.now(),
        type: 'note',
        title: processedNote.title,
        content: processedNote.content.substring(0, 200) + (processedNote.content.length > 200 ? '...' : ''),
        timestamp: new Date().toLocaleString(),
        date: new Date().toISOString().split('T')[0],
        tags: processedNote.tags,
        suggestedActions: processedNote.suggestedActions,
        icon: 'FileText',
        color: 'primary',
        fullContent: processedNote.content
      };
      
      existingInboxItems.unshift(inboxItem);
      localStorage.setItem('inbox_items', JSON.stringify(existingInboxItems));

      // Extract and save tasks to Knowledge Hub
      const extractedTasks = extractTasks(cleanedContent, cleanedTitle);
      if (extractedTasks.length > 0) {
        const existingKnowledgeItems = JSON.parse(localStorage.getItem('knowledge_items') || '[]');
        const newKnowledgeItems = [...existingKnowledgeItems, ...extractedTasks];
        localStorage.setItem('knowledge_items', JSON.stringify(newKnowledgeItems));
      }

      return processedNote;
    } finally {
      setIsProcessing(false);
    }
  };

  return { processNote, isProcessing };
}

// AI Content Cleanup
function cleanupContent(content: string): string {
  return content
    // Fix common markdown issues
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .replace(/^\s*-\s*/gm, '- ') // Fix list formatting
    .replace(/^\s*\*\s*/gm, '* ') // Fix asterisk lists
    .replace(/^\s*(\d+)\.\s*/gm, '$1. ') // Fix numbered lists
    .replace(/#{1,6}\s*/g, (match) => match.trim() + ' ') // Fix header spacing
    .replace(/\*\*([^*]+)\*\*/g, '**$1**') // Fix bold formatting
    // Clean up spacing and grammar
    .replace(/([.!?])\s*([a-z])/g, '$1 $2') // Fix sentence spacing
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim();
}

// AI Title Cleanup
function cleanupTitle(title: string): string {
  return title
    .replace(/^[^a-zA-Z0-9]*/, '') // Remove leading non-alphanumeric
    .replace(/[^a-zA-Z0-9]*$/, '') // Remove trailing non-alphanumeric
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
    .slice(0, 60) // Limit length
    || 'Processed Note';
}

// AI Tag Extraction
function extractAITags(content: string): string[] {
  const tags = new Set<string>();
  const lowerContent = content.toLowerCase();

  // Existing hash tags
  const hashTags = content.match(/#(\w+)/g);
  if (hashTags) {
    hashTags.forEach(tag => tags.add(tag.substring(1).toLowerCase()));
  }

  // AI-suggested contextual tags
  const contextualTags = [
    { keywords: ['equipment', 'tractor', 'plow', 'harvester', 'machinery'], tag: 'equipment' },
    { keywords: ['field', 'crop', 'plant', 'harvest', 'soil'], tag: 'farming' },
    { keywords: ['weather', 'rain', 'temperature', 'forecast'], tag: 'weather' },
    { keywords: ['task', 'todo', 'need', 'fix', 'repair'], tag: 'action-item' },
    { keywords: ['meeting', 'call', 'appointment', 'schedule'], tag: 'calendar' },
    { keywords: ['expense', 'cost', 'price', 'budget', 'money'], tag: 'financial' },
    { keywords: ['note', 'reminder', 'important', 'remember'], tag: 'reminder' },
    { keywords: ['research', 'study', 'learn', 'information'], tag: 'knowledge' }
  ];

  contextualTags.forEach(({ keywords, tag }) => {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      tags.add(tag);
    }
  });

  return Array.from(tags).slice(0, 5); // Limit to 5 tags
}

// AI Suggested Actions
function generateSuggestedActions(content: string, tags: string[]): string[] {
  const actions = new Set<string>();
  const lowerContent = content.toLowerCase();

  // Based on content analysis
  if (lowerContent.includes('fix') || lowerContent.includes('repair') || lowerContent.includes('broken')) {
    actions.add('Create Task');
  }
  
  if (lowerContent.includes('meeting') || lowerContent.includes('appointment') || lowerContent.includes('schedule')) {
    actions.add('Add to Calendar');
  }
  
  if (lowerContent.includes('expense') || lowerContent.includes('cost') || lowerContent.includes('price')) {
    actions.add('Add to Budget');
  }
  
  if (tags.includes('farming') || tags.includes('equipment')) {
    actions.add('Add to Forge');
  }
  
  if (tags.includes('knowledge') || tags.includes('research')) {
    actions.add('Add to Library');
  }

  // Default actions
  actions.add('Add to Journal');
  actions.add('Archive');

  return Array.from(actions).slice(0, 4); // Limit to 4 actions
}

// Extract Tasks from Content
function extractTasks(content: string, noteTitle: string): any[] {
  const tasks = [];
  const lines = content.split('\n');
  
  // Look for task patterns: - [ ], - [x], TODO:, TASK:, etc.
  const taskPatterns = [
    /^[\s]*[-*]\s*\[\s*\]\s*(.+)$/gim, // - [ ] task
    /^[\s]*[-*]\s*\[x\]\s*(.+)$/gim,   // - [x] completed task  
    /^[\s]*(?:TODO|TASK|Action|Fix|Repair):\s*(.+)$/gim, // TODO: task
    /(?:need to|should|must|have to|remember to)\s+(.+?)(?:\.|$)/gi, // natural language tasks
  ];

  let taskId = Date.now();
  
  taskPatterns.forEach((pattern, patternIndex) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const taskText = match[1]?.trim();
      if (taskText && taskText.length > 3) {
        const isCompleted = patternIndex === 1; // [x] pattern
        
        tasks.push({
          id: taskId++,
          type: 'task',
          title: taskText.length > 60 ? taskText.substring(0, 60) + '...' : taskText,
          content: `Task extracted from note: "${noteTitle}"\n\n${taskText}`,
          tags: ['task', 'extracted', ...extractTaskTags(taskText)],
          date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          module: 'Hub',
          status: isCompleted ? 'completed' : 'pending',
          sourceNote: noteTitle
        });
      }
    }
  });

  return tasks;
}

// Extract task-specific tags
function extractTaskTags(taskText: string): string[] {
  const tags = [];
  const lowerText = taskText.toLowerCase();
  
  const taskTagMappings = [
    { keywords: ['fix', 'repair', 'broken', 'maintenance'], tag: 'maintenance' },
    { keywords: ['buy', 'purchase', 'order', 'get'], tag: 'procurement' },
    { keywords: ['call', 'contact', 'phone', 'email'], tag: 'communication' },
    { keywords: ['plant', 'seed', 'harvest', 'crop'], tag: 'farming' },
    { keywords: ['equipment', 'tractor', 'combine', 'machinery'], tag: 'equipment' },
    { keywords: ['urgent', 'asap', 'important', 'critical'], tag: 'priority' },
    { keywords: ['meeting', 'schedule', 'appointment'], tag: 'calendar' },
  ];
  
  taskTagMappings.forEach(({ keywords, tag }) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      tags.push(tag);
    }
  });
  
  return tags.slice(0, 3); // Limit task tags
}
