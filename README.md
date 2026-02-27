# 🛒 Workspace Hub - E-Commerce Platform

A full-stack e-commerce application for premium workspace setup products including furniture, keyboards, monitors, lighting, and accessories.

**Live Demo:** [Coming Soon on Vercel]

---

## Features

✨ **Product Catalog** — Browse 8+ workspace products with categories  
🛒 **Shopping Cart** — Add/remove items with quantity controls  
💳 **Checkout System** — Complete order processing with validation  
📦 **Order Management** — Create and track orders  
🎨 **Modern UI** — Responsive design with gradient theme  
⚡ **Fast & Lightweight** — No external dependencies for frontend  

## Tech Stack

**Backend:**
- Node.js runtime environment
- Express.js web framework
- UUID for unique order IDs
- RESTful API architecture

**Frontend:**
- HTML5 semantic markup
- CSS3 with responsive grid layout
- Vanilla JavaScript (ES6+)
- Fetch API for HTTP requests
- LocalStorage for cart persistence

**Deployment:**
- Vercel serverless platform
- GitHub for version control

---

## Project Structure

```
workspace-hub-ecommerce/
├── index.js              # Express server & API
├── package.json          # Dependencies
├── vercel.json           # Vercel config
├── .gitignore            # Git ignore rules
├── README.md             # Documentation
└── public/               # Frontend files
    ├── index.html        # Store UI
    ├── style.css         # Responsive styling
    └── script.js         # Shopping logic
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API welcome message |
| GET | `/api/products` | Get all products (supports `?category=` filter) |
| GET | `/api/products/:id` | Get single product details |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/:email` | Get orders by customer email |

### Example Requests

**Get all products:**
```bash
curl http://localhost:3000/api/products
```

**Get products by category:**
```bash
curl http://localhost:3000/api/products?category=furniture
```

**Create order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": "1", "quantity": 2}],
    "customerName": "Jane Doe",
    "email": "jane@example.com"
  }'
```

---

## Product Categories

- 🪑 **Furniture** — Chairs, desks, etc.
- ⌨️ **Peripherals** — Keyboards, mice
- 🖥️ **Monitors** — Display screens
- 💡 **Lighting** — Desk lamps, light bars
- 📦 **Accessories** — Organizers, stands

---

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/awonuga123/workspace-hub-ecommerce.git
cd workspace-hub-ecommerce

# Install dependencies
npm install
```

### Local Development

```bash
# Start development server
npm start

# With hot-reload (install nodemon first)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Shopping Flow

1. **Browse** — Filter products by category
2. **Add to Cart** — Click "Add" button on any product
3. **Review Cart** — Click cart icon to view items
4. **Adjust Quantities** — Use +/- buttons or remove items
5. **Checkout** — Enter name & email, click "Proceed to Checkout"
6. **Confirm Order** — Receive order confirmation

---

## Features Deep Dive

### Cart Management
- Persistent storage using LocalStorage
- Real-time quantity updates
- Tax calculation (10%)
- Cart count badge

### Product Filtering
- Browse by 6 categories
- Dynamic product loading
- Category-based API queries

### Order Processing
- Stock validation
- Unique order IDs (UUID)
- Customer email verification
- Order summary with total

---

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Vercel auto-deploys on push

### Environment Setup

No environment variables required for basic setup.

---

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication & login
- [ ] Payment gateway (Stripe/PayPal)
- [ ] Order history page
- [ ] Product reviews & ratings
- [ ] Admin dashboard for inventory
- [ ] Email notifications
- [ ] Wishlist feature
- [ ] Search functionality
- [ ] Image uploads for products

---

## Development Notes

### Stock Management
Currently uses in-memory array. For production, use a database.

### Mock Data
8 sample workspace products included. Easy to expand.

### CORS
Enabled for frontend integration from any domain.

### Error Handling
Basic validation on checkout and order creation.

---

## Performance Considerations

- Static files served from `public/`
- Efficient grid layout with CSS
- Minimal API calls on page load
- LocalStorage for cart persistence

---

## Author

Built as a full-stack e-commerce portfolio project.

**Get in touch:** Check my [portfolio](your-portfolio-url) for more projects!

---

## License

MIT License - Free to use and modify
