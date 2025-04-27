import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, isPracticeUser, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className={`${theme === 'dark' ? 'bg-dark-surface text-dark-textPrimary' : 'bg-white text-light-textPrimary'} shadow-md`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className={`text-2xl font-bold ${theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'}`}>
            My Portfolio
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <Link to="/" className={`${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}>
                Home
              </Link>
              <Link to="/portfolio" className={`${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}>
                Portfolio
              </Link>
              <Link to="/reading" className={`${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}>
                Reading
              </Link>

              {/* Conditional rendering based on authentication */}
              {isAuthenticated() ? (
                <>
                  <Link to="/lab" className={`${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}>
                    Automation Lab
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" className={`${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}>
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className={`${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className={`${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}>
                  Login
                </Link>
              )}
            </nav>

            {/* Theme Toggle */}
            <ThemeToggle className={theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'} />
          </div>

          {/* Mobile menu and theme toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle className={theme === 'dark' ? 'text-dark-primary' : 'text-light-primary'} />

            <button 
              className={`${theme === 'dark' ? 'text-dark-textPrimary' : 'text-light-textPrimary'} focus:outline-none`}
              onClick={toggleMenu}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4 pb-4">
            <Link 
              to="/" 
              className={`block ${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/portfolio" 
              className={`block ${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link 
              to="/reading" 
              className={`block ${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Reading
            </Link>

            {/* Conditional rendering based on authentication */}
            {isAuthenticated() ? (
              <>
                <Link 
                  to="/lab" 
                  className={`block ${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Automation Lab
                </Link>
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className={`block ${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className={`block ${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors w-full text-left`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`block ${theme === 'dark' ? 'text-dark-textPrimary hover:text-dark-primary' : 'text-light-textPrimary hover:text-light-primary'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>

      {/* Advertisement Banner */}
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
      </div>
    </header>
  );
};

export default Header;
