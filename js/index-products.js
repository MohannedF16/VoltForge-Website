// Product interactions for index page
class IndexProducts {
    constructor() {
        this.cart = new Cart();
        this.favorites = new Favorites();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateFavoriteIcons();
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                e.preventDefault();
                const button = e.target.closest('.add-to-cart');
                const productId = button.getAttribute('data-id');
                this.cart.addToCart(productId, 1);
            }

            // Add to favorite buttons
            if (e.target.closest('.add-to-favorite')) {
                e.preventDefault();
                const button = e.target.closest('.add-to-favorite');
                const productId = button.getAttribute('data-id');
                this.toggleFavorite(productId, button);
            }
        });
    }

    toggleFavorite(productId, button) {
        if (this.favorites.isFavorite(productId)) {
            this.favorites.removeFromFavorites(productId);
            this.updateFavoriteIcon(button, false);
        } else {
            this.favorites.addToFavorites(productId);
            this.updateFavoriteIcon(button, true);
        }
    }

    updateFavoriteIcon(button, isFavorite) {
        const icon = button.querySelector('i');
        if (isFavorite) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = 'var(--danger)';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
        }
    }

    updateFavoriteIcons() {
        document.querySelectorAll('.add-to-favorite').forEach(button => {
            const productId = button.getAttribute('data-id');
            const isFavorite = this.favorites.isFavorite(productId);
            this.updateFavoriteIcon(button, isFavorite);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IndexProducts();
});