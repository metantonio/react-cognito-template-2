import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, // <-- import the hook
} from "@/components/ui/sidebar";
import {
  Home,
  Building2,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import RoleGuard from "@/components/RoleGuard";

const menuItems = [
  { title: "Dashboard", url: "/adminpanel", icon: Home, permission: "view_all" },
  { title: "Casinos", url: "/adminpanel/casinos", icon: Building2, permission: "view_all" },
  { title: "Users", url: "/adminpanel/users", icon: Users, permission: "add_edit_delete_users" },
  { title: "Analytics", url: "/adminpanel/analytics", icon: BarChart3, permission: "view_all" },
  { title: "Settings", url: "/adminpanel/settings", icon: Settings, permission: "view_all" },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useUser();
  const { state, toggleSidebar } = useSidebar(); // use sidebar context

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-navy-200"
      data-collapsed={state === "collapsed"}
    >
      <SidebarHeader className="p-6 border-b border-navy-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <img
              src="/casino-vision-uploads/casino-logo.png"
              alt="CasinoVizion"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="text-lg font-bold text-sidebar-foreground">CasinoVizion</h2>
              <p className="text-sm text-sidebar-foreground/70">Admin Panel</p>
              {user && (
                <span className="text-xs text-sidebar-foreground/50">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Access
                </span>
              )}
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium group-data-[collapsible=icon]:sr-only">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <RoleGuard key={item.title} permission={item.permission}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </RoleGuard>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-navy-200">
        <div className="text-xs text-sidebar-foreground/50 text-center group-data-[collapsible=icon]:sr-only">
          © 2025 CasinoVizion
        </div>

        {/* Custom left/right toggle button inside SidebarFooter */}
        <div className="flex justify-center mt-2">
          <button
            onClick={toggleSidebar}
            className="bg-sidebar-accent text-sidebar-accent-foreground rounded-full p-2 hover:bg-sidebar-accent/90 transition"
            aria-label={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
          >
            {state === "collapsed" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
