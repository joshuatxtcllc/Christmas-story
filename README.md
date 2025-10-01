# Christmas-story
# 🎄 Jay’s Frames

> Transform your family into holiday movie characters with AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)

## 🎬 Overview

Jay’s Frames is an AI-powered e-commerce platform that creates custom cartoon illustrations of families as characters from classic holiday movies (Home Alone, Elf, Christmas Vacation). Customers upload photos, select a movie theme, and receive a unique digital illustration they can download or order as a print.

## ✨ Features

- **AI Image Generation**: Custom family illustrations using Replicate/Flux models
- **3 Movie Themes**: Home Alone, Elf, and Christmas Vacation
- **Multiple Products**: Digital downloads, framed prints, and canvas prints
- **Secure Payments**: Stripe integration with webhooks
- **Email Delivery**: Automated SendGrid emails with download links
- **Print-on-Demand**: Optional Printful integration
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Production Ready**: Enterprise-level architecture

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend    │─────▶│  PostgreSQL │
│   (Vercel)  │      │  (Railway)   │      │  (Railway)  │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
         ┌────▼───┐    ┌────▼────┐   ┌───▼────┐
         │   S3   │    │ Stripe  │   │SendGrid│
         │  (AWS) │    │         │   │        │
         └────────┘    └─────────┘   └────────┘
                            │
                       ┌────▼────┐
                       │Replicate│
                       │   AI    │
                       └─────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL 14+
- AWS Account (S3)
- Stripe Account
- SendGrid Account
- Replicate Account

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/jaysframes.git
cd jaysframes
```

1. **Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

1. **Setup environment variables**

```bash
# Backend
cp .env.example .env
# Edit .env with your credentials

# Frontend
cp .env.example .env
# Edit .env with your frontend config
```

1. **Setup database**

```bash
cd backend
npm run migrate
```

1. **Start development servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

1. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

### Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
jaysframes/
├── backend/
│   ├── src/
│   │   ├── server.ts          # Main Express server
│   │   ├── services/
│   │   │   ├── ai-service.ts  # AI generation logic
│   │   │   └── email-service.ts # Email templates
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── database/
│   │       └── schema.sql     # PostgreSQL schema
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main React component
│   │   ├── components/
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── MovieSelector.tsx
│   │   │   ├── CheckoutForm.tsx
│   │   │   └── OrderStatus.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── railway.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=...
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG....
REPLICATE_API_TOKEN=r8_...
```

**Frontend (.env)**

```bash
VITE_API_URL=https://api.jaysframes.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 🚢 Deployment

### Railway (Backend)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📊 API Documentation

### Endpoints

**POST /api/upload**
Upload family photos

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.jpg"
```

**POST /api/orders/create**
Create new order

```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "images": [...],
    "movieTheme": "home_alone",
    "customerEmail": "user@example.com",
    "customerName": "John Doe"
  }'
```

**GET /api/orders/:orderId**
Check order status

**POST /api/webhooks/stripe**
Stripe webhook handler

## 💳 Pricing

|Product         |Price |Description           |
|----------------|------|----------------------|
|Digital Download|$19.99|High-res digital file |
|8x10 Print      |$49.99|Framed print          |
|11x14 Print     |$69.99|Large framed print    |
|16x20 Canvas    |$89.99|Gallery-wrapped canvas|

## 🛠️ Tech Stack

**Frontend**

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Stripe Elements

**Backend**

- Node.js
- Express
- TypeScript
- PostgreSQL
- Stripe
- SendGrid
- Replicate AI

**Infrastructure**

- Railway (Backend + DB)
- Vercel (Frontend)
- AWS S3 (Storage)
- CloudFlare (CDN)

## 📈 Performance

- API Response Time: < 500ms
- AI Generation: 2-4 minutes
- Image Upload: < 3 seconds
- Page Load: < 2 seconds

## 🔐 Security

- HTTPS enforced
- Rate limiting enabled
- SQL injection protection
- XSS protection via Helmet
- CORS properly configured
- Environment secrets encrypted
- PCI DSS compliant (Stripe)

## 🤝 Contributing

1. Fork the repository
1. Create feature branch (`git checkout -b feature/amazing-feature`)
1. Commit changes (`git commit -m 'Add amazing feature'`)
1. Push to branch (`git push origin feature/amazing-feature`)
1. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see <LICENSE> file.

## 🙏 Acknowledgments

- Replicate for AI models
- Stripe for payment processing
- SendGrid for email delivery
- Railway for hosting
- Vercel for frontend hosting

## 📞 Support

- Email: support@jaysframes.com
- Documentation: https://docs.jaysframes.com
- Issues: https://github.com/yourusername/jaysframes/issues

## 🗺️ Roadmap

- [ ] Additional movie themes (4th quarter 2025)
- [ ] Video generation (Q1 2026)
- [ ] Mobile app (Q2 2026)
- [ ] Subscription tiers (Q2 2026)
- [ ] API for white-label partners (Q3 2026)

-----

**Made with ❤️ by Jay’s Frames Team**
