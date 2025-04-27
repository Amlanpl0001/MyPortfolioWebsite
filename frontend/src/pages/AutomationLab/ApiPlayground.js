import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ApiPlayground = () => {
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

  // State for active category
  const [activeCategory, setActiveCategory] = useState('users');

  // API categories and endpoints
  const apiCategories = [
    { id: 'users', name: 'Users API' },
    { id: 'products', name: 'Products API' },
    { id: 'orders', name: 'Orders API' },
    { id: 'auth', name: 'Authentication API' },
    { id: 'special', name: 'Special Cases' },
  ];

  // API endpoints by category
  const apiEndpoints = {
    users: [
      {
        method: 'GET',
        endpoint: '/api/users',
        description: 'Get all users',
        responseType: 'JSON Array',
        statusCode: 200,
        requiresAuth: false,
        example: `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "user"
  }
]`
      },
      {
        method: 'GET',
        endpoint: '/api/users/{id}',
        description: 'Get user by ID',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: false,
        example: `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "createdAt": "2023-01-15T08:30:00Z",
  "lastLogin": "2023-03-20T14:25:30Z"
}`
      },
      {
        method: 'POST',
        endpoint: '/api/users',
        description: 'Create a new user',
        responseType: 'JSON Object',
        statusCode: 201,
        requiresAuth: true,
        requestBody: `{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "securepassword",
  "role": "user"
}`,
        example: `{
  "id": 3,
  "name": "New User",
  "email": "newuser@example.com",
  "role": "user",
  "createdAt": "2023-04-01T10:15:00Z"
}`
      },
      {
        method: 'PUT',
        endpoint: '/api/users/{id}',
        description: 'Update user by ID',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        requestBody: `{
  "name": "Updated Name",
  "email": "updated@example.com"
}`,
        example: `{
  "id": 1,
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "admin",
  "updatedAt": "2023-04-01T11:20:00Z"
}`
      },
      {
        method: 'DELETE',
        endpoint: '/api/users/{id}',
        description: 'Delete user by ID',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        example: `{
  "message": "User deleted successfully",
  "deletedId": 1
}`
      }
    ],
    products: [
      {
        method: 'GET',
        endpoint: '/api/products',
        description: 'Get all products',
        responseType: 'JSON Array',
        statusCode: 200,
        requiresAuth: false,
        example: `[
  {
    "id": 1,
    "name": "Laptop",
    "price": 999.99,
    "category": "Electronics",
    "inStock": true
  },
  {
    "id": 2,
    "name": "Smartphone",
    "price": 699.99,
    "category": "Electronics",
    "inStock": true
  }
]`
      },
      {
        method: 'GET',
        endpoint: '/api/products/{id}',
        description: 'Get product by ID',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: false,
        example: `{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM and 512GB SSD",
  "price": 999.99,
  "category": "Electronics",
  "inStock": true,
  "images": [
    "laptop-front.jpg",
    "laptop-side.jpg"
  ],
  "specs": {
    "processor": "Intel i7",
    "memory": "16GB",
    "storage": "512GB SSD"
  }
}`
      },
      {
        method: 'GET',
        endpoint: '/api/products/category/{category}',
        description: 'Get products by category',
        responseType: 'JSON Array',
        statusCode: 200,
        requiresAuth: false,
        example: `[
  {
    "id": 1,
    "name": "Laptop",
    "price": 999.99,
    "category": "Electronics",
    "inStock": true
  },
  {
    "id": 2,
    "name": "Smartphone",
    "price": 699.99,
    "category": "Electronics",
    "inStock": true
  }
]`
      }
    ],
    orders: [
      {
        method: 'GET',
        endpoint: '/api/orders',
        description: 'Get all orders',
        responseType: 'JSON Array',
        statusCode: 200,
        requiresAuth: true,
        example: `[
  {
    "id": 1,
    "userId": 2,
    "totalAmount": 1699.98,
    "status": "completed",
    "createdAt": "2023-03-15T09:30:00Z"
  },
  {
    "id": 2,
    "userId": 3,
    "totalAmount": 999.99,
    "status": "processing",
    "createdAt": "2023-03-20T14:45:00Z"
  }
]`
      },
      {
        method: 'GET',
        endpoint: '/api/orders/{id}',
        description: 'Get order by ID',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        example: `{
  "id": 1,
  "userId": 2,
  "customerName": "Jane Smith",
  "totalAmount": 1699.98,
  "status": "completed",
  "items": [
    {
      "productId": 1,
      "name": "Laptop",
      "quantity": 1,
      "price": 999.99
    },
    {
      "productId": 2,
      "name": "Smartphone",
      "quantity": 1,
      "price": 699.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  },
  "createdAt": "2023-03-15T09:30:00Z",
  "updatedAt": "2023-03-15T15:20:00Z"
}`
      },
      {
        method: 'POST',
        endpoint: '/api/orders',
        description: 'Create a new order',
        responseType: 'JSON Object',
        statusCode: 201,
        requiresAuth: true,
        requestBody: `{
  "userId": 2,
  "items": [
    {
      "productId": 1,
      "quantity": 1
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  }
}`,
        example: `{
  "id": 3,
  "userId": 2,
  "totalAmount": 1699.98,
  "status": "pending",
  "createdAt": "2023-04-01T10:15:00Z"
}`
      }
    ],
    auth: [
      {
        method: 'POST',
        endpoint: '/api/auth/login',
        description: 'User login',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: false,
        requestBody: `{
  "email": "user@example.com",
  "password": "password123"
}`,
        example: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "user"
  }
}`
      },
      {
        method: 'POST',
        endpoint: '/api/auth/register',
        description: 'User registration',
        responseType: 'JSON Object',
        statusCode: 201,
        requiresAuth: false,
        requestBody: `{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "securepassword"
}`,
        example: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "name": "New User",
    "email": "newuser@example.com",
    "role": "user"
  }
}`
      },
      {
        method: 'GET',
        endpoint: '/api/auth/me',
        description: 'Get current user info',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        example: `{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "user",
  "createdAt": "2023-01-20T10:30:00Z",
  "lastLogin": "2023-03-25T08:15:30Z"
}`
      }
    ],
    special: [
      {
        method: 'GET',
        endpoint: '/api/special/slow',
        description: 'Endpoint with delayed response (5 seconds)',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: false,
        example: `{
  "message": "This response was delayed by 5 seconds",
  "timestamp": "2023-04-01T12:30:00Z"
}`
      },
      {
        method: 'GET',
        endpoint: '/api/special/error',
        description: 'Endpoint that returns a 500 error',
        responseType: 'JSON Object',
        statusCode: 500,
        requiresAuth: false,
        example: `{
  "error": "Internal Server Error",
  "message": "This is a simulated server error",
  "timestamp": "2023-04-01T12:35:00Z"
}`
      },
      {
        method: 'GET',
        endpoint: '/api/special/not-found',
        description: 'Endpoint that returns a 404 error',
        responseType: 'JSON Object',
        statusCode: 404,
        requiresAuth: false,
        example: `{
  "error": "Not Found",
  "message": "The requested resource was not found",
  "timestamp": "2023-04-01T12:40:00Z"
}`
      },
      {
        method: 'GET',
        endpoint: '/api/special/large',
        description: 'Endpoint that returns a large JSON response (1000 items)',
        responseType: 'JSON Array',
        statusCode: 200,
        requiresAuth: false,
        example: `[
  { "id": 1, "name": "Item 1", "value": "..." },
  { "id": 2, "name": "Item 2", "value": "..." },
  ...
  { "id": 1000, "name": "Item 1000", "value": "..." }
]`
      },
      {
        method: 'GET',
        endpoint: '/api/special/secure',
        description: 'Endpoint that requires API key in header',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        headers: 'X-API-KEY: abc123',
        example: `{
  "message": "You have accessed a secure endpoint",
  "timestamp": "2023-04-01T12:45:00Z"
}`
      }
    ]
  };

  return (
    <div className="api-playground">
      <section className="py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <Link to="/lab" className="inline-block mb-6 text-white hover:text-blue-200 transition-colors">
            ← Back to Lab Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">API Playground</h1>
          <p className="text-xl max-w-3xl">
            Test RESTful APIs with various endpoints, status codes, and response formats.
            Great for Postman, RestAssured, or requests library practice.
          </p>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>

      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="glass p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p className="text-gray-700 mb-6">
                This API playground provides a collection of mock endpoints for testing. 
                You can use tools like Postman, curl, or any programming language to make requests to these endpoints.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Base URL</h3>
                <code className="block bg-white p-3 rounded text-blue-800">
                  https://api.myportfolio.example/v1
                </code>
                <p className="text-sm text-blue-700 mt-2">
                  Note: This is a mock API. In a real application, you would replace this with your actual API URL.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Authentication</h3>
                <p className="text-blue-700 mb-2">
                  For endpoints that require authentication, include the following header:
                </p>
                <code className="block bg-white p-3 rounded text-blue-800">
                  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                </code>
                <p className="text-sm text-blue-700 mt-2">
                  You can get a token by making a POST request to /api/auth/login with valid credentials.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* API Categories Sidebar */}
              <div className="md:w-1/4 mb-6 md:mb-0">
                <div className="neumorphic p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">API Categories</h3>
                  <ul className="space-y-2">
                    {apiCategories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => setActiveCategory(category.id)}
                          className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                            activeCategory === category.id
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-200'
                          }`}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Advertisement Space - Sidebar */}
                <div className="ad-sidebar mt-6">
                  Advertisement Space
                </div>
              </div>

              {/* API Endpoints */}
              <div className="md:w-3/4 md:pl-8">
                <h2 className="text-2xl font-bold mb-6">
                  {apiCategories.find(c => c.id === activeCategory)?.name || 'API Endpoints'}
                </h2>
                
                <div className="space-y-6">
                  {apiEndpoints[activeCategory]?.map((endpoint, index) => (
                    <div key={index} className="neumorphic p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <span className={`inline-block px-3 py-1 rounded-md text-white font-medium mr-3 ${
                          endpoint.method === 'GET' ? 'bg-green-600' :
                          endpoint.method === 'POST' ? 'bg-blue-600' :
                          endpoint.method === 'PUT' ? 'bg-yellow-600' :
                          endpoint.method === 'DELETE' ? 'bg-red-600' : 'bg-gray-600'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-lg font-mono">{endpoint.endpoint}</code>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{endpoint.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Response Type</p>
                          <p className="font-medium">{endpoint.responseType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status Code</p>
                          <p className="font-medium">{endpoint.statusCode}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Requires Auth</p>
                          <p className="font-medium">{endpoint.requiresAuth ? 'Yes' : 'No'}</p>
                        </div>
                        {endpoint.headers && (
                          <div>
                            <p className="text-sm text-gray-600">Headers</p>
                            <p className="font-medium font-mono">{endpoint.headers}</p>
                          </div>
                        )}
                      </div>
                      
                      {endpoint.requestBody && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Request Body</p>
                          <pre className="bg-gray-800 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
                            {endpoint.requestBody}
                          </pre>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Example Response</p>
                        <pre className="bg-gray-800 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
                          {endpoint.example}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
            <h2 className="text-xl font-semibold mb-4">API Testing Tips</h2>
            <p className="text-gray-700 mb-4">
              Here are some tips for testing the APIs in this playground:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use tools like Postman, Insomnia, or curl to make requests to these endpoints.</li>
              <li>For endpoints that require authentication, make sure to include the Authorization header.</li>
              <li>Test error handling by sending invalid data or accessing endpoints without proper authentication.</li>
              <li>The slow endpoint is useful for testing timeout handling in your code.</li>
              <li>The large response endpoint can help test how your code handles large datasets.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApiPlayground;