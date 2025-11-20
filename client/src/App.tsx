import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <SignedIn>
            <Dashboard />
          </SignedIn>
        }
      />

      {/* Redirect to sign in when signed out */}
      <Route path="*" element={<SignedOut><RedirectToSignIn /></SignedOut>} />
    </Routes>
  )
}