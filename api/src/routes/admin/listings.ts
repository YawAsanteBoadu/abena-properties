import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { getAll, getOne, runQuery, runInsert } from '../../config/database';
import { requireAuth } from '../../middleware/auth';
import { ListingRow, ListingImageRow, CreateListingBody } from '../../types';
import { formatListing } from '../listings';
import { deleteListingImages } from '../../services/imageService';

const router = Router();
router.use(requireAuth);

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
    res.status(404).json({ error: 'Listing not found' });
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

  if (!body.title || !body.location || !body.city || !body.category) {
    res.status(400).json({ error: 'title, location, city, and category are required' });
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
    res.status(404).json({ error: 'Listing not found' });
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
    res.status(404).json({ error: 'Listing not found' });
    return;
  }

  deleteListingImages(id);
  runQuery('DELETE FROM listings WHERE id = ?', [id]);
  res.json({ success: true });
});

router.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['draft', 'published', 'archived'].includes(status)) {
    res.status(400).json({ error: 'status must be draft, published, or archived' });
    return;
  }

  const existing = getOne<ListingRow>('SELECT * FROM listings WHERE id = ?', [id]);
  if (!existing) {
    res.status(404).json({ error: 'Listing not found' });
    return;
  }

  runQuery("UPDATE listings SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, id]);

  const updated = getOne<ListingRow>('SELECT * FROM listings WHERE id = ?', [id])!;
  const images = getAll<ListingImageRow>(
    'SELECT * FROM listing_images WHERE listing_id = ? ORDER BY sort_order ASC', [id]
  );
  res.json(formatListing(updated, images));
});

export default router;
