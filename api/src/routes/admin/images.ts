import { Router, Request, Response } from 'express';
import { getAll, getOne, runQuery } from '../../config/database';
import { requireAuth } from '../../middleware/auth';
import { ListingImageRow } from '../../types';
import { deleteImage } from '../../services/imageService';

const router = Router();
router.use(requireAuth);

router.delete('/:imageId', (req: Request, res: Response) => {
  const imageId = parseInt(req.params.imageId as string, 10);
  if (isNaN(imageId)) {
    res.status(400).json({ error: 'Invalid image ID', code: 'VALIDATION_ERROR' });
    return;
  }

  const image = getOne<ListingImageRow>('SELECT * FROM listing_images WHERE id = ?', [imageId]);
  if (!image) {
    res.status(404).json({ error: 'Image not found', code: 'NOT_FOUND' });
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
  const imageId = parseInt(req.params.imageId as string, 10);
  if (isNaN(imageId)) {
    res.status(400).json({ error: 'Invalid image ID', code: 'VALIDATION_ERROR' });
    return;
  }

  const image = getOne<ListingImageRow>('SELECT * FROM listing_images WHERE id = ?', [imageId]);
  if (!image) {
    res.status(404).json({ error: 'Image not found', code: 'NOT_FOUND' });
    return;
  }

  runQuery('UPDATE listing_images SET is_primary = 0 WHERE listing_id = ?', [image.listing_id]);
  runQuery('UPDATE listing_images SET is_primary = 1 WHERE id = ?', [imageId]);

  res.json({ success: true });
});

export default router;
