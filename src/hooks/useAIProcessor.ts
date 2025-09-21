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
