# MerkatoNet Ethiopia

[MerkatoNet Website] (https://merkatoNet.xyz)

MerkatoNet is an agricultural market connection platform that connects Ethiopian farmers and buyers. The platform features real-time market prices, product listings, and SMS notification capabilities.

## Features

- **Authentication System**: Firebase-based authentication with phone number and Google sign-in options
- **Market Price Tracking**: Real-time updates on agricultural product prices
- **Product Listings**: Browse and search for various agricultural products
- **SMS Notifications**: Subscribe to price alerts via SMS for commodities you're interested in
- **Multilingual Support**: Available in English and Amharic
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Authentication
- **SMS Service**: Twilio (configurable)
- **State Management**: React Query
- **Routing**: Wouter

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Environment Setup

The project requires the following environment variables:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id

# Optional: Twilio for SMS (not required for development)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MerkatoNet-ethiopia.git
   cd MerkatoNet-ethiopia
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`


## Project Structure

```
├── client/              # Frontend code
│   └── src/
│       ├── components/  # React components
│       ├── context/     # Context providers
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Utility functions
│       └── pages/       # Page components
├── server/              # Backend code
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage layer
│   └── twilio.ts        # Twilio integration
└── shared/              # Shared code
    └── schema.ts        # Database schema
```

## API Endpoints

- `GET /api/market/prices/current` - Get current market prices
- `GET /api/market/prices/history` - Get historical price data
- `GET /api/market/insights` - Get market insights and analysis
- `POST /api/sms/subscribe` - Subscribe to SMS price alerts
- `POST /api/sms/unsubscribe` - Unsubscribe from SMS alerts
- `GET /api/sms/status` - Check SMS subscription status

## Deployment

The application is configured for deployment on Replit.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Firebase](https://firebase.google.com/) - Authentication and database
- [Twilio](https://www.twilio.com/) - SMS service
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
