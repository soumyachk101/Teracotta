import { Star } from 'lucide-react';
import AnimateIn from '../shared/AnimateIn';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'The terracotta horse I purchased is absolutely stunning. You can feel the craftsmanship in every detail. It’s become the centerpiece of my living room.',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Bangalore',
    rating: 5,
    text: 'I bought a Ganesha idol for my pooja room. The quality is exceptional and it feels so authentic knowing it was handcrafted by artisans from Bishnupur.',
  },
  {
    id: 3,
    name: 'Anjali Gupta',
    location: 'Delhi',
    rating: 5,
    text: 'The necklace I ordered is even more beautiful in person. The attention to detail is incredible. I’ve already ordered three more as gifts!',
  },
];

export default function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2>What Our Customers Say</h2>
          <p className="text-stone-600">
            Real experiences from people who love authentic terracotta crafts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimateIn key={testimonial.id} variant="fade-up" delay={index * 100}>
              <div className="card-section">
                <div className="flex mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-terracotta-500 text-terracotta-500" />
                  ))}
                </div>
                <p className="text-stone-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-stone-900">{testimonial.name}</p>
                  <p className="text-sm text-stone-500">{testimonial.location}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
