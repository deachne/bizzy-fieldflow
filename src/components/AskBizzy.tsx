import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Send, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AskBizzyProps {
  className?: string;
}

export function AskBizzy({ className = "" }: AskBizzyProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "Did it rain during home field harvest?",
    "What's the best time to apply fertilizer?",
    "Show me my equipment maintenance schedule",
    "What are my field conditions today?",
    "Create a task to fix the mower",
    "What's my canola price forecast?"
  ];

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if we have an API key
    if (!apiKey) {
      setShowApiKeyInput(true);
      toast.error("Please enter your Perplexity API key to use Ask Bizzy");
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are Bizzy, an AI assistant specialized in farm management. Provide helpful, practical advice for farmers. Be concise and actionable. Focus on agricultural best practices, equipment maintenance, crop management, weather considerations, and farm operations.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 500,
          return_images: false,
          return_related_questions: false,
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResponse(data.choices[0]?.message?.content || 'No response received');
      
      // Store the response in inbox for later reference
      const existingInboxItems = JSON.parse(localStorage.getItem('inbox_items') || '[]');
      const inboxItem = {
        id: Date.now(),
        type: 'ai-query',
        title: `Ask Bizzy: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`,
        content: data.choices[0]?.message?.content || 'No response received',
        timestamp: new Date().toLocaleString(),
        date: new Date().toISOString().split('T')[0],
        tags: ['ai-assistant', 'query'],
        icon: 'Sparkles',
        color: 'primary'
      };
      
      existingInboxItems.unshift(inboxItem);
      localStorage.setItem('inbox_items', JSON.stringify(existingInboxItems));

    } catch (error) {
      console.error('Error calling Perplexity API:', error);
      toast.error('Failed to get response from Bizzy. Please check your API key.');
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setQuery('');
    setResponse('');
    setShowApiKeyInput(false);
  };

  if (!isExpanded) {
    return (
      <div className={`w-full max-w-4xl mx-auto ${className}`}>
        <div 
          className="relative cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
          <Input
            placeholder="Ask Bizzy anything... (e.g., 'Did it rain during home field harvest?')"
            className="pl-12 pr-12 py-6 text-lg bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
            readOnly
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <Card className="shadow-elegant border-primary/20">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Ask Bizzy</h3>
              <Badge variant="secondary" className="text-xs">AI Assistant</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* API Key Input */}
          {showApiKeyInput && (
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <label className="text-sm font-medium">Perplexity API Key</label>
              <Input
                type="password"
                placeholder="Enter your Perplexity API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">perplexity.ai/settings/api</a>
              </p>
            </div>
          )}

          {/* Query Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Ask me anything about farming, weather, equipment, or operations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-12 py-3"
                autoFocus
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-2"
                disabled={!query.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>

          {/* Suggestions */}
          {!response && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Response */}
          {response && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium">Bizzy's Response:</p>
              </div>
              <Card className="bg-gradient-subtle border-primary/20">
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground">
                Response saved to your Inbox for future reference
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}