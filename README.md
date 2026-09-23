# ClauseLens: AI Legal Document Copilot

ClauseLens is a GenAI-powered legal information assistant that helps users understand, compare, and navigate legal documents. It converts complex legal jargon into plain English, extracts critical obligations, detects potential risks, and allows users to ask questions directly against the document text.

This project was built for the PromptWars: Virtual (Exclusive Edition) challenge.

## Chosen Vertical

Legal Tech / Document Understanding

## Problem Statement

Legal documents (contracts, NDAs, terms of service) are notoriously dense and difficult for the average person to understand. Individuals and small businesses often sign agreements without fully comprehending the hidden risks, implicit obligations, or complex clauses buried in the fine print. Retaining a lawyer for every minor contract is prohibitively expensive and time-consuming, leaving a massive gap in legal accessibility. ClauseLens solves this by leveraging GenAI to instantly translate legalese into actionable, plain-English insights, empowering users to make informed decisions and better prepare for professional legal counsel.

## How the Solution Works

- **Document Analysis**: Upload a PDF/DOCX or paste text to generate a structured, plain-English executive summary.
- **Clause Extraction**: Automatically identifies and categorizes key clauses with direct source citations.
- **Risk Detection**: Highlights unusual terms, potential liabilities, and areas of concern categorized by severity.
- **Obligations Tracking**: Extracts obligations by party with corresponding triggers or deadlines.
- **Grounded Q&A**: Ask any question and get answers based strictly on the uploaded document text.
- **Comparison Mode**: Compare two versions of a contract to detect meaningful legal changes and their impact.
- **Checklist Generation**: Auto-generates actionable next steps and questions to prepare for professional legal review.
- **Customizable AI**: Supports dynamic custom base URLs and Gemini models directly from the UI.

## Documentation

For more in-depth information about the project, refer to the following documentation files:

- [Local Setup & Configuration](docs/SETUP.md)
- [Architecture & Tech Stack](docs/ARCHITECTURE.md)

## Approach and Logic

ClauseLens relies on a multi-modal approach:
1. **Extraction**: Uploaded documents (PDFs, DOCX) are parsed entirely on the server using edge-friendly libraries (`pdf-parse`, `mammoth`).
2. **Generative AI Analysis**: The raw text is passed to Google's Gemini models with a strict JSON schema prompt to extract structural components (summary, clauses, risks, obligations).
3. **Structured Rendering**: The React frontend maps this structured JSON into an intuitive, user-friendly dashboard, categorizing risks by severity and clauses by relevance.
4. **Agentic Q&A**: Users can ask contextual questions, which are resolved by grounding the prompt entirely in the uploaded document text.

## Project Architecture

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui + Base UI
- **Linting**: Biome
- **AI SDK**: `@google/genai` (Gemini 2.5 Flash)
- **Parsing**: `pdf-parse`, `mammoth`

### Boilerplate Structure
```text
ClauseLens/
├── src/
│   ├── app/                 # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── api/             # Server-side API endpoints for AI interactions
│   │   ├── analyze/         # Document Analysis feature route
│   │   ├── compare/         # Document Comparison feature route
│   │   └── page.tsx         # Landing Page
│   ├── components/          # Reusable UI components
│   └── lib/                 # Utility functions, type definitions, and parsing logic
├── public/                  # Static assets
├── tests/                   # Vitest unit test suites
├── docs/                    # Detailed setup and architectural documentation
├── biome.json               # Strict linting and formatting configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json             # Consolidated dependency management
```

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Code Quality Commands:**
```bash
# Run Biome linter
npm run lint

# Auto-fix linting & formatting errors
npm run lint:fix

# Run Vitest test suite
npm run test
```

Remember to copy the environment template and set your API keys! (See [SETUP.md](docs/SETUP.md) for details).

## Security

ClauseLens is designed with privacy and security as a priority:
- **API Keys**: The `GEMINI_API_KEY` is strictly kept server-side and never exposed to the client bundle. The Next.js API routing isolates the UI from direct API communications.
- **File Handling**: Uploaded documents are processed entirely in-memory during the request lifecycle. No files are permanently stored on the server.
- **Data Retention**: Since no data is persisted to a database, your document analysis remains entirely ephemeral.
- **Input Validation**: Uploaded files are validated by type and length constraints before any AI processing begins.

## Assumptions Made

**ClauseLens provides legal information and document understanding, not legal advice.** 

The AI-generated analysis, summaries, risks, and obligations are provided for educational and preparatory purposes only. It is designed to help you prepare for a conversation with a qualified legal professional, not replace one. You should always consult with a licensed attorney before making any decisions based on the output of this application.

## Evaluation Focus Areas

ClauseLens has been heavily optimized specifically to meet the PromptWars: Virtual (Exclusive Edition) requirements:
- **Code Quality**: Built on a modern, flattened Next.js App Router architecture. Employs Biome with strict `noExplicitAny` validation, zero React array index key warnings, and highly maintainable components.
- **Security**: The Gemini API executes 100% server-side, protecting sensitive tokens. Files are read in memory via Next.js routes and instantly discarded, ensuring no lingering data traces.
- **Efficiency**: Generative AI calls are restricted by custom response schemas. The frontend employs native React server components where possible to optimize initial payloads.
- **Testing**: Includes a Vitest test suite (`npm run test`) validating internal application utility logic without forcing excessive DOM mocks for simple operations.
- **Accessibility**: Employs heavily tested, accessible primitive components (`shadcn/ui`, `Base UI`), semantic HTML markup, screen-reader text (`sr-only`), and appropriate contrast scaling for dark/light modes.
