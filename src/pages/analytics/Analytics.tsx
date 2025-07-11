
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Building2, DollarSign } from "lucide-react";

// Mock data for analytics
const revenueData = [
  { month: 'Jan', revenue: 45000, casinos: 20 },
  { month: 'Feb', revenue: 52000, casinos: 21 },
  { month: 'Mar', revenue: 48000, casinos: 22 },
  { month: 'Apr', revenue: 61000, casinos: 23 },
  { month: 'May', revenue: 55000, casinos: 24 },
  { month: 'Jun', revenue: 67000, casinos: 24 },
];

const categoryData = [
  { name: 'Luxury', value: 40, color: '#13294B' },
  { name: 'Entertainment', value: 35, color: '#7D1D28' },
  { name: 'Budget', value: 25, color: '#1A5935' },
];

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-navy-500">Analytics</h1>
              <p className="text-gray-600">Business insights and performance metrics</p>
            </div>
          </div>
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-navy-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-navy-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-navy-600">$328,000</div>
              <p className="text-xs text-muted-foreground">+15.2% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-maroon-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Casinos</CardTitle>
              <Building2 className="h-4 w-4 text-maroon-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-maroon-600">24</div>
              <p className="text-xs text-muted-foreground">+2 new this month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-casino-green">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Visitors</CardTitle>
              <Users className="h-4 w-4 text-casino-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#1A5935' }}>125,847</div>
              <p className="text-xs text-muted-foreground">+8.3% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-casino-gold">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-casino-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#E0B100' }}>+18.7%</div>
              <p className="text-xs text-muted-foreground">+3.2% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-navy-600">Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#13294B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-navy-600">Casino Categories</CardTitle>
              <CardDescription>Distribution of casinos by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-navy-600">Casino Growth</CardTitle>
              <CardDescription>Number of casinos added over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="casinos" fill="#7D1D28" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-navy-600">Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Rating</span>
                <span className="text-lg font-bold text-casino-gold">4.6/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <span className="text-lg font-bold text-casino-green">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Repeat Visitors</span>
                <span className="text-lg font-bold text-navy-600">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Market Share</span>
                <span className="text-lg font-bold text-maroon-600">23%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
