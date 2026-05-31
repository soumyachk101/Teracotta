import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimateIn from '../shared/AnimateIn';

const artisans = [
  {
    id: 'art-001',
    name: 'Kartik Kumbhakar',
    village: 'Panchmura',
    experience: '28 years',
    generation: '4th',
    image: 'https://res.cloudinary.com/mittikala/images/artisans/kartik.webp',
  },
  {
    id: 'art-002',
    name: 'Mohan Bej',
    village: 'Bishnupur',
    experience: '22 years',
    generation: '3rd',
    image: 'https://res.cloudinary.com/mittikala/images/artisans/mohan.webp',
  },
  {
    id: 'art-003',
    name: 'Subal Kumbhakar',
    village: 'Panchmura',
    experience: '35 years',
    generation: '5th',
    image: 'https://res.cloudinary.com/mittikala/images/artisans/subal.webp',
  },
];

export default function ArtisanSpotlight() {
  return (
    <section className="section bg-cream-200">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2>Our Artisans</h2>
            <p className="text-stone-600">
              Meet the master craftsmen behind each piece
            </p>
          </div>
          <Link
            to="/about#artisans"
            className="hidden md:inline-flex items-center gap-2 text-terracotta-500 hover:text-terracotta-600 font-medium"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artisans.map((artisan, index) => (
            <AnimateIn key={artisan.id} variant="fade-up" delay={index * 150}>
              <div className="card-section text-center group cursor-pointer">
                <div className="aspect-square rounded-2xl overflow-hidden bg-cream-100 mb-4 mx-auto max-w-[200px]">
                  {/* Placeholder for artisan photo */}
                  <div className="w-full h-full bg-gradient-to-br from-terracotta-200 to-cream-300 flex items-center justify-center">
                    <span className="text-4xl text-terracotta-400">
                      {artisan.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold mb-1">
                  {artisan.name}
                </h3>
                <p className="text-stone-600 text-sm mb-2">{artisan.village}</p>
                <p className="text-stone-500 text-xs">
                  {artisan.experience} • {artisan.generation} Generation
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
