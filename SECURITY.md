# Security Policy

## Supported Versions
This project is currently in active development.

## Reporting a Vulnerability
Please email contact@clauselens.com with details. Do not open a public GitHub issue for security vulnerabilities.

## Security Practices
- All API keys are server-side only, never exposed to the client
- Files are processed in-memory and never persisted to disk
- Input is validated with Zod schemas before processing
- Rate limiting is applied to all AI endpoints
