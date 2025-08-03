const Url = require('../models/Url');
const { generateShortCode, isValidShortCode, generateCustomShortCode } = require('../utils/shortCodeGenerator');

/**
 * Create a new shortened URL
 * POST /api/urls
 */
async function createShortUrl(req, res) {
  try {
    const { originalUrl, customCode } = req.body;

    // Validate input
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Validate URL format
    let url;
    try {
      url = new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Ensure URL has protocol
    if (!url.protocol) {
      url = new URL(`https://${originalUrl}`);
    }

    let shortCode;

    // Handle custom code if provided
    if (customCode) {
      const validatedCode = generateCustomShortCode(customCode);
      if (!validatedCode) {
        return res.status(400).json({ error: 'Invalid custom code format' });
      }

      // Check if custom code already exists
      const exists = await Url.shortCodeExists(validatedCode);
      if (exists) {
        return res.status(409).json({ error: 'Custom code already exists' });
      }

      shortCode = validatedCode;
    } else {
      // Generate random short code
      let attempts = 0;
      const maxAttempts = 10;

      do {
        shortCode = generateShortCode();
        attempts++;

        if (attempts > maxAttempts) {
          return res.status(500).json({ error: 'Unable to generate unique short code' });
        }
      } while (await Url.shortCodeExists(shortCode));
    }

    // Create the shortened URL
    const createdUrl = await Url.create(shortCode, url.toString(), req.user?.username || 'admin', !!customCode);

    res.status(201).json({
      success: true,
      data: {
        shortCode: createdUrl.short_code,
        originalUrl: createdUrl.original_url,
        shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
        createdAt: createdUrl.created_at
      }
    });

  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all URLs with pagination
 * GET /api/urls
 */
async function getAllUrls(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const [urls, totalCount] = await Promise.all([
      Url.findAll(limit, offset),
      Url.getCount()
    ]);

    res.json({
      success: true,
      data: urls,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error getting URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get URL by short code
 * GET /api/urls/:shortCode
 */
async function getUrlByShortCode(req, res) {
  try {
    const { shortCode } = req.params;

    if (!isValidShortCode(shortCode)) {
      return res.status(400).json({ error: 'Invalid short code format' });
    }

    const url = await Url.findByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      success: true,
      data: {
        shortCode: url.short_code,
        originalUrl: url.original_url,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.short_code}`,
        createdAt: url.created_at,
        isCustom: url.is_custom
      }
    });

  } catch (error) {
    console.error('Error getting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Delete URL by short code
 * DELETE /api/urls/:shortCode
 */
async function deleteUrl(req, res) {
  try {
    const { shortCode } = req.params;

    if (!isValidShortCode(shortCode)) {
      return res.status(400).json({ error: 'Invalid short code format' });
    }

    const deleted = await Url.deleteByShortCode(shortCode);

    if (!deleted) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      success: true,
      message: 'URL deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createShortUrl,
  getAllUrls,
  getUrlByShortCode,
  deleteUrl
};