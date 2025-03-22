import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export function ContactList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const itemsPerPage = 10;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading, error } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/contact/${id}/read`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: "Message marked as read",
        description: "The contact message has been marked as read.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to mark message as read: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
        <span className="ml-2 text-light">Loading messages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-md p-4 text-red-500">
        <h3 className="text-lg font-medium">Error Loading Messages</h3>
        <p>{(error as Error).message || "An unknown error occurred"}</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil((messages?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMessages = messages 
    ? messages.slice(startIndex, startIndex + itemsPerPage) 
    : [];

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Contact Messages</h3>
        <div className="flex items-center">
          {messages && messages.filter(m => !m.isRead).length > 0 && (
            <Badge className="bg-accent-purple">
              {messages.filter(m => !m.isRead).length} unread
            </Badge>
          )}
        </div>
      </div>

      {paginatedMessages.length > 0 ? (
        <Table>
          <TableCaption>A list of contact form messages.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMessages.map((message) => (
              <TableRow key={message.id} className={!message.isRead ? "bg-primary-light bg-opacity-30" : ""}>
                <TableCell>
                  {message.isRead ? (
                    <Badge variant="outline" className="text-gray-400 border-gray-400">Read</Badge>
                  ) : (
                    <Badge className="bg-accent-teal">New</Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {message.name} <span className="text-gray-400">({message.email})</span>
                </TableCell>
                <TableCell>{message.subject}</TableCell>
                <TableCell>
                  {format(new Date(message.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-accent-teal hover:text-accent-teal hover:border-accent-teal"
                          onClick={() => setSelectedMessage(message)}
                        >
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">View Message</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{message.subject}</DialogTitle>
                          <DialogDescription>
                            From {message.name} ({message.email}) on {format(new Date(message.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 p-4 bg-primary rounded-md whitespace-pre-wrap">
                          {message.message}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                          {!message.isRead && (
                            <Button 
                              className="bg-accent-teal"
                              onClick={() => handleMarkAsRead(message.id)}
                              disabled={markAsReadMutation.isPending}
                            >
                              {markAsReadMutation.isPending ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Marking as read...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Mark as Read
                                </>
                              )}
                            </Button>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {!message.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-accent-purple hover:text-accent-purple hover:border-accent-purple"
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="sr-only">Mark as Read</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-light text-lg">No contact messages found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button 
                  key={index} 
                  variant={currentPage === index + 1 ? "default" : "outline"} 
                  size="sm"
                  className={currentPage === index + 1 ? "bg-accent-purple" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
