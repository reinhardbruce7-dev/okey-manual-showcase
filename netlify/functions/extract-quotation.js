import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const EXTRACTION_PROMPT = `You are an AI procurement document extraction engine.

Extract procurement and commercial information from the supplied supplier quotation.

Only extract information explicitly present in the document.
Do not invent missing information.
Preserve numerical values accurately.
Identify currency.
Identify supplier information.
Identify quotation reference and dates.
Extract every quoted product/item.
Extract quantities, units, unit prices and subtotals.
Extract discounts, taxes, shipping costs and final totals.
Extract Incoterms, payment terms, MOQ, warranty and lead time where available.

If information cannot be found, return null or "Not found".

Return ONLY valid structured JSON matching this schema:
{
  "supplier_name": "",
  "supplier_contact": "",
  "quotation_reference": "",
  "quotation_date": "",
  "valid_until": "",
  "currency": "",
  "items": [
    {
      "product_name": "",
      "specification": "",
      "quantity": 0,
      "unit": "",
      "unit_price": 0,
      "subtotal": 0
    }
  ],
  "discount": 0,
  "tax": 0,
  "total": 0,
  "shipping_cost": 0,
  "freight_method": "",
  "incoterms": "",
  "lead_time": "",
  "estimated_delivery": "",
  "payment_terms": "",
  "warranty": "",
  "moq": "",
  "notes": ""
}

Important: Return ONLY the JSON object. No markdown formatting, no code blocks, no explanation.`;

function parseJsonResponse(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return JSON.parse(cleaned);
}

export const handler = async (event) => {
  // CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'AI service not configured. Set GEMINI_API_KEY in Netlify environment variables.' }),
    };
  }

  try {
    const contentType = event.headers['content-type'] || '';

    if (contentType.includes('multipart/form-data')) {
      const boundary = contentType.split('boundary=')[1];
      if (!boundary) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid multipart data' }) };
      }

      const body = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'binary');
      const parts = body.toString('binary').split('--' + boundary);
      let fileContent = null;
      let fileName = 'quotation.pdf';
      let mimeType = 'application/pdf';

      for (const part of parts) {
        if (part.includes('filename=')) {
          const headerMatch = part.split('\r\n\r\n');
          if (headerMatch.length >= 2) {
            const header = headerMatch[0];
            const fileMatch = header.match(/filename="([^"]+)"/);
            const mimeMatch = header.match(/Content-Type:\s*([^\r\n]+)/);
            if (fileMatch) fileName = fileMatch[1];
            if (mimeMatch) mimeType = mimeMatch[1];

            const bodyStart = part.indexOf('\r\n\r\n') + 4;
            const bodyEnd = part.lastIndexOf('\r\n');
            fileContent = part.substring(bodyStart, bodyEnd);
          }
        }
      }

      if (!fileContent) {
        return { statusCode: 400, body: JSON.stringify({ error: 'No file found in upload' }) };
      }

      const base64Data = Buffer.from(fileContent, 'binary').toString('base64');

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.6-flash',
        generationConfig: { temperature: 0.1 },
      });

      const result = await model.generateContent([
        EXTRACTION_PROMPT,
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
      ]);

      const response = await result.response;
      const textResponse = response.text();
      const parsed = parseJsonResponse(textResponse);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Unsupported content type' }) };
  } catch (error) {
    console.error('Gemini extraction error:', error);

    if (error.message?.includes('JSON')) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'AI returned an invalid extraction. Please try again.' }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'AI extraction failed. Please try again or enter the quotation manually.',
      }),
    };
  }
};
