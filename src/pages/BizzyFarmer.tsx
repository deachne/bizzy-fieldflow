import { useState } from "react";
import { Map, Grid, AlertTriangle, Calendar, FileText, Wrench, Package, BookOpen, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const fields = [
  {
    id: "FIELD-HOME",
    name: "Home Field",
    crop: "Canola",
    acres: 160,
    status: "Harvested",
    hazards: [],
    thumbnail: "🌾",
    lastActivity: "Oct 12 - Harvest completed",
  },
  {
    id: "FIELD-N-HALF", 
    name: "N-Half",
    crop: "Wheat",
    acres: 320,
    status: "Ready for Harvest",
    hazards: ["Stone pile at south approach"],
    thumbnail: "🌾",
    lastActivity: "Oct 10 - Pre-harvest inspection",
  },
  {
    id: "FIELD-SOUTH-QTR",
    name: "South Quarter",
    crop: "Barley", 
    acres: 240,
    status: "Growing",
    hazards: [],
    thumbnail: "🌾",
    lastActivity: "Sep 28 - Fertilizer application",
  },
  {
    id: "FIELD-EAST-80",
    name: "East 80", 
    crop: "Canola",
    acres: 80,
    status: "Harvested",
    hazards: [],
    thumbnail: "🌾",
    lastActivity: "Oct 8 - Harvest completed",
  },
];

const operations = [
  {
    id: "OPS-HARV-2025-10-12",
    type: "Harvest",
    field: "Home Field",
    date: "Oct 12, 2024",
    time: "11:00 AM - 9:30 PM",
    notes: "Rain during operation, belt broke on Combine #2",
    linkedJournal: "JRN-2025-10-12-2130",
    linkedMaintenance: "MCB-2",
  },
  {
    id: "OPS-HARV-2025-10-14", 
    type: "Harvest",
    field: "N-Half",
    date: "Oct 14, 2024", 
    time: "8:00 AM - 6:00 PM",
    notes: "Clear conditions, good yield",
  },
  {
    id: "OPS-SPRAY-2025-09-28",
    type: "Spraying",
    field: "South Quarter",
    date: "Sep 28, 2024",
    time: "2:00 PM - 5:30 PM", 
    notes: "Fertilizer application, ideal conditions",
  },
];

const inventory = [
  {
    item: "Urea 46-0-0",
    category: "Fertilizer",
    quantity: "12 MT",
    location: "Yard bin #1",
    status: "In Stock",
  },
  {
    item: "Canola",
    category: "Grain", 
    quantity: "4,200 bu",
    location: "Bin #3",
    status: "Unpriced",
  },
  {
    item: "Wheat",
    category: "Grain",
    quantity: "890 bu", 
    location: "Bin #1",
    status: "Sold",
  },
];

export default function BizzyFarmer() {
  const [activeTab, setActiveTab] = useState("fields");
  const [selectedField, setSelectedField] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFields = fields.filter(field => 
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Harvested": return "success";
      case "Ready for Harvest": return "warning"; 
      case "Growing": return "farmer";
      default: return "muted";
    }
  };

  return (
    <div className="p-6 bg-gradient-earth min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">BizzyFarmer</h1>
            <p className="text-muted-foreground">Farm operations and field management</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-farmer-light text-farmer">
              780 acres harvested
            </Badge>
            <Badge variant="outline" className="bg-destructive/10 text-destructive">
              2 hazards flagged
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-fit">
            <TabsTrigger value="fields" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Fields
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Operations
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Library
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Fields Tab */}
          <TabsContent value="fields" className="space-y-4">
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search fields..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button className="bg-gradient-farmer">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredFields.map((field) => (
                    <Sheet key={field.id}>
                      <SheetTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-medium transition-all">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="text-2xl">{field.thumbnail}</div>
                              <Badge 
                                variant="outline" 
                                className={`bg-${getStatusColor(field.status)}/10 text-${getStatusColor(field.status)} border-${getStatusColor(field.status)}/20`}
                              >
                                {field.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <h3 className="font-semibold">{field.name}</h3>
                              <div className="text-sm text-muted-foreground">
                                <div>{field.crop} • {field.acres} acres</div>
                                <div className="mt-1">{field.lastActivity}</div>
                              </div>
                              {field.hazards.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-destructive" />
                                  <span className="text-xs text-destructive">
                                    {field.hazards.length} hazard{field.hazards.length > 1 ? 's' : ''}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </SheetTrigger>

                      <SheetContent className="w-[600px] sm:w-[600px] overflow-auto">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-3">
                            <span className="text-2xl">{field.thumbnail}</span>
                            {field.name}
                          </SheetTitle>
                        </SheetHeader>

                        <div className="mt-6 space-y-6">
                          {/* Field Overview */}
                          <div className="grid grid-cols-2 gap-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-sm text-muted-foreground">Crop</div>
                                <div className="font-semibold">{field.crop}</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-sm text-muted-foreground">Acres</div>
                                <div className="font-semibold">{field.acres}</div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Hazards */}
                          {field.hazards.length > 0 && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-destructive" />
                                  Hazards
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  {field.hazards.map((hazard, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                                      <span className="text-sm">{hazard}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Related Tasks */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Tasks</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {field.id === "FIELD-N-HALF" ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                    <Wrench className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Fix stone pile blocking access</span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No active tasks</p>
                              )}
                            </CardContent>
                          </Card>

                          {/* Journal Entries */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Recent Journal Entries</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {field.id === "FIELD-HOME" ? (
                                <div className="space-y-2">
                                  <div className="p-2 bg-muted rounded">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-medium">Harvest Day Notes</span>
                                      <span className="text-xs text-muted-foreground">Oct 12</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Started harvest at 11 AM. Rain began around 2 PM but continued operation.
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No recent entries</p>
                              )}
                            </CardContent>
                          </Card>

                          {/* Soil Test */}
                          {field.id === "FIELD-N-HALF" && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base">Latest Soil Test</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                      <div className="text-muted-foreground">pH</div>
                                      <div className="font-medium">6.8</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground">P (ppm)</div>
                                      <div className="font-medium">18</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground">K (ppm)</div>
                                      <div className="font-medium">165</div>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" className="w-full">
                                    Open in Forge
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-4">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Field Operations Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operations.map((op) => (
                    <Card key={op.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{op.type} - {op.field}</h4>
                            <p className="text-sm text-muted-foreground">{op.date} • {op.time}</p>
                          </div>
                          <Badge variant="outline">{op.id}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{op.notes}</p>
                        {(op.linkedJournal || op.linkedMaintenance) && (
                          <div className="flex gap-2">
                            {op.linkedJournal && (
                              <Badge variant="outline" className="text-xs">
                                Journal: {op.linkedJournal}
                              </Badge>
                            )}
                            {op.linkedMaintenance && (
                              <Badge variant="outline" className="text-xs">
                                Maintenance: {op.linkedMaintenance}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Inventory Snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Item</th>
                        <th className="text-left p-3 font-medium">Category</th>
                        <th className="text-left p-3 font-medium">Quantity</th>
                        <th className="text-left p-3 font-medium">Location</th>
                        <th className="text-left p-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-3 font-medium">{item.item}</td>
                          <td className="p-3 text-muted-foreground">{item.category}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3 text-muted-foreground">{item.location}</td>
                          <td className="p-3">
                            <Badge 
                              variant={item.status === "Sold" ? "default" : item.status === "Unpriced" ? "secondary" : "outline"}
                              className={item.status === "Unpriced" ? "bg-warning/10 text-warning" : ""}
                            >
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-4">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Farm Equipment Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="hover:shadow-soft transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📋</div>
                        <div>
                          <h4 className="font-medium">Combine #2 Parts Manual</h4>
                          <p className="text-sm text-muted-foreground">Complete maintenance guide</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Forge Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="hover:shadow-soft transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📊</div>
                        <div>
                          <h4 className="font-medium">Fertilizer Recommendation: N-Half</h4>
                          <p className="text-sm text-muted-foreground">AI-generated application plan</p>
                          <Badge variant="outline" className="text-xs mt-1">Oct 12, 2024</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}