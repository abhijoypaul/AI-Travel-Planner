import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CreateTripPage } from '@/pages/CreateTripPage'
import { TripResultsPage } from '@/pages/TripResultsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ShareTripPage } from '@/pages/ShareTripPage'
import { TripsPage } from '@/pages/TripsPage'
import { ExplorePage } from '@/pages/ExplorePage'
import { BookingsPage } from '@/pages/BookingsPage'
import { AIAssistantPage } from '@/pages/AIAssistantPage'
import { SavedPlacesPage } from '@/pages/SavedPlacesPage'
import { ItineraryPage } from '@/pages/ItineraryPage'
import { SettingsPage } from '@/pages/SettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/share/:token" element={<ShareTripPage />} />

          {/* Protected — core */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/create-trip" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
          <Route path="/trip/:id" element={<ProtectedRoute><TripResultsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Protected — sidebar nav */}
          <Route path="/trips" element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedPlacesPage /></ProtectedRoute>} />
          <Route path="/itinerary" element={<ProtectedRoute><ItineraryPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
