# LancerNest API

Backend API for LancerNest - A freelance platform connecting skilled professionals with clients.

## Project Overview

LancerNest API provides a secure, scalable, and feature-rich backend for the LancerNest platform. It follows a feature-based architecture that organizes code by business domain and includes versioned API endpoints.

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/lancer_nest_api.git
   cd lancer_nest_api
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create configuration
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your database credentials and other settings

4. Start the development server
   ```bash
   npm run dev
   ```

## Project Structure

The project follows a feature-based architecture, organizing code by business domain:

```
src/
├── config/                     # Configuration files
├── features/                   # Business features
│   └── core/                   # Core infrastructure
├── common/                     # Shared code across features
│   ├── middleware/             # Shared middleware
│   ├── utils/                  # Shared utilities
│   └── di/                     # Dependency injection
├── routes/                     # API routing layer
├── database/                   # Database setup
└── app.js                      # Application entry point
```

## API Documentation

API endpoints are versioned and available at:

- Base URL: `/api/v1`
- Health Check: `/api/v1/health`

## Development

Phase 1 of development includes:
- Basic project structure setup
- Environment configuration
- Database connection with pooling and retry
- Health check system
- CSRF protection
- Dependency injection system

## License

This project is licensed under the ISC License. 