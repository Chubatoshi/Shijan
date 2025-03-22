import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 w-full bg-dark/80 backdrop-blur-md z-50 transition-all duration-300 ${isScrolled ? 'py-2 shadow-md' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <div className="text-2xl font-bold text-white font-mono cursor-pointer">
                Shi<span className="text-accent-purple">jan</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#portfolio">Portfolio</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </nav>
          
          {/* Join Waitlist Button */}
          <div>
            <a href="#waitlist" className="hidden md:inline-flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-accent-purple hover:bg-opacity-80 transition duration-150">
              Join Waitlist
            </a>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-200 hover:text-white focus:outline-none" 
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <MobileNavLink href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</MobileNavLink>
                <MobileNavLink href="#portfolio" onClick={() => setIsMobileMenuOpen(false)}>Portfolio</MobileNavLink>
                <MobileNavLink href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</MobileNavLink>
                <MobileNavLink href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</MobileNavLink>
                <MobileNavLink 
                  href="#waitlist" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-white bg-accent-purple hover:bg-opacity-80"
                >
                  Join Waitlist
                </MobileNavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <a 
      href={href} 
      className="text-light hover:text-accent-purple transition"
    >
      {children}
    </a>
  );
}

interface MobileNavLinkProps {
  href: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

function MobileNavLink({ href, onClick, className, children }: MobileNavLinkProps) {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className={className || "block px-3 py-2 rounded-md text-light hover:bg-primary hover:text-white"}
    >
      {children}
    </a>
  );
}
