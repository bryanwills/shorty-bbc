import { Request, Response } from 'express';
import { Url } from '../models/Url';
import { generateShortCode, isValidShortCode, generateCustomShortCode } from '../utils/shortCodeGenerator';
import { CreateUrlRequest, CreateUrlResponse, UrlListResponse, UrlResponse, DeleteUrlResponse, RequestWithUser } from '../types';

/**
 * Create a new shortened URL
 * POST /api/urls
 */
export async function createShortUrl(req: Request<{}, {}, CreateUrlRequest>, res: Response<CreateUrlResponse | { error: string }>) {
  try {
    const { originalUrl, customCode } = req.body;

    // Validate input
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Validate URL format
    let url: URL;
    try {
      url = new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Ensure URL has protocol
    if (!url.protocol) {
      url = new URL(`https://${originalUrl}`);
    }

    let shortCode: string;

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
    const createdUrl = await Url.create(shortCode, url.toString(), 'admin', !!customCode);

    const response: CreateUrlResponse = {
      success: true,
      data: {
        shortCode: createdUrl.short_code,
        originalUrl: createdUrl.original_url,
        shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
        createdAt: createdUrl.created_at
      }
    };

    res.status(201).json(response);

  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all URLs with pagination
 * GET /api/urls
 */
export async function getAllUrls(req: Request, res: Response<UrlListResponse | { error: string }>) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const [urls, totalCount] = await Promise.all([
      Url.findAll(limit, offset),
      Url.getCount()
    ]);

    const response: UrlListResponse = {
      success: true,
      data: urls,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error getting URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get URL by short code
 * GET /api/urls/:shortCode
 */
export async function getUrlByShortCode(req: Request<{ shortCode: string }>, res: Response<UrlResponse | { error: string }>) {
  try {
    const { shortCode } = req.params;

    if (!isValidShortCode(shortCode)) {
      return res.status(400).json({ error: 'Invalid short code format' });
    }

    const url = await Url.findByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const response: UrlResponse = {
      success: true,
      data: {
        shortCode: url.short_code,
        originalUrl: url.original_url,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.short_code}`,
        createdAt: url.created_at,
        isCustom: url.is_custom
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error getting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Delete URL by short code
 * DELETE /api/urls/:shortCode
 */
export async function deleteUrl(req: Request<{ shortCode: string }>, res: Response<DeleteUrlResponse | { error: string }>) {
  try {
    const { shortCode } = req.params;

    if (!isValidShortCode(shortCode)) {
      return res.status(400).json({ error: 'Invalid short code format' });
    }

    const deleted = await Url.deleteByShortCode(shortCode);

    if (!deleted) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const response: DeleteUrlResponse = {
      success: true,
      message: 'URL deleted successfully'
    };

    res.json(response);

  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}