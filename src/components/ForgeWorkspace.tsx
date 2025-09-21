import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Sparkles, User, Download, Share, BookOpen, Tag, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ForgeOutput {
  id: string;
  type: 'report' | 'table' | 'chart' | 'analysis';
  title: string;
  content: any;
  sources: string[];
  tags: string[];
}

export function ForgeWorkspace() {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgeOutput, setForgeOutput] = useState<ForgeOutput | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with query from URL if present
    const initialQuery = searchParams.get('query');
    const suggestionId = searchParams.get('suggestion');
    
    if (initialQuery) {
      setCurrentQuery(initialQuery);
      // Auto-start conversation
      handleSubmit(null, initialQuery);
    } else if (suggestionId) {
      // Handle suggestion-based initialization
      const suggestions = {
        '1': 'Create a financial analysis for selling 10% of canola to cover October expenses',
        '2': 'Generate a maintenance task for fixing the mower before next week\'s rain',
        '3': 'Plan a soil testing schedule for the north field',
        '4': 'Analyze the weather window for herbicide application'
      };
      const suggestionQuery = suggestions[suggestionId as keyof typeof suggestions];
      if (suggestionQuery) {
        setCurrentQuery(suggestionQuery);
        handleSubmit(null, suggestionQuery);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent | null, queryOverride?: string) => {
    if (e) e.preventDefault();
    const query = queryOverride || currentQuery;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentQuery('');
    setIsLoading(true);

    // Simulate AI processing and component generation
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(query),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Generate mock forge output
      setForgeOutput(generateForgeOutput(query));
      setIsLoading(false);
    }, 2000);
  };

  const generateResponse = (query: string): string => {
    if (query.toLowerCase().includes('canola')) {
      return "I've analyzed your canola position and October cash flow requirements. Based on current market conditions ($620/MT), selling 10% of your canola inventory would generate approximately $24,800. This should cover your projected October expenses of $22,000 with a small buffer. I've created a detailed financial analysis showing the optimal timing and tax implications.";
    } else if (query.toLowerCase().includes('mower')) {
      return "I've created a maintenance task for your mower repair. The weather forecast shows rain in 5 days, so we have a good window. I've included the parts list, estimated repair time (3 hours), and scheduled reminders. The task is now ready to be assigned to your maintenance team.";
    } else if (query.toLowerCase().includes('soil test')) {
      return "I've generated a comprehensive soil testing plan for your north field. Based on your crop rotation and last test date, I recommend testing for N-P-K, pH, and organic matter. The plan includes optimal sampling locations, timing recommendations, and lab selection. This will help optimize your fertility program for next season.";
    }
    return "I've processed your request and generated the relevant analysis. The component shows detailed insights and actionable recommendations based on your farm data.";
  };

  const generateForgeOutput = (query: string): ForgeOutput => {
    if (query.toLowerCase().includes('canola')) {
      return {
        id: 'forge-canola-analysis',
        type: 'analysis',
        title: 'Canola Sales Analysis - October Cash Flow',
        content: {
          currentInventory: '800 MT',
          saleAmount: '80 MT (10%)',
          currentPrice: '$620/MT',
          grossRevenue: '$49,600',
          marketingCosts: '$1,200',
          netRevenue: '$48,400',
          taxImplications: 'Deferred to next tax year',
          recommendation: 'Proceed with sale - strong cash position'
        },
        sources: ['Market data: FarmLink', 'Inventory: Farm records', 'Weather: Environment Canada'],
        tags: ['financial', 'canola', 'cash-flow', 'october-2024']
      };
    } else if (query.toLowerCase().includes('mower')) {
      return {
        id: 'forge-mower-task',
        type: 'report',
        title: 'Mower Maintenance Task',
        content: {
          equipment: 'John Deere MX15 Mower',
          issue: 'Blade replacement and deck repair',
          priority: 'High - Rain forecast in 5 days',
          estimatedTime: '3 hours',
          partsNeeded: ['Blade set (3)', 'Deck bolt kit', 'Grease'],
          assignedTo: 'Maintenance Team',
          deadline: 'Oct 16, 2024'
        },
        sources: ['Equipment manual', 'Weather forecast', 'Parts inventory'],
        tags: ['maintenance', 'mower', 'urgent', 'weather-dependent']
      };
    }
    return {
      id: 'forge-generic',
      type: 'analysis',
      title: 'Analysis Results',
      content: { summary: 'Analysis completed successfully' },
      sources: ['Farm data'],
      tags: ['analysis']
    };
  };

  const handlePublishToHub = () => {
    if (!forgeOutput) return;
    
    // Save to Knowledge Hub
    const existingItems = JSON.parse(localStorage.getItem('knowledge_items') || '[]');
    const hubItem = {
      id: Date.now(),
      title: forgeOutput.title,
      content: JSON.stringify(forgeOutput.content),
      type: 'forge-output',
      tags: forgeOutput.tags,
      date: new Date().toISOString().split('T')[0],
      source: 'Bizzy Forge'
    };
    
    existingItems.unshift(hubItem);
    localStorage.setItem('knowledge_items', JSON.stringify(existingItems));
    
    // Show success message
    alert('Component published to Knowledge Hub!');
  };

  return (
    <div className="h-screen flex bg-gradient-earth">
      {/* Left: Conversation Thread */}
      <div className="w-1/3 border-r border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Bizzy Forge</h2>
            <Badge variant="secondary" className="text-xs">Workshop</Badge>
          </div>
        </div>
        
        <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gradient-primary text-white'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Bizzy is thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Continue the conversation..."
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Center: Made Component */}
      <div className="flex-1 overflow-auto">
        {forgeOutput ? (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{forgeOutput.title}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{forgeOutput.type}</Badge>
                  <Badge variant="secondary">{forgeOutput.id}</Badge>
                </div>
              </div>

              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Generated Component</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(forgeOutput.content).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-muted-foreground text-right max-w-[60%]">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center p-6">
            <div className="max-w-md">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Ready to Create</h2>
              <p className="text-muted-foreground">
                Start a conversation with Bizzy to generate reports, tables, analyses, and other farm management components.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right: Context & Actions */}
      <div className="w-80 border-l border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="p-4 border-b border-border/50">
          <h3 className="font-semibold">Context & Actions</h3>
        </div>
        
        <div className="p-4 space-y-6">
          {forgeOutput && (
            <>
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-primary" 
                    size="sm"
                    onClick={handlePublishToHub}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Publish to Hub
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Share Link
                  </Button>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {forgeOutput.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {forgeOutput.sources.map((source, index) => (
                      <div key={index} className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                        {source}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}