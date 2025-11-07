import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Send, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { InlineAnswerModal } from './InlineAnswerModal';
import { getPerplexityApiKey } from '@/lib/utils';

interface AskBizzyProps {
  className?: string;
}

export function AskBizzy({ className = "" }: AskBizzyProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(getPerplexityApiKey());
  const [showInlineModal, setShowInlineModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Listen for API key changes from Settings
  useEffect(() => {
    const handleStorageChange = () => {
      setApiKey(getPerplexityApiKey());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const bizzySuggestions = [
    {
      id: 1,
      title: "Sell 10% of canola to cover October expenses",
      type: "financial",
      action: "View Analysis",
      icon: "TrendingUp",
      priority: "high"
    },
    {
      id: 2,
      title: "Fix mower before next week's rain",
      type: "task",
      action: "Create Task", 
      icon: "Settings",
      priority: "medium"
    },
    {
      id: 3,
      title: "Schedule soil test for north field",
      type: "planning",
      action: "View Details",
      icon: "TestTube",
      priority: "low"
    },
    {
      id: 4,
      title: "Weather window for herbicide application",
      type: "weather",
      action: "View Forecast",
      icon: "Cloud",
      priority: "high"
    }
  ];

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Detect if query requires creation (Forge) or quick answer (inline)
  const requiresForge = (query: string): boolean => {
    const creationKeywords = [
      'create', 'build', 'generate', 'make', 'design', 'plan', 'report', 'table', 
      'chart', 'analysis', 'recommendation', 'forecast', 'calculate', 'compare',
      'budget', 'schedule', 'optimize', 'project', 'app', 'tool'
    ];
    
    return creationKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if we have an API key
    if (!apiKey) {
      toast.error(
        <div>
          Please configure your API key in{' '}
          <button
            onClick={() => navigate('/settings')}
            className="underline font-semibold"
          >
            Settings
          </button>
        </div>,
        { duration: 5000 }
      );
      return;
    }

    // Route to Forge if creation is needed
    if (requiresForge(query)) {
      navigate('/forge?query=' + encodeURIComponent(query));
      setIsExpanded(false);
      setQuery('');
      return;
    }

    // Handle quick answers inline
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
              content: 'You are Bizzy, an AI assistant specialized in farm management. Provide helpful, practical advice for farmers. Be very concise for quick facts, status updates, and weather queries. Focus on direct answers.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 300,
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
      const answer = data.choices[0]?.message?.content || 'No response received';
      setResponse(answer);
      setShowInlineModal(true);
      setIsExpanded(false);
      
      // Store the response in inbox for later reference
      const existingInboxItems = JSON.parse(localStorage.getItem('inbox_items') || '[]');
      const inboxItem = {
        id: Date.now(),
        type: 'ai-query',
        title: `Ask Bizzy: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`,
        content: answer,
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
      setShowInlineModal(true);
      setIsExpanded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: typeof bizzySuggestions[0]) => {
    // Route to Forge for these actionable suggestions
    navigate('/forge?suggestion=' + encodeURIComponent(suggestion.id.toString()));
    setIsExpanded(false);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setQuery('');
    setResponse('');
  };

  const handleCloseInlineModal = () => {
    setShowInlineModal(false);
    setResponse('');
    setQuery('');
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

          {/* No API Key Warning */}
          {!apiKey && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Please configure your API key in{' '}
                <button
                  onClick={() => navigate('/settings')}
                  className="text-primary hover:underline font-semibold"
                >
                  Settings
                </button>
                {' '}to use Ask Bizzy
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

          {/* Bizzy Suggestions */}
          {!response && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Bizzy Suggests:</p>
              <div className="space-y-2">
                {bizzySuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-2 h-2 rounded-full ${
                        suggestion.priority === 'high' ? 'bg-red-500' : 
                        suggestion.priority === 'medium' ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`} />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {suggestion.title}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.action}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
      
      {/* Inline Answer Modal */}
      <InlineAnswerModal
        isOpen={showInlineModal}
        onClose={handleCloseInlineModal}
        query={query}
        response={response}
      />
    </div>
  );
}