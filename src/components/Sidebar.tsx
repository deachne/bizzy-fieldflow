import { Home, Inbox, Search, BookOpen, Tractor, Zap, Settings, Hammer, FileText } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    name: "Today Hub",
    href: "/",
    icon: Home,
    badge: null,
  },
  {
    name: "Inbox",
    href: "/inbox", 
    icon: Inbox,
    badge: "2",
  },
  {
    name: "Knowledge Hub",
    href: "/knowledge",
    icon: Search,
    badge: "12",
  },
  {
    name: "Library",
    href: "/library",
    icon: BookOpen,
    badge: "3",
  },
  {
    name: "Notes",
    href: "/notes",
    icon: FileText,
    badge: null,
  },
  {
    name: "The Forge",
    href: "/forge",
    icon: Hammer,
    badge: null,
  },
];

const moduleItems = [
  {
    name: "BizzyFarmer",
    href: "/farmer",
    icon: Tractor,
    color: "farmer",
    stats: "780 acres harvested / 2 hazards flagged",
  },
  {
    name: "BizzyTrader", 
    href: "/trader",
    icon: Zap,
    color: "trader",
    stats: "Canola $865/MT ↗",
  },
  {
    name: "Accounting",
    href: "/accounting",
    icon: Settings,
    color: "accounting",
    stats: "Cashflow: $42,500",
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-earth border-r shadow-soft">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-farmer flex items-center justify-center">
            <Tractor className="w-4 h-4 text-white" />
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
              const Icon = item.icon;
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
                    <Icon className="w-4 h-4" />
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
              const Icon = item.icon;
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
                      <Icon className="w-3 h-3" />
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
      </nav>
    </div>
  );
}