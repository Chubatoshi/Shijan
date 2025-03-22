import { GradientText } from "@/components/ui/gradient-text";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-primary opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent-purple opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-accent-teal opacity-10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <GradientText>Shijan</GradientText>: Where <GradientText>Art</GradientText> meets <GradientText>Technology</GradientText>
            </h1>
            
            <p className="text-xl text-light max-w-xl">
              Seamlessly blending creative digital artistry with cutting-edge software solutions. Join our waitlist for exclusive early access.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#waitlist">
                <Button size="lg" className="bg-accent-purple hover:bg-opacity-90 text-white shadow-lg w-full sm:w-auto">
                  Join Waitlist
                </Button>
              </a>
              <a href="#portfolio">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10 text-white w-full sm:w-auto"
                >
                  View Portfolio
                </Button>
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            className="hidden lg:block relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple to-accent-teal rounded-lg blur opacity-30"></div>
              <div className="relative bg-dark rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1618004912476-29818d81ae2e?auto=format&q=90" 
                  alt="Digital art portfolio showcase" 
                  className="w-full h-auto rounded-lg" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-accent-purple bg-opacity-30 backdrop-blur-sm rounded-full text-sm font-mono mb-2">Featured Project</span>
                  <h3 className="text-xl font-bold text-white">Nexus Interface Design</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <ChevronDown className="w-8 h-8 text-light" />
      </motion.div>
    </section>
  );
}
