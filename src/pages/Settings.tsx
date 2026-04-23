import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, Palette, Globe } from "lucide-react";

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-card/20">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-primary/20 bg-background/95 backdrop-blur px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Settings</h1>
          </header>
          
          <div className="p-6 space-y-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Notifications */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <CardTitle>Notifications</CardTitle>
                  </div>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mining-alerts" className="flex flex-col space-y-1">
                      <span>Mining Alerts</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        Get notified about mining activities
                      </span>
                    </Label>
                    <Switch id="mining-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="transaction-alerts" className="flex flex-col space-y-1">
                      <span>Transaction Alerts</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        Get notified about transactions
                      </span>
                    </Label>
                    <Switch id="transaction-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="security-alerts" className="flex flex-col space-y-1">
                      <span>Security Alerts</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        Important security notifications
                      </span>
                    </Label>
                    <Switch id="security-alerts" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>Security</CardTitle>
                  </div>
                  <CardDescription>Manage your security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor" className="flex flex-col space-y-1">
                      <span>Two-Factor Authentication</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        Add an extra layer of security
                      </span>
                    </Label>
                    <Switch id="two-factor" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="biometric" className="flex flex-col space-y-1">
                      <span>Biometric Lock</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        Use fingerprint or face ID
                      </span>
                    </Label>
                    <Switch id="biometric" />
                  </div>
                  <Button variant="outline" className="w-full border-primary/30">
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <CardTitle>Appearance</CardTitle>
                  </div>
                  <CardDescription>Customize how ARXON looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                      <span>Dark Mode</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        Use dark theme
                      </span>
                    </Label>
                    <Switch id="dark-mode" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animations" className="flex flex-col space-y-1">
                      <span>Animations</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        Enable interface animations
                      </span>
                    </Label>
                    <Switch id="animations" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* Language & Region */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <CardTitle>Language & Region</CardTitle>
                  </div>
                  <CardDescription>Set your language and region preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Button variant="outline" className="w-full justify-start border-primary/30">
                      English (US)
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <Button variant="outline" className="w-full justify-start border-primary/30">
                      UTC (Coordinated Universal Time)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <Button 
                size="lg"
                className="w-full gradient-primary hover:glow-primary transition-smooth"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
