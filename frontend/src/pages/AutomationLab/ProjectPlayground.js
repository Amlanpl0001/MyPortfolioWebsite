import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProjectPlayground = () => {
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

  // State for cart and products
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, use mock data
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: 'Laptop',
          description: 'High-performance laptop with 16GB RAM and 512GB SSD',
          price: 999.99,
          image: 'https://via.placeholder.com/300x200?text=Laptop',
          category: 'Electronics',
          inStock: true
        },
        {
          id: 2,
          name: 'Smartphone',
          description: 'Latest smartphone with 128GB storage and 5G capability',
          price: 699.99,
          image: 'https://via.placeholder.com/300x200?text=Smartphone',
          category: 'Electronics',
          inStock: true
        },
        {
          id: 3,
          name: 'Headphones',
          description: 'Wireless noise-cancelling headphones with 20-hour battery life',
          price: 149.99,
          image: 'https://via.placeholder.com/300x200?text=Headphones',
          category: 'Electronics',
          inStock: true
        },
        {
          id: 4,
          name: 'T-shirt',
          description: 'Comfortable cotton t-shirt in various colors',
          price: 19.99,
          image: 'https://via.placeholder.com/300x200?text=T-shirt',
          category: 'Clothing',
          inStock: true
        },
        {
          id: 5,
          name: 'Jeans',
          description: 'Classic denim jeans with a modern fit',
          price: 49.99,
          image: 'https://via.placeholder.com/300x200?text=Jeans',
          category: 'Clothing',
          inStock: false
        },
        {
          id: 6,
          name: 'Coffee Maker',
          description: 'Programmable coffee maker with 12-cup capacity',
          price: 79.99,
          image: 'https://via.placeholder.com/300x200?text=Coffee+Maker',
          category: 'Home',
          inStock: true
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

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
    
    // In a real app, this would be an API call
    // For now, simulate API call
    setTimeout(() => {
      // Generate a random order ID
      const newOrderId = Math.floor(100000 + Math.random() * 900000);
      setOrderId(newOrderId);
      setOrderPlaced(true);
      
      // Clear cart
      setCart([]);
    }, 1000);
  };

  return (
    <div className="project-playground">
      <section className="py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <Link to="/lab" className="inline-block mb-6 text-white hover:text-blue-200 transition-colors">
            ← Back to Lab Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Mini E-commerce Store</h1>
          <p className="text-xl max-w-3xl">
            This is a complete mini e-commerce application for end-to-end testing practice.
            Browse products, add to cart, and place orders to test the full workflow.
          </p>
        </div>
      </section>

      {/* Advertisement Space */}
      <div className="ad-banner">
        Advertisement Space
      </div>

      {/* Order Confirmation Modal */}
      {orderPlaced && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="glass p-8 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Order Placed Successfully!</h2>
            <p className="text-gray-700 mb-4">
              Your order has been placed successfully. Your order ID is:
            </p>
            <p className="text-2xl font-bold text-center mb-6">{orderId}</p>
            <p className="text-gray-700 mb-6">
              You can use this order ID to track your order or to query the database for order details.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setOrderPlaced(false)}
                className="neumorphic px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="glass p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Testing Instructions</h2>
              <p className="text-gray-700 mb-4">
                This mini e-commerce store is designed for end-to-end testing practice. You can:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                <li>Browse products and view details</li>
                <li>Add products to your cart</li>
                <li>Update quantities or remove items from your cart</li>
                <li>Place an order and receive an order confirmation</li>
                <li>Use the Database Playground to query the orders table with your order ID</li>
              </ul>
              <p className="text-gray-700">
                Try automating this workflow using tools like Selenium, Cypress, or Playwright.
              </p>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Products Section */}
              <div className="md:w-2/3 md:pr-6 mb-8 md:mb-0">
                <h2 className="text-2xl font-bold mb-6">Products</h2>
                
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Loading products...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <div key={product.id} className="neumorphic p-4 rounded-lg">
                        <div className="mb-4 rounded-md overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-40 object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                        <p className="text-gray-700 text-sm mb-3 h-12 overflow-hidden">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                          {product.inStock ? (
                            <button
                              onClick={() => addToCart(product)}
                              className="neumorphic px-3 py-1 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors text-sm"
                              id={`add-to-cart-${product.id}`}
                            >
                              Add to Cart
                            </button>
                          ) : (
                            <span className="text-red-500 text-sm font-medium">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Section */}
              <div className="md:w-1/3">
                <div className="glass p-6 rounded-lg sticky top-6">
                  <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
                  
                  {cart.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cart.map(item => (
                          <div key={item.product.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <div className="flex items-center">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="w-16 h-16 object-cover rounded-md mr-4"
                              />
                              <div>
                                <h4 className="font-medium">{item.product.name}</h4>
                                <p className="text-gray-600 text-sm">${item.product.price.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="mx-2 w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="ml-4 text-red-500 hover:text-red-700"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4 mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Subtotal:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Shipping:</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={placeOrder}
                        className="neumorphic w-full px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
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
            <h2 className="text-xl font-semibold mb-4">Automation Tips</h2>
            <p className="text-gray-700 mb-4">
              Here are some tips for automating this e-commerce workflow:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use unique identifiers (IDs) for key elements like the "Add to Cart" and "Checkout" buttons.</li>
              <li>Implement waits for dynamic elements like the cart updates and order confirmation.</li>
              <li>Create a complete test that adds products to cart, updates quantities, and completes checkout.</li>
              <li>After placing an order, verify the order ID is displayed and capture it for database verification.</li>
              <li>Use the Database Playground to query the orders table with the captured order ID.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectPlayground;