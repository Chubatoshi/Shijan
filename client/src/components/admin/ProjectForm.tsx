import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type InsertProject, type Project } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GradientBorder } from "@/components/ui/gradient-border";
import { Loader2 } from "lucide-react";

// Extend the schema with more validation
const projectFormSchema = insertProjectSchema.extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  imageUrl: z.string().url("Please enter a valid URL"),
});

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertProject>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project ? {
      title: project.title,
      description: project.description,
      category: project.category,
      imageUrl: project.imageUrl,
      featured: project.featured,
      details: project.details,
    } : {
      title: "",
      description: "",
      category: "art",
      imageUrl: "",
      featured: false,
      details: {
        tools: [],
        client: "",
        link: "",
        gallery: [],
      },
    },
  });
  
  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest(
        project ? "PATCH" : "POST", 
        project ? `/api/projects/${project.id}` : "/api/projects", 
        data
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: `Project ${project ? "updated" : "created"} successfully!`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      if (onSuccess) onSuccess();
      if (!project) form.reset(); // Only reset if it's a new project
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${project ? "update" : "create"} project. Please try again.`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  function onSubmit(data: InsertProject) {
    setIsSubmitting(true);
    createProjectMutation.mutate(data);
  }
  
  return (
    <GradientBorder>
      <div className="p-6 bg-primary-light bg-opacity-50 rounded-lg">
        <h2 className="text-xl font-bold mb-6">
          {project ? "Edit Project" : "Create New Project"}
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="art">Digital Art</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Direct link to project image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured Project</FormLabel>
                    <FormDescription>
                      Mark this project as featured to highlight it on the homepage
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="details.tools"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tools Used (comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Photoshop, Illustrator, React, etc." 
                      value={field.value?.join(", ") || ""} 
                      onChange={(e) => {
                        const toolsArray = e.target.value
                          .split(",")
                          .map((tool) => tool.trim())
                          .filter((tool) => tool !== "");
                        field.onChange(toolsArray);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Tools and technologies used in this project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="details.client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Client name" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="details.link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Link (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (onSuccess) onSuccess();
                  else form.reset();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={project ? "bg-accent-teal" : "bg-accent-purple"}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {project ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  project ? "Update Project" : "Create Project"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </GradientBorder>
  );
}
