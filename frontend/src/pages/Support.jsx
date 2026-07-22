import { Link } from 'react-router-dom';

function InfoLayout({ title, subtitle, children }) {
  return (
    <div className="section">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="mb-4">{title}</h1>
          <p className="text-lg text-stone-600">{subtitle}</p>
        </div>
        {children}
        <div className="text-center mt-12">
          <p className="text-stone-600 mb-4">Still have questions?</p>
          <Link to="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    q: 'Are your products genuinely handmade?',
    a: 'Yes. Every piece is handcrafted by master artisans of Bishnupur and Panchmura using traditional techniques — no machines, no mass production. Eligible products carry the GI (Geographical Indication) tag badge.',
  },
  {
    q: 'What is the GI tag?',
    a: 'The Geographical Indication tag certifies that Bishnupur terracotta is produced in its place of origin using traditional methods. It is a government-backed mark of authenticity.',
  },
  {
    q: 'Do artisans really benefit from my purchase?',
    a: 'Artisans receive 70%+ of the sale price. We connect them directly with buyers, removing the middlemen who traditionally take 40–60% margin.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'UPI, credit/debit cards, net banking and wallets via Razorpay. International cards are supported via Stripe. Cash on Delivery is available for select pin codes, and EMI on orders above ₹3,000.',
  },
  {
    q: 'Do I need an account to order?',
    a: 'No — guest checkout is supported. An account lets you track orders, save addresses and maintain a wishlist.',
  },
  {
    q: 'Are terracotta pieces fragile? How are they packed?',
    a: 'Terracotta is fired clay and needs careful handling. Every piece is packed in multiple layers of protective cushioning inside a rigid box, and cartons are marked fragile.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes, we ship worldwide via DHL/FedEx. Domestic orders ship through Shiprocket partners. See our Shipping Info page for timelines.',
  },
  {
    q: 'Will I get a certificate of authenticity?',
    a: 'Yes. Every order includes an auto-generated Certificate of Authenticity for your pieces.',
  },
];

export function FAQ() {
  return (
    <InfoLayout
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about our terracotta crafts, shipping and more."
    >
      <div className="space-y-4">
        {faqs.map(({ q, a }) => (
          <details key={q} className="card-section group">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              {q}
              <span className="text-terracotta-600 transition-transform group-open:rotate-45 text-xl leading-none ml-4">
                +
              </span>
            </summary>
            <p className="text-stone-600 text-sm mt-3 leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </InfoLayout>
  );
}

export function ShippingInfo() {
  return (
    <InfoLayout
      title="Shipping Information"
      subtitle="From the artisan's kiln in Bishnupur to your doorstep, safely."
    >
      <div className="space-y-6">
        <div className="card-section">
          <h3 className="font-display text-xl font-semibold mb-3">Domestic Shipping (India)</h3>
          <ul className="text-stone-600 text-sm space-y-2 leading-relaxed list-disc pl-5">
            <li>Shipped via trusted Shiprocket courier partners.</li>
            <li>Dispatch within 2–4 business days of order confirmation — each piece is inspected and packed by hand.</li>
            <li>Delivery in 4–8 business days depending on your location.</li>
            <li>Pin-code serviceability is checked at checkout.</li>
            <li>Tracking link sent by email/SMS on dispatch.</li>
          </ul>
        </div>
        <div className="card-section">
          <h3 className="font-display text-xl font-semibold mb-3">International Shipping</h3>
          <ul className="text-stone-600 text-sm space-y-2 leading-relaxed list-disc pl-5">
            <li>Shipped worldwide via DHL / FedEx.</li>
            <li>Delivery in 8–15 business days depending on destination.</li>
            <li>Customs duties and import taxes, where applicable, are payable by the recipient.</li>
          </ul>
        </div>
        <div className="card-section">
          <h3 className="font-display text-xl font-semibold mb-3">Packaging</h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            Terracotta is delicate. Every piece is wrapped in multiple layers of protective
            cushioning and shipped in rigid, fragile-marked cartons. In the rare case of
            transit damage, see our Returns &amp; Refunds policy.
          </p>
        </div>
      </div>
    </InfoLayout>
  );
}

export function Returns() {
  return (
    <InfoLayout
      title="Returns & Refunds"
      subtitle="Handcrafted with care — and backed by a fair, simple policy."
    >
      <div className="space-y-6">
        <div className="card-section">
          <h3 className="font-display text-xl font-semibold mb-3">Damaged in Transit</h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            If your piece arrives broken or damaged, contact us within 48 hours of delivery
            with photos of the item and packaging. We will send a free replacement or issue
            a full refund — no need to ship the damaged piece back.
          </p>
        </div>
        <div className="card-section">
          <h3 className="font-display text-xl font-semibold mb-3">Returns</h3>
          <ul className="text-stone-600 text-sm space-y-2 leading-relaxed list-disc pl-5">
            <li>Returns are accepted within 7 days of delivery for unused items in original packaging.</li>
            <li>Since each piece is handmade, slight variations in colour, texture and finish are natural — they are marks of authenticity, not defects, and are not grounds for return.</li>
            <li>Custom and bespoke orders are non-returnable.</li>
          </ul>
        </div>
        <div className="card-section">
          <h3 className="font-display text-xl font-semibold mb-3">Refunds</h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            Once your return is received and inspected, refunds are processed to the original
            payment method within 5–7 business days. COD orders are refunded via bank transfer
            or UPI.
          </p>
        </div>
      </div>
    </InfoLayout>
  );
}
