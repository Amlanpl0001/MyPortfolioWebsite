import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  // Create array of page numbers
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          Previous
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const ReadingPage = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const postsPerPage = 3; // Number of posts to display per page

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
          // setAllPosts(response.data);

          // For now, use mock data with more posts for pagination
          const mockPosts = [
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
            {
              id: 6,
              title: 'Advanced Selenium Techniques',
              snippet: 'Take your Selenium skills to the next level with these advanced techniques...',
              publishDate: '2023-04-10',
              topicId: 2,
            },
            {
              id: 7,
              title: 'Introduction to API Testing',
              snippet: 'Learn the basics of API testing and why it\'s important for your test strategy...',
              publishDate: '2023-03-20',
              topicId: 3,
            },
            {
              id: 8,
              title: 'Exploring Europe',
              snippet: 'My adventures traveling through various European countries...',
              publishDate: '2023-01-05',
              topicId: 4,
            },
            {
              id: 9,
              title: 'Test Automation Frameworks',
              snippet: 'A comparison of popular test automation frameworks and when to use each...',
              publishDate: '2023-05-15',
              topicId: 3,
            },
            {
              id: 10,
              title: 'Effective Test Documentation',
              snippet: 'How to create test documentation that is both useful and maintainable...',
              publishDate: '2023-04-25',
              topicId: 1,
            },
            {
              id: 11,
              title: 'Mobile Testing Strategies',
              snippet: 'Comprehensive guide to testing mobile applications across different platforms and devices...',
              publishDate: '2023-06-10',
              topicId: 1,
            },
            {
              id: 12,
              title: 'Selenium Grid for Parallel Testing',
              snippet: 'How to set up and use Selenium Grid for running tests in parallel across multiple browsers...',
              publishDate: '2023-06-05',
              topicId: 2,
            },
            {
              id: 13,
              title: 'Python Design Patterns for Test Automation',
              snippet: 'Implementing design patterns in your Python test automation framework for better maintainability...',
              publishDate: '2023-05-28',
              topicId: 3,
            },
            {
              id: 14,
              title: 'My Adventure in South America',
              snippet: 'Exploring the diverse cultures and breathtaking landscapes of South America...',
              publishDate: '2023-04-15',
              topicId: 4,
            },
            {
              id: 15,
              title: 'Transitioning from Manual to Automation Testing',
              snippet: 'A step-by-step guide for manual testers looking to move into automation testing roles...',
              publishDate: '2023-05-20',
              topicId: 5,
            },
          ].filter(post => post.topicId === selectedTopic.id);

          setAllPosts(mockPosts);
          setCurrentPage(1); // Reset to first page when topic changes
          setSearchTerm(''); // Clear search when topic changes
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch posts. Please try again later.');
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [selectedTopic]);

  // Apply filtering, sorting, and pagination whenever allPosts, searchTerm, sortBy, or currentPage changes
  useEffect(() => {
    if (allPosts.length > 0) {
      // Step 1: Filter posts based on search term
      let filteredPosts = allPosts;
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        filteredPosts = allPosts.filter(post => 
          post.title.toLowerCase().includes(searchTermLower) || 
          post.snippet.toLowerCase().includes(searchTermLower)
        );
      }

      // Step 2: Sort posts based on sortBy
      switch (sortBy) {
        case 'newest':
          filteredPosts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
          break;
        case 'oldest':
          filteredPosts.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
          break;
        case 'a-z':
          filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'z-a':
          filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }

      // Step 3: Paginate posts
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      setDisplayedPosts(filteredPosts.slice(indexOfFirstPost, indexOfLastPost));
    }
  }, [allPosts, searchTerm, sortBy, currentPage, postsPerPage]);

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
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
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
              <div className="ad-sidebar mt-6" aria-label="Advertisement Space">
                <span className="sr-only">Advertisement Space</span>
              </div>
            </div>

            {/* Posts List */}
            <div className="md:w-3/4 md:pl-8">
              {selectedTopic ? (
                <>
                  <h2 className="text-3xl font-bold mb-2">{selectedTopic.name}</h2>
                  <p className="text-gray-600 mb-4">{selectedTopic.description}</p>

                  {/* Search and Filter Controls */}
                  <div className="neumorphic p-4 rounded-lg mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="md:w-1/2">
                        <label htmlFor="search" className="block text-sm text-gray-600 mb-1">Search Posts</label>
                        <input
                          type="text"
                          id="search"
                          placeholder="Search by title or content..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="sortBy" className="block text-sm text-gray-600 mb-1">Sort By</label>
                        <select
                          id="sortBy"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="a-z">A-Z</option>
                          <option value="z-a">Z-A</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <p>Loading posts...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : allPosts.length === 0 ? (
                    <p>No posts found for this topic.</p>
                  ) : displayedPosts.length === 0 ? (
                    <p>No posts match your search criteria.</p>
                  ) : (
                    <>
                      <div className="space-y-8">
                        {displayedPosts.map((post) => (
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

                      {/* Pagination */}
                      {allPosts.length > postsPerPage && (
                        <Pagination 
                          currentPage={currentPage}
                          totalPages={Math.ceil(allPosts.length / postsPerPage)}
                          onPageChange={setCurrentPage}
                        />
                      )}
                    </>
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
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
      </div>
    </div>
  );
};

export default ReadingPage;
