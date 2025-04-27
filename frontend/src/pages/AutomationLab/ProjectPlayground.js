import React, { useState, useEffect, useMemo } from 'react';
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

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, use mock data
    setTimeout(() => {
      const productData = [
        {
          id: 1,
          name: 'Laptop',
          description: 'High-performance laptop with 16GB RAM and 512GB SSD',
          price: 999.99,
          image: 'https://via.placeholder.com/300x200?text=Laptop',
          category: 'Electronics',
          audience: ['adults', 'professionals'],
          inStock: true,
          rating: 4.5,
          tags: ['tech', 'work', 'productivity']
        },
        {
          id: 2,
          name: 'Smartphone',
          description: 'Latest smartphone with 128GB storage and 5G capability',
          price: 699.99,
          image: 'https://via.placeholder.com/300x200?text=Smartphone',
          category: 'Electronics',
          audience: ['adults', 'teenagers'],
          inStock: true,
          rating: 4.2,
          tags: ['tech', 'communication', 'mobile']
        },
        {
          id: 3,
          name: 'Headphones',
          description: 'Wireless noise-cancelling headphones with 20-hour battery life',
          price: 149.99,
          image: 'https://via.placeholder.com/300x200?text=Headphones',
          category: 'Electronics',
          audience: ['adults', 'teenagers', 'children'],
          inStock: true,
          rating: 4.0,
          tags: ['music', 'audio', 'wireless']
        },
        {
          id: 4,
          name: 'T-shirt',
          description: 'Comfortable cotton t-shirt in various colors',
          price: 19.99,
          image: 'https://via.placeholder.com/300x200?text=T-shirt',
          category: 'Clothing',
          audience: ['men', 'women'],
          inStock: true,
          rating: 3.8,
          tags: ['casual', 'summer', 'cotton']
        },
        {
          id: 5,
          name: 'Jeans',
          description: 'Classic denim jeans with a modern fit',
          price: 49.99,
          image: 'https://via.placeholder.com/300x200?text=Jeans',
          category: 'Clothing',
          audience: ['men', 'women'],
          inStock: false,
          rating: 4.1,
          tags: ['casual', 'denim', 'everyday']
        },
        {
          id: 6,
          name: 'Coffee Maker',
          description: 'Programmable coffee maker with 12-cup capacity',
          price: 79.99,
          image: 'https://via.placeholder.com/300x200?text=Coffee+Maker',
          category: 'Home',
          audience: ['adults'],
          inStock: true,
          rating: 4.3,
          tags: ['kitchen', 'appliance', 'morning']
        },
        {
          id: 7,
          name: 'Kids Backpack',
          description: 'Colorful and durable backpack perfect for school',
          price: 29.99,
          image: 'https://via.placeholder.com/300x200?text=Kids+Backpack',
          category: 'Accessories',
          audience: ['children'],
          inStock: true,
          rating: 4.7,
          tags: ['school', 'storage', 'colorful']
        },
        {
          id: 8,
          name: 'Women\'s Dress',
          description: 'Elegant summer dress with floral pattern',
          price: 59.99,
          image: 'https://via.placeholder.com/300x200?text=Womens+Dress',
          category: 'Clothing',
          audience: ['women'],
          inStock: true,
          rating: 4.4,
          tags: ['elegant', 'summer', 'floral']
        },
        {
          id: 9,
          name: 'Men\'s Watch',
          description: 'Classic stainless steel watch with leather strap',
          price: 129.99,
          image: 'https://via.placeholder.com/300x200?text=Mens+Watch',
          category: 'Accessories',
          audience: ['men'],
          inStock: true,
          rating: 4.6,
          tags: ['time', 'accessory', 'style']
        },
        {
          id: 10,
          name: 'Toy Robot',
          description: 'Interactive robot toy with voice recognition',
          price: 39.99,
          image: 'https://via.placeholder.com/300x200?text=Toy+Robot',
          category: 'Toys',
          audience: ['children'],
          inStock: true,
          rating: 4.2,
          tags: ['fun', 'interactive', 'learning']
        }
      ];

      // Implement dynamic product display with position changes on reload
      const shuffledProducts = [...productData].sort(() => Math.random() - 0.5);

      setProducts(shuffledProducts);
      setLoading(false);
    }, 800);
  }, []);

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories;
  }, [products]);

  // Get unique audience types from products
  const audienceTypes = useMemo(() => {
    const allAudiences = products.flatMap(product => product.audience || []);
    const uniqueAudiences = [...new Set(allAudiences)];
    return uniqueAudiences;
  }, [products]);

  // Get price range from products
  const priceRangeValues = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map(product => product.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Search term filter
        const matchesSearch = searchTerm === '' || 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        // Price range filter
        const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;

        // Category filter
        const matchesCategory = selectedCategories.length === 0 || 
          selectedCategories.includes(product.category);

        // Audience filter
        const matchesAudience = selectedAudiences.length === 0 || 
          product.audience.some(audience => selectedAudiences.includes(audience));

        return matchesSearch && matchesPrice && matchesCategory && matchesAudience;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'price-low-high':
            return a.price - b.price;
          case 'price-high-low':
            return b.price - a.price;
          case 'name-a-z':
            return a.name.localeCompare(b.name);
          case 'name-z-a':
            return b.name.localeCompare(a.name);
          case 'rating-high-low':
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
  }, [products, searchTerm, priceRange, selectedCategories, selectedAudiences, sortOption]);

  // Get recommended products based on selected product
  const recommendedProducts = useMemo(() => {
    if (!selectedProduct) return [];

    // Find products with similar categories, tags, or audience
    return products
      .filter(product => 
        product.id !== selectedProduct.id && (
          product.category === selectedProduct.category ||
          product.tags.some(tag => selectedProduct.tags.includes(tag)) ||
          product.audience.some(audience => selectedProduct.audience.includes(audience))
        )
      )
      .sort((a, b) => {
        // Calculate similarity score (higher is more similar)
        const aScore = calculateSimilarityScore(a, selectedProduct);
        const bScore = calculateSimilarityScore(b, selectedProduct);
        return bScore - aScore;
      })
      .slice(0, 3); // Get top 3 recommendations
  }, [products, selectedProduct]);

  // Calculate similarity score between two products
  const calculateSimilarityScore = (product1, product2) => {
    let score = 0;

    // Same category
    if (product1.category === product2.category) score += 3;

    // Common tags
    const commonTags = product1.tags.filter(tag => product2.tags.includes(tag));
    score += commonTags.length * 2;

    // Common audience
    const commonAudience = product1.audience.filter(audience => product2.audience.includes(audience));
    score += commonAudience.length * 2;

    // Similar price range (within 20%)
    const priceDiff = Math.abs(product1.price - product2.price);
    const priceThreshold = product2.price * 0.2;
    if (priceDiff <= priceThreshold) score += 1;

    return score;
  };

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
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
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
              {/* Search and Filters Section */}
              <div className="md:w-2/3 md:pr-6 mb-8 md:mb-0">
                <div className="glass p-4 rounded-lg mb-6">
                  <h2 className="text-xl font-bold mb-4">Search & Filter</h2>

                  {/* Search Bar */}
                  <div className="mb-4">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
                    <input
                      type="text"
                      id="search"
                      placeholder="Search by name, description, category, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Price Range Filter */}
                    <div>
                      <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 mb-1">
                        Price Range: ${priceRange.min} - ${priceRange.max}
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          id="price-min"
                          min={priceRangeValues.min}
                          max={priceRangeValues.max}
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                          className="w-full"
                        />
                        <input
                          type="range"
                          id="price-max"
                          min={priceRangeValues.min}
                          max={priceRangeValues.max}
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                      <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="default">Default</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="name-a-z">Name: A to Z</option>
                        <option value="name-z-a">Name: Z to A</option>
                        <option value="rating-high-low">Rating: High to Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => {
                              if (selectedCategories.includes(category)) {
                                setSelectedCategories(selectedCategories.filter(c => c !== category));
                              } else {
                                setSelectedCategories([...selectedCategories, category]);
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded-full ${
                              selectedCategories.includes(category)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Audience Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                      <div className="flex flex-wrap gap-2">
                        {audienceTypes.map(audience => (
                          <button
                            key={audience}
                            onClick={() => {
                              if (selectedAudiences.includes(audience)) {
                                setSelectedAudiences(selectedAudiences.filter(a => a !== audience));
                              } else {
                                setSelectedAudiences([...selectedAudiences, audience]);
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded-full ${
                              selectedAudiences.includes(audience)
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            {audience}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reset Filters Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setPriceRange({ min: priceRangeValues.min, max: priceRangeValues.max });
                        setSelectedCategories([]);
                        setSelectedAudiences([]);
                        setSortOption('default');
                      }}
                      className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>

                {/* Products Section */}
                <h2 className="text-2xl font-bold mb-6">Products {filteredProducts.length > 0 && `(${filteredProducts.length})`}</h2>

                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Loading products...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No products match your filters. Try adjusting your search criteria.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map(product => (
                        <div 
                          key={product.id} 
                          className="neumorphic p-4 rounded-lg"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <div className="mb-4 rounded-md overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-40 object-cover"
                            />
                          </div>
                          <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                          <div className="flex justify-between mb-2">
                            <p className="text-gray-600 text-sm">{product.category}</p>
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-1">★</span>
                              <span className="text-sm">{product.rating}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.audience.map(audience => (
                              <span key={audience} className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                                {audience}
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-700 text-sm mb-3 h-12 overflow-hidden">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                            {product.inStock ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(product);
                                }}
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

                    {/* Recommended Products Section */}
                    {selectedProduct && recommendedProducts.length > 0 && (
                      <div className="mt-12">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold">Recommended Products</h3>
                          <button 
                            onClick={() => setSelectedProduct(null)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Clear Selection
                          </button>
                        </div>
                        <p className="text-gray-600 mb-6">Based on your interest in {selectedProduct.name}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {recommendedProducts.map(product => (
                            <div key={product.id} className="neumorphic p-3 rounded-lg">
                              <div className="flex items-center mb-2">
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-16 h-16 object-cover rounded-md mr-3"
                                />
                                <div>
                                  <h4 className="font-medium text-sm">{product.name}</h4>
                                  <p className="text-gray-600 text-xs">{product.category}</p>
                                  <p className="font-bold text-sm mt-1">${product.price.toFixed(2)}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => addToCart(product)}
                                className="w-full px-2 py-1 text-xs rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                disabled={!product.inStock}
                              >
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
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
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
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
