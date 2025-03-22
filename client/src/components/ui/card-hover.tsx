import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardHoverProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHover({ children, className }: CardHoverProps) {
  return (
    <motion.div
      className={cn("transition-all duration-300", className)}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)" 
      }}
    >
      {children}
    </motion.div>
  );
}
