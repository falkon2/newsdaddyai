# Integrity News - AI-Powered Satirical News Platform

A modern, responsive news platform built with Next.js, Tailwind CSS, and Aceternity UI components. This frontend connects to the [Integrity Project backend](https://github.com/nyujuzer/integrityproject) to deliver AI-generated satirical news articles.

## Features

- **Beautiful UI**: Built with Aceternity UI, Tailwind CSS, and Magic UI components
- **Responsive Design**: Looks great on all devices, from mobile to desktop
- **Server-Side Rendering**: Fast loading times with Next.js SSR
- **Dark Mode Support**: Elegant dark mode implementation
- **Trending Articles**: See what's popular right now
- **Focus Cards**: Interactive, snapping cards for featured content
- **Smooth Scrolling**: Lenis-powered smooth scroll for a premium feel
- **Infinite Scrolling**: Load more content as you browse
- **Animation on Scroll**: Elements animate into view as you scroll
- **Tag Filtering**: Find articles by topic
- **User Accounts**: Personalized content based on user preferences
- **AI Article Generation**: Generate new satirical articles with one click

## Tech Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **UI Components**: Aceternity UI, Shadcn UI
- **Animation**: Framer Motion
- **Smooth Scrolling**: Lenis
- **Carousel**: Embla Carousel
- **Package Manager**: Bun
- **Backend Integration**: API services connected to the Integrity Project backend

## Getting Started

For detailed setup instructions, including how to set up the backend and use the article generation feature, see [SETUP.md](./docs/SETUP.md).

### Quick Start

```bash
# Install dependencies
bun install

# Start the development server
bun dev
```

## Getting Started

### Prerequisites

- Bun (for package management)
- Node.js (v18 or higher recommended)

### Installation

1. Clone the repository:

```bash
git clone https://your-repository-url/integrity.git
cd integrity
```

2. Install dependencies:

```bash
bun install
```

3. Create a `.env.local` file based on `.env.example` and set your environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Connecting to the Backend

This frontend is designed to work with the [Integrity Project backend](https://github.com/nyujuzer/integrityproject). Make sure the backend is running and accessible at the URL specified in your `.env.local` file.

## Building for Production

```bash
bun run build
bun run start
```

## Project Structure

- `src/components` - UI components organized by feature
- `src/pages` - Next.js pages and API routes
- `src/services` - API service functions for backend communication
- `src/styles` - Global styles and Tailwind configuration
- `src/types` - TypeScript type definitions
- `src/utils` - Utility functions

## License

[MIT](LICENSE)
