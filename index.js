const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== MOCK DATABASE =====
let products = [
  {
    id: '1',
    name: 'Ergonomic Office Chair',
    price: 299.99,
    category: 'furniture',
    image: '/images/chair.jpg',
    description: 'Premium ergonomic office chair with lumbar support',
    stock: 15
  },
  {
    id: '2',
    name: 'Standing Desk 60"',
    price: 499.99,
    category: 'furniture',
    image: '/images/desk.jpg',
    description: 'Electric height-adjustable standing desk',
    stock: 8
  },
  {
    id: '3',
    name: 'Monitor Light Bar',
    price: 89.99,
    category: 'lighting',
    image: '/images/light.jpg',
    description: 'USB-powered auto-dimming light bar for monitors',
    stock: 25
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    price: 149.99,
    category: 'peripherals',
    image: '/images/keyboard.jpg',
    description: 'RGB Mechanical Keyboard with Cherry MX switches',
    stock: 20
  },
  {
    id: '5',
    name: 'Wireless Mouse',
    price: 59.99,
    category: 'peripherals',
    image: '/images/mouse.jpg',
    description: 'Ergonomic wireless mouse with 2.4GHz USB receiver',
    stock: 30
  },
  {
    id: '6',
    name: 'Desk Organizer Set',
    price: 34.99,
    category: 'accessories',
    image: '/images/organizer.jpg',
    description: 'Bamboo desk organizer set (5 pieces)',
    stock: 40
  },
  {
    id: '7',
    name: '27" 4K Monitor',
    price: 599.99,
    category: 'monitors',
    image: '/images/monitor.jpg',
    description: 'UltraHD 4K IPS Monitor with USB-C',
    stock: 12
  },
  {
    id: '8',
    name: 'Desk Lamp LED',
    price: 39.99,
    category: 'lighting',
    image: '/images/desk-lamp.jpg',
    description: 'Adjustable LED desk lamp with USB charging port',
    stock: 22
  }
];

let orders = [];

// ===== ROUTES =====

// Home
app.get('/', (req, res) => {
  res.send('🛒 Workspace Hub E-commerce API - Your workspace, powered!');
});

// Get all products
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let filtered = products;
  
  if (category && category !== 'all') {
    filtered = products.filter(p => p.category === category);
  }
  
  res.json({ success: true, data: filtered });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  res.json({ success: true, data: product });
});

// Create order
app.post('/api/orders', (req, res) => {
  const { items, customerName, email } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items in order' });
  }
  
  if (!customerName || !email) {
    return res.status(400).json({ success: false, message: 'Customer info required' });
  }
  
  // Calculate total and validate stock
  let total = 0;
  for (let item of items) {
    const product = products.find(p => p.id === item.id);
    if (!product) {
      return res.status(400).json({ success: false, message: `Product ${item.id} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}` });
    }
    total += product.price * item.quantity;
  }
  
  // Create order
  const order = {
    id: uuidv4(),
    items,
    customerName,
    email,
    total: parseFloat(total.toFixed(2)),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  // Update stock
  for (let item of items) {
    const product = products.find(p => p.id === item.id);
    product.stock -= item.quantity;
  }
  
  orders.push(order);
  
  res.status(201).json({ success: true, data: order });
});

// Get orders (simplified - in production use database)
app.get('/api/orders/:email', (req, res) => {
  const userOrders = orders.filter(o => o.email === req.params.email);
  res.json({ success: true, data: userOrders });
});

// Start server
app.listen(port, () => {
  console.log(`✨ Workspace Hub E-commerce listening on port ${port}`);
  console.log(`📍 Visit http://localhost:${port}`);
});
