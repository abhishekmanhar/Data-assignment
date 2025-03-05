
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const DashboardLayout = () => {
  const { logout, username } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle Menu</span>
            </Button>
            
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="font-bold text-lg">Dashboard</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground mr-4">
              Logged in as <span className="font-medium text-foreground">{username}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <nav className="fixed top-16 bottom-0 left-0 w-3/4 max-w-xs bg-card border-r border-border p-6 flex flex-col gap-6 overflow-y-auto animate-slide-in">
              <div className="flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setSidebarOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <nav className="hidden md:flex flex-col gap-6 w-64 border-r border-border bg-card/50 p-6">
          <div className="flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </nav>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4 md:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
