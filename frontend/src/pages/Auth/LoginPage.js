import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Simulate API call delay
      setTimeout(async () => {
        // Call the login function from AuthContext
        const result = await login(email, password);

        if (result.success) {
          // Redirect based on role
          if (result.role === 'admin') {
            navigate('/admin');
          } else {
            // If coming from a protected route, go back there, otherwise go to lab
            navigate(from === '/' ? '/lab' : from);
          }
        } else {
          setError(result.error);
        }

        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('Failed to log in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Login</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Sign in to access the Automation Lab and admin features.
          </p>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
      </div>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto glass p-8 rounded-lg">
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neumorphic-inset w-full px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="neumorphic-inset w-full px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="neumorphic px-8 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Don't have access? Contact the administrator for an account.
              </p>
            </div>

            {/* Demo Credentials - Remove in production */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Demo Credentials</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Admin:</strong> admin@example.com / admin123</p>
                <p><strong>Practice User:</strong> practice@example.com / practice123</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: These credentials are for demonstration purposes only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
      </div>
    </div>
  );
};

export default LoginPage;
