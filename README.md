# Food Waste Management System

A comprehensive full-stack application designed to help users track, manage, and reduce food waste through intelligent inventory management, consumption logging, and educational resources.

## 🌟 Features

### Core Functionality
- **Inventory Management**: Track food items across multiple inventories (fridge, pantry, freezer)
- **Consumption Logging**: Record food usage and waste patterns
- **Analytics Dashboard**: Visualize inventory trends and consumption patterns
- **Educational Resources**: Access tips and guides for reducing food waste
- **User Authentication**: Secure authentication powered by Clerk

### Key Capabilities
- Real-time inventory tracking with expiration date monitoring
- Multi-inventory support for different storage locations
- Consumption analytics and waste pattern identification
- Comprehensive food database with nutritional information
- User profiles with personalized settings
- Responsive design for mobile and desktop

## 🏗️ Project Structure
```
├── client/                      
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── home/          # Landing page components
│   │   │   ├── inventory/     # Inventory components
│   │   │   ├── resources/     # Resource components
│   │   │   ├── Layout.tsx     # App layout with sidebar
│   │   │   └── Sidebar.tsx    # Navigation sidebar
│   │   ├── pages/             # Page components
│   │   ├── context/           # React Context providers
│   │   ├── hooks/             # Custom hooks (useApi)
│   │   └── services/          # API service functions
│
├── server/                      # Express Backend (TypeScript)
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── users/        # User management
│   │   │   ├── foods/        # Food item database
│   │   │   ├── inventories/  # Inventory system
│   │   │   └── resources/    # Educational content
│   │   ├── config/           # App configuration
│   │   ├── middleware/       # Express middleware
│   │   └── router.ts         # API routes
│   └── prisma/
│       ├── schema.prisma     # Database schema
│       └── seed.ts           # Database seeding
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: TanStack Query (React Query)
- **Authentication**: Clerk React
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns, react-datepicker

### Backend
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk SDK Node
- **Security**: Helmet, CORS
- **Compression**: compression middleware

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Clerk account for authentication

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/navid1111/bubt_hackathon.git
cd bubt_hackathon
```

### 2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

#### Server Configuration

Create a `.env` file in the `server` directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database_name"

# Server
PORT=3000
NODE_ENV=development

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# CORS (comma-separated for multiple origins)
ALLOWED_ORIGINS=http://localhost:5173
```

#### Client Configuration

Create a `.env` file in the `client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_API_URL=http://localhost:3000
```

### 4. Database Setup
```bash
cd server

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npm run seed
```

## 🎯 Running the Application

### Development Mode

#### Start the backend server:
```bash
cd server
npm run dev
```
Server will run on `http://localhost:3000`

#### Start the frontend development server:
```bash
cd client
npm run dev
```
Client will run on `http://localhost:5173`

### Production Build

#### Build the backend:
```bash
cd server
npm run build
npm start
```

#### Build the frontend:
```bash
cd client
npm run build
npm run preview
```

## 📡 API Endpoints

### Public Routes
- `GET /api/health` - Health check
- `GET /api/foods` - Get all food items
- `GET /api/foods/:id` - Get specific food item
- `GET /api/resources` - Get educational resources

### Protected Routes (Require Authentication)

#### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Inventories
- `GET /api/inventories` - Get user's inventories
- `POST /api/inventories` - Create new inventory
- `GET /api/inventories/:id` - Get specific inventory
- `PUT /api/inventories/:id` - Update inventory
- `DELETE /api/inventories/:id` - Delete inventory

#### Inventory Items
- `GET /api/inventories/:id/items` - Get inventory items
- `POST /api/inventories/:id/items` - Add item to inventory
- `PUT /api/inventories/:id/items/:itemId` - Update inventory item
- `DELETE /api/inventories/:id/items/:itemId` - Remove inventory item

#### Consumption & Analytics
- `POST /api/inventories/consumption` - Log food consumption
- `GET /api/inventories/consumption` - Get consumption logs
- `GET /api/inventories/analytics/inventory-trends` - Get inventory analytics
- `GET /api/inventories/analytics/consumption-patterns` - Get consumption patterns

## 🔐 Authentication

This application uses [Clerk](https://clerk.com) for authentication. To set up:

1. Create a Clerk account at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application
3. Copy the API keys to your `.env` files
4. The application handles user synchronization automatically

## 🗄️ Database Schema

Key models include:
- **User**: User accounts and profiles
- **Inventory**: Storage locations (fridge, pantry, etc.)
- **InventoryItem**: Individual food items in inventories
- **Food**: Master food database with nutritional info
- **ConsumptionLog**: Track food usage and waste
- **Resource**: Educational content and tips

## 🧪 Testing
```bash
# Run tests (when implemented)
cd server
npm test

cd client
npm test
```

## 📦 Building for Production
```bash
# Build backend
cd server
npm run build

# Build frontend
cd client
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Note**: Make sure to never commit your `.env` files to version control. Use the `.env.example` files as templates.