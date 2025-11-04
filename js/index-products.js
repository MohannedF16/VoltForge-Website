// js/index-products.js - Coordinate-hit detection (overcome the z-index of the img tags)
class IndexProducts {
    constructor() {
        console.log('IndexProducts initializing...');
        this.handleClick = this.handleClick.bind(this);
        this.initWhenReady();
    }

    initWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('IndexProducts init() called');

        try {
            if (typeof Cart !== 'undefined' && !window.cart) {
                window.cart = new Cart();
                console.log('Cart constructed by IndexProducts');
            }
        } catch (err) { console.warn('Cart ctor error:', err); }

        try {
            if (typeof Favorites !== 'undefined' && !window.favorites) {
                window.favorites = new Favorites();
                console.log('Favorites constructed by IndexProducts');
            }
        } catch (err) { console.warn('Favorites ctor error:', err); }

        this.updateActionableElements();
        this.setupEventListeners();
        this.updateFavoriteIcons();
        console.log('IndexProducts setup complete');
    }

    updateActionableElements() {
        this.cartEls = Array.from(document.querySelectorAll('.add-to-cart'));
        this.favEls = Array.from(document.querySelectorAll('.add-to-favorite'));
        this.detailsEls = Array.from(document.querySelectorAll('.view-details'));
        this.allActionEls = [...this.cartEls, ...this.favEls, ...this.detailsEls];
        console.log('IndexProducts actionable counts:', {
            carts: this.cartEls.length,
            favs: this.favEls.length,
            details: this.detailsEls.length
        });
    }

    setupEventListeners() {
        console.log('Setting up IndexProducts event listeners...');
        document.removeEventListener('click', this.handleClick, true);
        document.removeEventListener('click', this.handleClick);
        document.addEventListener('click', this.handleClick, true);  // capture-phase earliest
        document.addEventListener('click', this.handleClick);        // bubble fallback
        this.setupMutationObserver();
        console.log('Event listeners attached (capture + bubble delegated)');
    }

    setupMutationObserver() {
        if (this._observer) return;
        try {
            this._observer = new MutationObserver((mutations) => {
                let changed = false;
                for (const m of mutations) {
                    if ((m.addedNodes && m.addedNodes.length) || (m.removedNodes && m.removedNodes.length)) {
                        changed = true; break;
                    }
                }
                if (changed) {
                    this.updateActionableElements();
                    this.updateFavoriteIcons();
                }
            });
            this._observer.observe(document.body, { childList: true, subtree: true });
        } catch (err) {
            // ignore
        }
    }

    hitTestByCoordinates(x, y) {
        const tol = 6; // small tolerance to make small icons easier to hit
        for (const el of this.allActionEls) {
            if (!el || !el.getBoundingClientRect) continue;
            const r = el.getBoundingClientRect();
            if (x >= r.left - tol && x <= r.right + tol && y >= r.top - tol && y <= r.bottom + tol) {
                return el;
            }
        }
        return null;
    }

    handleClick(e) {
        const originalTarget = e.target;
        const x = e.clientX, y = e.clientY;
        let hit = null;

        if (typeof x === 'number' && typeof y === 'number') {
            hit = this.hitTestByCoordinates(x, y);
        }

        if (!hit && typeof e.clientX === 'number') {
            try {
                const top = document.elementFromPoint(e.clientX, e.clientY);
                if (top) hit = top.closest && top.closest('.add-to-cart, .add-to-favorite, .view-details');
            } catch (err) { /* ignore for now*/ }
        }

        if (!hit && originalTarget && originalTarget.closest) {
            hit = originalTarget.closest('.add-to-cart, .add-to-favorite, .view-details');
        }

        if (!hit) return; // no actionable element

        if (hit.matches && hit.matches('.add-to-cart')) {
            e.preventDefault(); e.stopPropagation();
            const productId = hit.dataset.id ?? hit.getAttribute('data-id');
            console.log('IndexProducts: add-to-cart hit', productId);
            if (window.cart && typeof window.cart.addToCart === 'function') {
                window.cart.addToCart(String(productId), 1);
            } else {
                console.error('Cart not available');
                this.showMessage('Cart not available. Refresh page.', 'error');
            }
            return;
        }

        if (hit.matches && hit.matches('.add-to-favorite')) {
            e.preventDefault(); e.stopPropagation();
            const productId = hit.dataset.id ?? hit.getAttribute('data-id');
            console.log('IndexProducts: add-to-favorite hit', productId);
            if (window.favorites && typeof window.favorites.addToFavorites === 'function') {
                if (window.favorites.isFavorite(String(productId))) {
                    window.favorites.removeFromFavorites(String(productId));
                    this.updateFavoriteIcon(hit, false);
                } else {
                    window.favorites.addToFavorites(String(productId));
                    this.updateFavoriteIcon(hit, true);
                }
            } else {
                console.error('Favorites not available');
                this.showMessage('Favorites not available. Refresh page.', 'error');
            }
            return;
        }
        if (hit.matches && hit.matches('.view-details')) {
            const href = hit.href || hit.getAttribute('href');
            console.log('IndexProducts: view-details clicked ->', href);
            if (href) {
                // explicit navigation (bypass any preventDefault from other listeners)
                window.location.href = href;
            }
            return;
        }

    }

    updateFavoriteIcon(button, isFavorite) {
        const icon = button.querySelector('i');
        if (!icon) return;
        if (isFavorite) {
            icon.classList.remove('far'); icon.classList.add('fas'); icon.style.color = 'var(--danger)';
        } else {
            icon.classList.remove('fas'); icon.classList.add('far'); icon.style.color = '';
        }
    }

    updateFavoriteIcons() {
        document.querySelectorAll('.add-to-favorite').forEach(button => {
            const productId = button.dataset.id ?? button.getAttribute('data-id');
            if (window.favorites && typeof window.favorites.isFavorite === 'function') {
                const isFav = window.favorites.isFavorite(String(productId));
                this.updateFavoriteIcon(button, isFav);
            }
        });
    }

    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '100px';
        messageDiv.style.right = '20px';
        messageDiv.style.padding = '12px 16px';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.fontWeight = '700';
        messageDiv.style.zIndex = '10000';
        messageDiv.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
        if (type === 'error') {
            messageDiv.style.background = '#ff4444'; messageDiv.style.color = '#fff';
        } else {
            messageDiv.style.background = 'var(--accent)'; messageDiv.style.color = '#061226';
        }
        document.body.appendChild(messageDiv);
        setTimeout(() => { if (messageDiv.parentNode) messageDiv.parentNode.removeChild(messageDiv); }, 3000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { window.indexProducts = new IndexProducts(); });
} else {
    window.indexProducts = new IndexProducts();
}
