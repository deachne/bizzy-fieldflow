import { useState, useEffect } from "react";
import { Mic, Camera, Mail, Globe, FileText, Calendar, Filter, List, Grid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const filterOptions = ["Today", "This Week", "This Month", "All"];
const typeFilters = ["Voice", "Photo", "Email", "Web clip", "Note"];

const defaultInboxItems = [
  {
    id: 1,
    type: "voice",
    title: "Fix mower",
    content: "Fix mower because grass is long.",
    timestamp: "Today 8:30 AM",
    date: "2024-10-16",
    suggestedActions: ["Create Task", "Add to Journal", "Archive"],
    icon: Mic,
    color: "farmer",
  },
  {
    id: 2,
    type: "note",
    title: "Stone in N-Half",
    content: "Large stone pile blocking access to south approach of N-Half field.",
    timestamp: "Today 10:15 AM", 
    date: "2024-10-16",
    suggestedActions: ["Create Task", "Attach to Field", "Archive"],
    icon: FileText,
    color: "warning",
  },
  {
    id: 3,
    type: "email",
    title: "Fertilizer Quote - Nutrien",
    content: "Updated pricing for Urea 46-0-0: $865/MT, valid until Oct 21st",
    timestamp: "Yesterday 2:30 PM",
    date: "2024-10-15", 
    suggestedActions: ["Add to Trader", "Create Task", "Archive"],
    icon: Mail,
    color: "trader",
  },
  {
    id: 4,
    type: "photo",
    title: "Snake crossing road",
    content: "Two snakes observed crossing road near home quarter section.",
    timestamp: "Yesterday 7:00 AM",
    date: "2024-10-15",
    suggestedActions: ["Add to Journal", "Archive"],
    icon: Camera,
    color: "library",
  },
  {
    id: 5,
    type: "webclip",
    title: "Nutrient Loss Prevention",
    content: "YouTube video on timing fertilizer applications to minimize nutrient runoff.",
    timestamp: "Oct 14, 3:20 PM",
    date: "2024-10-14",
    suggestedActions: ["Add to Library", "Create Task", "Archive"],
    icon: Globe,
    color: "library",
  },
];

export default function Inbox() {
  const [inboxItems, setInboxItems] = useState(defaultInboxItems);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Load inbox items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('inbox_items');
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems);
        setInboxItems([...parsed, ...defaultInboxItems]);
      } catch (error) {
        console.error('Failed to parse inbox items:', error);
      }
    }
  }, []);

  const filteredItems = inboxItems.filter(item => {
    if (selectedFilter === "Today" && item.date !== "2024-10-16") return false;
    if (selectedFilter === "This Week" && !["2024-10-16", "2024-10-15", "2024-10-14"].includes(item.date)) return false;
    if (selectedType !== "All" && item.type.toLowerCase() !== selectedType.toLowerCase()) return false;
    return true;
  });

  const handleActionClick = (itemId: number, action: string) => {
    console.log(`Action: ${action} on item ${itemId}`);
    // In real app, this would process the item and move it to appropriate module
  };

  return (
    <div className="p-6 bg-gradient-earth min-h-full">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inbox</h1>
            <p className="text-muted-foreground">Captured data waiting for processing</p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {filteredItems.length} items
          </Badge>
        </div>

        {/* Filters */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Date Filters */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <div className="flex gap-1">
                    {filterOptions.map((filter) => (
                      <Button
                        key={filter}
                        variant={selectedFilter === filter ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedFilter(filter)}
                        className={selectedFilter === filter ? "bg-gradient-primary" : ""}
                      >
                        {filter}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Type Filters */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="text-sm border rounded px-2 py-1 bg-background"
                  >
                    <option value="All">All Types</option>
                    {typeFilters.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "calendar")}>
          <TabsContent value="list" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.id} className="shadow-soft hover:shadow-medium transition-all cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-${item.color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              {item.type}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {item.timestamp}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {item.content}
                      </p>
                      
                      <div>
                        <h5 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                          AI Suggested Actions
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {item.suggestedActions.map((action) => (
                            <Button
                              key={action}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActionClick(item.id, action);
                              }}
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>October 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {/* Calendar Header */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-2 font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    const dateStr = `2024-10-${day.toString().padStart(2, "0")}`;
                    const dayItems = filteredItems.filter(item => item.date === dateStr);
                    
                    return (
                      <div key={day} className="p-2 h-16 border rounded hover:bg-accent cursor-pointer">
                        <div className="font-medium">{day}</div>
                        {dayItems.length > 0 && (
                          <div className="flex justify-center">
                            <Badge variant="secondary" className="text-xs px-1">
                              {dayItems.length}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}