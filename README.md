# 🎯 ShelfSensei - Inventory Intelligence

ShelfSensei is a modern, intelligent inventory management system that combines real-time tracking with predictive analytics to help businesses make smarter inventory decisions. Like a wise master of inventory management, it guides you through your stock trends and forecasts future needs with precision.

## ✨ Features

- **Smart Forecasting**: Advanced predictive analytics for inventory trends
- **Multi-Shop Management**: Centralized control for multiple locations
- **Real-time Analytics**: Live tracking and visualization of inventory movements
- **Product Performance**: Detailed analysis of top-moving products
- **Interactive Dashboards**: Beautiful, responsive UI with real-time updates
- **Confidence Metrics**: Statistical reliability indicators for forecasts

## 🚀 Tech Stack

### Frontend
- React 18
- Chart.js & Recharts for data visualization
- TailwindCSS for styling
- Vite for build tooling
- Heroicons for UI elements

### Backend
- Node.js with Express
- Prisma ORM
- JWT for authentication
- PostgreSQL database

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Hack2Future-2025/ShelfSensei
cd shelfsensei
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
```bash
# In server directory
cp .env.example .env
# Edit .env with your database credentials
```

4. Initialize the database:
```bash
cd server
npx prisma migrate dev
npx prisma db seed
```

## 🏃‍♂️ Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 📊 Key Features Breakdown

### Inventory Forecasting
- Historical trend analysis
- Machine learning-based predictions
- Confidence interval calculations
- Seasonal adjustment factors

### Shop Management
- Multi-location inventory tracking
- Stock level monitoring
- Movement history
- Performance metrics

### Product Analytics
- Top-moving products identification
- Stock turnover rates
- Reorder point calculations
- Demand pattern analysis

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Secure API endpoints
- Input validation and sanitization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for intelligent inventory management
- Powered by data-driven decision making

## 📫 Support

For support, please open an issue in the GitHub repository or contact our support team.

---

Made with ❤️ by the ShelfSensei Team 