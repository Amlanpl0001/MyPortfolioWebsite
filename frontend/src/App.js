import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Import pages
import HomePage from './pages/Home/HomePage';
import PortfolioPage from './pages/Portfolio/PortfolioPage';
import ReadingPage from './pages/Reading/ReadingPage';
import BlogPostPage from './pages/Reading/BlogPostPage';
import LoginPage from './pages/Auth/LoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import LabHomePage from './pages/AutomationLab/LabHomePage';
import WebPlayground from './pages/AutomationLab/WebPlayground';
import ApiPlayground from './pages/AutomationLab/ApiPlayground';
import DbPlayground from './pages/AutomationLab/DbPlayground';
import ProjectPlayground from './pages/AutomationLab/ProjectPlayground';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Main App Content with theme awareness
const AppContent = () => {
  const { theme } = useTheme();

  return (
    <div className={`App ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}>
      <Header />
      <main className={`main-content min-h-screen ${theme === 'dark' ? 'text-dark-textPrimary' : 'text-light-textPrimary'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/reading/:topicId/:postId" element={<BlogPostPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/lab" element={<LabHomePage />} />
          <Route path="/lab/web" element={<WebPlayground />} />
          <Route path="/lab/api" element={<ApiPlayground />} />
          <Route path="/lab/db" element={<DbPlayground />} />
          <Route path="/lab/project" element={<ProjectPlayground />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
