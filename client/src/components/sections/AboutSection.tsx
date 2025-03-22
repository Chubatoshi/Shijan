import { GradientText } from "@/components/ui/gradient-text";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-dark to-primary-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              About Our <GradientText>Vision</GradientText>
            </h2>
            <p className="text-light text-lg mb-6">
              We bridge the gap between stunning visuals and functional technology, creating digital experiences that are both beautiful and powerful.
            </p>
            <p className="text-light text-lg mb-8">
              Our team brings together expertise in digital art and software development, offering a unique perspective that blends aesthetic excellence with technical innovation.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <StatCard value="5+" label="Years of industry experience" color="purple" />
              <StatCard value="100+" label="Projects delivered" color="teal" />
              <StatCard value="25+" label="Industry awards" color="pink" />
              <StatCard value="50+" label="Happy clients" color="purple" />
            </div>
            
            <a href="#contact">
              <Button className="bg-accent-purple hover:bg-opacity-90 text-white shadow-lg">
                Get in Touch
              </Button>
            </a>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative z-10 grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="space-y-4">
                <motion.div 
                  className="rounded-lg overflow-hidden h-48 transform translate-y-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1603969072881-b0fc7f3d6d7a?auto=format&q=80" 
                    alt="Tech developer workspace" 
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
                <motion.div 
                  className="rounded-lg overflow-hidden h-64"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1618004652321-13a63e576b80?auto=format&q=80" 
                    alt="Digital art portfolio" 
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
              </div>
              <div className="space-y-4">
                <motion.div 
                  className="rounded-lg overflow-hidden h-64"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1618346136472-090de27fe2b4?auto=format&q=80" 
                    alt="App showcase example" 
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
                <motion.div 
                  className="rounded-lg overflow-hidden h-48 transform -translate-y-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&q=80" 
                    alt="Modern software application" 
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
              </div>
            </div>
            
            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-accent-purple opacity-10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-accent-teal opacity-10 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  color: "purple" | "teal" | "pink";
}

function StatCard({ value, label, color }: StatCardProps) {
  const colorClasses = {
    purple: "text-accent-purple",
    teal: "text-accent-teal",
    pink: "text-accent-pink",
  };
  
  return (
    <motion.div 
      className="bg-primary bg-opacity-40 p-4 rounded-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${colorClasses[color]} text-3xl font-bold mb-2`}>{value}</div>
      <div className="text-light">{label}</div>
    </motion.div>
  );
}
