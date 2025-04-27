# Installation and Setup Guide

This guide provides detailed instructions for setting up and running the Personal Portfolio Website project, both for development and production environments.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Git**: [Install Git](https://git-scm.com/downloads)

For local development without Docker, you'll also need:

- **Node.js** (v16 or later): [Install Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Python** (v3.9 or later): [Install Python](https://www.python.org/downloads/)
- **pip** (comes with Python)

## Quick Start with Docker

The fastest way to get the application running is using Docker Compose:

1. Clone the repository:
   ```bash
   git clone https://github.com/Amlanpl0001/MyPortfolioWebsite.git
   cd MyPortfolioWebsite
   ```

2. Start the application in development mode (with hot reloading):
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Detailed Setup Instructions

### Development Environment

#### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/Amlanpl0001/MyPortfolioWebsite.git
   cd MyPortfolioWebsite
   ```

2. Start the application in development mode:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
   ```

   This will:
   - Build and start the frontend container with hot reloading
   - Build and start the backend container with hot reloading
   - Start a PostgreSQL database container
   - Set up the necessary network connections between containers

3. View logs (optional):
   ```bash
   docker-compose logs -f
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

5. Make changes to the code:
   - Frontend changes in the `frontend/src` directory will automatically trigger a rebuild
   - Backend changes in the `backend` directory will automatically trigger a reload

6. Stop the application:
   ```bash
   docker-compose down
   ```

#### Local Development (Without Docker)

##### Frontend Setup

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

##### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

5. The backend API will be available at http://localhost:8000

### Production Deployment

For production deployment, use the standard Docker Compose configuration:

1. Clone the repository:
   ```bash
   git clone https://github.com/Amlanpl0001/MyPortfolioWebsite.git
   cd MyPortfolioWebsite
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Testing

### Running Backend Tests

To run the backend tests:

```bash
docker-compose exec backend pytest
```

To run tests with coverage report:

```bash
docker-compose exec backend pytest --cov=main
```

### Running Frontend Tests

To run the frontend tests:

```bash
docker-compose exec frontend npm test
```

To run tests with coverage report:

```bash
docker-compose exec frontend npm test -- --coverage
```

## Environment Variables

The application uses the following environment variables, which can be configured in a `.env` file:

### Backend Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (default: `postgresql://postgres:postgres@db:5432/portfolio`)
- `SECRET_KEY`: Secret key for JWT token generation (default: `your-secret-key-change-in-production`)

### Frontend Environment Variables

- `REACT_APP_API_URL`: Backend API URL (default: `http://localhost:8000`)

## Project Structure

```
MyPortfolioWebsite/
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── Dockerfile           # Production Docker config
│   ├── Dockerfile.dev       # Development Docker config
│   └── nginx.conf           # Nginx configuration
├── backend/                 # FastAPI backend
│   ├── main.py              # Main application file
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend Docker config
├── docker-compose.yml       # Production Docker Compose config
└── docker-compose.override.yml # Development Docker Compose config
```

## Troubleshooting

### Common Issues

#### Container Fails to Start

If a container fails to start, check the logs:

```bash
docker-compose logs [service_name]
```

Where `[service_name]` is one of: `frontend`, `backend`, or `db`.

#### Database Connection Issues

If the backend cannot connect to the database, ensure the database container is running:

```bash
docker-compose ps
```

If the database container is running but the backend still cannot connect, check the database logs:

```bash
docker-compose logs db
```

#### Hot Reloading Not Working

If hot reloading is not working:

1. Ensure you're using the development configuration:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
   ```

2. Check the logs for any errors:
   ```bash
   docker-compose logs frontend
   docker-compose logs backend
   ```

3. Try restarting the containers:
   ```bash
   docker-compose restart frontend backend
   ```

#### Port Conflicts

If you see an error like "port is already allocated", you may have another service using the same port. You can either:

1. Stop the other service, or
2. Modify the port mapping in `docker-compose.yml` and `docker-compose.override.yml`

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)