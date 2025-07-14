
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, TrendingUp, DollarSign, Hotel, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import ProfileDropdown from "@/components/ProfileDropdown";
import RoleGuard from "@/components/RoleGuard";

const Index = () => {
  const { user } = useUser();

  // Define all possible cards
  const allCards = [
    {
      id: 'casinos',
      title: 'Total Casinos',
      value: '24',
      change: '+2 from last month',
      icon: Building2,
      color: 'navy-500',
      textColor: 'navy-600',
      permission: 'view_all'
    },
    {
      id: 'hotels',
      title: 'Total Hotels',
      value: '18',
      change: '+3 from last month',
      icon: Hotel,
      color: 'maroon-500',
      textColor: 'maroon-600',
      permission: 'view_all'
    },
    {
      id: 'restaurants',
      title: 'Total Restaurants',
      value: '42',
      change: '+5 from last month',
      icon: Utensils,
      color: 'casino-green',
      textColor: '[#1A5935]',
      permission: 'view_all'
    },
    {
      id: 'users',
      title: 'Active Customers',
      value: '1,247',
      change: '+180 from last month',
      icon: Users,
      color: 'maroon-500',
      textColor: 'maroon-600',
      permission: 'add_edit_delete_users'
    },
    // {
    //   id: 'revenue',
    //   title: 'Revenue',
    //   value: '$45,231',
    //   change: '+20.1% from last month',
    //   icon: DollarSign,
    //   color: 'casino-green',
    //   textColor: '[#1A5935]',
    //   permission: 'view_all'
    // },
    // {
    //   id: 'growth',
    //   title: 'Growth Rate',
    //   value: '+12.5%',
    //   change: '+2.1% from last month',
    //   icon: TrendingUp,
    //   color: 'casino-gold',
    //   textColor: '[#E0B100]',
    //   permission: 'view_all'
    // }
  ];

  // Filter cards based on user permissions
  const visibleCards = allCards.filter(card => {
    if (!user) return false;
    const permissions = {
      admin: ['view_all', 'add_edit_delete_users'],
      developer: ['view_all'],
      guest: ['view_all']
    };
    return permissions[user.role]?.includes(card.permission) || false;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            <div>
              <h1 className="text-2xl font-bold text-navy-500">Dashboard</h1>
              <p className="text-gray-600">
                Welcome to CasinoVizion Admin Panel
                {user && <span className="ml-2 text-navy-500">- {user.name} {user.family_name}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-medium text-navy-600">{user.name} {user.family_name}</p>
              </div>
            )}
            <ProfileDropdown />
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Flexible card grid that auto-adjusts based on visible cards */}
        <div 
          className={`grid gap-6 mb-8 ${
            visibleCards.length === 1 ? 'grid-cols-1' :
            visibleCards.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            visibleCards.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
            visibleCards.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
            visibleCards.length === 5 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
          }`}
        >
          {visibleCards.map((card) => (
            <Card key={card.id} className={`border-l-4 border-l-${card.color}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 text-${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold text-${card.textColor}`}>
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground">{card.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-navy-600">Quick Actions</CardTitle>
              <CardDescription>Manage your casino operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link 
                to="/adminpanel/casinos" 
                className="block p-4 bg-navy-50 hover:bg-navy-100 rounded-lg transition-colors border border-navy-200"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-navy-500" />
                  <div>
                    <h3 className="font-medium text-navy-600">Manage Casinos</h3>
                    <p className="text-sm text-gray-600">View and edit casino details</p>
                  </div>
                </div>
              </Link>
              
              <RoleGuard permission="add_edit_delete_users">
                <Link 
                  to="/adminpanel/users" 
                  className="block p-4 bg-navy-50 hover:bg-navy-100 rounded-lg transition-colors border border-navy-200"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-navy-500" />
                    <div>
                      <h3 className="font-medium text-navy-600">User Management</h3>
                      <p className="text-sm text-gray-600">Manage system users</p>
                    </div>
                  </div>
                </Link>
              </RoleGuard>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-navy-600">Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-casino-green rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New casino added: Bellagio Las Vegas</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-maroon-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Casino details updated: MGM Grand</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <RoleGuard permission="add_edit_delete_users">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-casino-gold rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </RoleGuard>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
