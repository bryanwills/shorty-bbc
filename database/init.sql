-- Initialize Shorty Database
-- This script creates the necessary tables for the URL shortening service

-- Create URLs table
CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(50) DEFAULT 'admin',
    is_custom BOOLEAN DEFAULT FALSE
);

-- Create Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    url_id INTEGER REFERENCES urls(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    clicked_at TIMESTAMP DEFAULT NOW()
);

-- Create Users table (for future use)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_url_id ON analytics(url_id);
CREATE INDEX IF NOT EXISTS idx_analytics_clicked_at ON analytics(clicked_at);

-- Insert default admin user (password: admin123)
-- In production, this should be changed
INSERT INTO users (username, password_hash)
VALUES ('admin', '$2a$10$rQZ9K8X2Y1L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J')
ON CONFLICT (username) DO NOTHING;