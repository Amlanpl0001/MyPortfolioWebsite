import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to My Portfolio</h1>
          <p className="text-xl md:text-2xl mb-8">Software Engineer & QA Automation Specialist</p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/resume.pdf" 
              className="neumorphic px-6 py-3 rounded-lg text-gray-800 bg-white hover:bg-gray-100 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Résumé
            </a>
            <a 
              href="https://linkedin.com/" 
              className="neumorphic px-6 py-3 rounded-lg text-gray-800 bg-white hover:bg-gray-100 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Profile
            </a>
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>

      {/* Section Overview Cards */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore My Site</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Portfolio Card */}
            <div className="glass p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Portfolio</h3>
              <p className="text-gray-700 mb-6">
                Explore my professional background, skills, projects, and experience. 
                Learn about my journey and expertise in software development and testing.
              </p>
              <Link 
                to="/portfolio" 
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Portfolio
              </Link>
            </div>

            {/* Reading Card */}
            <div className="glass p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Reading</h3>
              <p className="text-gray-700 mb-6">
                Dive into my blog where I share insights, tutorials, and thoughts on 
                testing, development, and other topics of interest.
              </p>
              <Link 
                to="/reading" 
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Read Articles
              </Link>
            </div>

            {/* Automation Lab Card */}
            <div className="glass p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Automation Lab</h3>
              <p className="text-gray-700 mb-6">
                Access interactive playgrounds for testing practice, including web, API, 
                and database environments. Perfect for honing your automation skills.
              </p>
              <Link 
                to="/lab" 
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Enter Lab
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>

      {/* Hire Me Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Hire Me</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Looking for a skilled professional for your project? I'm available for freelance 
            work and full-time opportunities. Let's discuss how I can help you achieve your goals.
          </p>
          <Link 
            to="/portfolio#hire-me" 
            className="neumorphic inline-block px-8 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
