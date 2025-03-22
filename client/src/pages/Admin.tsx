import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectList } from "@/components/admin/ProjectList";
import { WaitlistList } from "@/components/admin/WaitlistList";
import { ContactList } from "@/components/admin/ContactList";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const { data: user, isLoading: userLoading, error } = useQuery<User | null>({
    queryKey: ['/api/auth/me'],
    onSuccess: (data) => {
      if (data) {
        setIsAuthenticated(true);
        setCurrentUser(data);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setIsLoading(false);
    },
    onError: () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsLoading(false);
    }
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setIsAuthenticated(false);
      setCurrentUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoginSuccess = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    toast({
      title: "Welcome",
      description: `You are logged in as ${user.username}`,
    });
  };

  if (isLoading || userLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark">
        <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
        <span className="ml-2 text-light">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminLayout
      user={currentUser!}
      onLogout={handleLogout}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="projects" className="flex-1">Projects</TabsTrigger>
          <TabsTrigger value="waitlist" className="flex-1">Waitlist</TabsTrigger>
          <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          <Card>
            <CardContent className="pt-6">
              <ProjectList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="waitlist">
          <Card>
            <CardContent className="pt-6">
              <WaitlistList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card>
            <CardContent className="pt-6">
              <ContactList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
