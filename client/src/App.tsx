import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Home from './pages/Home';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OnboardingPage from './pages/OnboardingPage';
import { ProfileProvider } from './context/ProfileContext';

// Layout
import Layout from './components/Layout';

// Pages with Layout
import Dashboard from './pages/Dashboard';
import DailyLogPage from './pages/DailyLogPage';
// import InventoryPage from './pages/InventoryPage';
// import ResourcesPage from './pages/ResourcesPage';
// import NeighbourhoodPage from './pages/NeighbourhoodPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';

export default function App() {
  return (
    <ProfileProvider>
      <Routes>
        {/* Public routes (no layout) */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        
        {/* Onboarding (no layout) */}
        <Route
          path="/onboarding"
          element={
            <SignedIn>
              <OnboardingPage />
            </SignedIn>
          }
        />

        {/* Protected routes with layout */}
        <Route
          path="/"
          element={
            <SignedIn>
              <Layout />
            </SignedIn>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="daily-log" element={<DailyLogPage />} />
          {/* <Route path="inventory" element={<InventoryPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="neighbourhood" element={<NeighbourhoodPage />} /> */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
        </Route>

        {/* Redirect to sign in when signed out */}
        <Route
          path="*"
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          }
        />
      </Routes>
    </ProfileProvider>
  );
}