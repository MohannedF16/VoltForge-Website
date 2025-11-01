// Product details functionality
class ProductDetails {
    constructor() {
        this.product = null;
        this.quantity = 1;
        this.init();
    }

    init() {
        this.loadProduct();
        this.setupEventListeners();
    }

    loadProduct() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            console.error('No product ID found in URL');
            this.showError('Product not found');
            return;
        }

        const products = JSON.parse(localStorage.getItem('products')) || [];
        this.product = products.find(p => p.id === productId);

        if (this.product) {
            this.displayProduct();
        } else {
            console.error('Product not found');
            this.showError('Product not found');
        }
    }

    displayProduct() {
        if (!this.product) return;

        document.getElementById('mainProductImage').src = this.product.image;
        document.getElementById('mainProductImage').alt = this.product.name;
        document.getElementById('productName').textContent = this.product.name;
        document.getElementById('productPrice').textContent = `$${this.product.price}`;
        
        if (this.product.oldPrice) {
            document.getElementById('productOldPrice').textContent = `$${this.product.oldPrice}`;
            document.getElementById('productOldPrice').style.display = 'inline';
        } else {
            document.getElementById('productOldPrice').style.display = 'none';
        }

        document.getElementById('productDescription').textContent = this.product.description;

        // Update page title
        document.title = `${this.product.name} - VoltForge`;

        // Check favorite status
        this.checkFavoriteStatus();
    }

    setupEventListeners() {
        // Quantity controls
        document.getElementById('increaseQty').addEventListener('click', () => {
            this.quantity++;
            this.updateQuantity();
        });

        document.getElementById('decreaseQty').addEventListener('click', () => {
            if (this.quantity > 1) {
                this.quantity--;
                this.updateQuantity();
            }
        });

        // Add to cart
        document.getElementById('addToCart').addEventListener('click', () => {
            this.addToCart();
        });

        // Add to favorites
        document.getElementById('addToFavorite').addEventListener('click', () => {
            this.toggleFavorite();
        });
    }

    updateQuantity() {
        document.getElementById('quantity').textContent = this.quantity;
    }

    addToCart() {
        if (!this.product) {
            this.showMessage('Product not found!', 'error');
            return;
        }

        const cart = new Cart();
        cart.addToCart(this.product.id, this.quantity);
        
        this.showMessage(`${this.quantity} ${this.product.name}(s) added to cart!`, 'success');
        this.quantity = 1;
        this.updateQuantity();
    }

    toggleFavorite() {
        if (!this.product) {
            this.showMessage('Product not found!', 'error');
            return;
        }

        const favorites = new Favorites();
        const favoriteBtn = document.getElementById('addToFavorite');
        const icon = favoriteBtn.querySelector('i');
        
        if (favorites.isFavorite(this.product.id)) {
            favorites.removeFromFavorites(this.product.id);
            favoriteBtn.classList.remove('active');
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.showMessage(`${this.product.name} removed from favorites!`, 'success');
        } else {
            favorites.addToFavorites(this.product.id);
            favoriteBtn.classList.add('active');
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.showMessage(`${this.product.name} added to favorites!`, 'success');
        }
    }

    checkFavoriteStatus() {
        if (!this.product) return;

        const favorites = new Favorites();
        const favoriteBtn = document.getElementById('addToFavorite');
        const icon = favoriteBtn.querySelector('i');
        
        if (favorites.isFavorite(this.product.id)) {
            favoriteBtn.classList.add('active');
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
    }

    showMessage(message, type) {
        // Create message element
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

        // Add animation styles if not exists
        if (!document.querySelector('.message-animation-styles')) {
            const styles = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateY(-20px); }
                }
            `;
            const styleSheet = document.createElement('style');
            styleSheet.className = 'message-animation-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        messageDiv.style.animation = 'slideInRight 0.3s ease, fadeOut 0.3s ease 2s forwards';

        document.body.appendChild(messageDiv);
        
        // Remove message after animation
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 2500);
    }

    showError(message) {
        const container = document.querySelector('.product-details-container');
        if (container) {
            container.innerHTML = `
                <div class="container" style="text-align: center; padding: 100px 20px;">
                    <h2>Product Not Found</h2>
                    <p>${message}</p>
                    <a href="index.html" class="continue-shopping">Return to Home</a>
                </div>
            `;
        }
    }
}

// Initialize product details when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetails();
});