import { AlertTriangle, CheckCircle, Cloud, Camera, Mic, Paperclip, TrendingUp, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AICommandBar } from "@/components/AICommandBar";

const todaysBriefing = {
  critical: [
    "Harvested Acreage Report due EOD"
  ],
  tasks: [
    "Fix mower because grass is long",
    "Fix stone in N-Half field"
  ],
  weather: {
    current: "Cloudy, 18°C",
    forecast: "Rain in 3 days"
  }
};

const feedItems = [
  {
    id: 1,
    type: "briefing",
    title: "Today's Briefing",
    time: "6:00 AM",
    content: todaysBriefing,
  },
  {
    id: 2,
    type: "journal",
    title: "Morning Journal",
    time: "7:00 AM",
    content: {
      photo: "🐍",
      description: "Photo of 2 snakes crossing road",
      tags: ["Time: 7:00 AM", "Observation: 2 Snakes"],
    },
  },
  {
    id: 3,
    type: "voice",
    title: "Voice Note → Task",
    time: "8:30 AM",
    content: {
      transcription: "Fix mower because grass is long.",
      actions: ["Create Task", "Archive"],
    },
  },
  {
    id: 4,
    type: "webclip",
    title: "Web Clip",
    time: "Yesterday 3:20 PM",
    content: {
      title: "YT: Understanding Nutrient Loss in Fall Applications",
      summary: "Key insights on timing fertilizer applications to minimize nutrient runoff during fall weather patterns.",
      tags: ["#fertilizer", "#spreading", "#timing"],
    },
  },
];

const suggestions = [
  {
    icon: TrendingUp,
    type: "Financial",
    title: "Sell 10% of canola to cover October expenses",
    action: "View Analysis",
  },
  {
    icon: Calendar,
    type: "Social", 
    title: "Organize ball game with neighbor",
    action: "Create Task",
  },
  {
    icon: Clock,
    type: "Health",
    title: "You averaged 6.5 hrs sleep. Aim for 7+",
    action: "View Trends",
  },
];

export default function TodayHub() {
  return (
    <div className="flex h-full bg-gradient-earth">
      {/* Main Feed */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Good Morning! 🌱</h1>
            <p className="text-muted-foreground">Here's what's happening on your farm today</p>
            <div className="max-w-md mx-auto">
              <AICommandBar />
            </div>
          </div>

          {/* Feed Items */}
          <div className="space-y-4">
            {feedItems.map((item) => (
              <Card key={item.id} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {item.time}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {item.type === "briefing" && "critical" in item.content && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="font-medium text-destructive">Critical:</span>
                        <span className="text-sm">{item.content.critical[0]}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-farmer" />
                          Tasks:
                        </h4>
                        <ul className="space-y-1 ml-6">
                          {item.content.tasks.map((task: string, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground">• {task}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-trader/10 rounded-lg border border-trader/20">
                        <Cloud className="w-4 h-4 text-trader" />
                        <span className="font-medium">Weather:</span>
                        <span className="text-sm">{item.content.weather.current}, {item.content.weather.forecast}</span>
                      </div>
                    </div>
                  )}

                  {item.type === "journal" && "photo" in item.content && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{item.content.photo}</div>
                        <div>
                          <p className="text-sm font-medium">{item.content.description}</p>
                          <div className="flex gap-1 mt-1">
                            {item.content.tags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === "voice" && "transcription" in item.content && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm italic">"{item.content.transcription}"</p>
                      </div>
                      <div className="flex gap-2">
                        {item.content.actions.map((action: string) => (
                          <Button key={action} variant="outline" size="sm">
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.type === "webclip" && "title" in item.content && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Paperclip className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm mb-1">{item.content.title}</h5>
                          <p className="text-sm text-muted-foreground mb-2">{item.content.summary}</p>
                          <div className="flex gap-1">
                            {item.content.tags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions Sidebar */}
      <div className="w-80 p-6 bg-card border-l shadow-soft">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-1">Bizzy Suggests</h3>
            <p className="text-sm text-muted-foreground">AI-powered insights for your farm</p>
          </div>

          <div className="space-y-4">
            {suggestions.map((suggestion, i) => {
              const Icon = suggestion.icon;
              return (
                <Card key={i} className="hover:shadow-soft transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="outline" className="text-xs mb-2">
                          {suggestion.type}
                        </Badge>
                        <p className="text-sm font-medium mb-2 leading-relaxed">
                          {suggestion.title}
                        </p>
                        <Button variant="outline" size="sm" className="text-xs">
                          {suggestion.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}