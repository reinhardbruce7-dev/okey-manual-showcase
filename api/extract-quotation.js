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
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return JSON.parse(cleaned);
}

async function extractFromText(text) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent([
    EXTRACTION_PROMPT,
    `\n\nHere is the supplier quotation document content:\n\n${text}`,
  ]);

  const response = await result.response;
  const textResponse = response.text();
  return parseJsonResponse(textResponse);
}

async function extractFromFile(fileBuffer, fileName, mimeType) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    generationConfig: {
      temperature: 0.1,
    },
  });

  const fileData = Array.from(new Uint8Array(fileBuffer));

  const result = await model.generateContent([
    EXTRACTION_PROMPT,
    {
      inlineData: {
        mimeType: mimeType,
        data: btoa(String.fromCharCode(...fileData)),
      },
    },
  ]);

  const response = await result.response;
  const textResponse = response.text();
  return parseJsonResponse(textResponse);
}

function getMimeType(fileName) {
  const ext = fileName.toLowerCase().split('.').pop();
  const mimeTypes = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

function arrayBufferToText(buffer) {
  const bytes = new Uint8Array(buffer);
  let text = '';
  for (let i = 0; i < bytes.length; i++) {
    text += String.fromCharCode(bytes[i]);
  }
  return text;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'AI service not configured. Please set GEMINI_API_KEY environment variable.',
    });
  }

  try {
    const contentType = req.headers['content-type'] || '';

    if (contentType.includes('multipart/form-data')) {
      // Parse multipart form data
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // Simple multipart parser
      const boundary = contentType.split('boundary=')[1];
      if (!boundary) {
        return res.status(400).json({ error: 'Invalid multipart data' });
      }

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
            const body = part.substring(bodyStart, bodyEnd);
            fileContent = body;
          }
        }
      }

      if (!fileContent) {
        return res.status(400).json({ error: 'No file found in upload' });
      }

      // For text-based files, try to extract text; for others, send as inline data
      const ext = fileName.split('.').pop().toLowerCase();

      if (ext === 'txt' || ext === 'csv') {
        const text = fileContent;
        const result = await extractFromText(text);
        return res.status(200).json(result);
      }

      // Convert to base64 for binary files
      const base64Data = Buffer.from(fileContent, 'binary').toString('base64');
      const fileData = Uint8Array.from(Buffer.from(base64Data, 'base64'));

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
      return res.status(200).json(parsed);
    }

    return res.status(400).json({ error: 'Unsupported content type' });
  } catch (error) {
    console.error('Gemini extraction error:', error);

    if (error.message?.includes('JSON')) {
      return res.status(500).json({
        error: 'AI returned an invalid extraction. Please try again.',
      });
    }

    if (error.message?.includes('API_KEY')) {
      return res.status(500).json({
        error: 'Invalid API key. Please check GEMINI_API_KEY configuration.',
      });
    }

    return res.status(500).json({
      error: 'AI extraction failed. Please try again or enter the quotation manually.',
    });
  }
}
