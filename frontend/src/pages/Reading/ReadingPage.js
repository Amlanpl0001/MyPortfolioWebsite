import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ReadingPage = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/topics');
        // setTopics(response.data);
        
        // For now, use mock data
        setTopics([
          { id: 1, name: 'Manual Testing', description: 'Articles about manual testing techniques and best practices.' },
          { id: 2, name: 'Selenium', description: 'Tutorials and tips for Selenium automation.' },
          { id: 3, name: 'Python', description: 'Python programming for testers and developers.' },
          { id: 4, name: 'Travel', description: 'Travel experiences and recommendations.' },
          { id: 5, name: 'Career Growth', description: 'Tips for growing your career in tech.' },
        ]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch topics. Please try again later.');
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Fetch posts when a topic is selected
  useEffect(() => {
    if (selectedTopic) {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          // In a real app, this would be an API call
          // const response = await axios.get(`/api/posts?topic_id=${selectedTopic.id}`);
          // setPosts(response.data);
          
          // For now, use mock data
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
          ].filter(post => post.topicId === selectedTopic.id));
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch posts. Please try again later.');
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [selectedTopic]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="reading-page">
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Reading</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore articles on testing, development, travel, and more. 
            Sharing knowledge and experiences from my professional journey and personal interests.
          </p>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            {/* Topics Sidebar */}
            <div className="md:w-1/4 mb-8 md:mb-0">
              <div className="neumorphic p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-6">Topics</h2>
                {loading && !selectedTopic ? (
                  <p>Loading topics...</p>
                ) : error && !selectedTopic ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <ul className="space-y-3">
                    {topics.map((topic) => (
                      <li key={topic.id}>
                        <button
                          onClick={() => handleTopicSelect(topic)}
                          className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                            selectedTopic && selectedTopic.id === topic.id
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-200'
                          }`}
                        >
                          {topic.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Advertisement Space - Sidebar */}
              <div className="ad-sidebar mt-6">
                Advertisement Space
              </div>
            </div>

            {/* Posts List */}
            <div className="md:w-3/4 md:pl-8">
              {selectedTopic ? (
                <>
                  <h2 className="text-3xl font-bold mb-2">{selectedTopic.name}</h2>
                  <p className="text-gray-600 mb-8">{selectedTopic.description}</p>

                  {loading ? (
                    <p>Loading posts...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : posts.length === 0 ? (
                    <p>No posts found for this topic.</p>
                  ) : (
                    <div className="space-y-8">
                      {posts.map((post) => (
                        <div key={post.id} className="glass p-6 rounded-lg">
                          <h3 className="text-2xl font-semibold mb-2">
                            <Link 
                              to={`/reading/${selectedTopic.id}/${post.id}`} 
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-gray-500 mb-3">{formatDate(post.publishDate)}</p>
                          <p className="text-gray-700 mb-4">{post.snippet}</p>
                          <Link 
                            to={`/reading/${selectedTopic.id}/${post.id}`} 
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Read More
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold mb-4">Select a Topic</h2>
                  <p className="text-gray-600">
                    Choose a topic from the sidebar to see related articles.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>
    </div>
  );
};

export default ReadingPage;