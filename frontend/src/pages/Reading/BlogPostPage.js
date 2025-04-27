import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const BlogPostPage = () => {
  const { topicId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/posts/${postId}`);
        // setPost(response.data);
        
        // For now, use mock data
        // Simulate API delay
        setTimeout(() => {
          const mockPost = {
            id: parseInt(postId),
            title: 'Getting Started with Selenium WebDriver',
            content: `
# Getting Started with Selenium WebDriver

Selenium WebDriver is one of the most popular tools for automated testing of web applications. In this article, we'll explore how to set up and use Selenium WebDriver for your testing needs.

## What is Selenium WebDriver?

Selenium WebDriver is a collection of open-source APIs that are used to automate the testing of web applications. It provides a programming interface to create and execute test cases. WebDriver directly calls the browser using each browser's native support for automation.

## Setting Up Selenium WebDriver

### Prerequisites

Before we begin, make sure you have the following installed:

- Java Development Kit (JDK)
- An IDE like Eclipse or IntelliJ IDEA
- Maven (optional but recommended for dependency management)

### Step 1: Add Selenium WebDriver Dependency

If you're using Maven, add the following dependency to your pom.xml:

\`\`\`xml
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>4.1.0</version>
</dependency>
\`\`\`

### Step 2: Download Browser Drivers

You need to download the appropriate driver for the browser you want to automate:

- [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/) for Google Chrome
- [GeckoDriver](https://github.com/mozilla/geckodriver/releases) for Firefox
- [EdgeDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/) for Microsoft Edge

### Step 3: Write Your First Test

Here's a simple example of a Selenium test in Java:

\`\`\`java
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class FirstTest {
    public static void main(String[] args) {
        // Set the path to the ChromeDriver
        System.setProperty("webdriver.chrome.driver", "path/to/chromedriver");
        
        // Initialize ChromeDriver
        WebDriver driver = new ChromeDriver();
        
        // Navigate to a website
        driver.get("https://www.example.com");
        
        // Find an element by its ID and interact with it
        WebElement element = driver.findElement(By.id("example-id"));
        element.click();
        
        // Close the browser
        driver.quit();
    }
}
\`\`\`

## Common Selenium WebDriver Commands

Here are some common commands you'll use in your Selenium tests:

- **Finding Elements**:
  - \`driver.findElement(By.id("id"))\`
  - \`driver.findElement(By.name("name"))\`
  - \`driver.findElement(By.xpath("xpath"))\`
  - \`driver.findElement(By.cssSelector("css"))\`

- **Interacting with Elements**:
  - \`element.click()\` - Click on an element
  - \`element.sendKeys("text")\` - Type text into an input field
  - \`element.clear()\` - Clear text from an input field
  - \`element.submit()\` - Submit a form

- **Browser Navigation**:
  - \`driver.get("url")\` - Navigate to a URL
  - \`driver.navigate().back()\` - Go back
  - \`driver.navigate().forward()\` - Go forward
  - \`driver.navigate().refresh()\` - Refresh the page

## Waiting for Elements

One of the challenges in web automation is waiting for elements to be available before interacting with them. Selenium provides several waiting mechanisms:

### Implicit Wait

\`\`\`java
driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
\`\`\`

### Explicit Wait

\`\`\`java
WebDriverWait wait = new WebDriverWait(driver, 10);
WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("example-id")));
\`\`\`

## Conclusion

Selenium WebDriver is a powerful tool for automating web applications. With the basics covered in this article, you're ready to start writing your own automated tests. In future articles, we'll explore more advanced topics like handling frames, alerts, and implementing the Page Object Model.

## Video Tutorial

Check out this video tutorial for a visual guide:

<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Happy testing!
            `,
            publishDate: '2023-02-15',
            author: 'John Doe',
            topicId: parseInt(topicId),
            readTime: '8 min read',
          };
          
          setPost(mockPost);
          setLoading(false);
        }, 800); // Simulate loading delay
      } catch (err) {
        setError('Failed to fetch post. Please try again later.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, topicId]);

  // Custom renderer for code blocks with syntax highlighting
  const renderer = {
    code(code, language) {
      return (
        <SyntaxHighlighter style={docco} language={language || 'javascript'} className="rounded-md my-4">
          {code}
        </SyntaxHighlighter>
      );
    },
  };
  
  marked.use({ renderer });

  // Function to safely render HTML content (including iframes for videos)
  const createMarkup = (content) => {
    if (!content) return { __html: '' };
    
    // First pass: Convert markdown to HTML
    let html = marked(content);
    
    return { __html: html };
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-red-500">{error}</p>
        <Link to="/reading" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
          Back to Reading
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl">Post not found.</p>
        <Link to="/reading" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
          Back to Reading
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Link to="/reading" className="inline-block mb-6 text-white hover:text-blue-200 transition-colors">
            ← Back to Reading
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex justify-center items-center space-x-4 text-sm">
            <span>{formatDate(post.publishDate)}</span>
            <span>•</span>
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>

      {/* Post Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            {/* Main Content */}
            <div className="md:w-3/4">
              <article className="glass p-8 rounded-lg prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={createMarkup(post.content)} />
              </article>
            </div>

            {/* Sidebar */}
            <div className="md:w-1/4 md:pl-8 mt-8 md:mt-0">
              <div className="neumorphic p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">About the Author</h3>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img 
                      src="/author-profile.jpg" 
                      alt={post.author} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-sm text-gray-600">Software Engineer & QA Specialist</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  Passionate about software testing and automation. Sharing knowledge and experiences from years in the industry.
                </p>
              </div>

              {/* Advertisement Space - Sidebar */}
              <div className="ad-sidebar">
                Advertisement Space
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>

      {/* Related Posts - Could be implemented in a real app */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                <Link to="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Advanced Selenium Techniques
                </Link>
              </h3>
              <p className="text-gray-700 mb-4">
                Take your Selenium skills to the next level with these advanced techniques...
              </p>
              <Link to="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                Read More →
              </Link>
            </div>
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                <Link to="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Selenium vs Cypress: A Comparison
                </Link>
              </h3>
              <p className="text-gray-700 mb-4">
                Comparing two popular automation frameworks to help you choose the right one...
              </p>
              <Link to="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                Read More →
              </Link>
            </div>
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                <Link to="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Test Automation Best Practices
                </Link>
              </h3>
              <p className="text-gray-700 mb-4">
                Follow these best practices to create maintainable and effective test automation...
              </p>
              <Link to="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;