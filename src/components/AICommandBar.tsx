import { useState } from "react";
import { Search, Sparkles, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockResults = {
  "Did it rain during home field harvest?": {
    answer: "Yes. On Oct 12th, you combined Home Field from 11:00 AM – 9:30 PM. Belt broke on Combine #2 (logged in Maintenance).",
    sources: [
      { name: "Journal Oct 12", type: "journal" },
      { name: "Maintenance Log – Combine #2", type: "maintenance" },
      { name: "Combine #2 Manual", type: "library" },
    ],
  },
  "Make me a table of all chemical and fertilizer quotes": {
    answer: "Here's a ranked comparison of all chemical and fertilizer quotes:",
    table: [
      { product: "Urea 46-0-0", supplier: "Co-op", price: "$855/MT", date: "Oct 15", validity: "Valid 7 days", lowest: true },
      { product: "Urea 46-0-0", supplier: "Nutrien", price: "$865/MT", date: "Oct 14", validity: "Valid 5 days", lowest: false },
      { product: "Urea 46-0-0", supplier: "Richardson", price: "$880/MT", date: "Oct 13", validity: "Valid 3 days", lowest: false },
      { product: "Glyphosate 540", supplier: "AgChem", price: "$12.50/L", date: "Oct 10", validity: "Valid 14 days", lowest: true },
      { product: "Glyphosate 540", supplier: "FarmSupply", price: "$13.20/L", date: "Oct 9", validity: "Valid 10 days", lowest: false },
    ],
    sources: [
      { name: "Email: Co-op Quote", type: "email" },
      { name: "PDF: Nutrien Price List", type: "pdf" },
      { name: "Email: Richardson Quote", type: "email" },
    ],
  },
};

export function AICommandBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSearch = () => {
    if (query.toLowerCase().includes("rain") && query.toLowerCase().includes("harvest")) {
      setResult(mockResults["Did it rain during home field harvest?"]);
    } else if (query.toLowerCase().includes("table") && (query.toLowerCase().includes("quote") || query.toLowerCase().includes("chemical"))) {
      setResult(mockResults["Make me a table of all chemical and fertilizer quotes"]);
    } else {
      setResult({
        answer: `I found information related to "${query}". Here are the key insights from your farm data.`,
        sources: [
          { name: "Recent Journal Entries", type: "journal" },
          { name: "Field Records", type: "field" },
        ],
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full max-w-md mx-auto bg-card hover:bg-accent border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all group"
        >
          <Search className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary" />
          <span className="text-muted-foreground group-hover:text-foreground">Ask Bizzy anything...</span>
          <div className="ml-auto flex gap-1">
            <Badge variant="secondary" className="text-xs">⌘K</Badge>
          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden p-0">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-lg">AI Command Bar</h3>
          </div>
          
          <div className="flex gap-3">
            <Input
              placeholder="Ask about your farm operations, weather, inventory..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-gradient-primary">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {result && (
          <div className="p-6 overflow-auto">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3 text-foreground">Answer</h4>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-4">{result.answer}</p>
                    
                    {result.table && (
                      <div className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2 font-medium">Product</th>
                                <th className="text-left p-2 font-medium">Supplier</th>
                                <th className="text-left p-2 font-medium">Price</th>
                                <th className="text-left p-2 font-medium">Date</th>
                                <th className="text-left p-2 font-medium">Validity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.table.map((row: any, i: number) => (
                                <tr key={i} className="border-b">
                                  <td className="p-2">{row.product}</td>
                                  <td className="p-2">{row.supplier}</td>
                                  <td className={`p-2 font-medium ${row.lowest ? 'text-success' : ''}`}>
                                    {row.price}
                                    {row.lowest && <Badge variant="outline" className="ml-2 text-xs bg-success/10 text-success border-success">Lowest</Badge>}
                                  </td>
                                  <td className="p-2 text-muted-foreground">{row.date}</td>
                                  <td className="p-2 text-muted-foreground">{row.validity}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button variant="outline" className="bg-gradient-primary text-white border-0">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open in Forge
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-medium mb-3">Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((source: any, i: number) => (
                    <Badge key={i} variant="outline" className="cursor-pointer hover:bg-accent">
                      {source.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {query && !result && (
          <div className="p-6">
            <div className="text-center text-muted-foreground">
              <p>Try asking: "Did it rain during home field harvest?" or "Make me a table of all chemical quotes"</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}