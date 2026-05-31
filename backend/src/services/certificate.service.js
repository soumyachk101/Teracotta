import puppeteer from 'puppeteer';

export const certificateService = {
  async generate({ orderNumber, customerName, items, artisanName, artisanVillage }) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; padding: 40px; text-align: center; }
    .border { border: 3px solid #c4622d; padding: 40px; }
    h1 { color: #c4622d; font-size: 28px; }
    h2 { color: #3d1f0f; font-size: 20px; }
    .item { margin: 10px 0; font-size: 16px; }
    .artisan { color: #c4622d; font-weight: bold; }
    .footer { margin-top: 40px; font-size: 12px; color: #8a7567; }
  </style>
</head>
<body>
  <div class="border">
    <h1>Certificate of Authenticity</h1>
    <h2>Mitti Kala — Bishnupur Terracotta</h2>
    <p>This certifies that the following item(s) are authentic, GI-tagged terracotta crafts from Bishnupur, West Bengal.</p>
    <div class="item"><strong>Order:</strong> ${orderNumber}</div>
    <div class="item"><strong>Customer:</strong> ${customerName}</div>
    <hr/>
    ${items.map((item) => `<div class="item">${item.productName} — Handcrafted by <span class="artisan">${item.artisanName || artisanName}</span>, ${artisanVillage || 'Panchmura'}</div>`).join('')}
    <hr/>
    <p>Each piece is hand-shaped, sun-dried, and kiln-fired using techniques passed down through generations.</p>
    <div class="footer">
      <p>Mitti Kala | mittikala.com | Bishnupur, Bankura, West Bengal</p>
      <p>This certificate is auto-generated and valid without signature.</p>
    </div>
  </div>
</body>
</html>`;

    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdf;
  },
};
