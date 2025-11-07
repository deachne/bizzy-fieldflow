import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getPerplexityApiKey, setPerplexityApiKey, getAnthropicApiKey, setAnthropicApiKey } from '@/lib/utils';

export default function Settings() {
  const [perplexityKey, setPerplexityKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [isSavingPerplexity, setIsSavingPerplexity] = useState(false);
  const [isSavingAnthropic, setIsSavingAnthropic] = useState(false);
  const [isTestingPerplexity, setIsTestingPerplexity] = useState(false);

  useEffect(() => {
    // Load existing API keys on mount
    const existingPerplexityKey = getPerplexityApiKey();
    const existingAnthropicKey = getAnthropicApiKey();
    if (existingPerplexityKey) {
      setPerplexityKey(existingPerplexityKey);
    }
    if (existingAnthropicKey) {
      setAnthropicKey(existingAnthropicKey);
    }
  }, []);

  const handleSavePerplexity = () => {
    if (!perplexityKey.trim()) {
      toast.error('Please enter a Perplexity API key');
      return;
    }

    setIsSavingPerplexity(true);
    
    try {
      setPerplexityApiKey(perplexityKey);
      toast.success('Perplexity API key saved successfully');
      
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      toast.error('Failed to save Perplexity API key');
      console.error('Error saving API key:', error);
    } finally {
      setIsSavingPerplexity(false);
    }
  };

  const handleSaveAnthropic = () => {
    if (!anthropicKey.trim()) {
      toast.error('Please enter an Anthropic API key');
      return;
    }

    setIsSavingAnthropic(true);
    
    try {
      setAnthropicApiKey(anthropicKey);
      toast.success('Anthropic API key saved successfully');
      
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      toast.error('Failed to save Anthropic API key');
      console.error('Error saving API key:', error);
    } finally {
      setIsSavingAnthropic(false);
    }
  };

  const handleTestPerplexity = async () => {
    if (!perplexityKey.trim()) {
      toast.error('Please enter a Perplexity API key first');
      return;
    }

    setIsTestingPerplexity(true);

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'user',
              content: 'Say "Connection successful" if you can read this.'
            }
          ],
          max_tokens: 50,
        }),
      });

      if (response.ok) {
        toast.success('Perplexity API key is valid! Connection successful.');
      } else {
        const errorData = await response.json();
        toast.error(`Perplexity API key test failed: ${errorData.error?.message || 'Invalid key'}`);
      }
    } catch (error) {
      toast.error('Failed to test Perplexity API connection');
      console.error('Error testing API key:', error);
    } finally {
      setIsTestingPerplexity(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-earth p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Configure your Bizzy experience</p>
          </div>
        </div>

        {/* Perplexity API Configuration */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              <CardTitle>Perplexity API</CardTitle>
            </div>
            <CardDescription>
              Configure your Perplexity API key to enable Ask Bizzy's AI features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="perplexity-key">Perplexity API Key</Label>
              <Input
                id="perplexity-key"
                type="password"
                placeholder="pplx-..."
                value={perplexityKey}
                onChange={(e) => setPerplexityKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from{' '}
                <a
                  href="https://www.perplexity.ai/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  perplexity.ai/settings/api
                </a>
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSavePerplexity}
                disabled={isSavingPerplexity || !perplexityKey.trim()}
                className="flex items-center gap-2"
              >
                {isSavingPerplexity ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Save API Key
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleTestPerplexity}
                disabled={isTestingPerplexity || !perplexityKey.trim()}
                className="flex items-center gap-2"
              >
                {isTestingPerplexity ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>

            {getPerplexityApiKey() && (
              <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm text-success">Perplexity API key is configured</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Anthropic API Configuration */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              <CardTitle>Anthropic API</CardTitle>
            </div>
            <CardDescription>
              Configure your Anthropic API key for Claude models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="anthropic-key">Anthropic API Key</Label>
              <Input
                id="anthropic-key"
                type="password"
                placeholder="sk-ant-..."
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from{' '}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  console.anthropic.com/settings/keys
                </a>
              </p>
            </div>

            <Button
              onClick={handleSaveAnthropic}
              disabled={isSavingAnthropic || !anthropicKey.trim()}
              className="flex items-center gap-2"
            >
              {isSavingAnthropic ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save API Key
                </>
              )}
            </Button>

            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Anthropic API cannot be tested directly from the browser due to CORS restrictions. 
                The key will be validated when you use it in your application.
              </p>
            </div>

            {getAnthropicApiKey() && (
              <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm text-success">Anthropic API key is configured</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>About API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Perplexity:</strong> Powers Ask Bizzy's intelligent answers with real-time web search capabilities.
            </p>
            <p>
              <strong>Anthropic:</strong> Provides access to Claude models for advanced AI features.
            </p>
            <p>
              All API keys are stored securely in your browser and are never shared with third parties.
              Your queries and responses are saved to your Inbox for easy reference.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
