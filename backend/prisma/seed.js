import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── 1. CATEGORIES ───────────────────────────────────────────────────
  const categoryData = [
    { name: 'Terracotta Horses', slug: 'horses', icon: 'horse', description: 'The world-famous Bankura horses.' },
    { name: 'Ritual Idols', slug: 'idols', icon: 'shrub', description: 'Sacred figurines and traditional deities.' },
    { name: 'Decorative Panels', slug: 'panels', icon: 'layout', description: 'Intricate wall panels and relief art.' },
    { name: 'Artisan Jewelry', slug: 'jewelry', icon: 'gem', description: 'Handcrafted terracotta ornaments.' },
    { name: 'Home Decor', slug: 'decor', icon: 'home', description: 'Elegant terracotta pieces for every room.' },
    { name: 'Planters', slug: 'planters', icon: 'flower', description: 'Eco-friendly terracotta planters for indoor and outdoor use.' },
  ];

  const categories = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[created.slug] = created;
  }
  console.log(`  ✓ ${categoryData.length} categories`);

  // ─── 2. ARTISAN USERS & PROFILES ─────────────────────────────────────
  const artisanPassword = await bcrypt.hash('Artisan@123', 12);

  const artisanData = [
    {
      email: 'paresh@mittikala.com',
      name: 'Paresh Kumbhakar',
      displayName: 'Paresh Kumbhakar',
      village: 'Panchmura',
      yearsExperience: 40,
      craftGeneration: 3,
      speciality: 'Traditional horse making',
      bio: 'Master artisan with 40 years of experience in traditional horse making. His family has been crafting the iconic Bankura horse for three generations.',
    },
    {
      email: 'mohan@mittikala.com',
      name: 'Mohan Bej',
      displayName: 'Mohan Bej',
      village: 'Bishnupur',
      yearsExperience: 30,
      craftGeneration: 2,
      speciality: 'Wall panels and relief art',
      bio: 'A master of intricate wall panels and relief art. Mohan brings temple architecture traditions to life in every piece.',
    },
    {
      email: 'subal@mittikala.com',
      name: 'Subal Kumbhakar',
      displayName: 'Subal Kumbhakar',
      village: 'Panchmura',
      yearsExperience: 25,
      craftGeneration: 4,
      speciality: 'Decorative items and jewelry',
      bio: 'Fourth-generation artisan specializing in decorative items and terracotta jewelry. Known for blending tradition with contemporary design.',
    },
  ];

  const artisans = [];
  for (const ad of artisanData) {
    const user = await prisma.user.upsert({
      where: { email: ad.email },
      update: {},
      create: {
        email: ad.email,
        name: ad.name,
        passwordHash: artisanPassword,
        role: 'ARTISAN',
      },
    });
    const profile = await prisma.artisanProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        displayName: ad.displayName,
        village: ad.village,
        yearsExperience: ad.yearsExperience,
        craftGeneration: ad.craftGeneration,
        speciality: ad.speciality,
        bio: ad.bio,
        isVerified: true,
      },
    });
    artisans.push(profile);
  }
  console.log(`  ✓ ${artisanData.length} artisans`);

  // ─── 3. ADMIN USERS ─────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admins = [
    { email: 'admin@mittikala.com', name: 'Admin User' },
    { email: 'support@mittikala.com', name: 'Support User' },
  ];
  for (const a of admins) {
    await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: { email: a.email, name: a.name, passwordHash: adminPassword, role: 'ADMIN' },
    });
  }
  console.log(`  ✓ ${admins.length} admin users`);

  // ─── 4. TEST CUSTOMERS ──────────────────────────────────────────────
  const customerPassword = await bcrypt.hash('Test@123', 12);
  const customers = [
    { email: 'customer1@test.com', name: 'Test Customer 1' },
    { email: 'customer2@test.com', name: 'Test Customer 2' },
    { email: 'customer3@test.com', name: 'Test Customer 3' },
  ];
  for (const c of customers) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: { email: c.email, name: c.name, passwordHash: customerPassword, role: 'CUSTOMER' },
    });
  }
  console.log(`  ✓ ${customers.length} test customers`);

  // ─── 5. PRODUCTS ────────────────────────────────────────────────────
  const paresh = artisans[0];
  const mohan = artisans[1];
  const subal = artisans[2];

  const productData = [
    // ── Horses (3) ──
    {
      name: 'Classic Bankura Horse (Large)',
      slug: 'classic-bankura-horse-large',
      description: 'The iconic long-necked horse of Bishnupur, handcrafted in Panchmura using centuries-old techniques. This large statement piece captures the proud stance and flowing mane of the legendary Bankura horse. Each piece is shaped by hand, sun-dried for days, and fired in a traditional clay kiln.',
      price: 189900, categoryId: categories.horses.id, artisanId: paresh.id,
      stock: 10, material: 'Terracotta Clay', dimensions: '18 x 6 x 24 inches',
      isFeatured: true, isGITagged: true,
    },
    {
      name: 'Classic Bankura Horse (Medium)',
      slug: 'classic-bankura-horse-medium',
      description: 'Medium-sized traditional terracotta horse perfect for home decor. Handcrafted with the same care as our large horses, this piece fits beautifully on shelves, mantels, or as a centerpiece.',
      price: 99900, categoryId: categories.horses.id, artisanId: paresh.id,
      stock: 25, material: 'Terracotta Clay', dimensions: '12 x 4 x 16 inches',
      isFeatured: true, isGITagged: true,
    },
    {
      name: 'Mini Bankura Horse (Set of 3)',
      slug: 'mini-bankura-horse-set-3',
      description: 'A set of three miniature Bankura horses in graduating sizes. Ideal for gifting or creating a curated display. Each horse retains the iconic elongated neck and proud posture of the full-sized originals.',
      price: 79900, categoryId: categories.horses.id, artisanId: paresh.id,
      stock: 30, material: 'Terracotta Clay', dimensions: '4 x 2 x 6 / 6 x 3 x 8 / 8 x 3 x 10 inches',
      isGITagged: true,
    },

    // ── Idols (3) ──
    {
      name: 'Terracotta Ganesha (Large)',
      slug: 'terracotta-ganesha-large',
      description: 'A majestic Ganesha idol hand-molded with intricate detailing. The remover of obstacles sits in serene repose, adorned with traditional motifs. Perfect for puja rooms, festive decor, or as a meaningful gift.',
      price: 249900, categoryId: categories.idols.id, artisanId: subal.id,
      stock: 8, material: 'Terracotta Clay', dimensions: '10 x 6 x 14 inches',
      isFeatured: true, isGITagged: true,
    },
    {
      name: 'Durga Idol (Festival Special)',
      slug: 'durga-idol-festival',
      description: 'A stunning Durga idol crafted for the festive season. This limited-edition piece showcases the ten-armed goddess in all her glory, with meticulous attention to ornamentation and expression.',
      price: 349900, categoryId: categories.idols.id, artisanId: subal.id,
      stock: 5, material: 'Terracotta Clay', dimensions: '12 x 8 x 16 inches',
      isFeatured: true, isGITagged: true,
    },
    {
      name: 'Lakshmi Idol',
      slug: 'lakshmi-idol',
      description: 'The goddess of wealth and prosperity, rendered in terracotta with delicate hand-carved details. A timeless addition to your home temple or living room.',
      price: 199900, categoryId: categories.idols.id, artisanId: subal.id,
      stock: 12, material: 'Terracotta Clay', dimensions: '8 x 5 x 12 inches',
      isGITagged: true,
    },

    // ── Panels (3) ──
    {
      name: 'Tree of Life Wall Panel',
      slug: 'tree-of-life-wall-panel',
      description: 'A breathtaking wall panel depicting the Tree of Life, with intertwining branches, birds, and blossoms. Hand-carved by master artisan Mohan Bej, this piece transforms any wall into a gallery.',
      price: 399900, categoryId: categories.panels.id, artisanId: mohan.id,
      stock: 6, material: 'Terracotta Clay', dimensions: '24 x 1 x 30 inches',
      isFeatured: true, isGITagged: true,
    },
    {
      name: 'Peacock Relief Panel',
      slug: 'peacock-relief-panel',
      description: 'A stunning peacock in full display, rendered in high relief. The intricate feather detailing and graceful posture make this panel a conversation starter in any room.',
      price: 299900, categoryId: categories.panels.id, artisanId: mohan.id,
      stock: 8, material: 'Terracotta Clay', dimensions: '20 x 1 x 24 inches',
      isGITagged: true,
    },
    {
      name: 'Village Life Panel',
      slug: 'village-life-panel',
      description: 'A charming depiction of rural Bengal life, with farmers, thatched huts, and lush paddy fields. This panel captures the soul of the Bishnupur countryside in terracotta.',
      price: 249900, categoryId: categories.panels.id, artisanId: mohan.id,
      stock: 10, material: 'Terracotta Clay', dimensions: '18 x 1 x 22 inches',
      isGITagged: true,
    },

    // ── Jewelry (3) ──
    {
      name: 'Terracotta Necklace (Blue Lotus)',
      slug: 'terracotta-necklace-blue-lotus',
      description: 'A hand-painted terracotta necklace featuring lotus motifs in indigo blue. Lightweight and hypoallergenic, this piece bridges tradition and modern fashion.',
      price: 59900, categoryId: categories.jewelry.id, artisanId: subal.id,
      stock: 40, material: 'Terracotta Clay', dimensions: '18-inch chain',
      isFeatured: true,
    },
    {
      name: 'Terracotta Earrings (Traditional)',
      slug: 'terracotta-earrings-traditional',
      description: 'Lightweight drop earrings featuring traditional Bishnupur motifs. Hand-painted with natural pigments, each pair is unique.',
      price: 29900, categoryId: categories.jewelry.id, artisanId: subal.id,
      stock: 50, material: 'Terracotta Clay', dimensions: '2-inch drop',
    },
    {
      name: 'Terracotta Bangles (Set of 4)',
      slug: 'terracotta-bangles-set-4',
      description: 'A set of four hand-painted terracotta bangles in complementary earth tones. Comfortable, lightweight, and a perfect conversation starter.',
      price: 49900, categoryId: categories.jewelry.id, artisanId: subal.id,
      stock: 35, material: 'Terracotta Clay', dimensions: 'Standard bangle sizes',
    },

    // ── Decor (3) ──
    {
      name: 'Terracotta Vase (Matka)',
      slug: 'terracotta-vase-matka',
      description: 'A classic matka-shaped vase with a wide belly and narrow neck. Perfect for dried flowers, pampas grass, or as a standalone decor piece. The natural terracotta texture adds warmth to any space.',
      price: 79900, categoryId: categories.decor.id, artisanId: mohan.id,
      stock: 20, material: 'Terracotta Clay', dimensions: '8 x 8 x 12 inches',
      isFeatured: true,
    },
    {
      name: 'Decorative Lamp (Diya)',
      slug: 'decorative-lamp-diya',
      description: 'A hand-carved terracotta diya lamp with perforated patterns that cast beautiful shadows when lit. A blend of function and art for your evenings.',
      price: 44900, categoryId: categories.decor.id, artisanId: subal.id,
      stock: 25, material: 'Terracotta Clay', dimensions: '6 x 6 x 8 inches',
    },
    {
      name: 'Wall Hanging (Tree of Life)',
      slug: 'wall-hanging-tree-of-life',
      description: 'A compact wall hanging featuring the Tree of Life motif. Lighter and more affordable than our full panels, it is perfect for smaller spaces or gallery walls.',
      price: 129900, categoryId: categories.decor.id, artisanId: mohan.id,
      stock: 15, material: 'Terracotta Clay', dimensions: '12 x 1 x 15 inches',
    },

    // ── Planters (3) ──
    {
      name: 'Hanging Planter (Round)',
      slug: 'hanging-planter-round',
      description: 'A rustic round hanging planter with a rope hanger. Ideal for trailing plants like pothos or string of pearls. The porous terracotta keeps roots healthy.',
      price: 69900, categoryId: categories.planters.id, artisanId: paresh.id,
      stock: 30, material: 'Terracotta Clay', dimensions: '8 x 8 x 10 inches (with rope)',
    },
    {
      name: 'Tabletop Planter (Geometric)',
      slug: 'tabletop-planter-geometric',
      description: 'A modern geometric planter that pairs beautifully with succulents or cacti. The angular facets catch light and add a contemporary touch to your desk or windowsill.',
      price: 54900, categoryId: categories.planters.id, artisanId: paresh.id,
      stock: 35, material: 'Terracotta Clay', dimensions: '6 x 6 x 5 inches',
      isFeatured: true,
    },
    {
      name: 'Self-Watering Planter',
      slug: 'self-watering-planter',
      description: 'A cleverly designed terracotta planter with an internal water reservoir. The porous clay slowly wicks moisture to the soil, keeping plants hydrated for days.',
      price: 89900, categoryId: categories.planters.id, artisanId: paresh.id,
      stock: 18, material: 'Terracotta Clay', dimensions: '7 x 7 x 8 inches',
    },
  ];

  for (const prod of productData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }
  console.log(`  ✓ ${productData.length} products`);

  console.log('✅ Seed successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
