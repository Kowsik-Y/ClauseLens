# Architecture & Technology Stack

ClauseLens is a modern, high-performance web application built with a focus on clean architecture, strict typing, and exceptional user experience.

## Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **Components**: [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/)
- **Linting & Formatting**: [Biome](https://biomejs.dev/)
- **AI SDK**: `@google/genai`
- **Document Parsing**: `pdf-parse` (PDF), `mammoth` (DOCX)

## Repository Structure

The project has been intentionally flattened into a standard Next.js directory structure to simplify development and deployment:

```text
ClauseLens/
├── src/
│   ├── app/                 # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── api/             # Server-side API endpoints for AI interactions
│   │   ├── analyze/         # Document Analysis feature route
│   │   ├── compare/         # Document Comparison feature route
│   │   └── page.tsx         # Landing Page
│   ├── components/          # Reusable UI components (shadcn, Base UI)
│   └── lib/                 # Utility functions, type definitions, and parsing logic
├── public/                  # Static assets
├── docs/                    # Documentation
├── biome.json               # Strict linting and formatting configuration
├── tailwind.config.js       # Tailwind v4 configuration
└── package.json             # Consolidated dependency management
```

## GenAI Integration

ClauseLens leverages `gemini-2.5-flash` via the new `@google/genai` SDK for all natural language understanding.

### Structured Outputs (JSON Schema)
To ensure reliable rendering on the frontend, all AI endpoints enforce strict JSON schema outputs. This prevents the AI from returning unstructured markdown and allows the dashboard to predictably map data to React components (like the Risk Center, Key Clauses accordion, and Action Checklist).

### Server-Side Execution
All AI interactions are safely abstracted behind Next.js API Routes (`/src/app/api/...`).
- API keys are completely hidden from the client bundle.
- The UI never communicates directly with the Gemini API.

### Configurable Base URL
The API routes are configured to optionally accept a `GEMINI_BASE_URL` from the environment. This architectural decision enables developers to route traffic through custom OpenAI-compatible proxies, enterprise gateways, or alternative local AI endpoints seamlessly.

## Code Quality

ClauseLens uses **Biome** to enforce extremely strict codebase health.
- Prettier and ESLint have been entirely removed.
- Biome enforces a strict `noExplicitAny` policy, ensuring full end-to-end TypeScript safety.
- React rules strictly prevent unstable array index keys, preventing subtle UI rendering bugs.
