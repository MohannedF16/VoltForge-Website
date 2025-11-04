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
        this.updateFavoriteIcons();
        this.updateFavoritesCount();
    }

    addToFavorites(productId) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);

        if (!product) {
            console.error('Product not found');
            return false;
        }

        if (!this.isFavorite(productId)) {
            this.favorites.push(productId);
            this.saveFavorites();
            
            // Update favorite icons
            this.updateFavoriteIcons();
            this.updateFavoritesCount();
            
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
        this.favorites = this.favorites.filter(id => id !== productId);
        this.saveFavorites();

        // Update favorite icons
        this.updateFavoriteIcons();
        this.updateFavoritesCount();

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
                if (window.cart) {
                    window.cart.addToCart(productId);
                }
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

    updateFavoriteIcons() {
        // Update all favorite icons on the page
        document.querySelectorAll('.add-to-favorite').forEach(button => {
            const productId = button.getAttribute('data-id');
            const icon = button.querySelector('i');
            if (icon && this.isFavorite(productId)) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = 'var(--danger)';
            } else if (icon) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    }

    updateFavoritesCount() {
        const favoritesCount = this.favorites.length;
        const heartIcon = document.querySelector('a[href="favorites.html"]');
        
        if (heartIcon) {
            // Remove existing count
            const existingCount = heartIcon.querySelector('.favorites-count');
            if (existingCount) {
                existingCount.remove();
            }

            if (favoritesCount > 0) {
                const countElement = document.createElement('span');
                countElement.className = 'favorites-count';
                countElement.textContent = favoritesCount;
                countElement.style.position = 'absolute';
                countElement.style.top = '-5px';
                countElement.style.right = '-5px';
                countElement.style.background = 'var(--accent)';
                countElement.style.color = '#061226';
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
                countElement.style.boxShadow = '0 2px 8px rgba(0, 255, 255, 0.3)';
                countElement.style.zIndex = '10';
                countElement.style.border = '2px solid var(--panel)';

                // Add hover effects
                countElement.onmouseenter = function () {
                    this.style.transform = 'scale(1.4) rotate(12deg)';
                    this.style.background = '#00ffff';
                    this.style.boxShadow = '0 4px 15px rgba(0, 255, 255, 0.6)';
                };

                countElement.onmouseleave = function () {
                    this.style.transform = 'scale(1) rotate(0deg)';
                    this.style.background = 'var(--accent)';
                    this.style.boxShadow = '0 2px 8px rgba(0, 255, 255, 0.3)';
                };

                heartIcon.style.position = 'relative';
                heartIcon.appendChild(countElement);
            }
        }
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

        // Add animation styles
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
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 2500);
    }
}

// Initialize favorites when DOM is loaded, but avoid overwriting existing instance
document.addEventListener('DOMContentLoaded', function() {
    if (!window.favorites) {
        window.favorites = new Favorites();
        console.log('Favorites initialized (favorites.js)');
    } else {
        console.log('Favorites already initialized; skipping duplicate initialization (favorites.js)');
    }
});
