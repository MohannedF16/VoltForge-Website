// Cart functionality
class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        if (document.getElementById('cartItems')) {
            this.displayCartItems();
            this.setupEventListeners();
        }
        this.updateCartCount();
    }

    addToCart(productId, quantity = 1) {
        // Check if user is logged in
        if (!window.auth || !window.auth.isLoggedIn()) {
            if (window.auth) {
                window.auth.redirectToLoginWithReturn();
            } else {
                // Store current page and redirect to login
                const returnUrl = window.location.href;
                localStorage.setItem('returnUrl', returnUrl);
                window.location.href = 'signin.html';
            }
            return false;
        }

        // User is logged in, proceed with adding to cart
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);

        if (!product) {
            console.error('Product not found');
            this.showMessage('Product not found!', 'error');
            return false;
        }

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartCount();

        // If we're on the cart page, refresh the display
        if (document.getElementById('cartItems')) {
            this.displayCartItems();
        }

        // Show success message
        this.showMessage(`${quantity} ${product.name}(s) added to cart!`, 'success');
        return true;
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();

        if (document.getElementById('cartItems')) {
            this.displayCartItems();
        }

        this.showMessage('Item removed from cart!', 'success');
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();

            if (document.getElementById('cartItems')) {
                this.displayCartItems();
            }
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    displayCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="index.html" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
            this.updateSummary();
            return;
        }

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <a href="product-details.html?id=${item.id}" class="cart-item-name">${item.name}</a>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="decrease-qty" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-qty" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateSummary();
        this.setupCartEventListeners();
    }

    setupCartEventListeners() {
        // Quantity decrease buttons
        document.querySelectorAll('.decrease-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Quantity increase buttons
        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                this.removeFromCart(productId);
            });
        });

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
    }

    updateSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 9.99 : 0;
        const total = subtotal + shipping;

        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const totalElement = document.getElementById('total');

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE';
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

        // Update checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
            if (this.cart.length === 0) {
                checkoutBtn.style.opacity = '0.6';
                checkoutBtn.style.cursor = 'not-allowed';
            } else {
                checkoutBtn.style.opacity = '1';
                checkoutBtn.style.cursor = 'pointer';
            }
        }
    }

    updateCartCount() {
        const cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const bagElement = document.querySelector('.bag');

        if (bagElement) {
            // Remove existing count
            const existingCount = bagElement.querySelector('.cart-count');
            if (existingCount) {
                existingCount.remove();
            }

            if (cartCount >= 0) {
                const countElement = document.createElement('span');
                countElement.className = 'cart-count';
                countElement.textContent = cartCount;
                countElement.style.position = 'absolute';
                countElement.style.top = '-5px';
                countElement.style.right = '-5px';
                countElement.style.background = 'var(--danger)';
                countElement.style.color = 'white';
                countElement.style.borderRadius = '50%';
                countElement.style.width = '18px';
                countElement.style.height = '18px';
                countElement.style.fontSize = '12px';
                countElement.style.display = 'flex';
                countElement.style.alignItems = 'center';
                countElement.style.justifyContent = 'center';
                countElement.style.fontWeight = 'bold';
                countElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                countElement.style.cursor = 'pointer';
                countElement.style.boxShadow = '0 2px 8px rgba(255, 59, 59, 0.3)';
                countElement.style.zIndex = '10';
                countElement.style.border = '2px solid var(--panel)';

                // Add hover effects using CSS transitions
                countElement.onmouseenter = function () {
                    this.style.transform = 'scale(1.4) rotate(12deg)';
                    this.style.background = '#ff1a1a';
                    this.style.boxShadow = '0 4px 15px rgba(255, 59, 59, 0.6)';
                };

                countElement.onmouseleave = function () {
                    this.style.transform = 'scale(1) rotate(0deg)';
                    this.style.background = 'var(--danger)';
                    this.style.boxShadow = '0 2px 8px rgba(255, 59, 59, 0.3)';
                };

                bagElement.appendChild(countElement);
            }
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showMessage('Your cart is empty!', 'error');
            return;
        }

        if (!window.auth || !window.auth.isLoggedIn()) {
            this.showMessage('Please sign in to checkout!', 'error');
            if (window.auth) {
                window.auth.redirectToLoginWithReturn();
            } else {
                window.location.href = 'signin.html';
            }
            return;
        }

        // In a real application, you would redirect to a checkout page
        this.showMessage('Proceeding to checkout!', 'success');

       
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.displayCartItems();
    }

    getCartItems() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = message;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '100px';
        messageDiv.style.right = '20px';
        messageDiv.style.zIndex = '1000';
        messageDiv.style.padding = '15px 20px';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.fontWeight = '600';

        if (type === 'error') {
            messageDiv.style.background = 'var(--danger)';
            messageDiv.style.color = 'white';
        } else {
            messageDiv.style.background = 'var(--accent)';
            messageDiv.style.color = '#061226';
        }

        messageDiv.style.animation = 'slideInRight 0.3s ease, fadeOut 0.3s ease 2s forwards';

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 2500);
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.cart = new Cart();
});