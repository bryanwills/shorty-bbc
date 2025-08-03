import { Router } from 'express';
import { createShortUrl, getAllUrls, getUrlByShortCode, deleteUrl } from '../controllers/urlController';

const router: Router = Router();

// URL routes
router.post('/urls', createShortUrl);
router.get('/urls', getAllUrls);
router.get('/urls/:shortCode', getUrlByShortCode);
router.delete('/urls/:shortCode', deleteUrl);

export default router;