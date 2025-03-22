import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WaitlistEntry } from "@shared/schema";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { Check, X, Loader2 } from "lucide-react";

export function WaitlistList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [interestFilter, setInterestFilter] = useState("all");

  const { data: waitlistEntries, isLoading, error } = useQuery<WaitlistEntry[]>({
    queryKey: ['/api/waitlist'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
        <span className="ml-2 text-light">Loading waitlist entries...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-md p-4 text-red-500">
        <h3 className="text-lg font-medium">Error Loading Waitlist</h3>
        <p>{(error as Error).message || "An unknown error occurred"}</p>
      </div>
    );
  }

  const filteredEntries = waitlistEntries 
    ? waitlistEntries.filter(entry => 
        interestFilter === "all" || entry.interest === interestFilter
      )
    : [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

  const getInterestBadgeClass = (interest: string) => {
    switch (interest) {
      case "art":
        return "bg-accent-pink";
      case "software":
        return "bg-accent-teal";
      case "both":
        return "bg-accent-purple";
      default:
        return "bg-gray-500";
    }
  };

  const getInterestLabel = (interest: string) => {
    switch (interest) {
      case "art":
        return "Digital Art";
      case "software":
        return "Software";
      case "both":
        return "Both Services";
      default:
        return interest;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Waitlist Entries</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-light">Filter by interest:</span>
          <Select value={interestFilter} onValueChange={setInterestFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All interests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All interests</SelectItem>
              <SelectItem value="art">Digital Art</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="both">Both Services</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginatedEntries.length > 0 ? (
        <>
          <Table>
            <TableCaption>List of people who joined the waitlist.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Updates</TableHead>
                <TableHead>Date Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>
                    <Badge className={getInterestBadgeClass(entry.interest)}>
                      {getInterestLabel(entry.interest)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {entry.receivesUpdates ? (
                      <span className="flex items-center text-green-500">
                        <Check className="h-4 w-4 mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <X className="h-4 w-4 mr-1" /> No
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(entry.createdAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-light">Items per page:</span>
                <Select 
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(parseInt(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-light text-lg">No waitlist entries found.</p>
          {interestFilter !== "all" && (
            <p className="text-sm text-accent-purple mt-2">
              Try changing the interest filter to see more entries.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
