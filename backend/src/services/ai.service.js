import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function chat(systemPrompt, userMessage) {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });
  return response.content[0].text;
}

export const aiService = {
  async nlpSearch(query) {
    const system = `You convert user search queries into a structured JSON filter object for a terracotta e-commerce store.
Available categories: horses, idols, panels, jewelry, decor, planters
Available sortBy values: price_asc, price_desc, rating, newest, popular
Price is in Indian Rupees (INR).
Respond ONLY with a valid JSON object. No preamble, no markdown.`;

    const result = await chat(system, `Search query: "${query}"\n\nReturn JSON with keys: { category, minPrice, maxPrice, sortBy, keywords }\nUse null for any field you cannot determine from the query.`);
    return JSON.parse(result);
  },

  async generateDescription(product) {
    const system = `You are a copywriter for Mitti Kala, a premium e-commerce platform for authentic Bishnupur terracotta crafts from West Bengal, India.
Your writing style is warm, cultured, and reverent of craft tradition. Evokes texture, history, and artisan skill. Uses specific sensory details. Avoids generic adjectives. Always mentions the artisan's name and village. Write 200-250 words.`;

    return chat(system, `Write a product description for:
- Product Name: ${product.name}
- Category: ${product.category}
- Material: ${product.material}
- Dimensions: ${product.dimensions}
- Artisan: ${product.artisan?.displayName || 'Unknown'}, ${product.artisan?.village || 'Bishnupur'}
- GI Tagged: ${product.isGITagged ? 'Yes' : 'No'}`);
  },

  async generateArtisanBio(artisan) {
    const system = `You are writing for Mitti Kala's "Meet the Artisan" section. Write in a journalistic, first-person-adjacent style. Begin with a vivid scene-setting sentence. Respect and dignity. Mention craft lineage. 150-180 words.`;

    return chat(system, `Write an artisan story for:
- Name: ${artisan.displayName}
- Village: ${artisan.village}
- Speciality: ${artisan.speciality || 'Traditional terracotta'}
- Years of experience: ${artisan.yearsExperience || 'many'}
- Bio: ${artisan.bio || 'A skilled artisan'}`);
  },

  async customerChat(message, conversationHistory = []) {
    const system = `You are Mala, the friendly customer support assistant for Mitti Kala — a premium terracotta craft e-commerce store from Bishnupur, West Bengal.
Personality: warm, knowledgeable about Indian crafts, slightly poetic, always helpful.
You can help with: order status, product info, care instructions, return/refund policy (7-day return, 3-5 day refund), shipping (4-7 days domestic), authenticity questions.
Keep responses concise — 2-4 sentences.`;

    const messages = [
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      system,
      messages,
    });
    return response.content[0].text;
  },

  async summarizeReviews(productName, reviews) {
    const system = `Summarise the following product reviews in exactly 2 sentences.
Sentence 1: What buyers love most.
Sentence 2: Any common concerns or caveats.
Be specific. Keep under 40 words. Plain text only.`;

    const reviewText = reviews.map((r) => `- "${r.body}" (${r.rating}★)`).join('\n');
    return chat(system, `Product: ${productName}\nReviews:\n${reviewText}`);
  },
};
