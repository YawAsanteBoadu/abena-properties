import HeroBanner from '@/components/home/HeroBanner/HeroBanner';
import BuyOrRentSection from '@/components/home/BuyOrRentSection/BuyOrRentSection';
import NewPropertiesSection from '@/components/home/NewPropertiesSection/NewPropertiesSection';
import ClientsStoryCarousel from '@/components/home/ClientsStoryCarousel/ClientsStoryCarousel';
import RollableParallaxSection from '@/components/home/RollableParallaxSection/RollableParallaxSection';
import CallToActionSection from '@/components/home/CallToActionSection/CallToActionSection';
import SalesPitchSection from '@/components/home/SalesPitchSection/SalesPitchSection';
import { getHottestProperties } from '@/data/properties';

export default async function Home() {
  const [buyProperties, rentProperties] = await Promise.all([
    getHottestProperties('buy'),
    getHottestProperties('rent'),
  ]);

  return (
    <>
      <HeroBanner />
      <BuyOrRentSection />
      <NewPropertiesSection
        title="New Properties for Sale"
        properties={buyProperties}
        viewMoreHref="/buy"
        viewMoreLabel="View All For Sale"
      />
      <NewPropertiesSection
        title="New Properties for Rent"
        properties={rentProperties}
        viewMoreHref="/rent"
        viewMoreLabel="View All Rentals"
      />
      <RollableParallaxSection />
      <ClientsStoryCarousel />
      <CallToActionSection />
      <SalesPitchSection />
    </>
  );
}
