import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DbPlayground = () => {
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

  // State for active schema
  const [activeSchema, setActiveSchema] = useState('ecommerce');
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);

  // Sample database schemas
  const schemas = [
    { id: 'ecommerce', name: 'E-commerce Database' },
    { id: 'hr', name: 'HR Database' },
    { id: 'library', name: 'Library Database' },
  ];

  // Sample queries for each schema
  const sampleQueries = {
    ecommerce: [
      {
        name: 'List all products',
        query: 'SELECT * FROM products;'
      },
      {
        name: 'Find products with price > $500',
        query: 'SELECT name, price, category FROM products WHERE price > 500 ORDER BY price DESC;'
      },
      {
        name: 'Count products by category',
        query: 'SELECT category, COUNT(*) as product_count FROM products GROUP BY category;'
      }
    ],
    hr: [
      {
        name: 'List all employees',
        query: 'SELECT * FROM employees;'
      },
      {
        name: 'Employees by department',
        query: 'SELECT e.id, e.first_name, e.last_name, d.name as department FROM employees e JOIN departments d ON e.department_id = d.id ORDER BY d.name, e.last_name;'
      }
    ],
    library: [
      {
        name: 'List all books',
        query: 'SELECT * FROM books;'
      },
      {
        name: 'Books by author',
        query: 'SELECT b.title, b.publication_year, a.name as author FROM books b JOIN book_authors ba ON b.id = ba.book_id JOIN authors a ON ba.author_id = a.id ORDER BY a.name, b.publication_year;'
      }
    ]
  };

  // Handle query execution
  const executeQuery = () => {
    if (!sqlQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setIsExecuting(true);
    setError(null);

    // In a real app, this would be an API call to execute the query
    // For now, simulate API call with mock data
    setTimeout(() => {
      try {
        // Check if query is a SELECT statement (for safety in this demo)
        const normalizedQuery = sqlQuery.trim().toLowerCase();
        if (!normalizedQuery.startsWith('select')) {
          throw new Error('Only SELECT queries are allowed in this playground');
        }

        // Generate mock results based on the query and schema
        let mockResults;
        
        if (activeSchema === 'ecommerce') {
          mockResults = {
            columns: ['id', 'name', 'price', 'category', 'in_stock'],
            rows: [
              [1, 'Laptop', 999.99, 'Electronics', true],
              [2, 'Smartphone', 699.99, 'Electronics', true],
              [3, 'Headphones', 149.99, 'Electronics', true],
              [4, 'T-shirt', 19.99, 'Clothing', true],
              [5, 'Jeans', 49.99, 'Clothing', false]
            ]
          };
        } else if (activeSchema === 'hr') {
          mockResults = {
            columns: ['id', 'first_name', 'last_name', 'job_title', 'department_id', 'salary'],
            rows: [
              [1, 'Alice', 'Johnson', 'Software Engineer', 1, 85000.00],
              [2, 'Bob', 'Smith', 'Product Manager', 2, 95000.00],
              [3, 'Carol', 'Williams', 'UX Designer', 1, 80000.00],
              [4, 'Dave', 'Brown', 'Marketing Specialist', 3, 75000.00],
              [5, 'Eve', 'Davis', 'HR Manager', 4, 90000.00]
            ]
          };
        } else if (activeSchema === 'library') {
          mockResults = {
            columns: ['id', 'title', 'isbn', 'publication_year', 'publisher', 'copies'],
            rows: [
              [1, 'The Great Gatsby', '9780743273565', 1925, 'Scribner', 3],
              [2, 'To Kill a Mockingbird', '9780061120084', 1960, 'HarperCollins', 5],
              [3, '1984', '9780451524935', 1949, 'Signet Classics', 4],
              [4, 'Pride and Prejudice', '9780141439518', 1813, 'Penguin Classics', 2],
              [5, 'The Hobbit', '9780547928227', 1937, 'Houghton Mifflin', 3]
            ]
          };
        } else {
          mockResults = {
            columns: ['result'],
            rows: [['No data found for this query']]
          };
        }

        setQueryResult(mockResults);
      } catch (err) {
        setError(err.message);
        setQueryResult(null);
      } finally {
        setIsExecuting(false);
      }
    }, 1000);
  };

  // Load a sample query
  const loadSampleQuery = (query) => {
    setSqlQuery(query);
  };

  return (
    <div className="db-playground">
      <section className="py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <Link to="/lab" className="inline-block mb-6 text-white hover:text-blue-200 transition-colors">
            ← Back to Lab Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Database Playground</h1>
          <p className="text-xl max-w-3xl">
            Write and execute SQL queries against sample databases with different schemas.
            Perfect for practicing database testing and SQL skills.
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
                This Database Playground allows you to write and execute SQL queries against sample databases.
                Select a database schema, write your query, and click "Execute Query" to see the results.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Important Notes</h3>
                <ul className="list-disc pl-6 space-y-1 text-blue-700">
                  <li>Only SELECT queries are allowed in this playground for security reasons.</li>
                  <li>The databases are reset periodically, so any changes will not persist.</li>
                  <li>Use the sample queries to get started or explore the schema information.</li>
                </ul>
              </div>
            </div>

            {/* Schema Selection */}
            <div className="flex border-b border-gray-300 mb-8 overflow-x-auto">
              {schemas.map((schema) => (
                <button
                  key={schema.id}
                  onClick={() => setActiveSchema(schema.id)}
                  className={`px-6 py-3 font-medium whitespace-nowrap ${
                    activeSchema === schema.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {schema.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Schema Info Sidebar */}
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                <div className="neumorphic p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Schema Information</h3>
                  <p className="text-gray-700 mb-4">
                    {activeSchema === 'ecommerce' && 'E-commerce database with products, customers, orders, and order items.'}
                    {activeSchema === 'hr' && 'HR database with employees, departments, and job history.'}
                    {activeSchema === 'library' && 'Library database with books, authors, members, and loans.'}
                  </p>
                  <p className="text-gray-700">
                    Use the sample queries to explore the data in this schema.
                  </p>
                </div>

                {/* Advertisement Space - Sidebar */}
                <div className="ad-sidebar mt-6">
                  Advertisement Space
                </div>
              </div>

              {/* Query Editor and Results */}
              <div className="md:w-2/3">
                <div className="glass p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold mb-4">SQL Query Editor</h3>
                  
                  <div className="mb-4">
                    <textarea
                      id="sql-query"
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      placeholder="Enter your SQL query here..."
                      className="neumorphic-inset w-full px-4 py-3 rounded-lg font-mono text-sm h-40"
                    ></textarea>
                  </div>
                  
                  <div className="flex flex-wrap justify-between items-center">
                    <button
                      onClick={executeQuery}
                      disabled={isExecuting}
                      className="neumorphic px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                      {isExecuting ? 'Executing...' : 'Execute Query'}
                    </button>
                    
                    <div className="relative mt-4 sm:mt-0">
                      <select
                        onChange={(e) => loadSampleQuery(e.target.value)}
                        className="neumorphic-inset px-4 py-2 rounded-lg appearance-none pr-10 text-gray-700"
                        defaultValue=""
                      >
                        <option value="" disabled>Load Sample Query</option>
                        {sampleQueries[activeSchema]?.map((sample, index) => (
                          <option key={index} value={sample.query}>
                            {sample.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Query Results */}
                <div className="neumorphic p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Query Results</h3>
                  
                  {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  
                  {isExecuting ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Executing query...</p>
                    </div>
                  ) : queryResult ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                          <tr>
                            {queryResult.columns.map((column, index) => (
                              <th key={index} className="px-4 py-2 text-left text-gray-600 font-medium">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResult.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-2 border-t border-gray-200">
                                  {cell !== null ? String(cell) : <span className="text-gray-400">NULL</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-gray-500 text-sm mt-2">
                        {queryResult.rows.length} {queryResult.rows.length === 1 ? 'row' : 'rows'} returned
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Execute a query to see results</p>
                    </div>
                  )}
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
            <h2 className="text-xl font-semibold mb-4">SQL Tips</h2>
            <p className="text-gray-700 mb-4">
              Here are some tips for writing SQL queries:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use <code className="bg-gray-100 px-1 rounded">SELECT *</code> to retrieve all columns from a table.</li>
              <li>Use <code className="bg-gray-100 px-1 rounded">WHERE</code> to filter rows based on conditions.</li>
              <li>Use <code className="bg-gray-100 px-1 rounded">JOIN</code> to combine data from multiple tables.</li>
              <li>Use <code className="bg-gray-100 px-1 rounded">GROUP BY</code> to aggregate data.</li>
              <li>Use <code className="bg-gray-100 px-1 rounded">ORDER BY</code> to sort results.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DbPlayground;