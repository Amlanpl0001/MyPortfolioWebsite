# Project Details

This document provides a comprehensive overview of the Portfolio Website project, including its architecture, features, and technical details.

## Project Overview

The Portfolio Website is a modern, responsive web application designed to showcase a professional profile, share knowledge through a blog, and provide an interactive Automation Lab for testing practice. The project follows a client-server architecture with a React frontend and a FastAPI backend.

## Features

### Portfolio Section
- Professional profile with skills, experience, projects, and certifications
- Downloadable resume in PDF format
- Contact information and hire me section

### Reading Section (Blog)
- Articles organized by topics
- Rich text content with TipTap editor for content creation
- Author information and related posts
- Pagination for browsing through multiple posts
- Search and filtering options for finding specific content

### Automation Lab
- **Web Playground**: Practice UI automation with forms and dynamic elements
  - Interactive forms with validation
  - Dynamic elements that change based on user interaction
  - Drag and drop functionality
  - Iframes and modals for complex UI testing scenarios

- **API Playground**: Test RESTful APIs with various endpoints
  - Multiple API categories (Users, Products, Orders, Auth, etc.)
  - Professional-level request/response payloads
  - Advanced query section with GraphQL-style queries
  - Batch operations for multiple requests in a single call
  - Complex data aggregation endpoints
  - JSON operations and dynamic pivoting

- **Database Playground**: Write and execute SQL queries against sample databases
  - Multiple database schemas (E-commerce, HR, Library, Analytics)
  - Sample queries for common operations
  - Advanced SQL queries demonstrating complex database operations
  - Window functions for analytics
  - Common Table Expressions (CTEs) and recursive queries
  - JSON operations and dynamic pivoting

- **Project Playground**: Mini e-commerce application for end-to-end testing
  - Complete shopping workflow (browse, search, add to cart, checkout)
  - Advanced search functionality
  - Price range filtering
  - Product type filtering
  - Target audience filtering (men, women, children)
  - Dynamic product display with position changes on reload
  - Recommended products section based on product selection
  - Enhanced UI with filtering and sorting options

### Authentication System
- Secure login for admin and practice users
- JWT-based authentication
- Role-based access control

### Admin Dashboard
- Blog post management (create, edit, delete)
- Practice user management
- Site statistics

### UI/UX Features
- Responsive design for all device sizes
- Dark mode toggle using contrast ratio-optimized color scheme
- Glassmorphism and neumorphism design patterns
- Smooth transitions and animations
- Accessible design with proper contrast ratios

## Technical Architecture

### Frontend Architecture

The frontend is built with React.js and follows a component-based architecture:

```
frontend/
├── public/              # Static files
├── src/                 # Source code
│   ├── components/      # Reusable components
│   │   ├── Footer/
│   │   ├── Header/
│   │   └── TipTapEditor/ # Rich text editor component
│   ├── contexts/        # React contexts
│   │   └── AuthContext.js # Authentication context
│   ├── pages/           # Page components
│   │   ├── Admin/       # Admin dashboard
│   │   ├── Auth/        # Authentication pages
│   │   ├── AutomationLab/ # Lab pages
│   │   ├── Home/        # Home page
│   │   ├── Portfolio/   # Portfolio page
│   │   └── Reading/     # Blog pages
│   ├── App.js           # Main app component
│   └── index.js         # Entry point
```

### Backend Architecture

The backend is built with FastAPI and follows a modular architecture:

```
backend/
├── app/                 # Application code
│   ├── api/             # API endpoints
│   │   ├── auth.py      # Authentication endpoints
│   │   ├── posts.py     # Blog post endpoints
│   │   └── users.py     # User management endpoints
│   ├── core/            # Core functionality
│   │   ├── config.py    # Configuration
│   │   └── security.py  # Security utilities
│   ├── db/              # Database
│   │   ├── models.py    # Database models
│   │   └── session.py   # Database session
│   └── schemas/         # Pydantic schemas
│       ├── post.py      # Post schemas
│       └── user.py      # User schemas
├── main.py              # Application entry point
└── requirements.txt     # Python dependencies
```

## Database Schema

The application uses a PostgreSQL database with the following tables:

### Users Table
- id (PK)
- email
- hashed_password
- full_name
- role (admin, practice)
- created_at
- updated_at

### Posts Table
- id (PK)
- title
- content
- snippet
- author_id (FK to Users)
- topic_id (FK to Topics)
- published
- created_at
- updated_at

### Topics Table
- id (PK)
- name
- description
- created_at
- updated_at

### Comments Table
- id (PK)
- content
- post_id (FK to Posts)
- author_id (FK to Users)
- created_at
- updated_at

## Authentication Flow

1. User submits login credentials
2. Backend validates credentials and generates JWT token
3. Token is stored in localStorage on the client
4. Token is included in Authorization header for protected API requests
5. Backend validates token for each protected request

## Deployment Architecture

The application is containerized using Docker and can be deployed using Docker Compose:

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  React Frontend  |---->|  FastAPI Backend |---->|  PostgreSQL DB   |
|  (Nginx)         |     |                  |     |                  |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
```

## System Requirements

### Minimum Requirements
- **CPU**: Dual-core processor, 2.0 GHz or higher
- **RAM**: 4 GB
- **Storage**: 1 GB free space
- **OS**: Windows 10, macOS 10.15, Ubuntu 20.04 or newer

### Recommended Requirements
- **CPU**: Quad-core processor, 2.5 GHz or higher
- **RAM**: 8 GB
- **Storage**: 2 GB free space
- **OS**: Latest version of Windows, macOS, or Linux

## Technologies Used

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Contrast ratio-optimized color scheme for theming and dark mode
- Axios for API requests
- TipTap for rich text editing
- Marked for Markdown rendering
- Jest and React Testing Library for testing

### Backend
- FastAPI (Python)
- JWT for authentication
- Pydantic for data validation
- SQLAlchemy for ORM
- PostgreSQL for database
- Pytest for testing

### DevOps
- Docker and Docker Compose for containerization
- Nginx for serving the frontend
- GitHub Actions for CI/CD (optional)

## Future Enhancements

Potential future enhancements for the project include:

1. **Theme Customization**: Allow users to customize the theme colors and appearance
2. **Comment System**: Add the ability for users to comment on blog posts
3. **Search Functionality**: Implement full-text search for blog posts
4. **Analytics Dashboard**: Add analytics tracking and reporting
5. **Multi-language Support**: Add support for multiple languages
6. **Mobile App**: Develop a companion mobile app using React Native

## Conclusion

This Portfolio Website project provides a comprehensive platform for showcasing professional work, sharing knowledge, and practicing automation testing. Its modular architecture allows for easy maintenance and future enhancements.
