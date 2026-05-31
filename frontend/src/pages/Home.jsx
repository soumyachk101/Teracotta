import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoryGrid from '../components/home/CategoryGrid';
import ArtisanSpotlight from '../components/home/ArtisanSpotlight';
import StatsBar from '../components/home/StatsBar';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoryGrid />
      <ArtisanSpotlight />
      <StatsBar />
      <Testimonials />
      <Newsletter />
    </>
  );
}
