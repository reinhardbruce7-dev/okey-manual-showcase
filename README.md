# Okey Manual — AI-Powered Procurement & Supply Chain Platform

**Smarter Procurement. Stronger Supply Chains.**

> This is a Proof of Concept (POC) demonstrating the product experience and real Gemini AI integration for procurement document extraction.

---

## Architecture

```
USER
 ↓
FRONTEND (React + Vite)
 ↓
SECURE SERVERLESS GEMINI FUNCTION
 ↓
GEMINI API (Google AI)
 ↓
STRUCTURED JSON
 ↓
FRONTEND REVIEW SCREEN
```

The Gemini API key is **never** exposed to the browser. All AI requests flow through a secure serverless function.

---

## Features

- **Dashboard** — Real-time procurement overview
- **Supplier Directory** — 10 suppliers with detailed profiles and AI insights
- **RFQ Management** — Full RFQ lifecycle with 8 active RFQs
- **Quotation Management** — 15 pre-loaded quotations with manual entry
- **AI Quotation Extraction** — Real Gemini AI extraction from uploaded documents
- **AI Review Screen** — Editable extracted data with confidence indicators
- **Quotation Comparison** — Side-by-side supplier comparison with AI recommendations
- **Purchase Orders** — Generated POs with status tracking
- **Shipment Tracking** — Visual timeline tracking across 4 active shipments
- **Analytics** — Charts and KPIs for procurement performance
- **AI Intelligence** — Showcase of current and upcoming AI capabilities

---

## Setup

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. Copy the key

### 2. Deploy to Vercel

1. Push this project to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Import the repository
4. Add environment variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key
5. Deploy

### 3. Deploy to Netlify

1. Push this project to GitHub
2. Connect to [Netlify](https://netlify.com)
3. Import the repository
4. Add environment variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key
5. Deploy

### 4. Local Development

```bash
cd frontend
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` and proxies `/api` requests.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes (for AI extraction) |

**NEVER** put the API key in:
- Frontend JavaScript
- HTML or CSS
- Git repository
- Client-side configuration

---

## Project Structure

```
frontend/
├── api/
│   └── extract-quotation.js    # Vercel serverless function
├── netlify/functions/
│   └── extract-quotation.js    # Netlify serverless function
├── public/
│   └── assets/
├── src/
│   ├── components/             # Sidebar, Topbar, Toast
│   ├── pages/                  # All application pages
│   ├── data/                   # Mock procurement data
│   ├── store.js                # Zustand global state
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind + custom styles
├── vercel.json                 # Vercel configuration
├── netlify.toml                # Netlify configuration
└── README.md
```

---

## Demo Flow

1. Open **Dashboard**
2. Navigate to **RFQs**
3. Open **RFQ-2026-014** (Industrial Solar Panels)
4. Click **Add Quotation**
5. Select **AI Extract from Document**
6. Upload a supplier quotation (PDF, DOCX, XLSX, or image)
7. Click **Extract with AI**
8. Gemini processes the document and returns structured JSON
9. Review extracted information on the **AI Review Screen**
10. Edit any fields if needed
11. Click **Approve Quotation**
12. Confirm it appears in the RFQ and **Quotations** page
13. Open **Compare** to compare all suppliers
14. Select a supplier
15. View the generated **Purchase Order**
16. Check **Shipments** for tracking timeline

---

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Google Gemini 2.0 Flash via `@google/generative-ai`
- **Deployment**: Vercel / Netlify (serverless functions)

---

## Security

- The Gemini API key is stored **only** as a server-side environment variable
- All AI requests go through a secure serverless function
- The API key is **never** present in browser JavaScript, HTML, CSS, or Git
- Document uploads are processed in memory and not stored permanently

---

## Notes

- This is a **Proof of Concept**, not a production application
- All supplier data, RFQs, and quotations are realistic mock data
- The only real external integration is the Gemini AI extraction
- No database, authentication, or payment system is included
- The application is designed to demonstrate the product experience
