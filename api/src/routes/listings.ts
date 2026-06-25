import { Router, Request, Response } from 'express';
import { getAll, getOne } from '../config/database';
import { ListingRow, ListingImageRow, ListingResponse, ImageResponse } from '../types';

const router = Router();

export function formatListing(row: ListingRow, images: ListingImageRow[]): ListingResponse {
  const primaryImage = images.find((img) => img.is_primary) || images[0];
  const galleryImages = images
    .filter((img) => !img.is_primary || images.length === 1)
    .sort((a, b) => a.sort_order - b.sort_order);

  const response: ListingResponse = {
    id: row.id,
    title: row.title,
    location: row.location,
    city: row.city,
    category: row.category,
    status: row.status,
    imageUrl: primaryImage ? `/uploads/${row.id}/${primaryImage.filename}` : '',
    gallery: galleryImages.map((img) => `/uploads/${row.id}/${img.filename}`),
    images: images.map((img): ImageResponse => ({
      id: img.id,
      filename: img.filename,
      url: `/uploads/${row.id}/${img.filename}`,
      sortOrder: img.sort_order,
      isPrimary: img.is_primary === 1,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.price != null) response.price = row.price;
  if (row.original_price != null) response.originalPrice = row.original_price;
  if (row.type != null) response.type = row.type;
  if (row.bedrooms != null) response.bedrooms = row.bedrooms;
  if (row.baths != null) response.baths = row.baths;
  if (row.square_feet != null) response.squareFeet = row.square_feet;
  if (row.levels != null) response.levels = row.levels;
  if (row.size != null) response.size = row.size;
  if (row.completion != null) response.completion = row.completion;
  if (row.expected_completion != null) response.expectedCompletion = row.expected_completion;
  if (row.description) response.description = row.description;
  if (row.is_hottest) response.isHottest = true;

  return response;
}

router.get('/', (req: Request, res: Response) => {
  const { category, hottest, status } = req.query;
  const listingStatus = (status as string) || 'published';

  let sql = 'SELECT * FROM listings WHERE status = ?';
  const params: (string | number)[] = [listingStatus];

  if (category) {
    sql += ' AND category = ?';
    params.push(category as string);
  }
  if (hottest === 'true') {
    sql += ' AND is_hottest = 1';
  }
  sql += ' ORDER BY sort_order ASC, created_at DESC';

  const listings = getAll<ListingRow>(sql, params);

  const results = listings.map((listing) => {
    const images = getAll<ListingImageRow>(
      'SELECT * FROM listing_images WHERE listing_id = ? ORDER BY sort_order ASC',
      [listing.id]
    );
    return formatListing(listing, images);
  });

  res.set('Cache-Control', 'public, max-age=60, s-maxage=120');
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

  res.set('Cache-Control', 'public, max-age=60, s-maxage=120');
  res.json(formatListing(listing, images));
});

export default router;
