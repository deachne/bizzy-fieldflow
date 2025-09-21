import { useState } from "react";
import { FileText, Download, Share, ExternalLink, TrendingDown, MapPin, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const forgeReport = {
  id: "FORGE-2024-N-HALF-FERT",
  title: "Fertilizer Recommendation: N-Half Field",
  summary: "Apply 120 lbs/ac Urea (46-0-0) based on soil test results and yield targets",
  dateGenerated: "Oct 12, 2024",
  linkedField: "N-Half",
  
  recommendation: {
    product: "Urea 46-0-0",
    rate: "120 lbs/ac",
    totalNeeded: "38,400 lbs (19.2 MT)",
    timing: "Spring application before seeding",
    method: "Broadcast and incorporate",
  },

  dataSource: {
    soilTest: {
      lab: "A&L Labs",
      date: "Aug 2024",
      ph: 6.8,
      nitrogen: "18 ppm (Low)",
      phosphorus: "45 ppm (Medium)",
      potassium: "165 ppm (High)",
    },
    formula: "Regen Formula v2.1",
    yieldTarget: "45 bu/ac wheat",
  },

  priceComparison: [
    {
      supplier: "Co-op",
      price: 855,
      total: 16416,
      validity: "Valid 7 days",
      isLowest: true,
    },
    {
      supplier: "Richardson",
      price: 880,
      total: 16896,
      validity: "Valid 3 days", 
      isLowest: false,
    },
    {
      supplier: "Nutrien",
      price: 865,
      total: 16608,
      validity: "Valid 5 days",
      isLowest: false,
    },
  ],

  insights: [
    {
      type: "Weather Alert",
      icon: "🌧️",
      message: "Rain forecast in 3 days - optimal timing for application",
      priority: "medium",
    },
    {
      type: "Field Hazard",
      icon: "⚠️", 
      message: "Stone pile at south approach may impact spreader access",
      priority: "high",
    },
    {
      type: "Market Trend",
      icon: "📉",
      message: "Urea futures trending down 2% this week",
      priority: "low",
    },
  ],

  linkedReferences: [
    {
      title: "Agronomy Guidebook 2025",
      section: "Chapter 4: Nutrient Timing",
      type: "Library Reference",
    },
    {
      title: "N-Half Soil Test Report",
      section: "Full Analysis", 
      type: "Field Data",
    },
  ],
};

export default function TheForge() {
  const [activeSection, setActiveSection] = useState("overview");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gradient-earth min-h-full">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{forgeReport.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="outline">{forgeReport.id}</Badge>
                <span className="text-sm text-muted-foreground">Generated {forgeReport.dateGenerated}</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              Generate Purchase Order
            </Button>
            <Button className="bg-gradient-primary">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="shadow-strong bg-gradient-farmer text-white">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-white/90 mb-2">Recommendation</h3>
                <div className="text-2xl font-bold">{forgeReport.recommendation.rate}</div>
                <div className="text-white/80">{forgeReport.recommendation.product}</div>
              </div>
              <div>
                <h3 className="font-semibold text-white/90 mb-2">Total Required</h3>
                <div className="text-2xl font-bold">{forgeReport.recommendation.totalNeeded.split(' ')[0]}</div>
                <div className="text-white/80">{forgeReport.recommendation.totalNeeded.split(' ')[1]}</div>
              </div>
              <div>
                <h3 className="font-semibold text-white/90 mb-2">Best Price</h3>
                <div className="text-2xl font-bold">{formatCurrency(forgeReport.priceComparison[0].total)}</div>
                <div className="text-white/80">{forgeReport.priceComparison[0].supplier}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data & Sources */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Data & Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Soil Test Results</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lab:</span>
                        <span>{forgeReport.dataSource.soilTest.lab}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{forgeReport.dataSource.soilTest.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">pH:</span>
                        <span>{forgeReport.dataSource.soilTest.ph}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">N (ppm):</span>
                        <Badge variant="outline" className="bg-warning/10 text-warning">
                          {forgeReport.dataSource.soilTest.nitrogen}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">P (ppm):</span>
                        <Badge variant="outline" className="bg-success/10 text-success">
                          {forgeReport.dataSource.soilTest.phosphorus}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">K (ppm):</span>
                        <Badge variant="outline" className="bg-success/10 text-success">
                          {forgeReport.dataSource.soilTest.potassium}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Formula Used</h4>
                    <Badge variant="secondary">{forgeReport.dataSource.formula}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Yield Target</h4>
                    <span className="font-medium">{forgeReport.dataSource.yieldTarget}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Comparison */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Retail Price Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Supplier</th>
                        <th className="text-left p-3 font-medium">Price/MT</th>
                        <th className="text-left p-3 font-medium">Total Cost</th>
                        <th className="text-left p-3 font-medium">Validity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forgeReport.priceComparison.map((quote, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-3 font-medium">
                            {quote.supplier}
                            {quote.isLowest && (
                              <Badge variant="outline" className="ml-2 text-xs bg-success/10 text-success border-success">
                                Lowest
                              </Badge>
                            )}
                          </td>
                          <td className="p-3">${quote.price}/MT</td>
                          <td className="p-3 font-medium">{formatCurrency(quote.total)}</td>
                          <td className="p-3 text-muted-foreground">{quote.validity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Linked Library References */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Linked Library References
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forgeReport.linkedReferences.map((ref, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{ref.title}</h4>
                        <p className="text-sm text-muted-foreground">{ref.section}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{ref.type}</Badge>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Related Insights */}
          <div className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Related Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {forgeReport.insights.map((insight, i) => (
                  <div key={i} className={`p-3 rounded-lg border-l-4 ${
                    insight.priority === 'high' 
                      ? 'bg-destructive/10 border-destructive' 
                      : insight.priority === 'medium'
                      ? 'bg-warning/10 border-warning'
                      : 'bg-muted border-muted-foreground'
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{insight.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1">{insight.type}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {insight.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Field Information */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Field Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{forgeReport.linkedField}</h4>
                    <p className="text-sm text-muted-foreground">320 acres • Wheat</p>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    View Field Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-gradient-primary" size="sm">
                  Generate Purchase Order
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Request Updated Quote
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Schedule Application
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}