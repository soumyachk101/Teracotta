

const products = [
  {
    id: 1,
    name: "Classic Terracotta Pot",
    price: "$24.99",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2672&auto=format&fit=crop",
    description: "Handcrafted classic planter for your favorite indoor plants."
  },
  {
    id: 2,
    name: "Rustic Terracotta Vase",
    price: "$39.99",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2670&auto=format&fit=crop",
    description: "A beautiful rustic vase, perfect for dried flowers."
  },
  {
    id: 3,
    name: "Terracotta Bowl Set",
    price: "$45.00",
    image: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=2532&auto=format&fit=crop",
    description: "Set of three nesting bowls, ideal for serving or display."
  },
  {
    id: 4,
    name: "Geometric Planter",
    price: "$29.99",
    image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=2671&auto=format&fit=crop",
    description: "Modern geometric design meets traditional terracotta."
  }
];

function App() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Header */}
      <header className="bg-orange-800 text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">TERACOTTA</h1>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium">
              <li><a href="#" className="hover:text-orange-200 transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-orange-200 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-orange-200 transition-colors">Contact</a></li>
              <li>
                <button className="hover:text-orange-200 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <span className="ml-1">Cart (0)</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-orange-100 py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-extrabold text-orange-900 mb-4">Earthy Elegance for Your Home</h2>
          <p className="text-lg text-orange-800 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of handcrafted terracotta goods. Bring the warmth of natural clay into your everyday living spaces.
          </p>
          <a href="#shop" className="bg-orange-800 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-900 transition-colors inline-block">
            Shop the Collection
          </a>
        </div>
      </section>

      {/* Product Gallery */}
      <main id="shop" className="container mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Featured Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                <p className="text-stone-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-orange-900">{product.price}</span>
                  <button className="bg-orange-100 text-orange-800 px-4 py-2 rounded text-sm font-medium hover:bg-orange-200 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12 text-center text-sm">
        <div className="container mx-auto px-6">
          <h2 className="text-xl font-bold text-white mb-4">TERACOTTA</h2>
          <p className="mb-6">Handmade with love and earth.</p>
          <div className="flex justify-center space-x-6 mb-6">
             <a href="#" className="hover:text-white transition-colors">Instagram</a>
             <a href="#" className="hover:text-white transition-colors">Pinterest</a>
             <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <p>&copy; {new Date().getFullYear()} Teracotta. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
