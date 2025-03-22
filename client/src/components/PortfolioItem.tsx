import { CardHover } from "@/components/ui/card-hover";
import { type Project } from "@shared/schema";
import { motion } from "framer-motion";

interface PortfolioItemProps {
  project: Project;
}

export function PortfolioItem({ project }: PortfolioItemProps) {
  return (
    <div className="portfolio-item" data-category={project.category}>
      <CardHover className="relative overflow-hidden rounded-lg">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-64 object-cover object-center transition duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className={`inline-block px-3 py-1 ${project.category === 'art' ? 'bg-accent-pink' : 'bg-accent-teal'} bg-opacity-30 backdrop-blur-sm rounded-full text-xs font-mono mb-2`}>
            {project.category === 'art' ? 'Digital Art' : 'Software'}
          </span>
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
          <motion.p 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-light text-sm mt-1"
          >
            {project.description}
          </motion.p>
        </div>
      </CardHover>
    </div>
  );
}
