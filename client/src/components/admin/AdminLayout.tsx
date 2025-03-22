import { User } from "@shared/schema";
import { GradientText } from "@/components/ui/gradient-text";
import { Footer } from "@/components/layout/Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

export function AdminLayout({ children, user, onLogout }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <header className="bg-primary-light bg-opacity-80 backdrop-blur-md py-3 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white font-mono mr-4">
              Shi<span className="text-accent-purple">jan</span>
            </span>
            <span className="px-2 py-1 bg-accent-purple bg-opacity-20 text-accent-purple rounded text-xs">
              Admin Portal
            </span>
          </div>
          <div className="text-light">
            Logged in as <span className="font-semibold">{user.username}</span>
          </div>
        </div>
      </header>
      
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-2xl font-bold">
              <GradientText>Admin Control Panel</GradientText>
            </h1>
            <p className="text-light">Manage your portfolio, waitlist, and contact messages</p>
          </div>
          
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
