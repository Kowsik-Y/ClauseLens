# ClauseLens Setup Guide

This document outlines how to get ClauseLens running locally on your machine.

## Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm**: v9 or higher

## Environment Configuration

1. Create a `.env.local` file in the root of your project directory.
2. Configure the following variables:

```env
# API Key for Google Gemini (or a compatible provider proxy)
GEMINI_API_KEY=your_gemini_api_key_here

# Custom Base URL for the API (if using an OpenAI-compatible proxy or alternative endpoint)
GEMINI_BASE_URL=https://api.your-proxy.com/v1/

# Specific Model to use for generation (defaults to gemini-2.5-flash)
GEMINI_MODEL=gemini-2.5-flash
```


## Installation

Install the required dependencies from the root directory:

```bash
npm install
```

## Running the Application

To start the local development server:

```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## Linting & Formatting

The project uses [Biome](https://biomejs.dev/) for blazing-fast, strict formatting and linting.

To check for lint errors:
```bash
npm run lint
```

To automatically fix formatting and lint errors:
```bash
npm run lint:fix
```
