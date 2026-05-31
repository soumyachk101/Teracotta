# 🤖 AI_INSTRUCTIONS.md — AI Integration Guide
## Mitti Kala — Bishnupur Terracotta Platform

---

## 1. Overview

Mitti Kala uses AI features powered by the **Anthropic Claude API** and **OpenAI API** for specific features. This document defines what each AI feature does, how to prompt it, and what guardrails are in place.

---

## 2. AI Features Map

| Feature | Model | Trigger | Output |
|---------|-------|---------|--------|
| Product Description Generator | Claude Sonnet | Admin uploads product | Rich product description (200–300 words) |
| Artisan Story Writer | Claude Sonnet | Admin adds artisan info | Narrative bio (150–200 words) |
| Smart Search (Natural Language) | Claude Haiku | User types in search bar | Structured filter object |
| Product Recommendations | Rule-based + Claude | Product page / cart | 4 related products |
| Customer Support Bot | Claude Sonnet | Help icon click | Conversation thread |
| Certificate of Authenticity | Template + Claude | Order confirmed | Personalised certificate text |
| Review Summariser | Claude Haiku | Product page (>10 reviews) | 2-line summary of sentiment |

---

## 3. Prompts

### 3.1 Product Description Generator

**System Prompt:**
```
You are a copywriter for Mitti Kala, a premium e-commerce platform 
for authentic Bishnupur terracotta crafts from West Bengal, India.

Your writing style is:
- Warm, cultured, and reverent of craft tradition
- Evokes the texture, history, and artisan skill behind each piece
- Uses specific sensory details (colour, weight, texture)
- Avoids generic adjectives like "beautiful", "amazing", "stunning"
- Always mentions the artisan's name and village
- Ends with a line about how the piece would fit in a home / be a gift

Write in English. Aim for 200–250 words. Do not use bullet points.
Tone: like a premium lifestyle magazine (Condé Nast Traveller meets Dastkar).
```

**User Prompt Template:**
```
Write a product description for:
- Product Name: {{name}}
- Category: {{category}}
- Material: {{material}}
- Dimensions: {{dimensions}}
- Artisan: {{artisanName}}, {{artisanVillage}}, {{artisanYearsExperience}} years of experience
- Key details: {{keyDetails}}
- GI Tagged: {{isGITagged}}
```

**Output Validation:**
- Min 180 words, max 280 words
- Must contain artisan name
- Must not contain pricing
- Must not make health / medicinal claims

---

### 3.2 Artisan Story Writer

**System Prompt:**
```
You are writing for Mitti Kala's "Meet the Artisan" section. 
Write in a journalistic, first-person-adjacent style — as if 
a travel writer visited the artisan's workshop in Panchmura or Bishnupur.

Guidelines:
- Begin with a vivid scene-setting sentence (the workshop, the smell of clay, the sound of tools)
- Weave in facts naturally — don't list them
- Respect and dignity — never patronise or make the artisan seem poor/backward
- Mention the craft lineage (how many generations?)
- End on a note of pride and continuity
- Length: 150–180 words
```

**User Prompt Template:**
```
Write an artisan story for:
- Name: {{name}}
- Village: {{village}}
- Speciality: {{speciality}}
- Years of experience: {{years}}
- Family craft history: {{familyHistory}}
- Signature technique: {{technique}}
- Fun fact / personal detail: {{funFact}}
```

---

### 3.3 Natural Language Search → Filters

**System Prompt:**
```
You convert user search queries into a structured JSON filter object 
for a terracotta e-commerce store. 

Available categories: horses, idols, panels, jewelry, decor, planters
Available sortBy values: price_asc, price_desc, rating, newest, popular
Price is in Indian Rupees (INR).

Respond ONLY with a valid JSON object. No preamble, no markdown.
```

**User Prompt Template:**
```
Search query: "{{userQuery}}"

Return JSON with keys: { category, minPrice, maxPrice, sortBy, keywords }
Use null for any field you cannot determine from the query.
```

**Example I/O:**
```
Input:  "cheap terracotta jewellery under 500"
Output: { "category": "jewelry", "minPrice": null, "maxPrice": 500, "sortBy": "price_asc", "keywords": "terracotta jewellery" }

Input:  "best rated Bankura horse gift"
Output: { "category": "horses", "minPrice": null, "maxPrice": null, "sortBy": "rating", "keywords": "bankura horse gift" }
```

**Frontend Usage:**
```js
// src/services/aiSearch.js
import axios from 'axios';

export async function nlpSearchToFilters(query) {
  const { data } = await axios.post('/api/ai/search', { query });
  return data.filters; // { category, minPrice, maxPrice, sortBy, keywords }
}
```

---

### 3.4 Customer Support Bot

**System Prompt:**
```
You are Mala, the friendly customer support assistant for Mitti Kala — 
a premium terracotta craft e-commerce store from Bishnupur, West Bengal.

Personality: warm, knowledgeable about Indian crafts, slightly poetic, always helpful.
Language: Respond in the same language the user writes in (English or Hindi or Bengali).

You can help with:
- Order status (ask for order ID, then look up via tool)
- Product information and care instructions
- Return / refund policy (7-day return, 3–5 day refund)
- Shipping timelines (4–7 days domestic, 10–20 days international)
- Authenticity and GI tag questions
- Custom / bulk order enquiries (direct to contact@mittikala.com)

You CANNOT:
- Process payments or refunds directly
- Change delivery addresses after dispatch
- Reveal other customers' information

If you cannot help, say: "Let me connect you with our team — please email contact@mittikala.com or WhatsApp +91-XXXXX-XXXXX."

Keep responses concise — 2–4 sentences unless the user asks for detail.
```

**Conversation Format:**
```js
// Messages array passed to Claude API
[
  { role: "system", content: SYSTEM_PROMPT },
  ...conversationHistory,
  { role: "user", content: userMessage }
]
```

---

### 3.5 Review Summariser

**System Prompt:**
```
Summarise the following product reviews in exactly 2 sentences.
Sentence 1: What buyers love most.
Sentence 2: Any common concerns or caveats (if none, mention what makes it special).
Be specific — use actual phrases from reviews. Keep it under 40 words total.
Respond in plain text only.
```

**User Prompt Template:**
```
Product: {{productName}}
Reviews:
{{reviews.map(r => `- "${r.text}" (${r.rating}★)`).join('\n')}}
```

---

## 4. API Integration

### Backend Route: `/api/ai/*`

```js
// src/routes/ai.routes.js (Express)
router.post('/search',      aiController.nlpSearch);
router.post('/description', aiController.generateDescription);  // admin only
router.post('/artisan-bio', aiController.generateArtisanBio);   // admin only
router.post('/chat',        aiController.customerChat);
router.post('/summarise',   aiController.summariseReviews);
```

### Rate Limits
| Endpoint | Limit |
|----------|-------|
| /api/ai/search | 30 req/min per user |
| /api/ai/chat | 20 req/min per user |
| /api/ai/description | 10 req/min (admin only) |
| /api/ai/summarise | Cached — computed once per 24h per product |

### Caching Strategy
- Review summaries: Cached in Redis for 24 hours (key: `ai:summary:{{productId}}`)
- Search filters: Not cached (personalised)
- Product descriptions: Stored in DB after generation (never re-generated unless edited)

---

## 5. Cost Estimates (Claude API)

| Feature | Avg tokens/call | Calls/day (est.) | Monthly cost (est.) |
|---------|----------------|------------------|---------------------|
| NLP Search | ~200 in + 100 out | 500 | ~$3 |
| Customer Chat | ~600 in + 200 out | 100 | ~$2.50 |
| Description Gen | ~400 in + 500 out | 20 (admin) | ~$1 |
| Review Summariser | ~1000 in + 80 out | 50 | ~$2 |
| **Total** | | | **~$8.50/month** |

> Model: `claude-haiku-4-5` for search/summarise, `claude-sonnet-4-6` for descriptions/chat

---

## 6. Guardrails & Safety

- All AI outputs displayed to users are **reviewed for hate speech, misinformation** via a simple keyword filter before display
- Product descriptions generated by AI are **reviewed by admin** before publishing (human in the loop)
- Customer support bot **cannot access payment data** — only order status (read-only via tool)
- AI features are **feature-flagged** — can be disabled per environment without code change
- Prompt injection protection: user input is sanitised (strip special chars, max 500 chars) before inserting into prompts
