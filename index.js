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
  // FURNITURE (12 items)
  { id: '1', name: 'Ergonomic Office Chair', price: 299.99, category: 'furniture', description: 'Premium ergonomic office chair with lumbar support', stock: 15 },
  { id: '2', name: 'Standing Desk 60"', price: 499.99, category: 'furniture', description: 'Electric height-adjustable standing desk', stock: 8 },
  { id: '3', name: 'Executive Leather Chair', price: 449.99, category: 'furniture', description: 'Premium leather executive office chair', stock: 10 },
  { id: '4', name: 'Gaming Chair Pro', price: 379.99, category: 'furniture', description: 'Professional gaming chair with memory foam', stock: 12 },
  { id: '5', name: 'White Desk Organizer', price: 199.99, category: 'furniture', description: 'Modern white minimalist desk with storage', stock: 6 },
  { id: '6', name: 'Bamboo Standing Desk', price: 549.99, category: 'furniture', description: 'Eco-friendly bamboo height-adjustable desk', stock: 7 },
  { id: '7', name: 'Adjustable Monitor Stand', price: 79.99, category: 'furniture', description: 'Sturdy monitor stand with storage drawer', stock: 20 },
  { id: '8', name: 'Desk Shelf Riser', price: 49.99, category: 'furniture', description: 'Dual-tier shelf riser for desk organization', stock: 25 },
  { id: '9', name: 'Office Bookshelf', price: 199.99, category: 'furniture', description: '5-tier office bookshelf made from solid wood', stock: 9 },
  { id: '10', name: 'Floating Wall Shelf', price: 89.99, category: 'furniture', description: 'Minimalist floating shelves (set of 2)', stock: 18 },
  { id: '11', name: 'Corner Desk Setup', price: 599.99, category: 'furniture', description: 'L-shaped corner desk with cable management', stock: 5 },
  { id: '12', name: 'Mesh Back Office Chair', price: 269.99, category: 'furniture', description: 'Breathable mesh back ergonomic chair', stock: 14 },

  // PERIPHERALS (12 items)
  { id: '13', name: 'Mechanical Keyboard', price: 149.99, category: 'peripherals', description: 'RGB Mechanical Keyboard with Cherry MX switches', stock: 20 },
  { id: '14', name: 'Wireless Mouse', price: 59.99, category: 'peripherals', description: 'Ergonomic wireless mouse with 2.4GHz USB receiver', stock: 30 },
  { id: '15', name: 'Bluetooth Keyboard', price: 79.99, category: 'peripherals', description: 'Wireless Bluetooth keyboard with quiet keys', stock: 22 },
  { id: '16', name: 'Gaming Mouse Pro', price: 89.99, category: 'peripherals', description: 'Professional gaming mouse with 7 buttons', stock: 18 },
  { id: '17', name: 'USB-C Hub', price: 49.99, category: 'peripherals', description: 'Multi-port USB-C hub with HDMI and SD card', stock: 35 },
  { id: '18', name: 'Wireless Headphones', price: 129.99, category: 'peripherals', description: 'Premium noise-canceling wireless headphones', stock: 16 },
  { id: '19', name: 'Studio Microphone', price: 199.99, category: 'peripherals', description: 'Professional USB studio microphone with stand', stock: 11 },
  { id: '20', name: 'Mechanical Numpad', price: 69.99, category: 'peripherals', description: 'Standalone mechanical numpad for productivity', stock: 19 },
  { id: '21', name: 'Desktop Speakers', price: 99.99, category: 'peripherals', description: 'Powerful desktop speakers with rich bass', stock: 14 },
  { id: '22', name: 'Webcam 4K', price: 159.99, category: 'peripherals', description: '4K USB webcam with autofocus and mic', stock: 13 },
  { id: '23', name: 'Portable SSD 1TB', price: 129.99, category: 'peripherals', description: 'External SSD 1TB with USB-C connection', stock: 28 },
  { id: '24', name: 'Docking Station', price: 189.99, category: 'peripherals', description: 'Universal docking station for laptops', stock: 10 },

  // MONITORS (9 items)
  { id: '25', name: '27" 4K Monitor', price: 599.99, category: 'monitors', description: 'UltraHD 4K IPS Monitor with USB-C', stock: 12 },
  { id: '26', name: '32" Curved Gaming Monitor', price: 699.99, category: 'monitors', description: '144Hz curved gaming monitor with G-Sync', stock: 8 },
  { id: '27', name: '24" Full HD Monitor', price: 249.99, category: 'monitors', description: 'Full HD IPS monitor with excellent color accuracy', stock: 26 },
  { id: '28', name: '34" Ultrawide Monitor', price: 849.99, category: 'monitors', description: 'Ultrawide curved monitor for multitasking', stock: 6 },
  { id: '29', name: 'Dual Monitor Stand Arm', price: 129.99, category: 'monitors', description: 'Articulating arm for dual 27" monitors', stock: 15 },
  { id: '30', name: '15.6" Portable Monitor', price: 349.99, category: 'monitors', description: 'Portable USB-C monitor for on-the-go', stock: 11 },
  { id: '31', name: '43" 4K Display', price: 1299.99, category: 'monitors', description: 'Ultra-large 4K professional display', stock: 3 },
  { id: '32', name: '21.5" Budget Monitor', price: 179.99, category: 'monitors', description: 'Affordable LED monitor great for secondary display', stock: 24 },
  { id: '33', name: 'Curved 144Hz Monitor', price: 399.99, category: 'monitors', description: '27" 144Hz curved monitor for gaming', stock: 9 },

  // LIGHTING (9 items)
  { id: '34', name: 'Monitor Light Bar', price: 89.99, category: 'lighting', description: 'USB-powered auto-dimming light bar for monitors', stock: 25 },
  { id: '35', name: 'Desk Lamp LED', price: 39.99, category: 'lighting', description: 'Adjustable LED desk lamp with USB charging port', stock: 22 },
  { id: '36', name: 'RGB LED Strip', price: 49.99, category: 'lighting', description: '16.4ft RGB LED strip lights with remote control', stock: 32 },
  { id: '37', name: 'Ring Light', price: 79.99, category: 'lighting', description: '10" ring light with phone holder for streams', stock: 18 },
  { id: '38', name: 'Ambient Desk Light', price: 129.99, category: 'lighting', description: 'Smart ambient desk light with app control', stock: 14 },
  { id: '39', name: 'Floor Lamp Arc', price: 169.99, category: 'lighting', description: 'Modern arc floor lamp with dimming', stock: 8 },
  { id: '40', name: 'Smart Bulb Starter Kit', price: 59.99, category: 'lighting', description: 'WiFi smart bulbs pack (4 bulbs) with hub', stock: 20 },
  { id: '41', name: 'Neon Light Sign', price: 89.99, category: 'lighting', description: 'Customizable neon sign for workspace', stock: 12 },
  { id: '42', name: 'Warm White Desk Lamp', price: 44.99, category: 'lighting', description: 'Energy-saving warm white task lamp', stock: 28 },

  // ACCESSORIES (12 items)
  { id: '43', name: 'Desk Organizer Set', price: 34.99, category: 'accessories', description: 'Bamboo desk organizer set (5 pieces)', stock: 40 },
  { id: '44', name: 'Cable Management Box', price: 24.99, category: 'accessories', description: 'Hide cables with this modern management box', stock: 45 },
  { id: '45', name: 'Desk Mat', price: 39.99, category: 'accessories', description: 'Large extended mouse pad and desk mat (80x30cm)', stock: 35 },
  { id: '46', name: 'Monitor Filter', price: 29.99, category: 'accessories', description: 'Blue light filter for monitor screens', stock: 50 },
  { id: '47', name: 'Phone Stand', price: 19.99, category: 'accessories', description: 'Adjustable metal phone stand for desk', stock: 55 },
  { id: '48', name: 'Desk Drawer Organizer', price: 22.99, category: 'accessories', description: 'Bamboo drawer organizer set (6 pieces)', stock: 42 },
  { id: '49', name: 'Wrist Rest Pad', price: 34.99, category: 'accessories', description: 'Ergonomic wrist rest for keyboard and mouse', stock: 38 },
  { id: '50', name: 'Desk Plant', price: 29.99, category: 'accessories', description: 'Low-maintenance desk plant with pot', stock: 30 },
  { id: '51', name: 'USB Power Strip', price: 54.99, category: 'accessories', description: 'Power strip with 4 USB ports and 2 outlets', stock: 27 },
  { id: '52', name: 'Keyboard Dust Cover', price: 14.99, category: 'accessories', description: 'Protective dust cover for mechanical keyboard', stock: 60 },
  { id: '53', name: 'Monitor Arm Adapter', price: 49.99, category: 'accessories', description: 'VESA mount adapter for monitors', stock: 21 },
  { id: '54', name: 'Desk Lamp USB Charger', price: 59.99, category: 'accessories', description: 'Desk lamp with 3 USB charging ports', stock: 17 }
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
