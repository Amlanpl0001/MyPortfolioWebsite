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

// Import context
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
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
      </Router>
    </AuthProvider>
  );
}

export default App;