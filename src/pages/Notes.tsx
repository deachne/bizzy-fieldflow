import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Plus, Search, FileText, Calendar, Tag, Trash2, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAIProcessor } from '@/hooks/useAIProcessor';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  tags: string[];
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { processNote, isProcessing } = useAIProcessor();

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes: Note[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('note_')) {
        try {
          const noteData = JSON.parse(localStorage.getItem(key) || '');
          savedNotes.push({
            id: key,
            title: noteData.title || 'Untitled',
            content: noteData.content || '',
            timestamp: noteData.timestamp || Date.now(),
            tags: extractTags(noteData.content || '')
          });
        } catch (error) {
          console.error('Failed to parse note:', key, error);
        }
      }
    }
    
    // Sort by timestamp, newest first
    savedNotes.sort((a, b) => b.timestamp - a.timestamp);
    setNotes(savedNotes);
  }, []);

  const extractTags = (content: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = content.match(tagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: 'New Note',
      content: '',
      timestamp: Date.now(),
      tags: []
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const handleSaveNote = (content: string, title: string) => {
    if (!selectedNote) return;
    
    const updatedNote = {
      ...selectedNote,
      title: title || 'Untitled',
      content,
      tags: extractTags(content),
      timestamp: Date.now()
    };

    // Save to localStorage
    localStorage.setItem(selectedNote.id, JSON.stringify(updatedNote));
    
    // Update state
    const updatedNotes = notes.map(note => 
      note.id === selectedNote.id ? updatedNote : note
    );
    updatedNotes.sort((a, b) => b.timestamp - a.timestamp);
    setNotes(updatedNotes);
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  const handleDeleteNote = (noteId: string) => {
    localStorage.removeItem(noteId);
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const handleProcessWithAI = async () => {
    if (!selectedNote) return;
    
    try {
      toast.loading('AI is processing your note...', { id: 'ai-process' });
      await processNote(selectedNote.content, selectedNote.title);
      toast.success('Note processed and sent to inbox!', { id: 'ai-process' });
    } catch (error) {
      toast.error('Failed to process note', { id: 'ai-process' });
    }
  };

  if (isEditing && selectedNote) {
    return (
      <div className="h-full">
        <MarkdownEditor
          initialContent={selectedNote.content}
          title={selectedNote.title}
          onSave={handleSaveNote}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Notes List Sidebar */}
      <div className="w-80 border-r bg-card flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">Notes</h1>
            <Button onClick={handleCreateNote} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </p>
              {!searchQuery && (
                <Button variant="ghost" size="sm" onClick={handleCreateNote} className="mt-2">
                  Create your first note
                </Button>
              )}
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {filteredNotes.map((note) => (
                <Card 
                  key={note.id}
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    selectedNote?.id === note.id ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm truncate flex-1 mr-2">
                        {note.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {note.content.replace(/[#*`\[\]]/g, '').substring(0, 100)}
                      {note.content.length > 100 && '...'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(note.timestamp, { addSuffix: true })}
                      </div>
                      
                      {note.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-muted-foreground" />
                          <div className="flex gap-1">
                            {note.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                            {note.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                +{note.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note View/Edit */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <div className="h-full">
            {/* Header */}
            <div className="p-4 border-b bg-card flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{selectedNote.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Last modified {formatDistanceToNow(selectedNote.timestamp, { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleProcessWithAI}
                  disabled={isProcessing}
                  variant="outline"
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'AI Process & Send'}
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  Edit Note
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-auto">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: selectedNote.content
                    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 text-foreground">$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 text-foreground">$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 text-foreground">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                    .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
                    .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
                    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
                    .replace(/\n/g, '<br />')
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No note selected</h3>
              <p className="text-muted-foreground mb-4">
                Choose a note from the sidebar or create a new one
              </p>
              <Button onClick={handleCreateNote}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}