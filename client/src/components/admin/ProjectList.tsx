import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Star, XCircle, Loader2 } from "lucide-react";

export function ProjectList() {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`, undefined);
    },
    onSuccess: () => {
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setDeletingProjectId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete project: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDeleteProject = (id: number) => {
    deleteProjectMutation.mutate(id);
  };

  const handleEditComplete = () => {
    setEditingProject(null);
    setIsAddingProject(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
        <span className="ml-2 text-light">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-md p-4 text-red-500">
        <h3 className="text-lg font-medium">Error Loading Projects</h3>
        <p>{(error as Error).message || "An unknown error occurred"}</p>
      </div>
    );
  }

  if (isAddingProject) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Create New Project</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingProject(false)}
          >
            <XCircle className="h-4 w-4 mr-2" /> Cancel
          </Button>
        </div>
        <ProjectForm onSuccess={handleEditComplete} />
      </div>
    );
  }

  if (editingProject) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Edit Project</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setEditingProject(null)}
          >
            <XCircle className="h-4 w-4 mr-2" /> Cancel
          </Button>
        </div>
        <ProjectForm project={editingProject} onSuccess={handleEditComplete} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Portfolio Projects</h3>
        <Button 
          className="bg-accent-purple"
          onClick={() => setIsAddingProject(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </div>

      {projects && projects.length > 0 ? (
        <Table>
          <TableCaption>A list of your portfolio projects.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      project.category === "art" 
                        ? "bg-accent-pink" 
                        : "bg-accent-teal"
                    }
                  >
                    {project.category === "art" ? "Digital Art" : "Software"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {project.featured ? (
                    <Badge className="bg-yellow-600">
                      <Star className="h-3 w-3 mr-1" /> Featured
                    </Badge>
                  ) : (
                    "No"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProject(project)}
                      className="text-accent-teal hover:text-accent-teal hover:border-accent-teal"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-500 hover:border-red-500"
                          onClick={() => setDeletingProjectId(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Project</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete "{project.title}"? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button 
                            variant="destructive"
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={deleteProjectMutation.isPending}
                          >
                            {deleteProjectMutation.isPending && deletingProjectId === project.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>Delete</>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-light text-lg">No projects found. Create your first project!</p>
          <Button 
            className="mt-4 bg-accent-purple"
            onClick={() => setIsAddingProject(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        </div>
      )}
    </div>
  );
}
