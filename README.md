# Shorty - URL Shortener Service

A modern, fast, and scalable URL shortening service built with Node.js, React, and PostgreSQL. Designed for high performance and clean user experience.

## 📊 **Project Status**

**Phase 1: Core Infrastructure** ✅ **COMPLETED**

- ✅ **Backend API**: Fully functional with TypeScript, Express, PostgreSQL, Redis
- ✅ **URL Shortening**: Random and custom codes working
- ✅ **URL Redirection**: Proper 302 redirects implemented
- ✅ **Frontend**: Next.js with TypeScript, Tailwind CSS, theme support
- ✅ **Docker**: Containerized with Docker Compose
- ✅ **Testing**: API endpoints verified and working
- ✅ **Documentation**: Complete setup and usage guides

**Ready for Phase 2: Web Interface Enhancement**

## 🚀 Features

### Core Features

- **URL Shortening**: Convert long URLs to short codes (e.g., `bb.c/ABC123`)
- **URL Redirection**: Fast redirect from short codes to original URLs
- **Admin Dashboard**: Clean interface for managing short URLs
- **Full Analytics**: Comprehensive click tracking and geographic data
- **Theme Support**: Dark/light/system mode toggle
- **Responsive Design**: Works seamlessly on all devices

### Future Features (Planned)

- **Custom Short Codes**: Allow custom codes alongside random generation
- **Sequential IDs**: Option for sequential short code generation
- **Multi-Domain Support**: Support for multiple custom domains
- **Public API**: RESTful API with rate limiting
- **Rate Limiting**: Configurable limits for public usage
- **Advanced Analytics**: Real-time dashboards and detailed insights

## 🏗️ Architecture

### Backend Stack

- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL (production reliability)
- **Caching**: Redis (fast lookups)
- **Authentication**: JWT tokens for admin access
- **Containerization**: Docker

### Frontend Stack

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Theme**: Dark/light/system mode support

### Infrastructure

- **Reverse Proxy**: nginx (integrated with existing setup)
- **SSL**: Let's Encrypt (via existing nginx)
- **Domain**: `bb.c` subdomain of `bigbraincoding.com`

## 📁 Project Structure

```
shorty-bbc/
├── backend/                 # Node.js + TypeScript API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   │   └── urlController.ts
│   │   ├── models/         # Database models
│   │   │   └── Url.ts
│   │   ├── routes/         # API routes
│   │   │   ├── api.ts
│   │   │   └── redirect.ts
│   │   ├── utils/          # Utilities
│   │   │   └── shortCodeGenerator.ts
│   │   └── types/          # TypeScript types
│   │       └── index.ts
│   ├── package.json
│   └── Dockerfile
├── frontend/               # Next.js + React + TypeScript
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/    # React components
│   │   │   ├── dashboard.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   ├── url-form.tsx
│   │   │   └── url-list.tsx
│   │   ├── lib/           # Utilities and API
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   └── types/         # TypeScript types
│   │       └── index.ts
│   ├── package.json
│   └── Dockerfile
├── database/              # Database scripts
│   └── init.sql
├── docker-compose.yml     # Docker orchestration
├── env.example           # Environment variables template
├── SETUP.md              # Setup guide
└── README.md             # Project documentation
```

## 🗄️ Database Schema

### URLs Table

```sql
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(50) DEFAULT 'admin',
    is_custom BOOLEAN DEFAULT FALSE
);
```

### Analytics Table

```sql
CREATE TABLE analytics (
    id SERIAL PRIMARY KEY,
    url_id INTEGER REFERENCES urls(id),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    clicked_at TIMESTAMP DEFAULT NOW()
);
```

### Users Table (Future)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Development Phases

### Phase 1: Core Infrastructure ✅ COMPLETED

1. **Project Setup** ✅

   - ✅ Initialize Node.js backend with TypeScript
   - ✅ Set up Next.js frontend with TypeScript
   - ✅ Configure Docker Compose
   - ✅ Create database schema

2. **Basic URL Shortening** ✅
   - ✅ Generate random short codes (6 characters)
   - ✅ Store URL mappings
   - ✅ Implement redirect logic
   - ✅ Basic API endpoints
   - ✅ Custom code support
   - ✅ URL validation and error handling

### Phase 2: Web Interface (Week 2)

1. **Admin Dashboard**

   - Clean, modern UI with theme support
   - Create short URLs
   - View existing URLs
   - Basic analytics display
   - Simple authentication (admin-only)

2. **Performance Optimization**
   - Fast response times
   - Efficient database queries
   - Caching layer

### Phase 3: Production Integration (Week 3)

1. **nginx Configuration**

   - Set up `bb.c` subdomain
   - Configure SSL certificates
   - Proxy to backend service

2. **Analytics Implementation**
   - Full click tracking
   - Geographic data
   - Referrer tracking
   - Real-time analytics dashboard

### Phase 4: Advanced Features (Week 4)

1. **Custom Code Support**

   - Allow custom short codes
   - Sequential ID option
   - Code validation and conflict resolution

2. **Future-Ready Architecture**
   - Rate limiting infrastructure
   - Multi-domain support framework
   - API endpoint preparation

## 🎯 Technical Decisions

### Short Code Generation

- **Default**: Random 6-character alphanumeric codes
- **Future**: Custom codes and sequential options
- **Validation**: Ensure uniqueness and appropriate characters

### Authentication Strategy

- **Simple admin authentication** for now
- JWT tokens for session management
- Single admin user (owner)
- Easy to extend for multiple users later

### UI/UX Focus

- **Speed**: Optimized for fast URL shortening
- **Simplicity**: Clean, intuitive interface
- **Responsive**: Works on all devices
- **Theme**: Dark/light/system mode toggle
- **Modern**: Tailwind CSS with smooth animations

### Analytics Scope

- **Click tracking**: Total clicks, unique clicks
- **Geographic data**: Country, city (if available)
- **Referrer tracking**: Where clicks come from
- **Time-based analytics**: Daily, weekly, monthly stats
- **Real-time dashboard**: Live analytics display

## 🔧 Installation & Setup

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development)
- PostgreSQL (for production)
- nginx (for reverse proxy)

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd shorty-bbc

# Copy environment variables
cp env.example .env

# Start the services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3002
# Backend API: http://localhost:3001
# Health Check: http://localhost:3001/health
```

### Testing

The application has been tested and verified working:

```bash
# Test health check
curl http://localhost:3001/health

# Create a short URL
curl -X POST http://localhost:3001/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://google.com"}'

# Test redirect
curl -I http://localhost:3001/[SHORT_CODE]

# Get all URLs
curl http://localhost:3001/api/urls
```

## 📊 Analytics Features

### Click Tracking

- Total click count per URL
- Unique visitor tracking
- Click-through rate analysis

### Geographic Data

- Country-level analytics
- City-level data (when available)
- Geographic heat maps

### Referrer Analysis

- Traffic source tracking
- Social media referrers
- Direct vs. referral traffic

### Time-based Analytics

- Daily, weekly, monthly trends
- Peak usage time analysis
- Growth rate tracking

## 🔮 Future Roadmap

### Version 2.0

- **Public API**: RESTful API with rate limiting
- **Custom Domains**: Support for multiple domains
- **Advanced Analytics**: Real-time dashboards
- **Rate Limiting**: Configurable limits

### Version 3.0

- **Multi-tenant Support**: Multiple admin users
- **Custom Branding**: White-label solutions
- **API Monetization**: Paid API tiers
- **Enterprise Features**: Advanced security and compliance

## 🤝 Contributing

This project is designed to be open-sourced. Contributions are welcome!

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Maintain clean, documented code
- Use conventional commit messages

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support, please open an issue on GitHub or contact the maintainer.

---

**Built with ❤️ for fast, reliable URL shortening**
