import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import PageTransition from './components/PageTransition';
import SEO from './components/SEO';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import StudyMaterials from './pages/StudyMaterials';
import QuizGenerator from './pages/QuizGenerator';
import Profile from './pages/Profile';
import About from './pages/About';
import Flashcards from './pages/Flashcards';
import NotFound from './pages/NotFound';

const AppLayout = ({ children }) => <Layout>{children}</Layout>;

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen message="Loading AI StudyMate..." />;

  return (
    <>
      <SEO />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </AppLayout>
            }
          />
          <Route
            path="/chat"
            element={
              <AppLayout>
                <PageTransition>
                  <AIChat />
                </PageTransition>
              </AppLayout>
            }
          />
          <Route
            path="/materials"
            element={
              <AppLayout>
                <PageTransition>
                  <StudyMaterials />
                </PageTransition>
              </AppLayout>
            }
          />
          <Route
            path="/quiz"
            element={
              <AppLayout>
                <PageTransition>
                  <QuizGenerator />
                </PageTransition>
              </AppLayout>
            }
          />
          <Route
            path="/flashcards"
            element={
              <AppLayout>
                <PageTransition>
                  <Flashcards />
                </PageTransition>
              </AppLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AppLayout>
                <PageTransition>
                  <Profile />
                </PageTransition>
              </AppLayout>
            }
          />
          <Route
            path="/about"
            element={
              <AppLayout>
                <PageTransition>
                  <About />
                </PageTransition>
              </AppLayout>
            }
          />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route
            path="/admin"
            element={
              <AppLayout>
                <PageTransition>
                  <AdminPanel />
                </PageTransition>
              </AppLayout>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
