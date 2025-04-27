import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import TipTapEditor from '../../components/TipTapEditor/TipTapEditor';

// Admin Dashboard Components
const AdminDashboard = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated and is an admin
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: location } });
    } else if (!isAdmin()) {
      // Redirect to home if not an admin
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  // Get the current tab from the URL
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/posts')) return 'posts';
    if (path.includes('/admin/topics')) return 'topics';
    return 'dashboard';
  };

  return (
    <div className="admin-dashboard">
      <section className="py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-xl">
            Manage your blog posts and practice users.
          </p>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
      </div>

      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          {/* Admin Navigation Tabs */}
          <div className="flex border-b border-gray-300 mb-8">
            <Link 
              to="/admin" 
              className={`px-6 py-3 font-medium ${
                getCurrentTab() === 'dashboard' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/posts" 
              className={`px-6 py-3 font-medium ${
                getCurrentTab() === 'posts' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Blog Posts
            </Link>
            <Link 
              to="/admin/users" 
              className={`px-6 py-3 font-medium ${
                getCurrentTab() === 'users' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Practice Users
            </Link>
            <Link 
              to="/admin/topics" 
              className={`px-6 py-3 font-medium ${
                getCurrentTab() === 'topics' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Topics
            </Link>
          </div>

          {/* Admin Content */}
          <div className="admin-content">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/posts" element={<ManagePosts />} />
              <Route path="/users" element={<ManageUsers />} />
              <Route path="/topics" element={<ManageTopics />} />
            </Routes>
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

// Dashboard Home Component
const DashboardHome = () => {
  return (
    <div className="dashboard-home">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Blog Posts</h3>
          <p className="text-gray-600 mb-4">Manage your blog posts and create new content.</p>
          <Link 
            to="/admin/posts" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Manage Posts
          </Link>
        </div>

        <div className="glass p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Practice Users</h3>
          <p className="text-gray-600 mb-4">Manage users who can access the Automation Lab.</p>
          <Link 
            to="/admin/users" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Manage Users
          </Link>
        </div>

        <div className="glass p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Site Statistics</h3>
          <p className="text-gray-600 mb-4">View site statistics and analytics.</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="neumorphic p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-sm text-gray-600">Blog Posts</p>
            </div>
            <div className="neumorphic p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">2</p>
              <p className="text-sm text-gray-600">Practice Users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Manage Posts Component
const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    topicId: '',
  });

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/admin/posts');
        // setPosts(response.data);

        // For now, use mock data
        setTimeout(() => {
          setPosts([
            {
              id: 1,
              title: 'Getting Started with Selenium WebDriver',
              snippet: 'Learn how to set up and use Selenium WebDriver for automated testing...',
              publishDate: '2023-02-15',
              topicId: 2,
            },
            {
              id: 2,
              title: 'Best Practices for Manual Testing',
              snippet: 'Discover the most effective techniques for manual testing that will improve your efficiency...',
              publishDate: '2023-01-20',
              topicId: 1,
            },
            {
              id: 3,
              title: 'Python for Test Automation',
              snippet: 'Python has become the language of choice for test automation. Here\'s why and how to get started...',
              publishDate: '2023-03-05',
              topicId: 3,
            },
            {
              id: 4,
              title: 'My Trip to Japan',
              snippet: 'Exploring the beautiful landscapes and rich culture of Japan...',
              publishDate: '2022-11-10',
              topicId: 4,
            },
            {
              id: 5,
              title: 'From Tester to Test Lead',
              snippet: 'My journey and lessons learned transitioning from a tester to a test lead role...',
              publishDate: '2023-02-28',
              topicId: 5,
            },
          ]);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle editor content change
  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      content: content,
    });
  };

  // Helper function to extract plain text from HTML
  const extractPlainText = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // In a real app, this would be an API call
      // const response = await axios.post('/api/admin/posts', formData);
      // or for edit: await axios.put(`/api/admin/posts/${currentPost.id}`, formData);

      // For now, simulate API call
      setTimeout(() => {
        if (currentPost) {
          // Extract plain text for snippet
          const plainText = extractPlainText(formData.content);
          const snippet = plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;

          // Save the formatted content to localStorage
          localStorage.setItem(`post_${currentPost.id}_content`, formData.content);

          // Edit existing post
          setPosts(posts.map(post => 
            post.id === currentPost.id 
              ? { 
                  ...post, 
                  title: formData.title, 
                  snippet: snippet,
                  topicId: parseInt(formData.topicId) 
                }
              : post
          ));
        } else {
          // Extract plain text for snippet
          const plainText = extractPlainText(formData.content);
          const snippet = plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;

          // Add new post
          const newPostId = posts.length + 1;
          const newPost = {
            id: newPostId,
            title: formData.title,
            snippet: snippet,
            publishDate: new Date().toISOString().split('T')[0],
            topicId: parseInt(formData.topicId),
          };

          // Save the formatted content to localStorage
          localStorage.setItem(`post_${newPostId}_content`, formData.content);

          setPosts([...posts, newPost]);
        }

        // Reset form
        setFormData({
          title: '',
          content: '',
          topicId: '',
        });
        setCurrentPost(null);
        setShowForm(false);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to save post. Please try again later.');
      setLoading(false);
    }
  };

  // Handle edit post
  const handleEdit = (post) => {
    setCurrentPost(post);

    // In a real app, we would fetch the full content with formatting from an API
    // For now, we'll simulate fetching the saved content from localStorage
    let savedContent = localStorage.getItem(`post_${post.id}_content`);

    // If there's no saved content in localStorage, create some formatted HTML
    if (!savedContent) {
      savedContent = `
        <h1>${post.title}</h1>
        <p>${post.snippet.replace('...', '')}</p>
        <p>This is a <strong>formatted</strong> content that demonstrates the <em>TipTap</em> editor's capabilities.</p>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
      `;
    }

    setFormData({
      title: post.title,
      content: savedContent, // Use the saved formatted HTML content
      topicId: post.topicId.toString(),
    });
    setShowForm(true);
  };

  // Handle delete post
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setLoading(true);

      // In a real app, this would be an API call
      // await axios.delete(`/api/admin/posts/${postId}`);

      // For now, simulate API call
      setTimeout(() => {
        setPosts(posts.filter(post => post.id !== postId));
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to delete post. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="manage-posts">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
        <button
          onClick={() => {
            setCurrentPost(null);
            setFormData({
              title: '',
              content: '',
              topicId: '',
            });
            setShowForm(!showForm);
          }}
          className="neumorphic px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New Post'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="glass p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {currentPost ? 'Edit Post' : 'Create New Post'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="neumorphic-inset w-full px-4 py-2 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="topicId" className="block text-gray-700 mb-2">Topic</label>
              <select
                id="topicId"
                name="topicId"
                value={formData.topicId}
                onChange={handleInputChange}
                className="neumorphic-inset w-full px-4 py-2 rounded-lg"
                required
              >
                <option value="">Select a topic</option>
                <option value="1">Manual Testing</option>
                <option value="2">Selenium</option>
                <option value="3">Python</option>
                <option value="4">Travel</option>
                <option value="5">Career Growth</option>
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-gray-700 mb-2">Content</label>
              <TipTapEditor
                content={formData.content}
                onChange={handleEditorChange}
                placeholder="Write your post content here..."
              />
              <p className="text-sm text-gray-600 mt-1">
                Use the toolbar above to format your content.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="neumorphic px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm ? (
        <p>Loading posts...</p>
      ) : (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <p>No posts found. Create your first post!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="neumorphic p-6 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-500 mb-2">Published: {formatDate(post.publishDate)}</p>
                    <p className="text-gray-700 mb-4">{post.snippet}</p>
                    <div className="text-sm text-gray-600">
                      Topic ID: {post.topicId}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Manage Users Component
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/admin/users');
        // setUsers(response.data);

        // For now, use mock data
        setTimeout(() => {
          setUsers([
            {
              id: 1,
              name: 'John Smith',
              email: 'john@example.com',
              role: 'practice',
              createdAt: '2023-01-15',
            },
            {
              id: 2,
              name: 'Jane Doe',
              email: 'jane@example.com',
              role: 'practice',
              createdAt: '2023-02-20',
            },
          ]);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // In a real app, this would be an API call
      // const response = await axios.post('/api/admin/users', formData);

      // For now, simulate API call
      setTimeout(() => {
        const newUser = {
          id: users.length + 1,
          name: formData.name,
          email: formData.email,
          role: 'practice',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);

        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
        });
        setShowForm(false);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to create user. Please try again later.');
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setLoading(true);

      // In a real app, this would be an API call
      // await axios.delete(`/api/admin/users/${userId}`);

      // For now, simulate API call
      setTimeout(() => {
        setUsers(users.filter(user => user.id !== userId));
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to delete user. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="manage-users">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Practice Users</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="neumorphic px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="glass p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Create New Practice User</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="neumorphic-inset w-full px-4 py-2 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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
                value={formData.password}
                onChange={handleInputChange}
                className="neumorphic-inset w-full px-4 py-2 rounded-lg"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="neumorphic px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm ? (
        <p>Loading users...</p>
      ) : (
        <div className="space-y-6">
          {users.length === 0 ? (
            <p>No practice users found. Create your first user!</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="neumorphic p-6 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
                    <p className="text-gray-700 mb-2">{user.email}</p>
                    <div className="text-sm text-gray-600">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full mr-2">
                        {user.role}
                      </span>
                      <span>Created: {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Manage Topics Component
const ManageTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [currentTopic, setCurrentTopic] = useState(null);

  // Fetch topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/admin/topics');
        // setTopics(response.data);

        // For now, use mock data
        setTimeout(() => {
          setTopics([
            { id: 1, name: 'Manual Testing', description: 'Articles about manual testing techniques and best practices.' },
            { id: 2, name: 'Selenium', description: 'Tutorials and tips for Selenium automation.' },
            { id: 3, name: 'Python', description: 'Python programming for testers and developers.' },
            { id: 4, name: 'Travel', description: 'Travel experiences and recommendations.' },
            { id: 5, name: 'Career Growth', description: 'Tips for growing your career in tech.' },
          ]);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch topics. Please try again later.');
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // In a real app, this would be an API call
      // const response = await axios.post('/api/admin/topics', formData);
      // or for edit: await axios.put(`/api/admin/topics/${currentTopic.id}`, formData);

      // For now, simulate API call
      setTimeout(() => {
        if (currentTopic) {
          // Edit existing topic
          setTopics(topics.map(topic => 
            topic.id === currentTopic.id 
              ? { 
                  ...topic, 
                  name: formData.name, 
                  description: formData.description
                }
              : topic
          ));
        } else {
          // Add new topic
          const newTopic = {
            id: topics.length + 1,
            name: formData.name,
            description: formData.description,
          };
          setTopics([...topics, newTopic]);
        }

        // Reset form
        setFormData({
          name: '',
          description: '',
        });
        setCurrentTopic(null);
        setShowForm(false);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to save topic. Please try again later.');
      setLoading(false);
    }
  };

  // Handle edit topic
  const handleEdit = (topic) => {
    setCurrentTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description,
    });
    setShowForm(true);
  };

  // Handle delete topic
  const handleDelete = async (topicId) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) {
      return;
    }

    try {
      setLoading(true);

      // In a real app, this would be an API call
      // await axios.delete(`/api/admin/topics/${topicId}`);

      // For now, simulate API call
      setTimeout(() => {
        setTopics(topics.filter(topic => topic.id !== topicId));
        setLoading(false);
      }, 800);
    } catch (err) {
      setError('Failed to delete topic. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="manage-topics">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Topics</h2>
        <button
          onClick={() => {
            setCurrentTopic(null);
            setFormData({
              name: '',
              description: '',
            });
            setShowForm(!showForm);
          }}
          className="neumorphic px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New Topic'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="glass p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {currentTopic ? 'Edit Topic' : 'Create New Topic'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="neumorphic-inset w-full px-4 py-2 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="neumorphic-inset w-full px-4 py-2 rounded-lg"
                rows="3"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="neumorphic px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Topic'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm ? (
        <p>Loading topics...</p>
      ) : (
        <div className="space-y-6">
          {topics.length === 0 ? (
            <p>No topics found. Create your first topic!</p>
          ) : (
            topics.map((topic) => (
              <div key={topic.id} className="neumorphic p-6 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{topic.name}</h3>
                    <p className="text-gray-700 mb-2">{topic.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(topic)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(topic.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
