import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import { SearchProvider } from '@/components/Search/SearchProvider';
import SearchOverlay from '@/components/Search/SearchOverlay';
import { BRAND } from '@/data/constants';
import styles from '@/components/shared/Layout/Layout.module.css';

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description: 'Premium real estate listings for buying and renting in Ghana.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SearchProvider>
          <Navbar />
          <main className={styles.main}>{children}</main>
          <Footer />
          <SearchOverlay />
        </SearchProvider>
      </body>
    </html>
  );
}
