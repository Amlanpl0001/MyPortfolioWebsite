import React, { useState } from 'react';

const PortfolioPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend API
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      message: '',
    });
    // Reset form submission status after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <div className="portfolio-page">
      {/* About & Resume Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="glass p-8 rounded-lg max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="w-48 h-48 rounded-full overflow-hidden mx-auto">
                  <img 
                    src="https://randomuser.me/api/portraits/men/75.jpg" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3 md:pl-8">
                <h1 className="text-3xl font-bold mb-2">John Doe</h1>
                <p className="text-xl text-gray-600 mb-4">Software Engineer & QA Automation Specialist</p>
                <p className="text-gray-700 mb-6">
                  Passionate about creating efficient, scalable software solutions and ensuring 
                  quality through comprehensive testing. Experienced in both development and QA roles,
                  with a focus on automation testing and CI/CD implementation.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="/sample-resume.pdf" 
                    className="neumorphic px-4 py-2 rounded-lg text-black bg-blue-600 hover:bg-blue-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Résumé
                  </a>
                  <a 
                    href="https://linkedin.com/" 
                    className="neumorphic px-4 py-2 rounded-lg text-gray-800 bg-white hover:bg-gray-100 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
      </div>

      {/* Skills Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Skills</h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Programming Languages */}
              <div className="neumorphic p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Programming</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Python</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">JavaScript</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Java</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">SQL</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">HTML/CSS</span>
                </div>
              </div>

              {/* Frameworks & Libraries */}
              <div className="neumorphic p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Frameworks</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">React</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">FastAPI</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Django</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Express</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Tailwind CSS</span>
                </div>
              </div>

              {/* Testing & DevOps */}
              <div className="neumorphic p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Testing & DevOps</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">Selenium</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">Pytest</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">Docker</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">Jenkins</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">Git</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Experience Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Professional Experience</h2>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500"></div>

            {/* Experience Items */}
            <div className="space-y-12">
              {/* Experience 1 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                  <div className="glass p-6 rounded-lg inline-block">
                    <h3 className="text-xl font-semibold">Senior QA Automation Engineer</h3>
                    <p className="text-blue-600">Tech Solutions Inc.</p>
                    <p className="text-gray-600">Jan 2020 - Present</p>
                  </div>
                </div>
                <div className="hidden md:block w-4 h-4 bg-blue-600 rounded-full border-4 border-white absolute left-1/2 transform -translate-x-1/2"></div>
                <div className="md:w-1/2 md:pl-12">
                  <p className="text-gray-700">
                    Led the automation testing efforts for multiple projects. Designed and implemented 
                    test frameworks using Selenium and Python. Integrated tests with CI/CD pipelines.
                    Reduced regression testing time by 70%.
                  </p>
                </div>
              </div>

              {/* Experience 2 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0 md:order-1">
                  <p className="text-gray-700">
                    Developed and maintained automated test suites for web applications.
                    Collaborated with developers to ensure code quality and test coverage.
                    Implemented API testing using Postman and Python requests.
                  </p>
                </div>
                <div className="hidden md:block w-4 h-4 bg-blue-600 rounded-full border-4 border-white absolute left-1/2 transform -translate-x-1/2"></div>
                <div className="md:w-1/2 md:pl-12 md:order-0">
                  <div className="glass p-6 rounded-lg inline-block">
                    <h3 className="text-xl font-semibold">QA Automation Engineer</h3>
                    <p className="text-blue-600">Digital Innovations Co.</p>
                    <p className="text-gray-600">Mar 2017 - Dec 2019</p>
                  </div>
                </div>
              </div>

              {/* Experience 3 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                  <div className="glass p-6 rounded-lg inline-block">
                    <h3 className="text-xl font-semibold">Software Developer</h3>
                    <p className="text-blue-600">WebTech Solutions</p>
                    <p className="text-gray-600">Jun 2015 - Feb 2017</p>
                  </div>
                </div>
                <div className="hidden md:block w-4 h-4 bg-blue-600 rounded-full border-4 border-white absolute left-1/2 transform -translate-x-1/2"></div>
                <div className="md:w-1/2 md:pl-12">
                  <p className="text-gray-700">
                    Developed front-end features using React and JavaScript.
                    Built RESTful APIs using Node.js and Express.
                    Implemented unit tests and integration tests for code quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
      </div>

      {/* Projects Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="glass p-6 rounded-lg">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://source.unsplash.com/random/300x200?automation" 
                  alt="Project 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automation Framework</h3>
              <p className="text-gray-700 mb-4">
                A modular test automation framework built with Python and Selenium.
                Supports parallel execution, reporting, and CI/CD integration.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Python</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Selenium</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Jenkins</span>
              </div>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a 
                  href="#" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Demo
                </a>
              </div>
            </div>

            {/* Project 2 */}
            <div className="glass p-6 rounded-lg">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://source.unsplash.com/random/300x200?ecommerce" 
                  alt="Project 2" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">E-commerce Platform</h3>
              <p className="text-gray-700 mb-4">
                A full-stack e-commerce application with user authentication,
                product catalog, shopping cart, and payment integration.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">React</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Node.js</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">MongoDB</span>
              </div>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a 
                  href="#" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Demo
                </a>
              </div>
            </div>

            {/* Project 3 */}
            <div className="glass p-6 rounded-lg">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://source.unsplash.com/random/300x200?api" 
                  alt="Project 3" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">API Testing Tool</h3>
              <p className="text-gray-700 mb-4">
                A web-based tool for testing RESTful APIs. Supports various
                authentication methods, request customization, and response validation.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">JavaScript</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Express</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">PostgreSQL</span>
              </div>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a 
                  href="#" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Certifications</h2>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Certification 1 */}
            <div className="neumorphic p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">AWS Certified Developer</h3>
              <p className="text-gray-600 mb-2">Amazon Web Services</p>
              <p className="text-gray-700">Issued: January 2022</p>
            </div>

            {/* Certification 2 */}
            <div className="neumorphic p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Certified Selenium Professional</h3>
              <p className="text-gray-600 mb-2">Selenium Certification Board</p>
              <p className="text-gray-700">Issued: March 2021</p>
            </div>

            {/* Certification 3 */}
            <div className="neumorphic p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">ISTQB Certified Tester</h3>
              <p className="text-gray-600 mb-2">International Software Testing Qualifications Board</p>
              <p className="text-gray-700">Issued: September 2020</p>
            </div>

            {/* Certification 4 */}
            <div className="neumorphic p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Certified Scrum Master</h3>
              <p className="text-gray-600 mb-2">Scrum Alliance</p>
              <p className="text-gray-700">Issued: May 2019</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
      </div>

      {/* Interests & Personal Endeavors Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Interests & Personal Endeavors</h2>

          <div className="max-w-3xl mx-auto glass p-8 rounded-lg">
            <p className="text-gray-700 mb-6">
              Passionate about software testing and automation – see my <a href="/lab" className="text-blue-600 hover:text-blue-800">Automation Lab</a> for hands-on demos.
              Avid reader and traveler – check out my musings in the <a href="/reading" className="text-blue-600 hover:text-blue-800">Reading</a> section.
            </p>
            <p className="text-gray-700">
              In my free time, I contribute to open-source testing projects and mentor junior QA engineers.
              I also enjoy hiking, photography, and exploring new technologies through side projects.
            </p>
          </div>
        </div>
      </section>

      {/* Hire Me / Contact Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Hire Me</h2>

          <div className="max-w-5xl mx-auto glass p-8 rounded-lg">
            <div className="flex flex-col md:flex-row">
              {/* Left Side - Contact Information */}
              <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Email</h4>
                    <p className="text-gray-700">john.doe@example.com</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Phone</h4>
                    <p className="text-gray-700">Primary: (555) 123-4567</p>
                    <p className="text-gray-700">Secondary: (555) 987-6543</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">LinkedIn</h4>
                    <p className="text-gray-700">
                      <a 
                        href="https://linkedin.com/in/johndoe" 
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        linkedin.com/in/johndoe
                      </a>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Availability</h4>
                    <p className="text-gray-700">Available for full-time positions and select contract opportunities</p>
                  </div>

                  <div className="pt-4">
                    <a 
                      href="/sample-resume.pdf" 
                      className="neumorphic px-6 py-3 rounded-lg text-black bg-blue-600 hover:bg-blue-700 transition-colors inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download My Résumé
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side - Capabilities */}
              <div className="md:w-1/2 md:pl-8 md:border-l border-gray-300">
                <h3 className="text-2xl font-semibold mb-6">My Capabilities</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">End-to-End Test Automation</h4>
                    <p className="text-gray-700">
                      Expertise in designing and implementing comprehensive test automation frameworks that cover UI, API, and database testing.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">CI/CD Integration</h4>
                    <p className="text-gray-700">
                      Strong experience integrating automated tests into CI/CD pipelines for continuous quality assurance and faster releases.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Full-Stack Development</h4>
                    <p className="text-gray-700">
                      Capable of developing both frontend and backend components, with a focus on creating testable and maintainable code.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Team Leadership</h4>
                    <p className="text-gray-700">
                      Experience leading QA teams, mentoring junior engineers, and collaborating effectively with cross-functional teams.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
