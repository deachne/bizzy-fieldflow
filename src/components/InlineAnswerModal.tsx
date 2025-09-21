import { X, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface InlineAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  response: string;
}

export function InlineAnswerModal({ isOpen, onClose, query, response }: InlineAnswerModalProps) {
  if (!response) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <DialogTitle className="text-lg font-semibold">Bizzy's Answer</DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Query */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">You asked:</p>
            <p className="text-sm">{query}</p>
          </div>

          {/* Response */}
          <Card className="bg-gradient-subtle border-primary/20">
            <CardContent className="p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            This response has been saved to your Inbox for future reference
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}