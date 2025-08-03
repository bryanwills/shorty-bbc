const { Pool } = require('pg');
const redis = require('redis');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

class Url {
  /**
   * Create a new shortened URL
   * @param {string} shortCode - The short code
   * @param {string} originalUrl - The original URL
   * @param {string} createdBy - Who created the URL (default: 'admin')
   * @param {boolean} isCustom - Whether this is a custom code
   * @returns {Promise<Object>} - Created URL object
   */
  static async create(shortCode, originalUrl, createdBy = 'admin', isCustom = false) {
    const query = `
      INSERT INTO urls (short_code, original_url, created_by, is_custom)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [shortCode, originalUrl, createdBy, isCustom]);
      const url = result.rows[0];

      // Cache the URL in Redis for fast lookups
      await redisClient.setEx(`url:${shortCode}`, 3600, JSON.stringify(url));

      return url;
    } catch (error) {
      console.error('Error creating URL:', error);
      throw error;
    }
  }

  /**
   * Find URL by short code
   * @param {string} shortCode - The short code to look up
   * @returns {Promise<Object|null>} - URL object or null if not found
   */
  static async findByShortCode(shortCode) {
    try {
      // Check Redis cache first
      const cached = await redisClient.get(`url:${shortCode}`);
      if (cached) {
        return JSON.parse(cached);
      }

      // If not in cache, query database
      const query = 'SELECT * FROM urls WHERE short_code = $1';
      const result = await pool.query(query, [shortCode]);

      if (result.rows.length === 0) {
        return null;
      }

      const url = result.rows[0];

      // Cache the result
      await redisClient.setEx(`url:${shortCode}`, 3600, JSON.stringify(url));

      return url;
    } catch (error) {
      console.error('Error finding URL:', error);
      throw error;
    }
  }

  /**
   * Check if short code already exists
   * @param {string} shortCode - The short code to check
   * @returns {Promise<boolean>} - True if exists, false otherwise
   */
  static async shortCodeExists(shortCode) {
    try {
      const query = 'SELECT COUNT(*) FROM urls WHERE short_code = $1';
      const result = await pool.query(query, [shortCode]);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error('Error checking short code:', error);
      throw error;
    }
  }

  /**
   * Get all URLs with pagination
   * @param {number} limit - Number of URLs to return
   * @param {number} offset - Number of URLs to skip
   * @returns {Promise<Array>} - Array of URL objects
   */
  static async findAll(limit = 50, offset = 0) {
    try {
      const query = `
        SELECT * FROM urls
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const result = await pool.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Error finding all URLs:', error);
      throw error;
    }
  }

  /**
   * Delete a URL by short code
   * @param {string} shortCode - The short code to delete
   * @returns {Promise<boolean>} - True if deleted, false if not found
   */
  static async deleteByShortCode(shortCode) {
    try {
      const query = 'DELETE FROM urls WHERE short_code = $1 RETURNING *';
      const result = await pool.query(query, [shortCode]);

      if (result.rows.length > 0) {
        // Remove from cache
        await redisClient.del(`url:${shortCode}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting URL:', error);
      throw error;
    }
  }

  /**
   * Get total count of URLs
   * @returns {Promise<number>} - Total number of URLs
   */
  static async getCount() {
    try {
      const query = 'SELECT COUNT(*) FROM urls';
      const result = await pool.query(query);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting URL count:', error);
      throw error;
    }
  }
}

module.exports = Url;