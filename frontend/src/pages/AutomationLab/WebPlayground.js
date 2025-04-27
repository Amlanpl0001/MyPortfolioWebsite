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
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
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
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
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

// Signup Form Component
const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupStatus, setSignupStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate terms agreement
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call delay
      setTimeout(() => {
        setSignupStatus({
          success: true,
          message: 'Account created successfully! You can now log in.'
        });
        setIsSubmitting(false);

        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false
        });
      }, 1500);
    }
  };

  return (
    <div className="signup-form-playground">
      <div className="glass p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Signup Form</h2>

        {signupStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            signupStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {signupStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} id="signup-form" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`neumorphic-inset w-full px-4 py-2 rounded-lg ${errors.firstName ? 'border border-red-500' : ''}`}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`neumorphic-inset w-full px-4 py-2 rounded-lg ${errors.lastName ? 'border border-red-500' : ''}`}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`neumorphic-inset w-full px-4 py-2 rounded-lg ${errors.email ? 'border border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`neumorphic-inset w-full px-4 py-2 rounded-lg ${errors.password ? 'border border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`neumorphic-inset w-full px-4 py-2 rounded-lg ${errors.confirmPassword ? 'border border-red-500' : ''}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="agreeTerms" className="ml-2 text-gray-700">
              I agree to the <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">Terms and Conditions</a>
            </label>
          </div>
          {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}

          <div>
            <button
              type="submit"
              id="signup-button"
              className="neumorphic w-full px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormElements = () => {
  const [formData, setFormData] = useState({
    textInput: '',
    textarea: '',
    select: '',
    radioOption: 'option1',
    checkboxes: {
      option1: false,
      option2: false,
      option3: false
    },
    rangeInput: 50,
    dateInput: '',
    colorInput: '#4FB3BF',
    fileInput: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        checkboxes: {
          ...formData.checkboxes,
          [name.split('.')[1]]: checked
        }
      });
    } else if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0] ? files[0].name : ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted with the following data:\n' + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="glass p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Form Elements</h2>
      <p className="mb-6">This form showcases various form elements that can be used for automation testing.</p>

      <form onSubmit={handleSubmit} id="form-elements" className="space-y-6">
        {/* Text Input */}
        <div>
          <label htmlFor="textInput" className="block text-gray-700 mb-2">Text Input</label>
          <input
            type="text"
            id="textInput"
            name="textInput"
            value={formData.textInput}
            onChange={handleInputChange}
            placeholder="Enter some text"
            className="neumorphic-inset w-full px-4 py-2 rounded-lg"
          />
        </div>

        {/* Textarea */}
        <div>
          <label htmlFor="textarea" className="block text-gray-700 mb-2">Textarea</label>
          <textarea
            id="textarea"
            name="textarea"
            value={formData.textarea}
            onChange={handleInputChange}
            placeholder="Enter multiple lines of text"
            rows="4"
            className="neumorphic-inset w-full px-4 py-2 rounded-lg"
          ></textarea>
        </div>

        {/* Select Dropdown */}
        <div>
          <label htmlFor="select" className="block text-gray-700 mb-2">Select Dropdown</label>
          <select
            id="select"
            name="select"
            value={formData.select}
            onChange={handleInputChange}
            className="neumorphic-inset w-full px-4 py-2 rounded-lg"
          >
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        {/* Radio Buttons */}
        <div>
          <label className="block text-gray-700 mb-2">Radio Buttons</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="radioOption1"
                name="radioOption"
                value="option1"
                checked={formData.radioOption === 'option1'}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="radioOption1" className="ml-2 text-gray-700">Option 1</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="radioOption2"
                name="radioOption"
                value="option2"
                checked={formData.radioOption === 'option2'}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="radioOption2" className="ml-2 text-gray-700">Option 2</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="radioOption3"
                name="radioOption"
                value="option3"
                checked={formData.radioOption === 'option3'}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="radioOption3" className="ml-2 text-gray-700">Option 3</label>
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div>
          <label className="block text-gray-700 mb-2">Checkboxes</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="checkboxOption1"
                name="checkboxes.option1"
                checked={formData.checkboxes.option1}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="checkboxOption1" className="ml-2 text-gray-700">Option 1</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="checkboxOption2"
                name="checkboxes.option2"
                checked={formData.checkboxes.option2}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="checkboxOption2" className="ml-2 text-gray-700">Option 2</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="checkboxOption3"
                name="checkboxes.option3"
                checked={formData.checkboxes.option3}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="checkboxOption3" className="ml-2 text-gray-700">Option 3</label>
            </div>
          </div>
        </div>

        {/* Range Input */}
        <div>
          <label htmlFor="rangeInput" className="block text-gray-700 mb-2">Range Input: {formData.rangeInput}</label>
          <input
            type="range"
            id="rangeInput"
            name="rangeInput"
            min="0"
            max="100"
            value={formData.rangeInput}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        {/* Date Input */}
        <div>
          <label htmlFor="dateInput" className="block text-gray-700 mb-2">Date Input</label>
          <input
            type="date"
            id="dateInput"
            name="dateInput"
            value={formData.dateInput}
            onChange={handleInputChange}
            className="neumorphic-inset w-full px-4 py-2 rounded-lg"
          />
        </div>

        {/* Color Input */}
        <div>
          <label htmlFor="colorInput" className="block text-gray-700 mb-2">Color Input</label>
          <input
            type="color"
            id="colorInput"
            name="colorInput"
            value={formData.colorInput}
            onChange={handleInputChange}
            className="w-full h-10 rounded-lg"
          />
        </div>

        {/* File Input */}
        <div>
          <label htmlFor="fileInput" className="block text-gray-700 mb-2">File Input</label>
          <input
            type="file"
            id="fileInput"
            name="fileInput"
            onChange={handleInputChange}
            className="w-full"
          />
          {formData.fileInput && (
            <p className="text-sm text-gray-600 mt-1">Selected file: {formData.fileInput}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            id="submit-form-elements"
            className="neumorphic w-full px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
};

const DynamicElements = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [visibleElement, setVisibleElement] = useState(false);
  const [delayedText, setDelayedText] = useState('');
  const [counter, setCounter] = useState(0);
  const [progress, setProgress] = useState(0);

  // Load items with delay
  const loadItems = () => {
    setLoading(true);
    setItems([]);

    // Simulate API call with delay
    setTimeout(() => {
      const newItems = [
        { id: 1, name: 'Item 1', description: 'This is the first item' },
        { id: 2, name: 'Item 2', description: 'This is the second item' },
        { id: 3, name: 'Item 3', description: 'This is the third item' },
        { id: 4, name: 'Item 4', description: 'This is the fourth item' },
        { id: 5, name: 'Item 5', description: 'This is the fifth item' }
      ];
      setItems(newItems);
      setLoading(false);
    }, 2000);
  };

  // Toggle visibility of an element
  const toggleVisibility = () => {
    setVisibleElement(!visibleElement);
  };

  // Show text after delay
  const showDelayedText = () => {
    setDelayedText('Loading...');

    setTimeout(() => {
      setDelayedText('This text appeared after a 3-second delay!');
    }, 3000);
  };

  // Increment counter
  const incrementCounter = () => {
    setCounter(counter + 1);
  };

  // Reset counter
  const resetCounter = () => {
    setCounter(0);
  };

  // Start progress bar
  const startProgress = () => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);
  };

  return (
    <div className="glass p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Dynamic Elements</h2>
      <p className="mb-6">This section demonstrates elements that change dynamically, which is important for testing automation tools that need to handle dynamic content.</p>

      <div className="space-y-8">
        {/* Dynamic Loading */}
        <div className="neumorphic p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Dynamic Loading</h3>
          <p className="text-gray-700 mb-4">Click the button to load items with a 2-second delay.</p>

          <button
            onClick={loadItems}
            className="neumorphic px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors mb-4"
            id="load-items-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load Items'}
          </button>

          {loading ? (
            <div className="text-center py-8" id="loading-indicator">
              <p className="text-gray-600">Loading items...</p>
            </div>
          ) : (
            <ul className="space-y-2" id="items-list">
              {items.map(item => (
                <li key={item.id} className="p-3 bg-gray-100 rounded-md" id={`item-${item.id}`}>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </li>
              ))}
              {items.length === 0 && (
                <p className="text-gray-600 text-center">No items to display. Click the button to load items.</p>
              )}
            </ul>
          )}
        </div>

        {/* Element Visibility */}
        <div className="neumorphic p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Element Visibility</h3>
          <p className="text-gray-700 mb-4">Click the button to toggle the visibility of an element.</p>

          <button
            onClick={toggleVisibility}
            className="neumorphic px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors mb-4"
            id="toggle-visibility-button"
          >
            {visibleElement ? 'Hide Element' : 'Show Element'}
          </button>

          {visibleElement && (
            <div 
              className="p-4 bg-green-100 text-green-700 rounded-md mt-4" 
              id="visible-element"
            >
              This element is now visible! It was hidden before you clicked the button.
            </div>
          )}
        </div>

        {/* Delayed Text */}
        <div className="neumorphic p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Delayed Text</h3>
          <p className="text-gray-700 mb-4">Click the button to show text after a 3-second delay.</p>

          <button
            onClick={showDelayedText}
            className="neumorphic px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors mb-4"
            id="show-delayed-text-button"
            disabled={delayedText === 'Loading...'}
          >
            Show Delayed Text
          </button>

          <div 
            className="p-4 bg-gray-100 rounded-md mt-4 min-h-[50px]" 
            id="delayed-text-container"
          >
            {delayedText}
          </div>
        </div>

        {/* Counter */}
        <div className="neumorphic p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Counter</h3>
          <p className="text-gray-700 mb-4">Click the buttons to increment or reset the counter.</p>

          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={incrementCounter}
              className="neumorphic px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              id="increment-button"
            >
              Increment
            </button>

            <button
              onClick={resetCounter}
              className="neumorphic px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
              id="reset-button"
            >
              Reset
            </button>
          </div>

          <div 
            className="p-4 bg-gray-100 rounded-md text-center text-2xl font-bold" 
            id="counter-value"
          >
            {counter}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="neumorphic p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Progress Bar</h3>
          <p className="text-gray-700 mb-4">Click the button to start a progress bar that fills up over time.</p>

          <button
            onClick={startProgress}
            className="neumorphic px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors mb-4"
            id="start-progress-button"
            disabled={progress > 0 && progress < 100}
          >
            Start Progress
          </button>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-2" id="progress-container">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
              id="progress-bar"
            ></div>
          </div>

          <p className="text-right text-sm text-gray-600" id="progress-text">{progress}% Complete</p>
        </div>
      </div>
    </div>
  );
};

const MiniStore = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 79.99,
      image: 'https://via.placeholder.com/150?text=Headphones',
      category: 'Electronics',
      forWhom: 'Adults',
      inStock: true
    },
    {
      id: 2,
      name: 'Smartphone Case',
      price: 19.99,
      image: 'https://via.placeholder.com/150?text=Phone+Case',
      category: 'Accessories',
      forWhom: 'Adults',
      inStock: true
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: 49.99,
      image: 'https://via.placeholder.com/150?text=Speaker',
      category: 'Electronics',
      forWhom: 'Adults',
      inStock: true
    },
    {
      id: 4,
      name: 'Laptop Backpack',
      price: 39.99,
      image: 'https://via.placeholder.com/150?text=Backpack',
      category: 'Accessories',
      forWhom: 'Adults',
      inStock: false
    },
    {
      id: 5,
      name: 'Kids Headphones',
      price: 29.99,
      image: 'https://via.placeholder.com/150?text=Kids+Headphones',
      category: 'Electronics',
      forWhom: 'Children',
      inStock: true
    },
    {
      id: 6,
      name: 'Women\'s Smartwatch',
      price: 129.99,
      image: 'https://via.placeholder.com/150?text=Smartwatch',
      category: 'Electronics',
      forWhom: 'Women',
      inStock: true
    },
    {
      id: 7,
      name: 'Men\'s Fitness Tracker',
      price: 89.99,
      image: 'https://via.placeholder.com/150?text=Fitness+Tracker',
      category: 'Electronics',
      forWhom: 'Men',
      inStock: true
    },
    {
      id: 8,
      name: 'Designer Phone Case',
      price: 24.99,
      image: 'https://via.placeholder.com/150?text=Designer+Case',
      category: 'Accessories',
      forWhom: 'Women',
      inStock: true
    },
    {
      id: 9,
      name: 'Rugged Phone Case',
      price: 29.99,
      image: 'https://via.placeholder.com/150?text=Rugged+Case',
      category: 'Accessories',
      forWhom: 'Men',
      inStock: true
    },
    {
      id: 10,
      name: 'Kids Tablet Case',
      price: 19.99,
      image: 'https://via.placeholder.com/150?text=Kids+Case',
      category: 'Accessories',
      forWhom: 'Children',
      inStock: true
    },
    {
      id: 11,
      name: 'Premium Headphones',
      price: 199.99,
      image: 'https://via.placeholder.com/150?text=Premium+Headphones',
      category: 'Electronics',
      forWhom: 'Adults',
      inStock: true
    },
    {
      id: 12,
      name: 'Budget Earbuds',
      price: 15.99,
      image: 'https://via.placeholder.com/150?text=Budget+Earbuds',
      category: 'Electronics',
      forWhom: 'Adults',
      inStock: true
    }
  ]);

  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeAudience, setActiveAudience] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [sortOption, setSortOption] = useState('default');
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Shuffle products on page load for dynamic display
  useEffect(() => {
    const shuffleProducts = () => {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setProducts(shuffled);
    };

    shuffleProducts();
  }, []);

  // Update recommended products based on cart items
  useEffect(() => {
    if (cart.length > 0) {
      // Get categories and audiences from cart items
      const cartCategories = [...new Set(cart.map(item => item.product.category))];
      const cartAudiences = [...new Set(cart.map(item => item.product.forWhom))];

      // Filter products that match cart categories or audiences but are not in cart
      const cartProductIds = cart.map(item => item.product.id);
      const recommended = products.filter(product => 
        !cartProductIds.includes(product.id) && 
        (cartCategories.includes(product.category) || cartAudiences.includes(product.forWhom))
      ).slice(0, 3); // Limit to 3 recommendations

      setRecommendedProducts(recommended);
    } else {
      setRecommendedProducts([]);
    }
  }, [cart, products]);

  // Filter and sort products
  const filteredProducts = products
    // Filter by search term
    .filter(product => 
      searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Filter by category
    .filter(product => 
      activeCategory === 'all' || 
      product.category === activeCategory
    )
    // Filter by audience
    .filter(product => 
      activeAudience === 'all' || 
      product.forWhom === activeAudience
    )
    // Filter by price range
    .filter(product => 
      product.price >= priceRange.min && 
      product.price <= priceRange.max
    )
    // Sort products
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
      // Increment quantity if already in cart
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // Update quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  // Calculate cart total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Place order
  const placeOrder = () => {
    if (cart.length === 0) return;

    // Simulate order processing
    setTimeout(() => {
      setOrderPlaced(true);

      // Clear cart after order is placed
      setCart([]);
    }, 1000);
  };

  // Reset order status
  const continueShopping = () => {
    setOrderPlaced(false);
  };

  return (
    <div className="glass p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Mini Store</h2>
      <p className="mb-6">This is a simple e-commerce store for practicing end-to-end testing scenarios.</p>

      {/* Order Confirmation Modal */}
      {orderPlaced && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-green-600">Order Placed Successfully!</h3>
            <p className="text-gray-700 mb-6">
              Thank you for your order. Your items will be shipped soon.
            </p>
            <div className="flex justify-center">
              <button
                onClick={continueShopping}
                className="neumorphic px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                id="continue-shopping-button"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Product Listing */}
        <div className="md:w-2/3 md:pr-6 mb-8 md:mb-0">
          {/* Search and Filters */}
          <div className="mb-6 glass p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Search & Filters</h3>

            {/* Search Bar */}
            <div className="mb-4">
              <label htmlFor="search" className="block text-gray-700 mb-1 text-sm">Search Products</label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neumorphic-inset w-full px-4 py-2 rounded-lg"
              />
            </div>

            {/* Price Range Filter */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1 text-sm">Price Range: ${priceRange.min} - ${priceRange.max}</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                  className="w-1/2"
                />
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-1/2"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-4">
              <label htmlFor="sort" className="block text-gray-700 mb-1 text-sm">Sort By</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="neumorphic-inset w-full px-4 py-2 rounded-lg"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1 text-sm">Product Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1 rounded-full ${
                    activeCategory === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  id="category-all"
                >
                  All
                </button>
                <button
                  onClick={() => setActiveCategory('Electronics')}
                  className={`px-3 py-1 rounded-full ${
                    activeCategory === 'Electronics' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  id="category-electronics"
                >
                  Electronics
                </button>
                <button
                  onClick={() => setActiveCategory('Accessories')}
                  className={`px-3 py-1 rounded-full ${
                    activeCategory === 'Accessories' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  id="category-accessories"
                >
                  Accessories
                </button>
              </div>
            </div>

            {/* Target Audience Filter */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm">For Whom</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveAudience('all')}
                  className={`px-3 py-1 rounded-full ${
                    activeAudience === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  id="audience-all"
                >
                  All
                </button>
                <button
                  onClick={() => setActiveAudience('Men')}
                  className={`px-3 py-1 rounded-full ${
                    activeAudience === 'Men' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  id="audience-men"
                >
                  Men
                </button>
                <button
                  onClick={() => setActiveAudience('Women')}
                  className={`px-3 py-1 rounded-full ${
                    activeAudience === 'Women' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  id="audience-women"
                >
                  Women
                </button>
                <button
                  onClick={() => setActiveAudience('Children')}
                  className={`px-3 py-1 rounded-full ${
                    activeAudience === 'Children' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  id="audience-children"
                >
                  Children
                </button>
                <button
                  onClick={() => setActiveAudience('Adults')}
                  className={`px-3 py-1 rounded-full ${
                    activeAudience === 'Adults' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  id="audience-adults"
                >
                  Adults
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-700">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Recommended For You</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedProducts.map(product => (
                  <div key={`rec-${product.id}`} className="neumorphic p-4 rounded-lg bg-blue-50" id={`recommended-${product.id}`}>
                    <div className="mb-2">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-24 object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-xs mb-1">{product.category} • For {product.forWhom}</p>
                    <p className="font-bold text-sm mb-2">${product.price.toFixed(2)}</p>
                    {product.inStock ? (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full px-2 py-1 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors text-xs"
                        id={`rec-add-to-cart-${product.id}`}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <p className="text-red-500 text-xs font-medium text-center">Out of Stock</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="neumorphic p-4 rounded-lg" id={`product-${product.id}`}>
                <div className="mb-3">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-32 object-contain"
                  />
                </div>
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-1">{product.category} • For {product.forWhom}</p>
                <p className="font-bold mb-3">${product.price.toFixed(2)}</p>
                {product.inStock ? (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full px-3 py-1 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors text-sm"
                    id={`add-to-cart-${product.id}`}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <p className="text-red-500 text-sm font-medium text-center">Out of Stock</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="md:w-1/3">
          <div className="neumorphic p-6 rounded-lg sticky top-6">
            <h3 className="text-xl font-semibold mb-4">Your Cart</h3>

            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-6" id="empty-cart-message">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between border-b border-gray-200 pb-3" id={`cart-item-${item.product.id}`}>
                      <div className="flex items-center">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-10 h-10 object-cover rounded-md mr-3"
                        />
                        <div>
                          <h4 className="font-medium text-sm">{item.product.name}</h4>
                          <p className="text-gray-600 text-xs">${item.product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-700"
                          id={`decrease-quantity-${item.product.id}`}
                        >
                          -
                        </button>
                        <span className="mx-2 w-6 text-center" id={`quantity-${item.product.id}`}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-700"
                          id={`increase-quantity-${item.product.id}`}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-3 text-red-500 hover:text-red-700"
                          id={`remove-item-${item.product.id}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Subtotal:</span>
                    <span id="cart-subtotal">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Shipping:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span id="cart-total">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  className="w-full px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
                  id="checkout-button"
                >
                  Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebPlayground;
