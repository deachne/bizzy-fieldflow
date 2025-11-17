import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    name: "Today Hub",
    href: "/",
    emoji: "🏠",
    badge: null,
  },
  {
    name: "Inbox",
    href: "/inbox", 
    emoji: "📥",
    badge: "2",
  },
  {
    name: "Knowledge Hub",
    href: "/knowledge",
    emoji: "🔍",
    badge: "12",
  },
  {
    name: "Library",
    href: "/library",
    emoji: "📚",
    badge: "3",
  },
  {
    name: "Notes",
    href: "/notes",
    emoji: "📝",
    badge: null,
  },
  {
    name: "The Forge",
    href: "/forge",
    emoji: "🔨",
    badge: null,
  },
];

const moduleItems = [
  {
    name: "BizzyFarmer",
    href: "/farmer",
    emoji: "🚜",
    color: "farmer",
    stats: "780 acres harvested / 2 hazards flagged",
  },
  {
    name: "BizzyTrader", 
    href: "/trader",
    emoji: "📈",
    color: "trader",
    stats: "Canola $865/MT ↗",
  },
  {
    name: "Accounting",
    href: "/accounting",
    emoji: "💰",
    color: "accounting",
    stats: "Cashflow: $42,500",
  },
];

const settingsItem = {
  name: "Settings",
  href: "/settings",
  emoji: "⚙️",
};

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-earth border-r shadow-soft">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-farmer flex items-center justify-center">
            <span className="text-base">🚜</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Bizzy</h1>
            <p className="text-xs text-muted-foreground">Farm Management Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.emoji}</span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Modules */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Modules
          </h3>
          <div className="space-y-3">
            {moduleItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-3 rounded-lg transition-all hover:shadow-soft",
                    isActive
                      ? `bg-${item.color}-light border border-${item.color}/20`
                      : "bg-card hover:bg-accent"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      "w-6 h-6 rounded flex items-center justify-center",
                      `bg-${item.color} text-white`
                    )}>
                      <span className="text-sm">{item.emoji}</span>
                    </div>
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed ml-9">
                    {item.stats}
                  </p>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="border-t pt-4 mt-auto">
          <NavLink
            to={settingsItem.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
              location.pathname === settingsItem.href
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <span className="text-base">{settingsItem.emoji}</span>
            <span>{settingsItem.name}</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}