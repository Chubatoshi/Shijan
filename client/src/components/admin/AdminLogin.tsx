import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";
import { GradientText } from "@/components/ui/gradient-text";
import { GradientBorder } from "@/components/ui/gradient-border";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface AdminLoginProps {
  onLoginSuccess: (user: User) => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      onLoginSuccess(data.user);
    },
    onError: (error) => {
      setError((error as Error).message || "Invalid username or password");
      toast({
        title: "Login Failed",
        description: (error as Error).message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: LoginFormValues) {
    setError(null);
    loginMutation.mutate(data);
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <GradientText>Admin Login</GradientText>
          </h1>
          <p className="text-light">Sign in to access the admin dashboard</p>
        </div>
        
        <GradientBorder>
          <div className="p-8 bg-primary-light bg-opacity-50 rounded-lg">
            {error && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-md text-red-500">
                <p>{error}</p>
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-light">Username</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-darkgray border-midgray focus:border-accent-purple focus:ring-accent-purple focus:ring-opacity-30 text-light"
                          placeholder="Enter your username"
                          {...field}
                          autoComplete="username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-light">Password</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-darkgray border-midgray focus:border-accent-purple focus:ring-accent-purple focus:ring-opacity-30 text-light"
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent-purple hover:bg-opacity-90"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Login
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Default admin credentials:</p>
              <p className="text-accent-purple">username: admin / password: adminpassword</p>
            </div>
          </div>
        </GradientBorder>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-accent-purple hover:underline">
            Return to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
