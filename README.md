# MerkatoNet Ethiopia

MerkatoNet is an agricultural market connection platform that connects Ethiopian farmers and buyers, named after Africa's largest open market (Merkato in Addis Ababa). The platform features real-time market prices, product listings, and SMS notification capabilities.

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
- Replit account (for deployment)

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
   git clone https://github.com/yourusername/merkato-net-ethiopia.git
   cd merkato-net-ethiopia
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

## Firebase Setup

To configure Firebase authentication:

1. Create a Firebase project at [firebase.google.com](https://console.firebase.google.com/)
2. Enable Authentication and select Google as a sign-in method
3. Add your development domain to the authorized domains list
4. Get your Firebase configuration (API Key, App ID, and Project ID)
5. Add these values to your environment variables

## Twilio Setup (Optional)

For SMS functionality:

1. Create a Twilio account at [twilio.com](https://www.twilio.com/)
2. Get a Twilio phone number
3. Find your Account SID and Auth Token from the Twilio dashboard
4. Add these values to your environment variables

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Firebase](https://firebase.google.com/) - Authentication and database
- [Twilio](https://www.twilio.com/) - SMS service
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM