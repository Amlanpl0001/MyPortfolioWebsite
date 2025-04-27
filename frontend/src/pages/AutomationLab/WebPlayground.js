import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const WebPlayground = () => {
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

  // State for active tab
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="web-playground">
      <section className="py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <Link to="/lab" className="inline-block mb-6 text-white hover:text-blue-200 transition-colors">
            ← Back to Lab Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Web Playground</h1>
          <p className="text-xl max-w-3xl">
            Practice UI automation with forms, dynamic elements, and other web components.
            Perfect for Selenium, Cypress, or Playwright practice.
          </p>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>

      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-300 mb-8 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('login')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'login' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Login Form
            </button>
            <button 
              onClick={() => setActiveTab('signup')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'signup' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Signup Form
            </button>
            <button 
              onClick={() => setActiveTab('elements')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'elements' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Form Elements
            </button>
            <button 
              onClick={() => setActiveTab('dynamic')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'dynamic' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Dynamic Elements
            </button>
            <button 
              onClick={() => setActiveTab('store')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'store' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Mini Store
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'login' && <LoginForm />}
            {activeTab === 'signup' && <SignupForm />}
            {activeTab === 'elements' && <FormElements />}
            {activeTab === 'dynamic' && <DynamicElements />}
            {activeTab === 'store' && <MiniStore />}
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>

      {/* Help Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto glass p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Automation Tips</h2>
            <p className="text-gray-700 mb-4">
              Here are some tips for automating the elements on this page:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use unique identifiers (IDs) where available for stable element selection.</li>
              <li>Practice handling different form elements like inputs, checkboxes, and dropdowns.</li>
              <li>For dynamic elements, implement proper waits (implicit or explicit) in your automation scripts.</li>
              <li>Test both valid and invalid scenarios (e.g., correct and incorrect login credentials).</li>
              <li>For the mini store, practice a complete workflow from browsing to checkout.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

// Login Form Component
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Check credentials (for demo purposes)
      if (username === 'testuser' && password === 'password') {
        setLoginStatus({ success: true, message: 'Login successful!' });
      } else {
        setLoginStatus({ success: false, message: 'Invalid username or password.' });
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="login-form-playground">
      <div className="glass p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Login Form</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Test Credentials:</strong> Username: testuser, Password: password
          </p>
        </div>
        
        {loginStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            loginStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {loginStatus.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} id="login-form" className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="neumorphic-inset w-full px-4 py-2 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neumorphic-inset w-full px-4 py-2 rounded-lg"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              name="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 text-gray-700">
              Remember me
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              id="login-button"
              className="neumorphic w-full px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
          
          <div className="text-center">
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const SignupForm = () => (
  <div className="glass p-8 rounded-lg">
    <h2 className="text-2xl font-bold mb-6">Signup Form</h2>
    <p>Signup form will be implemented here.</p>
  </div>
);

const FormElements = () => (
  <div className="glass p-8 rounded-lg">
    <h2 className="text-2xl font-bold mb-6">Form Elements</h2>
    <p>Various form elements will be implemented here.</p>
  </div>
);

const DynamicElements = () => (
  <div className="glass p-8 rounded-lg">
    <h2 className="text-2xl font-bold mb-6">Dynamic Elements</h2>
    <p>Dynamic elements will be implemented here.</p>
  </div>
);

const MiniStore = () => (
  <div className="glass p-8 rounded-lg">
    <h2 className="text-2xl font-bold mb-6">Mini Store</h2>
    <p>Mini e-commerce store will be implemented here.</p>
  </div>
);

export default WebPlayground;