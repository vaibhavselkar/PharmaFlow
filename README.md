# PharmaFlow - Pharmaceutical Supply Chain Management Platform

![PharmaFlow Logo](https://img.shields.io/badge/PharmaFlow-Pharmaceutical%20Supply%20Chain-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-blue)

A comprehensive pharmaceutical supply chain management platform designed to streamline medicine distribution, optimize inventory management, and enhance delivery efficiency for pharmacies, distributors, and delivery agents.

## 🚀 Features

### For Pharmacies
- **Real-time Inventory Management**: Track stock levels and automated reordering
- **Medicine Search & Substitutes**: Find alternatives and substitutes instantly
- **Order Processing**: Efficient order management and tracking
- **Analytics & Insights**: Sales insights and performance metrics

### For Distributors
- **Comprehensive Inventory Control**: Full stock management across locations
- **Agent Management**: Monitor and manage delivery teams
- **Performance Analytics**: Track delivery efficiency and KPIs
- **Route Optimization**: Smart delivery route planning

### For Delivery Agents
- **Mobile-First Interface**: User-friendly mobile application
- **GPS Route Navigation**: Optimized delivery routes
- **Direct Communication**: Contact pharmacies directly
- **Performance Tracking**: Track deliveries and earnings

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14+ with App Router
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with custom JWT tokens
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner toast notifications

### Project Structure
```
PharmaFlow/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and management
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboards by role
│   ├── landing/           # Marketing landing page
│   ├── login/             # Authentication pages
│   └── register/          # User registration
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   └── ui/               # Radix UI components
├── lib/                   # Business logic and utilities
│   ├── auth.ts           # Authentication utilities
│   ├── data.ts           # Data fetching and manipulation
│   ├── supabase.ts       # Supabase client and queries
│   ├── token.ts          # JWT token management
│   └── types.ts          # TypeScript type definitions
├── public/               # Static assets
└── styles/               # Global styles
```

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase project
- Google Cloud Console project (for OAuth)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/PharmaFlow.git
cd PharmaFlow
```

### 2. Install dependencies
```bash
pnpm install
# or
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

### 4. Database Setup

1. Create a Supabase project
2. Run the database schema from `supabase/schema.sql`
3. Set up the admin user with `supabase/create-admin.sql`

### 5. Start the development server
```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Configuration

### Role-Based Access Control
The platform supports three main user roles:
- **Pharmacy**: Pharmacy owners and managers
- **Distributor**: Distribution company representatives  
- **Agent**: Delivery personnel

### Authentication Flow
1. **Email/Password**: Standard email and password authentication
2. **Google OAuth**: Single sign-on with Google accounts
3. **Custom JWT Tokens**: Secure token-based authentication

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `NEXT_PUBLIC_BASE_URL` | Base application URL | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |

## 📖 Usage

### Landing Page
- Visit the main URL to see the marketing landing page
- Explore features, testimonials, and platform benefits
- Register as a new user or login to existing account

### User Registration
1. Click "Register" from the landing page
2. Select your role (Pharmacy or Delivery Agent)
3. Fill in required information
4. Complete registration and access your dashboard

### Dashboard Access
- **Pharmacies**: `/dashboard/pharmacy`
- **Distributors**: `/dashboard/distributor` 
- **Agents**: `/dashboard/agent`
- **Admin**: `/admin/dashboard`

## 🎨 UI Components

### Dashboard Shell
- **Sidebar Navigation**: Role-based navigation menu
- **Top Bar**: User info, notifications, and quick actions
- **Responsive Layout**: Works on desktop, tablet, and mobile

### Key Components
- **Order Management**: Create, track, and manage orders
- **Inventory Tables**: Real-time stock level monitoring
- **Medicine Search**: Advanced search with filters
- **Status Badges**: Visual order status indicators
- **Charts & Analytics**: Performance visualization

## 🔐 Security

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: Strict role-based permissions
- **Secure Cookies**: HttpOnly and secure cookie storage
- **Input Validation**: Comprehensive form validation

### Data Protection
- **Supabase Security**: Built-in PostgreSQL security
- **Row Level Security**: Database-level access control
- **HTTPS Required**: Secure communication enforced

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds

### Docker Deployment
```bash
# Build the image
docker build -t pharmaflow .

# Run the container
docker run -p 3000:3000 pharmaflow
```

### Production Considerations
- Set proper environment variables
- Configure SSL/HTTPS
- Set up monitoring and logging
- Implement backup strategies

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Structure
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API route testing
- **E2E Tests**: Full user journey testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the excellent React framework
- **Supabase Team**: For the fantastic backend platform
- **Radix UI Team**: For accessible UI components
- **Tailwind CSS Team**: For the utility-first CSS framework

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email us at support@pharmaflow.com

---

**PharmaFlow** - Revolutionizing pharmaceutical supply chain management. 💊🚀