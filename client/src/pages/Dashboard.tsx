import { useEffect } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Home, BarChart3, Users, Settings, User } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, loading, isOnboarded } = useProfile();

  // Redirect to onboarding if profile is incomplete
  useEffect(() => {
    if (!loading && !isOnboarded) {
      navigate('/onboarding');
    }
  }, [loading, isOnboarded, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Navbar */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">NutriTrack</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-smooth"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Profile</span>
              </Link>
              <span className="text-sm text-foreground/70 hidden sm:inline">
                Welcome, {profile?.profile?.fullName || 'User'}!
              </span>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10',
                    userButtonPopoverCard: 'bg-card border border-border',
                    userButtonPopoverActionButton: 'hover:bg-secondary/10 text-foreground',
                    userButtonPopoverActionButtonText: 'text-foreground',
                    userButtonPopoverActionButtonIcon: 'text-foreground/70',
                    userButtonPopoverFooter: 'hidden',
                  },
                  variables: {
                    colorPrimary: '#16803C',
                    colorBackground: '#ffffff',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-foreground/70">Track your food consumption and reduce waste</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Items Tracked</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Waste Reduced</p>
                <p className="text-2xl font-bold text-foreground">0 kg</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Community</p>
                <p className="text-2xl font-bold text-foreground">1</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Goals Met</p>
                <p className="text-2xl font-bold text-foreground">0/0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to NutriTrack! 🌱</h2>
          <p className="text-foreground/70 mb-6">
            Start tracking your food consumption and reduce waste. Here are some quick actions to get you started:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth font-medium">
              Add Your First Item
            </button>
            <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-smooth font-medium">
              Set Your Goals
            </button>
            <Link
              to="/profile"
              className="px-6 py-3 bg-card border border-border text-foreground rounded-lg hover:bg-secondary/10 transition-smooth font-medium text-center"
            >
              View Profile
            </Link>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Recent Activity</h3>
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-foreground/50">No activity yet. Start tracking to see your progress here!</p>
          </div>
        </div>
      </div>
    </div>
  );
}