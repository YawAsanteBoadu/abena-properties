import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

export async function processAndSaveImage(
  buffer: Buffer,
  listingId: string
): Promise<string> {
  const listingDir = path.join(UPLOADS_DIR, listingId);
  if (!fs.existsSync(listingDir)) {
    fs.mkdirSync(listingDir, { recursive: true });
  }

  const filename = `${nanoid(12)}.webp`;
  const outputPath = path.join(listingDir, filename);

  await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);

  return filename;
}

export async function copyAndProcessImage(
  sourcePath: string,
  listingId: string
): Promise<string> {
  const buffer = fs.readFileSync(sourcePath);
  return processAndSaveImage(buffer, listingId);
}

export function deleteImage(listingId: string, filename: string): void {
  const filePath = path.join(UPLOADS_DIR, listingId, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function deleteListingImages(listingId: string): void {
  const listingDir = path.join(UPLOADS_DIR, listingId);
  if (fs.existsSync(listingDir)) {
    fs.rmSync(listingDir, { recursive: true, force: true });
  }
}
