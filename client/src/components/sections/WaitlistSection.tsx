import { useState } from "react";
import { GradientText } from "@/components/ui/gradient-text";
import { GradientBorder } from "@/components/ui/gradient-border";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWaitlistEntrySchema, type InsertWaitlistEntry } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Extend the schema with more validation
const waitlistFormSchema = insertWaitlistEntrySchema.extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export function WaitlistSection() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<InsertWaitlistEntry>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      name: "",
      email: "",
      interest: "",
      receivesUpdates: true,
    },
  });
  
  const waitlistMutation = useMutation({
    mutationFn: async (data: InsertWaitlistEntry) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll notify you soon!",
        variant: "default",
      });
      setSubmitted(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: InsertWaitlistEntry) {
    waitlistMutation.mutate(data);
  }
  
  return (
    <section id="waitlist" className="py-20 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-accent-purple opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-accent-teal opacity-5 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Join Our <GradientText>Exclusive Waitlist</GradientText>
          </h2>
          <p className="text-xl text-light">
            Be among the first to experience our innovative platform and receive early access to our services.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {submitted ? (
            <div className="bg-primary-light bg-opacity-50 rounded-2xl p-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-accent-purple bg-opacity-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-light mb-6">
                  We've received your information and will reach out soon with exclusive updates and early access opportunities.
                </p>
                <Button 
                  variant="outline" 
                  className="border-accent-purple text-accent-purple hover:bg-accent-purple hover:bg-opacity-10"
                  onClick={() => setSubmitted(false)}
                >
                  Sign Up Another
                </Button>
              </motion.div>
            </div>
          ) : (
            <GradientBorder>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-light font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-darkgray border-midgray focus:border-accent-purple focus:ring-accent-purple focus:ring-opacity-30 text-light"
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-light font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-darkgray border-midgray focus:border-accent-purple focus:ring-accent-purple focus:ring-opacity-30 text-light"
                            placeholder="Enter your email address"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="text-light font-medium">Primary Interest</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-darkgray border-midgray focus:border-accent-purple focus:ring-accent-purple focus:ring-opacity-30 text-light">
                              <SelectValue placeholder="Select your primary interest" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="art">Digital Art & Design</SelectItem>
                            <SelectItem value="software">Software Development</SelectItem>
                            <SelectItem value="both">Both Services</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="receivesUpdates"
                    render={({ field }) => (
                      <FormItem className="mb-6 flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-light">
                            I agree to receive updates about the product launch and early access opportunities.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent-purple hover:bg-opacity-90 text-white"
                    disabled={waitlistMutation.isPending}
                  >
                    {waitlistMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Waitlist"
                    )}
                  </Button>
                  
                  <p className="text-xs text-light text-center mt-4">
                    By joining our waitlist, you agree to our <a href="#" className="text-accent-purple hover:underline">Terms of Service</a> and <a href="#" className="text-accent-purple hover:underline">Privacy Policy</a>.
                  </p>
                </form>
              </Form>
            </GradientBorder>
          )}
        </motion.div>
      </div>
    </section>
  );
}
