import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { getAll, getOne, runQuery, runInsert } from '../../config/database';
import { requireAuth } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { ListingRow, ListingImageRow, CreateListingBody } from '../../types';
import { formatListing } from '../listings';
import { deleteListingImages, processAndSaveImage } from '../../services/imageService';

const router = Router();
router.use(requireAuth);

const VALID_CATEGORIES = ['buy', 'rent', 'land', 'project', 'distress'];
const VALID_STATUSES = ['draft', 'published', 'archived'];

interface FieldErrors {
  [field: string]: string;
}

function validateListingBody(body: CreateListingBody, requireAll: boolean): FieldErrors {
  const errors: FieldErrors = {};

  if (requireAll) {
    if (!body.title?.trim()) errors.title = 'Title is required.';
    if (!body.location?.trim()) errors.location = 'Location is required.';
    if (!body.city?.trim()) errors.city = 'City is required.';
    if (!body.category) errors.category = 'Category is required.';
  }

  if (body.category && !VALID_CATEGORIES.includes(body.category)) {
    errors.category = `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}.`;
  }
  if (body.status && !VALID_STATUSES.includes(body.status)) {
    errors.status = `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`;
  }
  if (body.price !== undefined && body.price !== null && body.price < 0) {
    errors.price = 'Price cannot be negative.';
  }
  if (body.bedrooms !== undefined && body.bedrooms !== null && body.bedrooms < 0) {
    errors.bedrooms = 'Bedrooms cannot be negative.';
  }
  if (body.baths !== undefined && body.baths !== null && body.baths < 0) {
    errors.baths = 'Bathrooms cannot be negative.';
  }
  if (body.completion !== undefined && body.completion !== null && (body.completion < 0 || body.completion > 100)) {
    errors.completion = 'Completion must be between 0 and 100.';
  }

  return errors;
}

router.get('/', (_req: Request, res: Response) => {
  const listings = getAll<ListingRow>(
    'SELECT * FROM listings ORDER BY sort_order ASC, created_at DESC'
  );

  const results = listings.map((listing) => {
    const images = getAll<ListingImageRow>(
      'SELECT * FROM listing_images WHERE listing_id = ? ORDER BY sort_order ASC',
      [listing.id]
    );
    return formatListing(listing, images);
  });

  res.json(results);
});

router.get('/:id', (req: Request, res: Response) => {
  const listing = getOne<ListingRow>('SELECT * FROM listings WHERE id = ?', [req.params.id]);
  if (!listing) {
    res.status(404).json({ error: 'Listing not found', code: 'NOT_FOUND' });
    return;
  }
  const images = getAll<ListingImageRow>(
    'SELECT * FROM listing_images WHERE listing_id = ? ORDER BY sort_order ASC',
    [listing.id]
  );
  res.json(formatListing(listing, images));
});

router.post('/', (req: Request, res: Response) => {
  const body: CreateListingBody = req.body;

  const fieldErrors = validateListingBody(body, true);
  if (Object.keys(fieldErrors).length > 0) {
    res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: fieldErrors,
    });
    return;
  }

  const id = body.id || nanoid(8);

  runQuery(
    `INSERT INTO listings (id, title, location, city, category, status, price, original_price, type, bedrooms, baths, square_feet, levels, size, completion, expected_completion, description, is_hottest)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, body.title, body.location, body.city, body.category,
      body.status || 'draft',
      body.price ?? null, body.originalPrice ?? null, body.type ?? null,
      body.bedrooms ?? null, body.baths ?? null, body.squareFeet ?? null, body.levels ?? null,
      body.size ?? null, body.completion ?? null, body.expectedCompletion ?? null,
      body.description ?? null, body.isHottest ? 1 : 0,
    ]
  );

  const listing = getOne<ListingRow>('SELECT * FROM listings WHERE id = ?', [id])!;
  res.status(201).json(formatListing(listing, []));
});

router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const body: CreateListingBody = req.body;

  const existing = getOne<ListingRow>('SELECT * FROM listings WHERE id = ?', [id]);
  if (!existing) {
    res.status(404).json({ error: 'Listing not found', code: 'NOT_FOUND' });
    return;
  }

  const fieldErrors = validateListingBody(body, false);
  if (Object.keys(fieldErrors).length > 0) {
    res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: fieldErrors,
    });
    return;
  }

  runQuery(
    `UPDATE listings SET
      title = ?, location = ?, city = ?, category = ?,
      price = ?, original_price = ?, type = ?,
      bedrooms = ?, baths = ?, square_feet = ?, levels = ?,
      size = ?, completion = ?, expected_completion = ?,
      description = ?, is_hottest = ?,
      updated_at = datetime('now')
    WHERE id = ?`,
    [
      body.title ?? existing.title,
      body.location ?? existing.location,
      body.city ?? existing.city,
      body.category ?? existing.category,
      body.price ?? existing.price,
      body.originalPrice ?? existing.original_price,
      body.type ?? existing.type,
      body.bedrooms ?? existing.bedrooms,
      body.baths ?? existing.baths,
      body.squareFeet ?? existing.square_feet,
      body.levels ?? existing.levels,
      body.size ?? existing.size,
      body.completion ?? existing.completion,
      body.expectedCompletion ?? existing.expected_completion,
      body.description ?? existing.description,
      body.isHottest !== undefined ? (body.isHottest ? 1 : 0) : existing.is_hottest,
      id,
    ]
  );

  const updated = getOne<ListingRow>('SELECT * FROM listings WHERE id = ?', [id])!;
  const images = getAll<ListingImageRow>(
    'SELECT * FROM listing_images WHERE listing_id = ? ORDER BY sort_order ASC', [id]
  );
  res.json(formatListing(updated, images));
});

router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = getOne<ListingRow>('SELECT * FROM listings WHERE id = ?', [id]);
  if (!existing) {
    res.status(404).json({ error: 'Listing not found', code: 'NOT_FOUND' });
    return;
  }

  deleteListingImages(id);
  runQuery('DELETE FROM listings WHERE id = ?', [id]);
  res.json({ success: true });
});

router.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    res.status(400).json({
      error: `Status must be one of: ${VALID_STATUSES.join(', ')}.`,
      code: 'VALIDATION_ERROR',
      details: { status: `Invalid status "${status}".` },
    });
    return;
  }

  const existing = getOne<ListingRow>('SELECT * FROM listings WHERE id = ?', [id]);
  if (!existing) {
    res.status(404).json({ error: 'Listing not found', code: 'NOT_FOUND' });
    return;
  }

  runQuery("UPDATE listings SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, id]);

  const updated = getOne<ListingRow>('SELECT * FROM listings WHERE id = ?', [id])!;
  const images = getAll<ListingImageRow>(
    'SELECT * FROM listing_images WHERE listing_id = ? ORDER BY sort_order ASC', [id]
  );
  res.json(formatListing(updated, images));
});

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 20 },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type "${file.mimetype}". Allowed: JPEG, PNG, WebP, GIF, AVIF.`));
    }
  },
});

router.post(
  '/:id/images',
  (req: Request, res: Response, next: NextFunction) => {
    upload.array('images', 20)(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const listing = getOne<ListingRow>('SELECT * FROM listings WHERE id = ?', [id]);
    if (!listing) {
      res.status(404).json({ error: 'Listing not found', code: 'NOT_FOUND' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No images provided', code: 'VALIDATION_ERROR' });
      return;
    }

    const existing = getAll<ListingImageRow>(
      'SELECT * FROM listing_images WHERE listing_id = ?', [id]
    );
    const existingCount = existing.length;

    const results = [];
    for (let i = 0; i < files.length; i++) {
      const filename = await processAndSaveImage(files[i].buffer, id);
      const isPrimary = existingCount === 0 && i === 0 ? 1 : 0;
      const sortOrder = existingCount + i;

      const lastId = runInsert(
        'INSERT INTO listing_images (listing_id, filename, sort_order, is_primary) VALUES (?, ?, ?, ?)',
        [id, filename, sortOrder, isPrimary]
      );
      results.push({
        id: lastId,
        filename,
        url: `/uploads/${id}/${filename}`,
        sortOrder,
        isPrimary: isPrimary === 1,
      });
    }

    res.status(201).json(results);
  })
);

export default router;
