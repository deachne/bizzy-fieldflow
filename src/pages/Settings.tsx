import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getPerplexityApiKey, setPerplexityApiKey } from '@/lib/utils';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Load existing API key on mount
    const existingKey = getPerplexityApiKey();
    if (existingKey) {
      setApiKey(existingKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsSaving(true);
    
    try {
      setPerplexityApiKey(apiKey);
      toast.success('API key saved successfully');
      
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      toast.error('Failed to save API key');
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key first');
      return;
    }

    setIsTesting(true);

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
              role: 'user',
              content: 'Say "Connection successful" if you can read this.'
            }
          ],
          max_tokens: 50,
        }),
      });

      if (response.ok) {
        toast.success('API key is valid! Connection successful.');
      } else {
        const errorData = await response.json();
        toast.error(`API key test failed: ${errorData.error?.message || 'Invalid key'}`);
      }
    } catch (error) {
      toast.error('Failed to test API connection');
      console.error('Error testing API key:', error);
    } finally {
      setIsTesting(false);
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

        {/* API Configuration */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              <CardTitle>API Configuration</CardTitle>
            </div>
            <CardDescription>
              Configure your Perplexity API key to enable Ask Bizzy's AI features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Perplexity API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="pplx-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
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
                onClick={handleSave}
                disabled={isSaving || !apiKey.trim()}
                className="flex items-center gap-2"
              >
                {isSaving ? (
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
                onClick={handleTest}
                disabled={isTesting || !apiKey.trim()}
                className="flex items-center gap-2"
              >
                {isTesting ? (
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
                <span className="text-sm text-success">API key is configured</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>About Ask Bizzy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Ask Bizzy uses Perplexity AI to provide intelligent answers to your farm management questions.
              The API key is stored securely in your browser and is never shared with third parties.
            </p>
            <p>
              Your queries and responses are saved to your Inbox for easy reference later.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
