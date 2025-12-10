import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import FindInstructor from './pages/FindInstructor';
import InstructorDetail from './pages/InstructorDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import InstructorList from './pages/Admin/InstructorList';
import InstructorForm from './pages/Admin/InstructorForm';
import SubjectPage from './pages/SubjectPage';
import ExamLanding from './pages/ExamLanding';
import ProtectedRoute from './components/ProtectedRoute';
import PostList from './pages/community/PostList';
import PostEditor from './pages/community/PostEditor';
import PostDetail from './pages/community/PostDetail';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/find-instructor" element={<FindInstructor />} />
              <Route path="/instructor/:id" element={<InstructorDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <InstructorList />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/instructor/new"
                element={
                  <ProtectedAdminRoute>
                    <InstructorForm />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/instructor/:id"
                element={
                  <ProtectedAdminRoute>
                    <InstructorForm />
                  </ProtectedAdminRoute>
                }
              />

              <Route path="/exam/:examType/:subjectSlug" element={<SubjectPage />} />
              <Route path="/exam/:examType" element={<ExamLanding />} />

              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <PostList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community/write"
                element={
                  <ProtectedRoute>
                    <PostEditor mode="create" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community/:id"
                element={
                  <ProtectedRoute>
                    <PostDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community/:id/edit"
                element={
                  <ProtectedRoute>
                    <PostEditor mode="edit" />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
