// Auth functionality
class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        // Check if we're on auth pages
        if (document.getElementById('signupForm')) {
            this.initSignup();
        }
        if (document.getElementById('signinForm')) {
            this.initSignin();
        }
        this.updateNavigation();
        this.initSearch();
    }

    initSignup() {
        const signupForm = document.getElementById('signupForm');
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.signup();
        });
    }

    initSignin() {
        const signinForm = document.getElementById('signinForm');
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.signin();
        });
    }

    signup() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Clear previous messages
        this.clearMessages();

        // Validation
        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match!', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters long!', 'error');
            return;
        }

        if (this.users.find(user => user.email === email)) {
            this.showMessage('User already exists with this email!', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // Auto login after signup
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // Check for return URL
        const returnUrl = localStorage.getItem('returnUrl');
        localStorage.removeItem('returnUrl');
        
        this.showMessage('Account created successfully! Redirecting...', 'success');
        
        setTimeout(() => {
            if (returnUrl && returnUrl !== window.location.href) {
                window.location.href = returnUrl;
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
    }

    signin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Clear previous messages
        this.clearMessages();

        const user = this.users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Check for return URL
            const returnUrl = localStorage.getItem('returnUrl');
            localStorage.removeItem('returnUrl');
            
            this.showMessage('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                if (returnUrl && returnUrl !== window.location.href) {
                    window.location.href = returnUrl;
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);
        } else {
            this.showMessage('Invalid email or password!', 'error');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    redirectToLoginWithReturn() {
        // Store the current page as return URL
        const returnUrl = window.location.href;
        localStorage.setItem('returnUrl', returnUrl);
        window.location.href = 'signin.html';
    }

    requireLogin(callback) {
        if (!this.isLoggedIn()) {
            this.redirectToLoginWithReturn();
            return false;
        }
        if (callback) callback();
        return true;
    }

    updateNavigation() {
        const userLinks = document.querySelector('.right-area');
        if (!userLinks) return;

        if (this.currentUser) {
            // User is logged in
            userLinks.innerHTML = `
                <a href="#" class="search-icon"><i class="fas fa-search"></i></a>
                <a href="#" id="userMenu"><i class="far fa-user"></i> ${this.currentUser.name.split(' ')[0]}</a>
                <a href="favorites.html"><i class="far fa-heart"></i></a>
                <a href="cart.html" class="bag"><i class="fas fa-shopping-cart"></i></a>
            `;

            // Add logout functionality
            const userMenu = document.getElementById('userMenu');
            if (userMenu) {
                userMenu.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to logout?')) {
                        this.logout();
                    }
                });
            }
        } else {
            // User is not logged in
            userLinks.innerHTML = `
                <a href="#" class="search-icon"><i class="fas fa-search"></i></a>
                <a href="signin.html"><i class="far fa-user"></i></a>
                <a href="favorites.html"><i class="far fa-heart"></i></a>
                <a href="cart.html" class="bag"><i class="fas fa-shopping-cart"></i></a>
            `;
        }

        // Update header links
        this.updateHeaderLinks();
        // Re-initialize search after navigation update
        this.initSearch();
    }

    updateHeaderLinks() {
        const pagesMenu = document.querySelector('.drop-menue');
        if (pagesMenu) {
            const loginLinks = pagesMenu.querySelectorAll('a.link-drop');
            loginLinks.forEach(link => {
                if (link.textContent === 'Login' || link.textContent === 'Logout') {
                    if (this.currentUser) {
                        link.textContent = 'Logout';
                        link.href = '#';
                        link.onclick = (e) => {
                            e.preventDefault();
                            this.logout();
                        };
                    } else {
                        link.textContent = 'Login';
                        link.href = 'signin.html';
                        link.onclick = null;
                    }
                }
            });
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    initSearch() {
        const searchIcons = document.querySelectorAll('.search-icon, .fa-search');
        searchIcons.forEach(icon => {
            // Remove existing listeners
            icon.replaceWith(icon.cloneNode(true));
        });
        
        // Re-attach listeners
        document.querySelectorAll('.search-icon, .fa-search').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSearchModal();
            });
        });
    }

    showSearchModal() {
        // Remove existing modal if any
        const existingModal = document.querySelector('.search-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-header">
                    <h3>Search Products</h3>
                    <button class="close-search">&times;</button>
                </div>
                <div class="search-input-group">
                    <input type="text" id="searchInput" placeholder="Search by name or category...">
                    <button id="searchBtn"><i class="fas fa-search"></i></button>
                </div>
                <div class="search-filters">
                    <label><input type="radio" name="searchType" value="name" checked> Search by Name</label>
                    <label><input type="radio" name="searchType" value="category"> Search by Category</label>
                </div>
                <div class="search-results" id="searchResults"></div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add styles
        this.addSearchStyles();

        // Event listeners
        modal.querySelector('.close-search').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#searchBtn').addEventListener('click', () => {
            this.performSearch();
        });

        modal.querySelector('#searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Focus on input
        setTimeout(() => {
            modal.querySelector('#searchInput').focus();
        }, 100);
    }

    addSearchStyles() {
        if (document.querySelector('.search-modal-styles')) return;

        const styles = `
            .search-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .search-modal-content {
                background: var(--panel);
                padding: 30px;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }
            .search-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .search-header h3 {
                color: var(--text);
                margin: 0;
            }
            .close-search {
                background: none;
                border: none;
                color: var(--text);
                font-size: 24px;
                cursor: pointer;
            }
            .search-input-group {
                display: flex;
                margin-bottom: 20px;
            }
            .search-input-group input {
                flex: 1;
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px 0 0 8px;
                color: var(--text);
                border: none;
            }
            .search-input-group button {
                padding: 12px 20px;
                background: var(--accent);
                border: none;
                border-radius: 0 8px 8px 0;
                cursor: pointer;
                color: #061226;
            }
            .search-filters {
                margin-bottom: 20px;
                color: var(--muted);
            }
            .search-filters label {
                margin-right: 20px;
                cursor: pointer;
            }
            .search-results {
                max-height: 300px;
                overflow-y: auto;
            }
            .search-result-item {
                padding: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                transition: background 0.3s ease;
            }
            .search-result-item:hover {
                background: rgba(255, 255, 255, 0.05);
            }
            .search-result-item h4 {
                color: var(--text);
                margin: 0 0 5px 0;
            }
            .search-result-item p {
                color: var(--muted);
                margin: 0;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.className = 'search-modal-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    performSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchType = document.querySelector('input[name="searchType"]:checked').value;
        const searchResults = document.getElementById('searchResults');
        
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) {
            searchResults.innerHTML = '<p style="color: var(--muted); text-align: center;">Please enter a search term</p>';
            return;
        }

        const products = JSON.parse(localStorage.getItem('products')) || [];
        
        let results = [];
        if (searchType === 'name') {
            results = products.filter(product => 
                product.name.toLowerCase().includes(query)
            );
        } else {
            results = products.filter(product => 
                product.category.toLowerCase().includes(query)
            );
        }

        this.displayResults(results, searchResults);
    }

    displayResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<p style="color: var(--muted); text-align: center;">No products found</p>';
            return;
        }

        container.innerHTML = results.map(product => `
            <div class="search-result-item" onclick="window.location.href='product-details.html?id=${product.id}'">
                <h4>${product.name}</h4>
                <p>$${product.price} • ${product.category}</p>
            </div>
        `).join('');
    }

    showMessage(message, type) {
        // Remove any existing messages
        this.clearMessages();

        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = message;

        // Insert message after the form
        const form = document.querySelector('.auth-form');
        if (form) {
            form.parentNode.insertBefore(messageDiv, form);
        }
    }

    clearMessages() {
        const existingMessages = document.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());
    }
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.auth = new Auth();
});