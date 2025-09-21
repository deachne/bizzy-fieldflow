import { useState } from "react";
import { Search, FileText, Image, Mic, Globe, BookOpen, Calendar, Tag, Filter, Grid, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const knowledgeItems = [
  {
    id: 1,
    type: "journal",
    title: "Morning Wildlife Observation",
    content: "Two snakes crossing road near home quarter. Species appeared to be garter snakes, likely moving due to cooler morning temperatures.",
    tags: ["wildlife", "observation", "weather", "home-quarter"],
    date: "Oct 15, 2024",
    module: "Hub",
    icon: FileText,
  },
  {
    id: 2,
    type: "report", 
    title: "Fertilizer Recommendation: N-Half",
    content: "AI-generated recommendation for spring nitrogen application based on soil tests and yield targets.",
    tags: ["fertilizer", "N-Half", "soil-test", "recommendations"],
    date: "Oct 12, 2024",
    module: "Farmer",
    icon: FileText,
  },
  {
    id: 3,
    type: "webclip",
    title: "Nutrient Loss Prevention Strategies",
    content: "YouTube video summary on timing fertilizer applications to minimize nutrient runoff during fall weather patterns.",
    tags: ["fertilizer", "spreading", "timing", "environmental"],
    date: "Oct 14, 2024",
    module: "Library",
    icon: Globe,
  },
  {
    id: 4,
    type: "photo",
    title: "Stone Pile Documentation",
    content: "GPS-tagged photo of stone pile blocking south approach to N-Half field.",
    tags: ["N-Half", "hazard", "access", "GPS"],
    date: "Oct 13, 2024", 
    module: "Farmer",
    icon: Image,
  },
  {
    id: 5,
    type: "voice",
    title: "Equipment Maintenance Note",
    content: "Voice memo about mower belt replacement needed due to extended grass growth.",
    tags: ["maintenance", "mower", "equipment"],
    date: "Oct 16, 2024",
    module: "Farmer", 
    icon: Mic,
  },
  {
    id: 6,
    type: "reference",
    title: "Combine #2 Parts Manual",
    content: "Complete parts manual and maintenance schedule for Case IH combine.",
    tags: ["equipment", "manual", "combine", "maintenance"],
    date: "Sep 28, 2024",
    module: "Library",
    icon: BookOpen,
  },
];

const allTags = Array.from(new Set(knowledgeItems.flatMap(item => item.tags)));
const modules = ["All", "Hub", "Farmer", "Trader", "Library"];

export default function KnowledgeHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesModule = selectedModule === "All" || item.module === selectedModule;
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => item.tags.includes(tag));
    
    return matchesSearch && matchesModule && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case "Farmer": return "farmer";
      case "Trader": return "trader";
      case "Library": return "library";
      default: return "muted";
    }
  };

  return (
    <div className="p-6 bg-gradient-earth min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Knowledge Hub</h1>
            <p className="text-muted-foreground">Searchable archive of all captured data</p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {filteredItems.length} of {knowledgeItems.length} items
          </Badge>
        </div>

        {/* Search & Filters */}
        <Card className="shadow-soft">
          <CardContent className="p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search across journals, reports, web clips, and library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Module Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Module:</span>
                  <div className="flex gap-1">
                    {modules.map((module) => (
                      <Button
                        key={module}
                        variant={selectedModule === module ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedModule(module)}
                        className={selectedModule === module ? `bg-gradient-${getModuleColor(module)}` : ""}
                      >
                        {module}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 ml-auto">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tag Filters */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 12).map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {allTags.length > 12 && (
                  <Badge variant="secondary" className="cursor-pointer">
                    +{allTags.length - 12} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(selectedTags.length > 0 || selectedModule !== "All") && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <span className="text-sm font-medium">Active filters:</span>
                {selectedModule !== "All" && (
                  <Badge variant="secondary">
                    Module: {selectedModule}
                    <button
                      className="ml-1 hover:bg-muted rounded"
                      onClick={() => setSelectedModule("All")}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                    <button
                      className="ml-1 hover:bg-muted rounded"
                      onClick={() => toggleTag(tag)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className={viewMode === "grid" 
          ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" 
          : "space-y-3"
        }>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.id} className="shadow-soft hover:shadow-medium transition-all cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-${getModuleColor(item.module)} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.module}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {item.date}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {item.tags.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">No items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}