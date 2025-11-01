// Favorites functionality
class Favorites {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.init();
    }

    init() {
        if (document.getElementById('favoritesGrid')) {
            this.displayFavorites();
        }
    }

    addToFavorites(productId) {
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

        // User is logged in, proceed with adding to favorites
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);

        if (!product) {
            console.error('Product not found');
            return false;
        }

        if (!this.isFavorite(productId)) {
            this.favorites.push(productId);
            this.saveFavorites();
            
            // Show success message if not on favorites page
            if (!document.getElementById('favoritesGrid')) {
                this.showMessage(`${product.name} added to favorites!`, 'success');
            }
        }

        // Update UI if on favorites page
        if (document.getElementById('favoritesGrid')) {
            this.displayFavorites();
        }
        return true;
    }

    removeFromFavorites(productId) {
        // Check if user is logged in
        if (!window.auth || !window.auth.isLoggedIn()) {
            if (window.auth) {
                window.auth.redirectToLoginWithReturn();
            }
            return false;
        }

        // User is logged in, proceed with removal
        this.favorites = this.favorites.filter(id => id !== productId);
        this.saveFavorites();

        // Update UI if on favorites page
        if (document.getElementById('favoritesGrid')) {
            this.displayFavorites();
        }
        
        // Show removal message if not on favorites page
        if (!document.getElementById('favoritesGrid')) {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const product = products.find(p => p.id === productId);
            if (product) {
                this.showMessage(`${product.name} removed from favorites!`, 'success');
            }
        }
        return true;
    }

    isFavorite(productId) {
        return this.favorites.includes(productId);
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    displayFavorites() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        const products = JSON.parse(localStorage.getItem('products')) || [];
        
        const favoriteProducts = products.filter(product => 
            this.favorites.includes(product.id)
        );

        if (favoriteProducts.length === 0) {
            favoritesGrid.innerHTML = `
                <div class="empty-favorites">
                    <i class="far fa-heart"></i>
                    <p>Your favorites list is empty</p>
                    <a href="index.html" class="continue-shopping">Explore Products</a>
                </div>
            `;
            return;
        }

        favoritesGrid.innerHTML = favoriteProducts.map(product => `
            <div class="favorite-item">
                <div class="favorite-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="favorite-item-details">
                    <a href="product-details.html?id=${product.id}" class="favorite-item-name">${product.name}</a>
                    <div class="favorite-item-price">$${product.price}</div>
                    <div class="favorite-item-actions">
                        <button class="add-to-cart-btn-sm" data-id="${product.id}">Add to Cart</button>
                        <button class="remove-favorite" data-id="${product.id}">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        this.setupFavoritesEventListeners();
    }

    setupFavoritesEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn-sm').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const cart = new Cart();
                cart.addToCart(productId);
            });
        });

        // Remove from favorites buttons
        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                this.removeFromFavorites(productId);
            });
        });
    }

    getFavorites() {
        return this.favorites;
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

// Initialize favorites when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.favorites = new Favorites();
});