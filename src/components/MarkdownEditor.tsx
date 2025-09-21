import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, List, Link, Code, Quote, Eye, Edit, Save, Download, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface MarkdownEditorProps {
  initialContent?: string;
  onSave?: (content: string, title: string) => void;
  title?: string;
}

export function MarkdownEditor({ initialContent = '', onSave, title: initialTitle = '' }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newContent);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const renderMarkdownPreview = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 text-foreground">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 text-foreground">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 text-foreground">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/\n/g, '<br />');
  };

  const handleSave = () => {
    if (onSave) {
      onSave(content, title);
    }
    // Also save to localStorage
    localStorage.setItem(`note_${Date.now()}`, JSON.stringify({ title, content, timestamp: Date.now() }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(content + '\n\n' + text);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([`# ${title}\n\n${content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'note'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex-1 mr-4">
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-lg font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {content.length} chars
          </Badge>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <input
            type="file"
            accept=".md,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-card">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('**', '**')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('*', '*')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('`', '`')}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('\n- ', '')}
          title="List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('[', '](url)')}
          title="Link"
        >
          <Link className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('\n> ', '')}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="text-xs">
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Editor/Preview */}
      <div className="flex-1 p-4">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="edit" className="h-full mt-0">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your markdown note...

# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

`code inline` 

```
code block
```

[Link text](https://example.com)

> Quote text

@field-name to link to fields
/task to create a task"
              className="h-full resize-none font-mono text-sm"
            />
          </TabsContent>
          <TabsContent value="preview" className="h-full mt-0">
            <Card className="h-full">
              <CardContent className="p-6 h-full overflow-auto">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdownPreview(content) || '<p class="text-muted-foreground italic">Nothing to preview yet. Switch to Edit tab to start writing.</p>' 
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}