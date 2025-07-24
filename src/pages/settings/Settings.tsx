import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { updatePassword } from 'aws-amplify/auth';

const Settings = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "general";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const [settings, setSettings] = useState({
    companyName: "CasinoVizion",
    adminEmail: "admin@casinovizion.com",
    timezone: "America/Los_Angeles",
    currency: "USD",
    notifications: true,
    emailAlerts: true,
    twoFactorAuth: false,
    maintenanceMode: false,
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const [passwords, setPasswords] = useState({
  old: "",
  new: "",
  confirm: "",
});
const [error, setError] = useState("");

// Handler
const handlePasswordChange = (field: string, value: string) => {
  setPasswords((prev) => ({ ...prev, [field]: value }));
  if (field === "new" || field === "confirm") {
    const newPassword = field === "new" ? value : passwords.new;
    const confirmPassword = field === "confirm" ? value : passwords.confirm;
    setError(newPassword && confirmPassword && newPassword !== confirmPassword ? "Passwords do not match." : "");
  }
};

const handleUpdatePassword = async () => {
  if (passwords.new !== passwords.confirm) {
    setError("Passwords do not match.");
    return;
  }
  try {
    await updatePassword({ oldPassword: passwords.old, newPassword: passwords.new });
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    setPasswords({ old: "", new: "", confirm: "" });
  } catch (err) {
    setError("Failed to update password. Please check your old password and try again.");
    console.error("Password update error:", err);
  }
};

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Settings saved successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            <div>
              <h1 className="text-2xl font-bold text-navy-500">Settings</h1>
              <p className="text-gray-600">Manage your system configuration</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-navy-500 hover:bg-navy-600 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </header>

      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Reset Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* GENERAL */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-600">General Settings</CardTitle>
                <CardDescription>Basic configuration for your CasinoVizion admin panel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/casino-images/ce767b88-6e44-4170-964b-241465ab0d9a.png" />
                    <AvatarFallback>CV</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="mb-2">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-sm text-gray-500">Recommended: 200x200px, PNG or JPG</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => handleSettingChange('companyName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-500">Reset Password</CardTitle>
                <CardDescription>Reset your Password</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Right side: Change Password */}
                  <div className="p-6 items-center rounded-xl border border-gray-250 bg-white shadow-md">
                    <h3 className="text-lg font-semibold text-navy-250 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">Old Password</Label>
                        <Input
                          id="oldPassword"
                          type="password"
                          placeholder="Enter current password"
                          value={passwords.old}
                          onChange={(e) => handlePasswordChange("old", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          value={passwords.new}
                          onChange={(e) => handlePasswordChange("new", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Re-enter new password"
                          value={passwords.confirm}
                          onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                        />
                      </div>

                      {error && <p className="text-sm text-red-600">{error}</p>}

                      <Button
                        onClick={handleUpdatePassword}
                        disabled={
                          !passwords.old || !passwords.new || !passwords.confirm || error !== ""
                        }
                        className="bg-navy-500 hover:bg-navy-600 text-white w-full"
                      >
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* NOTIFICATIONS */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-600">Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Alerts</Label>
                    <p className="text-sm text-gray-500">Receive important updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailAlerts}
                    onCheckedChange={(checked) => handleSettingChange('emailAlerts', checked)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Email Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SYSTEM */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-600">System Settings</CardTitle>
                <CardDescription>Advanced system configuration options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Temporarily disable access for maintenance</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Data Backup</Label>
                  <div className="flex gap-2">
                    <Button variant="outline">Download Backup</Button>
                    <Button variant="outline">Schedule Backup</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>API Rate Limiting</Label>
                  <Select defaultValue="1000">
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 requests/hour</SelectItem>
                      <SelectItem value="500">500 requests/hour</SelectItem>
                      <SelectItem value="1000">1000 requests/hour</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
