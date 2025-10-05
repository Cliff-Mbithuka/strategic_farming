
import { useState, useContext } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "./ui/sidebar";
import { LayoutDashboard, Satellite, Users, Bug, ShoppingCart, MessageSquare, Coins, Menu, Sprout } from "lucide-react";
import { Button } from "./ui/button";
import { Dashboard } from "./Dashboard";
import SatelliteView from "./SatelliteView";
import { NeighborCrops } from "./NeighborCrops";
import { PestPrediction } from "./PestPrediction";
import { MarketPlace } from "./MarketPlace";
import { ChatCopilot } from "./ChatCopilot";
import { CreditSystem } from "./CreditSystem";
import { FloatingCopilot } from "./FloatingCopilot";
import { CopilotProvider } from "./CopilotContext";
import { AuthContext } from "../contexts/AuthContext";

type View = "dashboard" | "satellite" | "neighbors" | "pests" | "market" | "chat" | "credits";

export default function Layout() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const menuItems = [
    { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
    { id: "satellite" as View, label: "Satellite & Data", icon: Satellite },
    { id: "neighbors" as View, label: "Neighbor Crops", icon: Users },
    { id: "pests" as View, label: "Pest Prediction", icon: Bug },
    { id: "market" as View, label: "Go to Market", icon: ShoppingCart },
    { id: "chat" as View, label: "AI Copilot", icon: MessageSquare },
    { id: "credits" as View, label: "Credit Points", icon: Coins }
  ];

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "satellite":
        return <SatelliteView />;
      case "neighbors":
        return <NeighborCrops />;
      case "pests":
        return <PestPrediction />;
      case "market":
        return <MarketPlace />;
      case "chat":
        return <ChatCopilot />;
      case "credits":
        return <CreditSystem />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CopilotProvider>
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="flex h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">M-kulima</h2>
                <p className="text-xs text-muted-foreground">Smart Farming Platform</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => setCurrentView(item.id)}
                          isActive={currentView === item.id}
                          tooltip={item.label}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                {user?.firstName?.charAt(0) || "?"} {user?.lastName?.charAt(0) || "?"}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs">{user?.currentRank || "Member"} Member</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <h2 className="font-semibold">M-kulima</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8">
            {renderView()}
          </div>
        </main>

          {/* Floating Copilot - Available on all pages */}
          <FloatingCopilot />
        </div>
      </SidebarProvider>
    </CopilotProvider>
  );
}
