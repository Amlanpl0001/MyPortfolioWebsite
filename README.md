# Personal Portfolio Website

A modern, responsive personal portfolio website with a blog and interactive Automation Lab for testing practice.

## Features

- **Portfolio Section**: Showcase professional profile, skills, experience, projects, and certifications
- **Reading Section (Blog)**: Share knowledge through articles on various topics
- **Automation Lab**: Interactive playground for testing practice, including:
  - Web Playground: Practice UI automation with forms and dynamic elements
  - API Playground: Test RESTful APIs with various endpoints
  - Database Playground: Write and execute SQL queries against sample databases
  - Project Playground: Mini e-commerce application for end-to-end testing
- **Authentication System**: Secure access to admin features and the Automation Lab
- **Responsive Design**: Works on all device sizes (mobile, tablet, desktop)
- **Modern UI**: Implements glassmorphism and neumorphism design patterns
- **Dark Mode Support**: Toggle between light and dark themes with optimized contrast ratios for accessibility
- **Pagination**: Browse through blog posts with pagination support

## Technologies Used

### Frontend
- React.js
- React Router
- Tailwind CSS
- Contrast ratio-optimized color scheme for accessibility
- Axios for API requests
- Marked for Markdown rendering
- TipTap for rich text editing

### Backend
- FastAPI (Python)
- JWT for authentication
- PostgreSQL database
- Pydantic for data validation

### Deployment
- Docker & Docker Compose
- Nginx for serving the frontend

## Installation and Setup

### Prerequisites
- Docker and Docker Compose
- Node.js and npm (for local development)
- Python 3.9+ (for local development)

### Local Development

#### Frontend
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The frontend will be available at http://localhost:3000

#### Backend
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Start the backend server:
   ```
   uvicorn main:app --reload
   ```

6. The backend API will be available at http://localhost:8000

### Docker Deployment

To deploy the entire application using Docker:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd MyPortfolio
   ```

2. Build and start the containers:
   ```
   docker-compose up -d
   ```

3. The application will be available at:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Usage

### Accessing the Portfolio and Blog
The Portfolio and Reading (Blog) sections are publicly accessible without authentication.

### Accessing the Automation Lab
The Automation Lab requires authentication. Use the following demo credentials:
- **Admin**: admin@example.com / admin123
- **Practice User**: practice@example.com / practice123

### Admin Features
As an admin, you can:
- Create, edit, and delete blog posts
- Manage practice users (create, delete)
- Access all areas of the Automation Lab

### Practice User Features
As a practice user, you can:
- Access all areas of the Automation Lab
- Practice automation testing on the various playgrounds

## Project Structure

```
MyPortfolio/
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   │   ├── Admin/       # Admin dashboard
│   │   │   ├── Auth/        # Authentication pages
│   │   │   ├── AutomationLab/ # Lab pages
│   │   │   ├── Home/        # Home page
│   │   │   ├── Portfolio/   # Portfolio page
│   │   │   └── Reading/     # Blog pages
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── Dockerfile           # Frontend Docker config
│   └── nginx.conf           # Nginx configuration
├── backend/                 # FastAPI backend
│   ├── main.py              # Main application file
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend Docker config
└── docker-compose.yml       # Docker Compose config
```

## Future Enhancements

- Integration with a real database for persistent data
- Enhanced admin dashboard with analytics
- More interactive features in the Automation Lab
- Security testing playground in the Automation Lab
- Comments or reactions on blog posts
- User profile customization
- Social media sharing for blog posts
- Email subscription for blog updates

## License

This project is licensed under the MIT License - see the LICENSE file for details.
