import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import arxonLogo from "@/assets/arxon-logo-profile.png";

const Profile = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-card/20">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-primary/20 bg-background/95 backdrop-blur px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Profile</h1>
          </header>
          
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-6">
                    {/* Avatar */}
                    <Avatar className="w-40 h-40 border-4 border-primary/30">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-card/80 text-muted-foreground">
                        <User className="w-20 h-20" />
                      </AvatarFallback>
                    </Avatar>

                    {/* Username */}
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2" style={{ color: "#C4CDCC" }}>
                        Username
                      </h2>
                      <p className="text-muted-foreground">
                        Joined: Not set
                      </p>
                    </div>

                    {/* About Me Section */}
                    <div className="w-full space-y-4">
                      <h3 className="text-xl font-semibold text-center">About Me</h3>
                      <div className="min-h-[100px] p-4 rounded-lg bg-background/50 border border-primary/20 text-center text-muted-foreground">
                        Tell us about yourself...
                      </div>
                    </div>

                    {/* Edit Button */}
                    <Button 
                      size="lg"
                      className="w-full max-w-xs gradient-primary hover:glow-primary transition-smooth"
                    >
                      Edit
                    </Button>

                    {/* Stats */}
                    <div className="w-full grid grid-cols-3 gap-4 pt-6 border-t border-primary/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "#C4CDCC" }}>0</div>
                        <div className="text-xs text-muted-foreground">Transactions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "#C4CDCC" }}>0</div>
                        <div className="text-xs text-muted-foreground">Blocks Mined</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "#C4CDCC" }}>0</div>
                        <div className="text-xs text-muted-foreground">ARXON Earned</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
