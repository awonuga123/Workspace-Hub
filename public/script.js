const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : window.location.origin;

let cart = [];
let allProducts = [];
let currentFilter = 'all';

// Initialize
window.addEventListener('load', () => {
  loadProducts();
  loadCartFromStorage();
  updateCartCount();
});

// Load products from API
async function loadProducts(category = 'all') {
  try {
    const url = category === 'all' 
      ? `${API_URL}/api/products` 
      : `${API_URL}/api/products?category=${category}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      allProducts = result.data;
      renderProducts(allProducts);
    }
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('productsGrid').innerHTML = '<p>Error loading products</p>';
  }
}

// Render products grid
function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  
  if (products.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products found</p>';
    return;
  }
  
  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${getProductImage(product.category, product.name)}" alt="${product.name}" />
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-footer">
          <div class="product-price">$${product.price}</div>
          <button class="btn-add" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">
            Add
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Get professional product images based on product name
function getProductImage(category, productName) {
  const productImages = {
    // FURNITURE
    'Ergonomic Office Chair': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=400&fit=crop',
    'Standing Desk 60"': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=400&fit=crop',
    'Executive Leather Chair': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=400&fit=crop',
    'Gaming Chair Pro': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=400&fit=crop',
    'White Desk Organizer': 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=400&fit=crop',
    'Bamboo Standing Desk': 'https://images.unsplash.com/photo-1611269431079-a0d4e0f41e8b?w=500&h=400&fit=crop',
    'Adjustable Monitor Stand': 'https://images.unsplash.com/photo-1599180722290-b674d6850fef?w=500&h=400&fit=crop',
    'Desk Shelf Riser': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop',
    'Office Bookshelf': 'https://images.unsplash.com/photo-1453928582348-e0612415ae0d?w=500&h=400&fit=crop',
    'Floating Wall Shelf': 'https://images.unsplash.com/photo-1565193540876-58f520b849bf?w=500&h=400&fit=crop',
    'Corner Desk Setup': 'https://images.unsplash.com/photo-1487014929ada-8385a97a63d4?w=500&h=400&fit=crop',
    'Mesh Back Office Chair': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=400&fit=crop',

    // PERIPHERALS
    'Mechanical Keyboard': 'https://images.unsplash.com/photo-1587829191301-41ea6cdfbf0d?w=500&h=400&fit=crop',
    'Wireless Mouse': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=400&fit=crop',
    'Bluetooth Keyboard': 'https://images.unsplash.com/photo-1587829191301-41ea6cdfbf0d?w=500&h=400&fit=crop',
    'Gaming Mouse Pro': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=400&fit=crop',
    'USB-C Hub': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    'Wireless Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
    'Studio Microphone': 'https://images.unsplash.com/photo-1606933248051-5ce98adc476d?w=500&h=400&fit=crop',
    'Mechanical Numpad': 'https://images.unsplash.com/photo-1587829191301-41ea6cdfbf0d?w=500&h=400&fit=crop',
    'Desktop Speakers': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
    'Webcam 4K': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    'Portable SSD 1TB': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=400&fit=crop',
    'Docking Station': 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b08e?w=500&h=400&fit=crop',

    // MONITORS
    '27" 4K Monitor': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=400&fit=crop',
    '32" Curved Gaming Monitor': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=400&fit=crop',
    '24" Full HD Monitor': 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500&h=400&fit=crop',
    '34" Ultrawide Monitor': 'https://images.unsplash.com/photo-1547394030-6f6a15d8673e?w=500&h=400&fit=crop',
    'Dual Monitor Stand Arm': 'https://images.unsplash.com/photo-1599180722290-b674d6850fef?w=500&h=400&fit=crop',
    '15.6" Portable Monitor': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
    '43" 4K Display': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    '21.5" Budget Monitor': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    'Curved 144Hz Monitor': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=400&fit=crop',

    // LIGHTING
    'Monitor Light Bar': 'https://images.unsplash.com/photo-1565636166750-e51df1bdc82f?w=500&h=400&fit=crop',
    'Desk Lamp LED': 'https://images.unsplash.com/photo-1546159092-9a0b0e62dc7d?w=500&h=400&fit=crop',
    'RGB LED Strip': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
    'Ring Light': 'https://images.unsplash.com/photo-1574169208507-84007bde4df5?w=500&h=400&fit=crop',
    'Ambient Desk Light': 'https://images.unsplash.com/photo-1545269865-cbf461f313cc?w=500&h=400&fit=crop',
    'Floor Lamp Arc': 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=400&fit=crop',
    'Smart Bulb Starter Kit': 'https://images.unsplash.com/photo-1565636166750-e51df1bdc82f?w=500&h=400&fit=crop',
    'Neon Light Sign': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
    'Warm White Desk Lamp': 'https://images.unsplash.com/photo-1546159092-9a0b0e62dc7d?w=500&h=400&fit=crop',

    // ACCESSORIES
    'Desk Organizer Set': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
    'Cable Management Box': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400&fit=crop',
    'Desk Mat': 'https://images.unsplash.com/photo-1614008375890-cb53b6c5f8d5?w=500&h=400&fit=crop',
    'Monitor Filter': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop',
    'Phone Stand': 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=400&fit=crop',
    'Desk Drawer Organizer': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=400&fit=crop',
    'Wrist Rest Pad': 'https://images.unsplash.com/photo-1578926078328-123456789000?w=500&h=400&fit=crop',
    'Desk Plant': 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&h=400&fit=crop',
    'USB Power Strip': 'https://images.unsplash.com/photo-1498049860654-af1a5c566840?w=500&h=400&fit=crop',
    'Keyboard Dust Cover': 'https://images.unsplash.com/photo-1587829191301-41ea6cdfbf0d?w=500&h=400&fit=crop',
    'Monitor Arm Adapter': 'https://images.unsplash.com/photo-1599180722290-b674d6850fef?w=500&h=400&fit=crop',
    'Desk Lamp USB Charger': 'https://images.unsplash.com/photo-1546159092-9a0b0e62dc7d?w=500&h=400&fit=crop'
  };

  // Try exact product name first
  if (productImages[productName]) {
    return productImages[productName];
  }

  // Fallback to category-based images
  const categoryImages = {
    furniture: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1611269431079-a0d4e0f41e8b?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1487014929ada-8385a97a63d4?w=500&h=400&fit=crop'
    ],
    peripherals: [
      'https://images.unsplash.com/photo-1587829191301-41ea6cdfbf0d?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606933248051-5ce98adc476d?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop'
    ],
    monitors: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1547394030-6f6a15d8673e?w=500&h=400&fit=crop'
    ],
    lighting: [
      'https://images.unsplash.com/photo-1565636166750-e51df1bdc82f?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546159092-9a0b0e62dc7d?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1574169208507-84007bde4df5?w=500&h=400&fit=crop'
    ],
    accessories: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1614008375890-cb53b6c5f8d5?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=400&fit=crop'
    ]
  };

  const images = categoryImages[category] || categoryImages.accessories;
  const hashCode = productName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hashCode) % images.length;
  return images[index];
}

// Filter products
function filterProducts(category) {
  currentFilter = category;
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  loadProducts(category);
}

// Add to cart
function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  
  saveCartToStorage();
  updateCartCount();
  showNotification(`${name} added to cart!`);
}

// Update cart count badge
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartCount').textContent = count;
}

// Toggle cart modal
function toggleCart() {
  const modal = document.getElementById('cartModal');
  modal.classList.toggle('active');
  
  if (modal.classList.contains('active')) {
    renderCartItems();
  }
}

// Render cart items
function renderCartItems() {
  const container = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    document.getElementById('subtotal').textContent = '$0.00';
    document.getElementById('tax').textContent = '$0.00';
    document.getElementById('total').textContent = '$0.00';
    return;
  }
  
  let subtotal = 0;
  
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-details">$${item.price} x ${item.quantity} = $${itemTotal.toFixed(2)}</div>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
          <span style="width: 30px; text-align: center;">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>
    `;
  }).join('');
  
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Update quantity
function updateQty(id, change) {
  const item = cart.find(item => item.id === id);
  
  if (item) {
    item.quantity += change;
    
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCartToStorage();
      renderCartItems();
      updateCartCount();
    }
  }
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCartToStorage();
  renderCartItems();
  updateCartCount();
}

// Checkout
async function checkout() {
  const customerName = document.getElementById('customerName').value.trim();
  const customerEmail = document.getElementById('customerEmail').value.trim();
  
  if (!customerName || !customerEmail) {
    alert('Please enter your name and email');
    return;
  }
  
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        customerName,
        email: customerEmail
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      const order = result.data;
      
      // Close cart modal
      document.getElementById('cartModal').classList.remove('active');
      
      // Show success modal
      document.getElementById('successMessage').innerHTML = `
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Total:</strong> $${order.total}</p>
        <p>A confirmation email will be sent to ${order.email}</p>
      `;
      
      document.getElementById('successModal').classList.add('active');
      
      // Clear cart
      cart = [];
      saveCartToStorage();
      updateCartCount();
      
      // Clear form
      document.getElementById('customerName').value = '';
      document.getElementById('customerEmail').value = '';
    } else {
      alert('Order failed: ' + result.message);
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Checkout error: ' + error.message);
  }
}

// Close success modal
function closeSuccessModal() {
  document.getElementById('successModal').classList.remove('active');
}

// Local storage management
function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    cart = JSON.parse(saved);
  }
}

// Notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #0f766e 0%, #047857 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(15, 118, 110, 0.3);
    z-index: 500;
    animation: slideIn 0.3s ease;
    font-weight: 600;
    max-width: 300px;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

