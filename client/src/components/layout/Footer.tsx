import { Link } from "wouter";
import { SITE_NAME, SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/">
              <div className="text-2xl font-bold text-white font-mono cursor-pointer">
                Shi<span className="text-accent-purple">jan</span>
              </div>
            </Link>
            <p className="mt-4 text-light max-w-md">
              Merging creative artistry with technological innovation to deliver exceptional digital experiences.
            </p>
            <div className="mt-6 flex space-x-4">
              <SocialLink href={SOCIAL_LINKS.FACEBOOK} icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href={SOCIAL_LINKS.TWITTER} icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href={SOCIAL_LINKS.INSTAGRAM} icon={<Instagram className="w-5 h-5" />} />
              <SocialLink href={SOCIAL_LINKS.GITHUB} icon={<Github className="w-5 h-5" />} />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="#services">Services</FooterLink>
              <FooterLink href="#portfolio">Portfolio</FooterLink>
              <FooterLink href="#about">About Us</FooterLink>
              <FooterLink href="#contact">Contact</FooterLink>
              <FooterLink href="#waitlist">Join Waitlist</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-light text-center">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

function SocialLink({ href, icon }: SocialLinkProps) {
  return (
    <a 
      href={href} 
      className="flex items-center justify-center w-10 h-10 rounded-full bg-darkgray hover:bg-accent-purple hover:bg-opacity-20 transition-all"
      target="_blank" 
      rel="noopener noreferrer"
    >
      <span className="text-white">{icon}</span>
    </a>
  );
}

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <li>
      <a href={href} className="text-light hover:text-accent-purple transition">
        {children}
      </a>
    </li>
  );
}
