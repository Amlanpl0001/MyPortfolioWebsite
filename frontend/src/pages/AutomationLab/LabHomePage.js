import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LabHomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <div className="lab-home-page">
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Automation Lab</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Welcome to the interactive Automation Lab! This space is designed for testing practice,
            with various environments to help you hone your automation skills.
          </p>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p className="text-gray-700 mb-6">
                The Automation Lab provides four different environments for testing practice:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                <li><strong>Web Playground:</strong> Practice UI automation with forms, dynamic elements, and more.</li>
                <li><strong>API Playground:</strong> Test RESTful APIs with various endpoints and response types.</li>
                <li><strong>Database Playground:</strong> Write and execute SQL queries against sample databases.</li>
                <li><strong>Project Playground:</strong> Work with a complete mini e-commerce application for end-to-end testing.</li>
              </ul>
              <p className="text-gray-700">
                Select any of the environments below to get started. Each playground includes instructions and examples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Web Playground Card */}
              <div className="neumorphic p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Web Playground</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Practice UI automation with login forms, dynamic elements, and other web components.
                  Perfect for Selenium, Cypress, or Playwright practice.
                </p>
                <Link 
                  to="/lab/web" 
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Enter Web Playground
                </Link>
              </div>

              {/* API Playground Card */}
              <div className="neumorphic p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">API Playground</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Test RESTful APIs with various endpoints, status codes, and response formats.
                  Great for Postman, RestAssured, or requests library practice.
                </p>
                <Link 
                  to="/lab/api" 
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Enter API Playground
                </Link>
              </div>

              {/* Database Playground Card */}
              <div className="neumorphic p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Database Playground</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Write and execute SQL queries against sample databases with different schemas.
                  Perfect for practicing database testing and SQL skills.
                </p>
                <Link 
                  to="/lab/db" 
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Enter Database Playground
                </Link>
              </div>

              {/* Project Playground Card */}
              <div className="neumorphic p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Project Playground</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Work with a complete mini e-commerce application for end-to-end testing.
                  Practice testing a full workflow from UI to database.
                </p>
                <Link 
                  to="/lab/project" 
                  className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Enter Project Playground
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Need Help?</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-8">
            If you have any questions or need assistance with the Automation Lab,
            please check the documentation or contact the administrator.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/lab-documentation.pdf" 
              className="neumorphic px-6 py-3 rounded-lg text-gray-800 bg-white hover:bg-gray-100 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Documentation
            </a>
            <Link 
              to="/portfolio#hire-me" 
              className="neumorphic px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Contact Admin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LabHomePage;
