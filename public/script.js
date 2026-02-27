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

// Get professional product images based on category
function getProductImage(category, productName) {
  const images = {
    furniture: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1611269431079-a0d4e0f41e8b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop'
    ],
    peripherals: [
      'https://images.unsplash.com/photo-1587829191301-41ea6cdfbf0d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1606933248051-5ce98adc476d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1525865267965-fbd022a6c48d?w=400&h=300&fit=crop'
    ],
    monitors: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1547394030-6f6a15d8673e?w=400&h=300&fit=crop'
    ],
    lighting: [
      'https://images.unsplash.com/photo-1565636166750-e51df1bdc82f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546159092-9a0b0e62dc7d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565193540876-58f520b849bf?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1545269865-cbf461f313cc?w=400&h=300&fit=crop'
    ],
    accessories: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop'
    ]
  };

  const categoryImages = images[category] || images.accessories;
  const hashCode = productName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hashCode) % categoryImages.length;
  return categoryImages[index];
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

