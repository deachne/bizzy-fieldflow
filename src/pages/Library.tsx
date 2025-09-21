import { useState } from "react";
import { BookOpen, FileText, Download, ExternalLink, Link, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const libraryItems = [
  {
    id: "LIB-001",
    title: "Combine #2 Parts Manual",
    type: "PDF",
    description: "Complete parts catalog and maintenance procedures for Case IH Combine #2. Contains part FH-BELT-7G-8821 specifications.",
    tags: ["equipment", "maintenance", "combine", "parts"],
    linkedEntities: ["Combine #2", "Equipment Maintenance"],
    dateAdded: "Sep 28, 2024",
    fileSize: "12.4 MB",
    pages: 247,
    thumbnail: "📋",
  },
  {
    id: "LIB-002", 
    title: "Agronomy Guidebook 2025",
    type: "PDF",
    description: "Comprehensive guide covering fertility management, regenerative practices, and soil health optimization.",
    tags: ["fertility", "regenerative", "agronomy", "soil-health"],
    linkedEntities: ["BizzyFarmer", "Soil Management"],
    dateAdded: "Oct 1, 2024",
    fileSize: "8.7 MB", 
    pages: 156,
    thumbnail: "🌱",
  },
  {
    id: "LIB-003",
    title: "Managing Soil Organic Matter",
    type: "eBook",
    description: "Essential strategies for building and maintaining soil organic matter in agricultural systems.",
    tags: ["soil", "organic-matter", "sustainability", "carbon"],
    linkedEntities: ["Soil Tests", "Field Management"],
    dateAdded: "Oct 5, 2024",
    fileSize: "3.2 MB",
    pages: 89,
    thumbnail: "📖",
  },
  {
    id: "LIB-004",
    title: "Canola Market Analysis 2024",
    type: "PDF",
    description: "Comprehensive market report covering pricing trends, global demand, and seasonal patterns.",
    tags: ["market", "canola", "pricing", "analysis"],
    linkedEntities: ["BizzyTrader", "Market Data"],
    dateAdded: "Oct 8, 2024",
    fileSize: "5.1 MB",
    pages: 43,
    thumbnail: "📊",
  },
  {
    id: "LIB-005",
    title: "Equipment Safety Protocols",
    type: "Manual",
    description: "Safety procedures and emergency protocols for all farm equipment operations.",
    tags: ["safety", "protocols", "equipment", "emergency"],
    linkedEntities: ["Equipment", "Safety Training"],
    dateAdded: "Sep 15, 2024",
    fileSize: "2.8 MB", 
    pages: 67,
    thumbnail: "⚠️",
  },
];

const typeFilters = ["All", "PDF", "eBook", "Manual", "Guide"];
const tagFilters = ["All", "equipment", "soil", "market", "safety", "fertility", "maintenance"];

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === "All" || item.type === selectedType;
    const matchesTag = selectedTag === "All" || item.tags.includes(selectedTag);
    
    return matchesSearch && matchesType && matchesTag;
  });

  return (
    <div className="flex h-full bg-gradient-earth">
      {/* Main Library List */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Library</h1>
              <p className="text-muted-foreground">Reference materials, manuals, and documentation</p>
            </div>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Reference
            </Button>
          </div>

          {/* Search & Filters */}
          <Card className="shadow-soft">
            <CardContent className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search manuals, guides, and references..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Type:</span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="text-sm border rounded px-2 py-1 bg-background"
                  >
                    {typeFilters.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tag:</span>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="text-sm border rounded px-2 py-1 bg-background"
                  >
                    {tagFilters.map((tag) => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>

                <Badge variant="outline" className="ml-auto">
                  {filteredItems.length} items
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Library Items */}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className={`shadow-soft hover:shadow-medium transition-all cursor-pointer ${
                  selectedItem?.id === item.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-20 bg-library-light rounded-lg flex items-center justify-center text-2xl">
                      {item.thumbnail}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.id}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {item.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {item.pages} pages • {item.fileSize}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="text-xs">
                            {item.dateAdded}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-96 bg-card border-l shadow-soft overflow-auto">
        {selectedItem ? (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="w-20 h-24 bg-library-light rounded-lg flex items-center justify-center text-3xl mx-auto mb-4">
                {selectedItem.thumbnail}
              </div>
              <h3 className="font-semibold text-lg mb-1">{selectedItem.title}</h3>
              <Badge variant="outline">{selectedItem.id}</Badge>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="secondary">{selectedItem.type}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pages:</span>
                <span>{selectedItem.pages}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">File Size:</span>
                <span>{selectedItem.fileSize}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Added:</span>
                <span>{selectedItem.dateAdded}</span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h4 className="font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {selectedItem.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Linked Entities */}
            <div>
              <h4 className="font-medium mb-2">Linked to</h4>
              <div className="space-y-2">
                {selectedItem.linkedEntities.map((entity: string) => (
                  <div key={entity} className="flex items-center gap-2 text-sm">
                    <Link className="w-3 h-3 text-muted-foreground" />
                    <span>{entity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full bg-gradient-primary">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Document
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="w-full">
                <Link className="w-4 h-4 mr-2" />
                Link to Module
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">Select a Document</h3>
            <p className="text-sm text-muted-foreground">
              Choose an item from the library to view details and preview.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}