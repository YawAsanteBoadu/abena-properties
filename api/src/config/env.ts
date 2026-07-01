import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  webOrigin: process.env.WEB_ORIGIN || 'http://localhost:3000',
  adminOrigin: process.env.ADMIN_ORIGIN || 'http://localhost:3001',
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || 'admin@abenaproperties.com',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
};
