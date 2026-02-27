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
        ${getProductEmoji(product.category)}
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

// Get emoji based on category
function getProductEmoji(category) {
  const emojis = {
    furniture: '🪑',
    peripherals: '⌨️',
    monitors: '🖥️',
    lighting: '💡',
    accessories: '📦'
  };
  return emojis[category] || '🛒';
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
  // Simple notification (can be enhanced with toast library)
  console.log(message);
}
