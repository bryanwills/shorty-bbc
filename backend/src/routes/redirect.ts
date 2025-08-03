import { Router, Request, Response } from 'express';
import { Url } from '../models/Url';
import { isValidShortCode } from '../utils/shortCodeGenerator';

const router: Router = Router();

/**
 * Redirect short code to original URL
 * GET /:shortCode
 */
router.get('/:shortCode', async (req: Request<{ shortCode: string }>, res: Response) => {
  try {
    const { shortCode } = req.params;

    // Skip if it's an API route or static file
    if (shortCode.startsWith('api') || shortCode.includes('.')) {
      return res.status(404).json({ error: 'Route not found' });
    }

    if (!isValidShortCode(shortCode)) {
      return res.status(400).json({ error: 'Invalid short code format' });
    }

    const url = await Url.findByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Redirect to the original URL
    res.redirect(url.original_url);

  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;