import { Helmet } from 'react-helmet-async';

export default function SEOHead({
  title = 'Mitti Kala — Authentic Bishnupur Terracotta',
  description = 'Premium handcrafted terracotta products from the master artisans of Bishnupur and Panchmura, West Bengal. GI-tagged, authentic, artisan-made.',
  image,
  url,
  type = 'website',
}) {
  const fullTitle = title === 'Mitti Kala' ? title : `${title} | Mitti Kala`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="Mitti Kala" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
