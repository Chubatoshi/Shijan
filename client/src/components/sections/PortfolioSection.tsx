import { useState, useEffect } from "react";
import { GradientText } from "@/components/ui/gradient-text";
import { PortfolioItem } from "@/components/PortfolioItem";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
  
  useEffect(() => {
    if (projects) {
      if (activeCategory === "all") {
        setFilteredProjects(projects);
      } else {
        setFilteredProjects(projects.filter(project => project.category === activeCategory));
      }
    }
  }, [activeCategory, projects]);
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  return (
    <section id="portfolio" className="py-20 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Our <GradientText>Portfolio</GradientText>
          </h2>
          <p className="mt-4 text-xl text-light max-w-2xl mx-auto">
            A showcase of our dual expertise in digital art and software development
          </p>
        </motion.div>
        
        {/* Portfolio Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center space-x-2">
            <CategoryButton 
              category="all" 
              activeCategory={activeCategory} 
              onClick={() => handleCategoryChange("all")}
            >
              All Projects
            </CategoryButton>
            <CategoryButton 
              category="art" 
              activeCategory={activeCategory} 
              onClick={() => handleCategoryChange("art")}
            >
              Digital Art
            </CategoryButton>
            <CategoryButton 
              category="software" 
              activeCategory={activeCategory} 
              onClick={() => handleCategoryChange("software")}
            >
              Software
            </CategoryButton>
          </div>
        </div>
        
        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Show skeletons while loading
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <Skeleton className="w-full h-64" />
              </div>
            ))
          ) : filteredProjects.length > 0 ? (
            // Show portfolio items
            filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PortfolioItem project={project} />
              </motion.div>
            ))
          ) : (
            // Show message when no projects
            <div className="col-span-full text-center py-12">
              <p className="text-light text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface CategoryButtonProps {
  category: string;
  activeCategory: string;
  onClick: () => void;
  children: React.ReactNode;
}

function CategoryButton({ category, activeCategory, onClick, children }: CategoryButtonProps) {
  const isActive = category === activeCategory;
  
  return (
    <Button 
      variant={isActive ? "default" : "secondary"}
      className={`rounded-full ${isActive ? 'bg-accent-purple' : 'bg-darkgray hover:bg-primary-light'}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
