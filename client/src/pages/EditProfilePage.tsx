import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Leaf, User, Utensils, MapPin, DollarSign, Save, ArrowLeft } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useApi } from '../hooks/useApi';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useProfile();
  const api = useApi();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    dietaryPreference: '',
    location: '',
    budgetRange: '',
  });

  useEffect(() => {
    if (profile?.profile) {
      setFormData({
        fullName: profile.profile.fullName || '',
        dietaryPreference: profile.profile.dietaryPreference || '',
        location: profile.profile.location || '',
        budgetRange: profile.profile.budgetRange?.toString() || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.updateProfile({
        fullName: formData.fullName,
        dietaryPreference: formData.dietaryPreference || undefined,
        location: formData.location || undefined,
        budgetRange: formData.budgetRange ? parseFloat(formData.budgetRange) : undefined,
      });

      await refreshProfile();
      setSuccess(true);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const dietaryOptions = [
    { value: '', label: 'Select preference' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'pescatarian', label: 'Pescatarian' },
    { value: 'omnivore', label: 'Omnivore' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">NutriTrack</span>
            </Link>

            <div className="flex items-center gap-4">
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

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-smooth mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        {/* Form */}
        <div className="bg-card rounded-2xl border border-border p-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <User className="w-4 h-4 text-primary" />
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Dietary Preference */}
            <div>
              <label htmlFor="dietaryPreference" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Utensils className="w-4 h-4 text-primary" />
                Dietary Preference
              </label>
              <select
                id="dietaryPreference"
                name="dietaryPreference"
                value={formData.dietaryPreference}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              >
                {dietaryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                placeholder="e.g., Dhaka, Bangladesh"
              />
            </div>

            {/* Budget Range */}
            <div>
              <label htmlFor="budgetRange" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Monthly Budget
              </label>
              <input
                type="number"
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                placeholder="e.g., 5000"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">Profile updated successfully! Redirecting...</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-smooth font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}