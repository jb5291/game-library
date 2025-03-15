
# Game Library API

A RESTful API for managing your video game collection. Built with Node.js, Express, and MongoDB. WIP, all endpoints are not implemented.


## 📋 Table of Contents


- [Features](#features)

- [Tech Stack](#tech-stack)

- [Getting Started](#getting-started)

  - [Prerequisites](#prerequisites)

  - [Installation](#installation)

  - [Environment Variables](#environment-variables)

- [API Endpoints](#api-endpoints)

- [Authentication](#authentication)

- [Database Schema](#database-schema)

- [Docker Deployment](#docker-deployment)

- [Development](#development)

- [Testing](#testing)

- [Production Deployment](#production-deployment)

- [Contributing](#contributing)

- [License](#license)

## ✨ Features

- **User Authentication**: Secure JWT-based authentication

- **Game Management**: CRUD operations for video games

- **Game Collections**: Organize games into custom collections

- **Search & Filter**: Find games by title, genre, platform, etc.

- **User Profiles**: Track game progress and personal ratings

- **RESTful API**: Well-documented API endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js

- **Framework**: Express.js

- **Database**: MongoDB

- **Authentication**: JWT (JSON Web Tokens)

- **Containerization**: Docker

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)

- MongoDB (v4.4 or higher)

- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/game-library-api.git
   cd game-library-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Start the development server:
   ```bash
   npm run dev
   ```
The API will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/gametracker

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=7d
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user

- `POST /api/auth/login` - Login and get JWT token

- `GET /api/auth/me` - Get current user profile

### Games

- `GET /api/games` - Get all games

- `GET /api/games/:id` - Get a specific game

- `POST /api/games` - Create a new game

- `PUT /api/games/:id` - Update a game

- `DELETE /api/games/:id` - Delete a game

### Collections

- `GET /api/collections` - Get user's collections

- `GET /api/collections/:id` - Get a specific collection

- `POST /api/collections` - Create a new collection

- `PUT /api/collections/:id` - Update a collection

- `DELETE /api/collections/:id` - Delete a collection

- `POST /api/collections/:id/games` - Add games to a collection

- `DELETE /api/collections/:id/games/:gameId` - Remove a game from a collection

### User Profiles

- `GET /api/profile` - Get user's profile

- `PUT /api/profile` - Update user's profile

- `GET /api/profile/games` - Get user's games

- `PUT /api/profile/games/:id` - Update game progress/status

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Register or login to get a JWT token

2. Include the token in the Authorization header of your requests:
   ```
   Authorization: Bearer your_token_here
   ```

## 📊 Database Schema

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Game
```javascript
{
  title: String,
  description: String,
  genre: [String],
  platform: [String],
  developer: String,
  publisher: String,
  releaseDate: Date,
  imageUrl: String,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

### Collection
```javascript
{
  name: String,
  description: String,
  games: [ObjectId (Game)],
  user: ObjectId (User),
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### UserGame
```javascript
{
  user: ObjectId (User),
  game: ObjectId (Game),
  status: String (enum: ['backlog', 'playing', 'completed', 'abandoned']),
  rating: Number (1-5),
  playTime: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🐳 Docker Deployment

### Using Docker Compose

1. Make sure Docker and Docker Compose are installed on your system

2. Run the application:
   ```bash
   docker-compose up -d
   ```

The API will be available at `http://localhost:3000`.

### Building the Docker Image

```bash
docker build -t game-library-api .
```

### Running the Container

```bash
docker run -p 3000:3000 --env-file .env game-library-api
```

## 💻 Development

### Code Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── validation/     # Request validation schemas
└── index.ts        # Application entry point
```

### Available Scripts

- `npm run dev` - Start development server with hot-reload

- `npm run build` - Build for production

- `npm start` - Start production server

- `npm run lint` - Run ESLint

- `npm run format` - Format code with Prettier

- `npm test` - Run tests

## 🧪 Testing

This project uses Jest for testing. Run the tests with:

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

## 🌍 Production Deployment

For production deployment, follow these steps:

2. Build the application:
   ```bash
   npm run build
   ```
3. Start the server:
   ```bash
   npm start
   ```

### Using PM2 (recommended)

```bash
npm install -g pm2
pm2 start dist/index.js --name game-library-api
```

## 🤝 Contributing

1. Fork the repository

2. Create your feature branch (`git checkout -b feature/amazing-feature`)

3. Commit your changes (`git commit -m 'Add some amazing feature'`)

4. Push to the branch (`git push origin feature/amazing-feature`)

5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ and Cursor by [jb5291](https://github.com/jb5291)
