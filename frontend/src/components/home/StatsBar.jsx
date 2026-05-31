export default function StatsBar() {
  const stats = [
    { value: '50+', label: 'Artisans' },
    { value: '400', label: 'Year Tradition' },
    { value: '10,000+', label: 'Happy Customers' },
    { value: '4.8', label: 'Average Rating' },
  ];

  return (
    <section className="py-16 bg-terracotta-500 text-white">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-display text-4xl md:text-5xl font-bold mb-2">
                {stat.value}
              </p>
              <p className="text-terracotta-100 text-sm uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
