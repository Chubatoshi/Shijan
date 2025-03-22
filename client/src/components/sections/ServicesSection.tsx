import { GradientText } from "@/components/ui/gradient-text";
import { CardHover } from "@/components/ui/card-hover";
import { Check, Code, Image } from "lucide-react";
import { motion } from "framer-motion";

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-dark to-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Our <GradientText>Dual Expertise</GradientText>
          </h2>
          <p className="mt-4 text-xl text-light max-w-2xl mx-auto">
            Seamlessly bridging the gap between artistic vision and technical execution
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Art Service Card */}
          <ServiceCard
            title="Digital Artistry"
            description="Elevate your brand with stunning digital art that captivates and inspires. From concept to creation, we bring your vision to life."
            icon={<Image className="h-8 w-8 text-accent-pink" />}
            color="pink"
            features={[
              "UI/UX Design & Illustrations",
              "Brand Identity Systems",
              "Motion Graphics & Animation"
            ]}
            link="#portfolio"
            linkText="View Art Portfolio"
          />
          
          {/* Tech Service Card */}
          <ServiceCard
            title="Software Development"
            description="Transform ideas into powerful software solutions. We craft intuitive applications that solve complex problems with elegant simplicity."
            icon={<Code className="h-8 w-8 text-accent-teal" />}
            color="teal"
            features={[
              "Web & Mobile Applications",
              "Custom Software Solutions",
              "API Development & Integration"
            ]}
            link="#portfolio"
            linkText="View Software Projects"
          />
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "pink" | "teal" | "purple";
  features: string[];
  link: string;
  linkText: string;
}

function ServiceCard({ title, description, icon, color, features, link, linkText }: ServiceCardProps) {
  const colorClasses = {
    pink: "bg-accent-pink text-accent-pink",
    teal: "bg-accent-teal text-accent-teal",
    purple: "bg-accent-purple text-accent-purple",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <CardHover className="relative overflow-hidden rounded-2xl bg-primary-light bg-opacity-50 p-8">
        <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 ${color === "pink" ? "bg-accent-pink" : "bg-accent-teal"} opacity-10 rounded-full blur-2xl`}></div>
        <div className="relative z-10">
          <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${colorClasses[color].split(" ")[0]} bg-opacity-20 mb-6`}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-light mb-6">{description}</p>
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className={`h-5 w-5 ${colorClasses[color].split(" ")[1]} mt-1 mr-2`} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <a href={link} className={`inline-flex items-center ${colorClasses[color].split(" ")[1]} hover:underline`}>
            <span>{linkText}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </CardHover>
    </motion.div>
  );
}
