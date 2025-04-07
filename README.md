# Todo Application

A full-stack todo application built with React.js, Express.js, MySQL, and Ant Design.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Running Locally](#running-locally)
  - [Running with Docker](#running-with-docker)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create new todo items
- View recent todo items
- Mark todos as complete
- User-friendly interface with Ant Design components
- Form validation using React Hook Form
- Persistent storage with MySQL database
- Containerized setup using Docker

## Technologies Used

### Frontend
- **React.js**: JavaScript library for building user interfaces
- **Ant Design**: UI library with pre-designed components
- **React Hook Form**: Form validation and handling
- **Axios**: HTTP client for API requests

### Backend
- **Express.js**: Web application framework for Node.js
- **MySQL**: Relational database for data storage
- **Sequelize**: ORM for database interactions

### DevOps
- **Docker**: Containerization platform
- **Docker Compose**: Tool for defining and running multi-container Docker applications

## Prerequisites

Before running the application, make sure you have the following installed:

- **For local development:**
  - Node.js (v14 or higher)
  - npm or yarn
  - MySQL

- **For Docker deployment:**
  - Docker
  - Docker Compose

## Getting Started

### Running Locally

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

#### 2. Set up the backend
```bash
cd backend

# Install dependencies
npm install

# Create a .env file with the following variables
# DATABASE_NAME=todo_db
# DATABASE_USER=root
# DATABASE_PASSWORD=your_password
# DATABASE_HOST=localhost
# PORT=5000

# Run migrations
npx sequelize-cli db:migrate

# Start the server
npm start
```

#### 3. Set up the frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Create a .env file with the backend URL
# REACT_APP_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

#### 4. Access the application
Open your browser and navigate to `http://localhost:3000`

### Running with Docker

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

#### 2. Create environment files

Create a `.env` file in the root directory with the following variables:
```
MYSQL_DATABASE=todo_db
MYSQL_ROOT_PASSWORD=your_password
MYSQL_USER=user
MYSQL_PASSWORD=password
BACKEND_PORT=5000
FRONTEND_PORT=3000
```

#### 3. Build and run with Docker Compose
```bash
# Build and start containers
docker-compose up --build

# To run in detached mode
docker-compose up -d
```

#### 4. Access the application
Open your browser and navigate to `http://localhost:3000`

#### 5. Stopping the containers
```bash
# If running in foreground, press Ctrl+C
# If running in detached mode
docker-compose down
```

## Project Structure
```
todo-app/
├── backend/              # Express.js backend
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── config/           # Configuration files
│   ├── Dockerfile        # Backend Docker configuration
│   └── server.js         # Main entry point
├── frontend/             # React.js frontend
│   ├── public/           # Static files
│   ├── src/              # Source code
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main component
│   ├── Dockerfile        # Frontend Docker configuration
│   └── package.json      # Dependencies
├── docker-compose.yml    # Docker Compose configuration
└── README.md             # Project documentation
```

## API Endpoints

### Todos
- `GET /api/todos/recent` - Get 5 most recent todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id/complete` - Mark a todo as complete
