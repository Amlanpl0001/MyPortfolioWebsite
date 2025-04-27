# Installation Guide

This document provides detailed instructions for setting up and running the Portfolio Website project.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **Python** (v3.9 or higher)
- **pip** (latest version)
- **Docker** and **Docker Compose** (for containerized deployment)

### Verifying Prerequisites

Run these commands to verify your installed versions:

#### Windows (PowerShell)
```powershell
node --version
npm --version
python --version
pip --version
docker --version
docker-compose --version
```

#### Linux/Mac (Bash)
```bash
node --version
npm --version
python --version
pip --version
docker --version
docker-compose --version
```

## Local Development Setup

### Frontend Setup

#### Windows (PowerShell)

1. Navigate to the frontend directory:
   ```powershell
   cd .\frontend\
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm start
   ```

4. The frontend will be available at http://localhost:3000

#### Linux/Mac (Bash)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend will be available at http://localhost:3000

#### Verification

To verify the frontend is running correctly:
- Open your browser and navigate to http://localhost:3000
- You should see the homepage of the portfolio website
- Try navigating to the Automation Lab section (you'll need to log in)
- Use the demo credentials displayed on the login page:
  - Admin: admin@example.com / admin123
  - Practice User: practice@example.com / practice123

### Backend Setup

#### Windows (PowerShell)

1. Navigate to the backend directory:
   ```powershell
   cd .\backend\
   ```

2. Create a virtual environment:
   ```powershell
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

   Note: If you encounter execution policy errors, you may need to run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   ```

4. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

5. Start the backend server:
   ```powershell
   uvicorn main:app --reload
   ```

#### Linux/Mac (Bash)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

#### Verification

The backend API will be available at http://localhost:8000

To verify the backend is running correctly:
- Open your browser and navigate to http://localhost:8000/docs
- You should see the Swagger UI documentation for the API
- Try making a test request to one of the endpoints
- Ensure the frontend can connect to the backend by logging in and accessing protected features

## Docker Deployment

For a production-ready deployment, you can use Docker:

### Windows (PowerShell)

1. Make sure Docker Desktop is running

2. Navigate to the project root directory:
   ```powershell
   cd <project_root_path>
   ```

3. Build and start the containers:
   ```powershell
   docker-compose up -d --build
   ```

4. Check the status of the containers:
   ```powershell
   docker-compose ps
   ```

### Linux/Mac (Bash)

1. Make sure Docker service is running:
   ```bash
   sudo systemctl status docker
   ```

2. Navigate to the project root directory:
   ```bash
   cd <project_root_path>
   ```

3. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```

4. Check the status of the containers:
   ```bash
   docker-compose ps
   ```

### Verification

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

To verify the Docker deployment:
1. Open your browser and navigate to http://localhost
2. Ensure the website loads correctly
3. Test the login functionality with the demo credentials
4. Navigate to the Automation Lab and test the various features
5. Check the API documentation at http://localhost:8000/docs

### Stopping Docker Containers

To stop the Docker containers:

#### Windows (PowerShell)
```powershell
docker-compose down
```

#### Linux/Mac (Bash)
```bash
docker-compose down
```

## Environment Variables

The following environment variables can be configured:

### Frontend

Create a `.env` file in the frontend directory with the following variables:

```env
REACT_APP_API_URL=http://localhost:8000
```

### Backend

Create a `.env` file in the backend directory with the following variables:

```env
DATABASE_URL=postgresql://user:password@db:5432/portfolio
SECRET_KEY=your_secret_key_here
CORS_ORIGINS=http://localhost:3000
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: If you already have services running on ports 3000 or 8000, you can change the ports:
   - Frontend: Edit the `package.json` file and add `"start": "PORT=3001 react-scripts start"` to the scripts section
   - Backend: Run with:
     ```bash
     uvicorn main:app --reload --port 8001
     ```

2. **Database connection issues**: Ensure your PostgreSQL server is running and the credentials in the `.env` file are correct.

3. **Node modules issues**: If you encounter problems with node modules, try deleting the `node_modules` folder and running `npm install` again.

## Testing

### Running Tests

#### Windows (PowerShell)

1. Navigate to the frontend directory:
   ```powershell
   cd .\frontend\
   ```

2. Run the tests:
   ```powershell
   npm test
   ```

3. Generate a coverage report:
   ```powershell
   npm test -- --coverage
   ```

#### Linux/Mac (Bash)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Run the tests:
   ```bash
   npm test
   ```

3. Generate a coverage report:
   ```bash
   npm test -- --coverage
   ```

## New Features

The project includes several enhanced features for testing practice and improved user experience:

### UI/UX Enhancements

- **Dark Mode**: Toggle between light and dark themes using contrast ratio-optimized color scheme
- **Pagination**: Browse through blog posts with pagination support
- **Search and Filtering**: Find specific blog posts using search and filtering options
- **Improved Text Visibility**: Better contrast ratios for text in both light and dark modes
- **Smooth Transitions**: Enhanced animations and transitions between pages and states

### E-cart Search and Sort Functionality

The Project Playground (Mini E-commerce Store) now includes:
- Advanced search functionality
- Price range filtering
- Product type filtering
- Target audience filtering (men, women, children)
- Dynamic product display with position changes on reload
- Recommended products section based on product selection
- Enhanced UI with new filtering and sorting options

To access these features:
1. Log in with the demo credentials
2. Navigate to Automation Lab > Project Playground
3. Explore the search and filtering options in the Mini E-commerce Store

### Enhanced API Playground

The API Playground now includes:
- Complex queries with professional-level request/response payloads
- Advanced query section with GraphQL-style queries
- Batch operations for multiple requests in a single call
- Complex data aggregation endpoints
- JSON operations and dynamic pivoting

To access these features:
1. Log in with the demo credentials
2. Navigate to Automation Lab > API Playground
3. Explore the various API categories and endpoints

### Complex Database Queries

The Database Playground now includes:
- Advanced SQL queries demonstrating complex database operations
- Window functions for analytics
- Common Table Expressions (CTEs)
- Recursive queries
- JSON operations
- Dynamic pivoting
- Analytics database schema with complex queries

To access these features:
1. Log in with the demo credentials
2. Navigate to Automation Lab > Database Playground
3. Select a database schema and explore the sample queries

## Next Steps

After installation, refer to the [Project Documentation](PROJECT_DETAILS.md) for details on the project structure and features.
