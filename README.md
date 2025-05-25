# Inventory Management System

A full-stack inventory management application built with React, Express.js, and PostgreSQL.

## Features

- Dashboard with real-time statistics and charts
- Product management with categories
- Vendor management
- Inventory tracking
- Low stock alerts
- Beautiful UI with Tailwind CSS

## Prerequisites

- Node.js 20.x
- PostgreSQL 14+
- npm or yarn

## Setup Instructions

### Database Setup

1. Create a PostgreSQL database
2. Update the `.env` file in the server directory with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/inventory_db"
```

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Initialize Prisma and run migrations:
```bash
npx prisma migrate dev
```

4. Start the server:
```bash
npm run dev
```

The server will start on http://localhost:5000

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will start on http://localhost:5173

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   └── App.jsx       # Main application component
│   └── package.json
│
└── server/                # Express.js backend
    ├── src/
    │   ├── routes/       # API routes
    │   ├── controllers/  # Route controllers
    │   └── index.js      # Server entry point
    ├── prisma/           # Database schema and migrations
    └── package.json
```

## API Endpoints

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create a new category
- `GET /api/products` - List all products
- `POST /api/products` - Create a new product
- `GET /api/vendors` - List all vendors
- `POST /api/vendors` - Create a new vendor
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Add inventory movement 