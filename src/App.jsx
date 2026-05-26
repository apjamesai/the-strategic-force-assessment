import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Assessment from './pages/Assessment';
import AdminPage from './pages/AdminPage';
import ImageStudioPage from './pages/ImageStudioPage';

/**
 * Routing policy:
 *  - `/`  is public. Participants take the assessment anonymously; identity
 *         is captured by the in-app intake form (first name, last name,
 *         email, gender). No Base44 login is required to reach this route.
 *  - `/admin` and `/admin/image-studio` are admin-only. Wrapped in
 *         ProtectedRoute which uses Base44 auth. Non-admin visitors are
 *         redirected to `/` rather than being shown a login screen.
 */
function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/" element={<Assessment />} />

            <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/" replace />} />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/image-studio" element={<ImageStudioPage />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
