import { Router, Request, Response } from 'express';
import multer from 'multer';
import { getAll, getOne, runQuery, runInsert } from '../../config/database';
import { requireAuth } from '../../middleware/auth';
import { ListingRow, ListingImageRow } from '../../types';
import { processAndSaveImage, deleteImage } from '../../services/imageService';

const router = Router();
router.use(requireAuth);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/:id/images', upload.array('images', 20), async (req: Request, res: Response) => {
  const { id } = req.params;

  const listing = getOne<ListingRow>('SELECT * FROM listings WHERE id = ?', [id]);
  if (!listing) {
    res.status(404).json({ error: 'Listing not found' });
    return;
  }

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ error: 'No images provided' });
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
});

router.delete('/:imageId', (req: Request, res: Response) => {
  const imageId = parseInt(req.params.imageId, 10);
  const image = getOne<ListingImageRow>('SELECT * FROM listing_images WHERE id = ?', [imageId]);

  if (!image) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }

  deleteImage(image.listing_id, image.filename);
  runQuery('DELETE FROM listing_images WHERE id = ?', [imageId]);

  if (image.is_primary) {
    const nextImage = getOne<ListingImageRow>(
      'SELECT * FROM listing_images WHERE listing_id = ? ORDER BY sort_order ASC LIMIT 1',
      [image.listing_id]
    );
    if (nextImage) {
      runQuery('UPDATE listing_images SET is_primary = 1 WHERE id = ?', [nextImage.id]);
    }
  }

  res.json({ success: true });
});

router.patch('/:imageId/primary', (req: Request, res: Response) => {
  const imageId = parseInt(req.params.imageId, 10);
  const image = getOne<ListingImageRow>('SELECT * FROM listing_images WHERE id = ?', [imageId]);

  if (!image) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }

  runQuery('UPDATE listing_images SET is_primary = 0 WHERE listing_id = ?', [image.listing_id]);
  runQuery('UPDATE listing_images SET is_primary = 1 WHERE id = ?', [imageId]);

  res.json({ success: true });
});

export default router;
