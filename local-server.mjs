import http from 'http';
import { Buffer } from 'buffer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PORT = 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is not set.');
  console.error('Run: GEMINI_API_KEY=your_key node local-server.mjs');
  process.exit(1);
}

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

function parseMultipart(buffer, boundary, contentType) {
  const parts = buffer.toString('binary').split('--' + boundary);
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

  return { fileContent, fileName, mimeType };
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  if (req.method !== 'POST' || req.url !== '/api/extract-quotation') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Not found' }));
  }

  try {
    const contentType = req.headers['content-type'] || '';

    if (!contentType.includes('multipart/form-data')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Unsupported content type' }));
    }

    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid multipart data' }));
    }

    // Read request body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const { fileContent, fileName, mimeType } = parseMultipart(buffer, boundary, contentType);

    if (!fileContent) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'No file found in upload' }));
    }

    console.log(`Extracting from: ${fileName} (${mimeType})`);

    const base64Data = Buffer.from(fileContent, 'binary').toString('base64');

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      generationConfig: {
        temperature: 0.1,
      },
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

    console.log('Extraction successful');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(parsed));
  } catch (error) {
    console.error('Extraction error:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'AI extraction failed. Please try again or enter the quotation manually.',
    }));
  }
});

server.listen(PORT, () => {
  console.log(`\n  Okey Manual API Server running on http://localhost:${PORT}`);
  console.log(`  Waiting for extraction requests...\n`);
});
