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
    { id: 'analytics', name: 'Analytics API' },
    { id: 'payments', name: 'Payments API' },
    { id: 'search', name: 'Search API' },
    { id: 'advanced', name: 'Advanced Queries' },
    { id: 'special', name: 'Special Cases' },
  ];

  // API endpoints by category
  const apiEndpoints = {
    advanced: [
      {
        method: 'POST',
        endpoint: '/api/graphql',
        description: 'GraphQL-style query endpoint for flexible data fetching',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        headers: 'Authorization: Bearer {token}',
        requestBody: `{
  "query": "query GetUserWithOrdersAndProducts($userId: ID!, $orderLimit: Int) {
    user(id: $userId) {
      id
      name
      email
      profile {
        avatar
        phoneNumber
        preferences {
          theme
          language
          notifications
        }
      }
      orders(limit: $orderLimit, sort: { field: createdAt, direction: DESC }) {
        id
        status
        totalAmount
        createdAt
        items {
          product {
            id
            name
            price
            category
            rating
          }
          quantity
          unitPrice
        }
      }
      wishlist {
        id
        name
        price
        inStock
      }
    }
  }",
  "variables": {
    "userId": "user_12345",
    "orderLimit": 5
  },
  "operationName": "GetUserWithOrdersAndProducts"
}`,
        example: `{
  "data": {
    "user": {
      "id": "user_12345",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "profile": {
        "avatar": "https://example.com/avatars/jane.jpg",
        "phoneNumber": "+1-555-123-4567",
        "preferences": {
          "theme": "dark",
          "language": "en-US",
          "notifications": true
        }
      },
      "orders": [
        {
          "id": "order_98765",
          "status": "delivered",
          "totalAmount": 329.97,
          "createdAt": "2023-03-28T14:30:00Z",
          "items": [
            {
              "product": {
                "id": "prod_12345",
                "name": "Wireless Headphones",
                "price": 149.99,
                "category": "Electronics",
                "rating": 4.8
              },
              "quantity": 1,
              "unitPrice": 149.99
            },
            {
              "product": {
                "id": "prod_23456",
                "name": "Bluetooth Speaker",
                "price": 89.99,
                "category": "Electronics",
                "rating": 4.5
              },
              "quantity": 2,
              "unitPrice": 89.99
            }
          ]
        },
        {
          "id": "order_87654",
          "status": "processing",
          "totalAmount": 1299.99,
          "createdAt": "2023-03-15T09:45:00Z",
          "items": [
            {
              "product": {
                "id": "prod_34567",
                "name": "Laptop",
                "price": 1299.99,
                "category": "Electronics",
                "rating": 4.9
              },
              "quantity": 1,
              "unitPrice": 1299.99
            }
          ]
        }
      ],
      "wishlist": [
        {
          "id": "prod_45678",
          "name": "Smartphone",
          "price": 899.99,
          "inStock": true
        },
        {
          "id": "prod_56789",
          "name": "Tablet",
          "price": 499.99,
          "inStock": false
        }
      ]
    }
  }
}`
      },
      {
        method: 'POST',
        endpoint: '/api/batch',
        description: 'Batch operations endpoint for multiple requests in a single call',
        responseType: 'JSON Array',
        statusCode: 200,
        requiresAuth: true,
        headers: 'Authorization: Bearer {token}',
        requestBody: `{
  "operations": [
    {
      "method": "GET",
      "path": "/api/products/1",
      "id": "product-1"
    },
    {
      "method": "GET",
      "path": "/api/products/2",
      "id": "product-2"
    },
    {
      "method": "POST",
      "path": "/api/orders",
      "id": "new-order",
      "body": {
        "userId": 2,
        "items": [
          {
            "productId": 1,
            "quantity": 1
          },
          {
            "productId": 2,
            "quantity": 2
          }
        ],
        "shippingAddress": {
          "street": "123 Main St",
          "city": "Anytown",
          "state": "CA",
          "zipCode": "12345"
        }
      }
    },
    {
      "method": "GET",
      "path": "/api/users/2",
      "id": "user-2"
    }
  ],
  "options": {
    "continueOnError": true,
    "parallel": false
  }
}`,
        example: `{
  "results": [
    {
      "id": "product-1",
      "status": 200,
      "body": {
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
      }
    },
    {
      "id": "product-2",
      "status": 200,
      "body": {
        "id": 2,
        "name": "Smartphone",
        "description": "Latest smartphone with 128GB storage and 5G capability",
        "price": 699.99,
        "category": "Electronics",
        "inStock": true,
        "images": [
          "smartphone-front.jpg",
          "smartphone-back.jpg"
        ],
        "specs": {
          "processor": "Snapdragon 8",
          "memory": "8GB",
          "storage": "128GB"
        }
      }
    },
    {
      "id": "new-order",
      "status": 201,
      "body": {
        "id": 3,
        "userId": 2,
        "totalAmount": 2399.97,
        "status": "pending",
        "createdAt": "2023-04-01T10:15:00Z"
      }
    },
    {
      "id": "user-2",
      "status": 200,
      "body": {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "user",
        "createdAt": "2023-01-20T10:30:00Z",
        "lastLogin": "2023-03-25T08:15:30Z"
      }
    }
  ],
  "meta": {
    "successCount": 4,
    "errorCount": 0,
    "processingTimeMs": 320
  }
}`
      },
      {
        method: 'POST',
        endpoint: '/api/products/aggregate',
        description: 'Advanced aggregation endpoint for product analytics',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        headers: 'Authorization: Bearer {token}',
        requestBody: `{
  "dimensions": ["category", "brand"],
  "metrics": ["count", "avgPrice", "minPrice", "maxPrice", "totalRevenue"],
  "filters": [
    {
      "field": "price",
      "operator": "between",
      "value": [50, 1000]
    },
    {
      "field": "rating",
      "operator": "gte",
      "value": 4
    },
    {
      "field": "createdAt",
      "operator": "after",
      "value": "2023-01-01T00:00:00Z"
    }
  ],
  "having": [
    {
      "metric": "count",
      "operator": "gte",
      "value": 5
    }
  ],
  "sort": [
    {
      "dimension": "category",
      "direction": "asc"
    },
    {
      "metric": "totalRevenue",
      "direction": "desc"
    }
  ],
  "limit": 20,
  "includeMetadata": true
}`,
        example: `{
  "aggregations": [
    {
      "dimensions": {
        "category": "Electronics",
        "brand": "Apple"
      },
      "metrics": {
        "count": 12,
        "avgPrice": 899.99,
        "minPrice": 199.99,
        "maxPrice": 1999.99,
        "totalRevenue": 245000.00
      }
    },
    {
      "dimensions": {
        "category": "Electronics",
        "brand": "Samsung"
      },
      "metrics": {
        "count": 10,
        "avgPrice": 799.99,
        "minPrice": 149.99,
        "maxPrice": 1799.99,
        "totalRevenue": 180000.00
      }
    },
    {
      "dimensions": {
        "category": "Electronics",
        "brand": "Sony"
      },
      "metrics": {
        "count": 8,
        "avgPrice": 599.99,
        "minPrice": 99.99,
        "maxPrice": 1499.99,
        "totalRevenue": 120000.00
      }
    },
    {
      "dimensions": {
        "category": "Home",
        "brand": "Dyson"
      },
      "metrics": {
        "count": 6,
        "avgPrice": 399.99,
        "minPrice": 199.99,
        "maxPrice": 699.99,
        "totalRevenue": 75000.00
      }
    }
  ],
  "metadata": {
    "totalRecords": 36,
    "filteredRecords": 36,
    "aggregatedGroups": 4,
    "processingTimeMs": 150,
    "dimensions": ["category", "brand"],
    "metrics": ["count", "avgPrice", "minPrice", "maxPrice", "totalRevenue"],
    "filters": [
      {
        "field": "price",
        "operator": "between",
        "value": [50, 1000]
      },
      {
        "field": "rating",
        "operator": "gte",
        "value": 4
      },
      {
        "field": "createdAt",
        "operator": "after",
        "value": "2023-01-01T00:00:00Z"
      }
    ]
  }
}`
      },
      {
        method: 'POST',
        endpoint: '/api/data/query',
        description: 'SQL-like query interface for complex data retrieval',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        headers: 'Authorization: Bearer {token}',
        requestBody: `{
  "query": "SELECT p.id, p.name, p.price, p.category, b.name as brand, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count FROM products p JOIN brands b ON p.brand_id = b.id LEFT JOIN reviews r ON p.id = r.product_id WHERE p.price BETWEEN :min_price AND :max_price AND p.category IN (:categories) GROUP BY p.id HAVING avg_rating >= :min_rating ORDER BY avg_rating DESC, review_count DESC LIMIT :limit OFFSET :offset",
  "params": {
    "min_price": 100,
    "max_price": 1000,
    "categories": ["Electronics", "Computers", "Audio"],
    "min_rating": 4.0,
    "limit": 10,
    "offset": 0
  },
  "options": {
    "timeout": 5000,
    "useCache": true,
    "cacheExpiry": 300
  }
}`,
        example: `{
  "results": [
    {
      "id": 12345,
      "name": "Premium Wireless Headphones",
      "price": 349.99,
      "category": "Audio",
      "brand": "Sony",
      "avg_rating": 4.8,
      "review_count": 1245
    },
    {
      "id": 23456,
      "name": "Ultra-Thin Laptop",
      "price": 899.99,
      "category": "Computers",
      "brand": "Apple",
      "avg_rating": 4.7,
      "review_count": 987
    },
    {
      "id": 34567,
      "name": "Noise-Cancelling Earbuds",
      "price": 199.99,
      "category": "Audio",
      "brand": "Bose",
      "avg_rating": 4.6,
      "review_count": 876
    },
    {
      "id": 45678,
      "name": "Smart Speaker",
      "price": 129.99,
      "category": "Audio",
      "brand": "Amazon",
      "avg_rating": 4.5,
      "review_count": 1543
    },
    {
      "id": 56789,
      "name": "Gaming Laptop",
      "price": 999.99,
      "category": "Computers",
      "brand": "Asus",
      "avg_rating": 4.5,
      "review_count": 654
    }
  ],
  "metadata": {
    "query": {
      "executionTimeMs": 45,
      "rowsExamined": 1250,
      "rowsReturned": 5
    },
    "pagination": {
      "limit": 10,
      "offset": 0,
      "totalRows": 28,
      "hasMore": true
    },
    "cache": {
      "hit": false,
      "stored": true,
      "expiresAt": "2023-04-01T11:25:00Z"
    }
  }
}`
      }
    ],
    analytics: [
      {
        method: 'GET',
        endpoint: '/api/analytics/dashboard',
        description: 'Get dashboard analytics data',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        headers: 'Authorization: Bearer {token}',
        example: `{
  "summary": {
    "totalUsers": 15482,
    "activeUsers": 8721,
    "totalRevenue": 287549.99,
    "conversionRate": 3.2,
    "timeframe": "last_30_days"
  },
  "trends": {
    "userGrowth": [
      {"date": "2023-03-01", "value": 15100},
      {"date": "2023-03-08", "value": 15200},
      {"date": "2023-03-15", "value": 15300},
      {"date": "2023-03-22", "value": 15400},
      {"date": "2023-03-29", "value": 15482}
    ],
    "revenue": [
      {"date": "2023-03-01", "value": 280000.00},
      {"date": "2023-03-08", "value": 282500.00},
      {"date": "2023-03-15", "value": 284000.00},
      {"date": "2023-03-22", "value": 286000.00},
      {"date": "2023-03-29", "value": 287549.99}
    ],
    "topProducts": [
      {"id": 123, "name": "Premium Headphones", "sales": 1245},
      {"id": 456, "name": "Wireless Keyboard", "sales": 987},
      {"id": 789, "name": "Smartphone Case", "sales": 876},
      {"id": 101, "name": "USB-C Cable", "sales": 765},
      {"id": 112, "name": "Bluetooth Speaker", "sales": 654}
    ]
  },
  "userSegmentation": {
    "byAge": [
      {"segment": "18-24", "percentage": 22},
      {"segment": "25-34", "percentage": 38},
      {"segment": "35-44", "percentage": 25},
      {"segment": "45-54", "percentage": 10},
      {"segment": "55+", "percentage": 5}
    ],
    "byLocation": [
      {"country": "United States", "users": 7500},
      {"country": "United Kingdom", "users": 2300},
      {"country": "Canada", "users": 1800},
      {"country": "Australia", "users": 1200},
      {"country": "Germany", "users": 950},
      {"country": "Other", "users": 1732}
    ],
    "byDevice": [
      {"device": "Mobile", "percentage": 68},
      {"device": "Desktop", "percentage": 27},
      {"device": "Tablet", "percentage": 5}
    ]
  },
  "timestamp": "2023-03-30T08:30:00Z",
  "dataQuality": {
    "completeness": 99.8,
    "accuracy": 98.5
  }
}`
      },
      {
        method: 'GET',
        endpoint: '/api/analytics/user-behavior',
        description: 'Get user behavior analytics',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        headers: 'Authorization: Bearer {token}',
        example: `{
  "sessionMetrics": {
    "averageSessionDuration": 340,
    "bounceRate": 32.5,
    "pageViewsPerSession": 4.2,
    "totalSessions": 45678
  },
  "userFlows": [
    {
      "path": "Home > Products > Product Detail > Cart > Checkout",
      "frequency": 3245,
      "conversionRate": 2.8
    },
    {
      "path": "Home > Search > Product Detail > Cart > Checkout",
      "frequency": 2876,
      "conversionRate": 3.1
    },
    {
      "path": "Home > Categories > Category Page > Product Detail > Cart",
      "frequency": 1987,
      "conversionRate": 1.9
    }
  ],
  "heatmapData": {
    "clicks": [
      {"selector": "#main-nav", "count": 12543},
      {"selector": ".product-card", "count": 34521},
      {"selector": ".add-to-cart-button", "count": 8765},
      {"selector": "#search-bar", "count": 23456}
    ],
    "scrollDepth": [
      {"depth": "25%", "percentage": 95},
      {"depth": "50%", "percentage": 80},
      {"depth": "75%", "percentage": 65},
      {"depth": "100%", "percentage": 40}
    ]
  },
  "featureUsage": [
    {"feature": "Search", "usageCount": 34567, "uniqueUsers": 12345},
    {"feature": "Filters", "usageCount": 23456, "uniqueUsers": 9876},
    {"feature": "Wishlist", "usageCount": 12345, "uniqueUsers": 5432},
    {"feature": "Reviews", "usageCount": 7654, "uniqueUsers": 3456}
  ],
  "timeframe": "last_30_days",
  "timestamp": "2023-03-30T08:30:00Z"
}`
      },
      {
        method: 'POST',
        endpoint: '/api/analytics/custom-report',
        description: 'Generate a custom analytics report',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        headers: 'Authorization: Bearer {token}',
        requestBody: `{
  "timeframe": {
    "start": "2023-01-01T00:00:00Z",
    "end": "2023-03-31T23:59:59Z"
  },
  "metrics": ["user_growth", "revenue", "conversion_rate", "average_order_value"],
  "dimensions": ["date", "device_type", "user_segment", "product_category"],
  "filters": [
    {
      "dimension": "user_segment",
      "operator": "in",
      "values": ["new_users", "returning_users"]
    },
    {
      "dimension": "product_category",
      "operator": "in",
      "values": ["electronics", "accessories"]
    }
  ],
  "sort": [
    {
      "metric": "revenue",
      "direction": "desc"
    }
  ],
  "limit": 1000,
  "format": "json"
}`,
        example: `{
  "reportId": "cust-rep-2023-04-01-12345",
  "generatedAt": "2023-04-01T10:15:30Z",
  "parameters": {
    "timeframe": {
      "start": "2023-01-01T00:00:00Z",
      "end": "2023-03-31T23:59:59Z"
    },
    "metrics": ["user_growth", "revenue", "conversion_rate", "average_order_value"],
    "dimensions": ["date", "device_type", "user_segment", "product_category"],
    "filters": [
      {
        "dimension": "user_segment",
        "operator": "in",
        "values": ["new_users", "returning_users"]
      },
      {
        "dimension": "product_category",
        "operator": "in",
        "values": ["electronics", "accessories"]
      }
    ],
    "sort": [
      {
        "metric": "revenue",
        "direction": "desc"
      }
    ]
  },
  "data": [
    {
      "date": "2023-03-15",
      "device_type": "mobile",
      "user_segment": "returning_users",
      "product_category": "electronics",
      "user_growth": 2.3,
      "revenue": 12500.50,
      "conversion_rate": 4.2,
      "average_order_value": 85.75
    },
    {
      "date": "2023-02-28",
      "device_type": "desktop",
      "user_segment": "returning_users",
      "product_category": "electronics",
      "user_growth": 1.8,
      "revenue": 10200.25,
      "conversion_rate": 3.8,
      "average_order_value": 92.30
    }
    // ... more data rows (truncated for brevity)
  ],
  "summary": {
    "totalRows": 1000,
    "aggregates": {
      "user_growth_avg": 1.9,
      "revenue_sum": 287549.99,
      "conversion_rate_avg": 3.2,
      "average_order_value_avg": 78.50
    }
  },
  "links": {
    "csv_download": "/api/analytics/reports/cust-rep-2023-04-01-12345/download?format=csv",
    "xlsx_download": "/api/analytics/reports/cust-rep-2023-04-01-12345/download?format=xlsx"
  }
}`
      }
    ],
    payments: [
      {
        method: 'POST',
        endpoint: '/api/payments/process',
        description: 'Process a payment',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        headers: 'Authorization: Bearer {token}',
        requestBody: `{
  "amount": 99.99,
  "currency": "USD",
  "paymentMethod": {
    "type": "credit_card",
    "cardNumber": "4111111111111111",
    "expiryMonth": 12,
    "expiryYear": 2025,
    "cvv": "123",
    "cardholderName": "John Doe"
  },
  "customer": {
    "id": "cust_12345",
    "email": "john.doe@example.com",
    "billingAddress": {
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94103",
      "country": "US"
    }
  },
  "metadata": {
    "orderId": "order_67890",
    "products": [
      {
        "id": "prod_12345",
        "name": "Premium Headphones",
        "quantity": 1,
        "unitPrice": 79.99
      },
      {
        "id": "prod_23456",
        "name": "Shipping",
        "quantity": 1,
        "unitPrice": 9.99
      },
      {
        "id": "prod_34567",
        "name": "Tax",
        "quantity": 1,
        "unitPrice": 10.01
      }
    ]
  },
  "idempotencyKey": "payment_req_12345_20230401_101530"
}`,
        example: `{
  "id": "pay_987654321",
  "status": "succeeded",
  "amount": 99.99,
  "currency": "USD",
  "paymentMethod": {
    "type": "credit_card",
    "last4": "1111",
    "brand": "Visa",
    "expiryMonth": 12,
    "expiryYear": 2025,
    "cardholderName": "John Doe"
  },
  "customer": {
    "id": "cust_12345",
    "email": "john.doe@example.com"
  },
  "metadata": {
    "orderId": "order_67890"
  },
  "receiptUrl": "https://example.com/receipts/pay_987654321",
  "createdAt": "2023-04-01T10:15:30Z",
  "updatedAt": "2023-04-01T10:15:35Z",
  "transactionDetails": {
    "authorizationCode": "AUTH123456",
    "processorResponseCode": "approved",
    "avsResult": "Y",
    "cvvResult": "M",
    "riskScore": 15
  }
}`
      },
      {
        method: 'GET',
        endpoint: '/api/payments/{paymentId}',
        description: 'Get payment details',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        headers: 'Authorization: Bearer {token}',
        example: `{
  "id": "pay_987654321",
  "status": "succeeded",
  "amount": 99.99,
  "currency": "USD",
  "paymentMethod": {
    "type": "credit_card",
    "last4": "1111",
    "brand": "Visa",
    "expiryMonth": 12,
    "expiryYear": 2025,
    "cardholderName": "John Doe"
  },
  "customer": {
    "id": "cust_12345",
    "email": "john.doe@example.com",
    "billingAddress": {
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94103",
      "country": "US"
    }
  },
  "metadata": {
    "orderId": "order_67890",
    "products": [
      {
        "id": "prod_12345",
        "name": "Premium Headphones",
        "quantity": 1,
        "unitPrice": 79.99
      },
      {
        "id": "prod_23456",
        "name": "Shipping",
        "quantity": 1,
        "unitPrice": 9.99
      },
      {
        "id": "prod_34567",
        "name": "Tax",
        "quantity": 1,
        "unitPrice": 10.01
      }
    ]
  },
  "receiptUrl": "https://example.com/receipts/pay_987654321",
  "refunds": [],
  "disputes": [],
  "createdAt": "2023-04-01T10:15:30Z",
  "updatedAt": "2023-04-01T10:15:35Z",
  "transactionDetails": {
    "authorizationCode": "AUTH123456",
    "processorResponseCode": "approved",
    "avsResult": "Y",
    "cvvResult": "M",
    "riskScore": 15,
    "processorName": "Stripe",
    "paymentNetwork": "Visa"
  }
}`
      },
      {
        method: 'POST',
        endpoint: '/api/payments/{paymentId}/refund',
        description: 'Refund a payment',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: true,
        headers: 'Authorization: Bearer {token}',
        requestBody: `{
  "amount": 99.99,
  "reason": "customer_requested",
  "metadata": {
    "refundRequestId": "refund_req_12345",
    "notes": "Customer was not satisfied with the product"
  },
  "idempotencyKey": "refund_req_12345_20230401_111530"
}`,
        example: `{
  "id": "ref_123456789",
  "paymentId": "pay_987654321",
  "amount": 99.99,
  "currency": "USD",
  "status": "succeeded",
  "reason": "customer_requested",
  "metadata": {
    "refundRequestId": "refund_req_12345",
    "notes": "Customer was not satisfied with the product"
  },
  "createdAt": "2023-04-01T11:15:30Z",
  "updatedAt": "2023-04-01T11:15:35Z",
  "transactionDetails": {
    "processorResponseCode": "approved",
    "processorRefundId": "ref_processor_123456"
  }
}`
      }
    ],
    search: [
      {
        method: 'GET',
        endpoint: '/api/search',
        description: 'Search for products with advanced filtering',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: false,
        example: `{
  "query": "headphones wireless",
  "filters": {
    "price": {
      "min": 50,
      "max": 300
    },
    "categories": ["electronics", "audio"],
    "brands": ["sony", "bose", "sennheiser"],
    "ratings": {
      "min": 4
    },
    "inStock": true
  },
  "sort": {
    "field": "relevance",
    "direction": "desc"
  },
  "pagination": {
    "page": 1,
    "perPage": 20,
    "totalItems": 42,
    "totalPages": 3
  },
  "results": [
    {
      "id": "prod_12345",
      "name": "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
      "description": "Industry-leading noise cancellation with Dual Noise Sensor technology",
      "price": 279.99,
      "salePrice": 249.99,
      "currency": "USD",
      "category": "electronics",
      "subCategory": "audio",
      "brand": "Sony",
      "rating": 4.8,
      "reviewCount": 1245,
      "images": [
        {
          "url": "https://example.com/images/sony-wh1000xm4-1.jpg",
          "alt": "Sony WH-1000XM4 Front View",
          "isPrimary": true
        },
        {
          "url": "https://example.com/images/sony-wh1000xm4-2.jpg",
          "alt": "Sony WH-1000XM4 Side View",
          "isPrimary": false
        }
      ],
      "inStock": true,
      "stockCount": 42,
      "attributes": {
        "color": "Black",
        "connectivity": "Bluetooth 5.0",
        "batteryLife": "30 hours",
        "noiseCancellation": true,
        "weight": "254g"
      },
      "url": "/products/sony-wh-1000xm4-wireless-noise-canceling-headphones",
      "relevanceScore": 0.95
    },
    {
      "id": "prod_23456",
      "name": "Bose QuietComfort 45 Wireless Noise Cancelling Headphones",
      "description": "High-fidelity audio with adjustable EQ and noise cancellation",
      "price": 329.99,
      "salePrice": null,
      "currency": "USD",
      "category": "electronics",
      "subCategory": "audio",
      "brand": "Bose",
      "rating": 4.7,
      "reviewCount": 987,
      "images": [
        {
          "url": "https://example.com/images/bose-qc45-1.jpg",
          "alt": "Bose QuietComfort 45 Front View",
          "isPrimary": true
        }
      ],
      "inStock": true,
      "stockCount": 28,
      "attributes": {
        "color": "White",
        "connectivity": "Bluetooth 5.1",
        "batteryLife": "24 hours",
        "noiseCancellation": true,
        "weight": "240g"
      },
      "url": "/products/bose-quietcomfort-45-wireless-noise-cancelling-headphones",
      "relevanceScore": 0.92
    }
    // ... more results (truncated for brevity)
  ],
  "facets": {
    "categories": [
      {"value": "electronics", "count": 42},
      {"value": "audio", "count": 42}
    ],
    "brands": [
      {"value": "sony", "count": 12},
      {"value": "bose", "count": 10},
      {"value": "sennheiser", "count": 8},
      {"value": "apple", "count": 5},
      {"value": "jabra", "count": 4},
      {"value": "other", "count": 3}
    ],
    "price": {
      "min": 49.99,
      "max": 549.99,
      "ranges": [
        {"range": "0-100", "count": 8},
        {"range": "100-200", "count": 15},
        {"range": "200-300", "count": 12},
        {"range": "300+", "count": 7}
      ]
    },
    "ratings": [
      {"value": 5, "count": 12},
      {"value": 4, "count": 25},
      {"value": 3, "count": 5},
      {"value": 2, "count": 0},
      {"value": 1, "count": 0}
    ],
    "attributes": {
      "color": [
        {"value": "black", "count": 20},
        {"value": "white", "count": 12},
        {"value": "blue", "count": 5},
        {"value": "silver", "count": 5}
      ],
      "connectivity": [
        {"value": "bluetooth 5.0", "count": 18},
        {"value": "bluetooth 5.1", "count": 12},
        {"value": "bluetooth 4.2", "count": 8},
        {"value": "wired", "count": 4}
      ],
      "noiseCancellation": [
        {"value": true, "count": 32},
        {"value": false, "count": 10}
      ]
    }
  },
  "relatedSearches": [
    "wireless earbuds",
    "noise cancelling headphones",
    "sony headphones",
    "bluetooth headphones"
  ],
  "correctedQuery": null,
  "processingTimeMs": 125
}`
      },
      {
        method: 'POST',
        endpoint: '/api/search/autocomplete',
        description: 'Get search autocomplete suggestions',
        responseType: 'JSON Object',
        statusCode: 200,
        requiresAuth: false,
        requestBody: `{
  "query": "head",
  "limit": 10,
  "types": ["product", "category", "brand", "suggestion"]
}`,
        example: `{
  "query": "head",
  "suggestions": [
    {
      "type": "product",
      "text": "headphones",
      "highlighted": "<strong>head</strong>phones",
      "url": "/search?q=headphones",
      "score": 0.95,
      "metadata": {
        "productCount": 42
      }
    },
    {
      "type": "product",
      "text": "headsets",
      "highlighted": "<strong>head</strong>sets",
      "url": "/search?q=headsets",
      "score": 0.85,
      "metadata": {
        "productCount": 28
      }
    },
    {
      "type": "product",
      "text": "headbands",
      "highlighted": "<strong>head</strong>bands",
      "url": "/search?q=headbands",
      "score": 0.75,
      "metadata": {
        "productCount": 15
      }
    },
    {
      "type": "category",
      "text": "headphones & earbuds",
      "highlighted": "<strong>head</strong>phones & earbuds",
      "url": "/category/headphones-earbuds",
      "score": 0.90,
      "metadata": {
        "productCount": 65
      }
    },
    {
      "type": "brand",
      "text": "Headrush",
      "highlighted": "<strong>Head</strong>rush",
      "url": "/brand/headrush",
      "score": 0.70,
      "metadata": {
        "productCount": 8
      }
    },
    {
      "type": "suggestion",
      "text": "headphones with microphone",
      "highlighted": "<strong>head</strong>phones with microphone",
      "url": "/search?q=headphones+with+microphone",
      "score": 0.80,
      "metadata": {
        "productCount": 24
      }
    }
  ],
  "processingTimeMs": 28
}`
      }
    ],
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
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
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
                <div className="ad-sidebar mt-6" aria-label="Advertisement Space">
                  <span className="sr-only">Advertisement Space</span>
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
                          {(() => {
                            try {
                              // Parse the JSON string
                              const jsonObj = JSON.parse(endpoint.example);
                              // Format it with proper indentation
                              return JSON.stringify(jsonObj, null, 2);
                            } catch (e) {
                              // If parsing fails, return the original string
                              return endpoint.example;
                            }
                          })()}
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
      <div className="ad-banner" aria-label="Advertisement Space">
        <span className="sr-only">Advertisement Space</span>
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
