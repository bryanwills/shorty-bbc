# Shorty - Setup Guide

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development)
- Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd shorty-bbc

# Copy environment variables
cp env.example .env
```

### 2. Start the Application

```bash
# Start all services
docker-compose up -d

# Or start with logs
docker-compose up
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🛠️ Development

### Backend Development

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Frontend Development

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📊 Database

The application uses PostgreSQL with the following schema:

### URLs Table
- `id`: Primary key
- `short_code`: Unique 6-character code
- `original_url`: The original URL
- `created_at`: Creation timestamp
- `created_by`: User who created the URL
- `is_custom`: Whether it's a custom code

### Analytics Table
- `id`: Primary key
- `url_id`: Foreign key to URLs
- `ip_address`: Visitor IP
- `user_agent`: Browser info
- `referrer`: Where the click came from
- `country`: Visitor country
- `city`: Visitor city
- `clicked_at`: Click timestamp

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Backend
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://shorty_user:shorty_password@localhost:5432/shorty
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build

# Clean up volumes
docker-compose down -v
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📁 Project Structure

```
shorty-bbc/
├── backend/                 # Node.js + TypeScript API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utilities
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── Dockerfile
├── frontend/               # Next.js + React + TypeScript
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities and API
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── Dockerfile
├── database/              # Database scripts
│   └── init.sql
├── docker-compose.yml     # Docker orchestration
└── README.md
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: URL and short code validation
- **SQL Injection Protection**: Parameterized queries

## 🚀 Production Deployment

### 1. Environment Setup

```bash
# Set production environment
NODE_ENV=production
DATABASE_URL=your-production-db-url
REDIS_URL=your-production-redis-url
JWT_SECRET=your-production-jwt-secret
```

### 2. Build and Deploy

```bash
# Build all services
docker-compose -f docker-compose.prod.yml up --build

# Or deploy to cloud platform
# (Vercel, Heroku, AWS, etc.)
```

### 3. Domain Configuration

Configure your domain (`bb.c`) to point to the application:

```nginx
# nginx configuration
server {
    listen 80;
    server_name bb.c;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Database connection**: Check DATABASE_URL in .env
3. **Redis connection**: Check REDIS_URL in .env
4. **Build errors**: Clear node_modules and rebuild

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## 📈 Monitoring

- **Health Check**: http://localhost:3001/health
- **Database**: Connect to PostgreSQL on port 5432
- **Redis**: Connect to Redis on port 6379

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.