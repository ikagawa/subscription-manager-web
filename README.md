# Subscription Manager Web App

A modern web application for tracking and managing your subscriptions. Monitor monthly and annual costs, organize subscriptions by category, and get reminders for upcoming renewals.

## Features

- **Dashboard**: View monthly/annual costs, active subscriptions, and upcoming renewals
- **Subscription List**: Browse all subscriptions with category filtering and search
- **Add/Edit Subscriptions**: Manage subscription details with date pickers and validation
- **Settings**: Configure currency, notifications, and data management
- **Local Storage**: All data stored locally in your browser
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## Development

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/        # Reusable components
├── context/          # React Context for state management
├── pages/            # Page components
├── utils/            # Utility functions
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Data Storage

All subscription data is stored in your browser's localStorage. Data persists between sessions but is device-specific.

### Export Data

Use the Settings page to export your subscriptions as CSV for backup.

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the dist folder to Netlify
```

## Features Coming Soon

- Push notifications for renewal reminders
- Cloud sync across devices
- Spending analytics and charts
- Subscription sharing with family
- Multi-currency support

## License

MIT

## Support

For issues or feature requests, please open an issue on GitHub.
