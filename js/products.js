// products.js - Initialize all data first
console.log('Initializing products data...');

const sampleProducts = [
    {
        id: '1',
        name: 'NVIDIA RTX 4080 — Phantom',
        price: 1199,
        oldPrice: 1399,
        category: 'GPU',
        image: 'images/dao-hi-u-3UAiwOgoSnE-unsplash.jpg',
        description: 'High-performance graphics card with ray tracing technology and AI-powered features for the ultimate gaming experience.'
    },
    {
        id: '2',
        name: 'UltraFast 240Hz OLED Monitor',
        price: 699,
        oldPrice: 799,
        category: 'Monitor',
        image: 'images/mohammadreza-alidoost-8XrE7Kp7FNw-unsplash.jpg',
        description: 'Crystal-clear OLED display with 240Hz refresh rate for buttery-smooth gameplay and vibrant colors.'
    },
    {
        id: '3',
        name: 'ProSurge Wireless Headset',
        price: 199,
        oldPrice: 249,
        category: 'Headset',
        image: 'images/wu-yi-rNCoW7s8oHE-unsplash.jpg',
        description: 'Premium wireless gaming headset with 7.1 surround sound and noise-cancelling microphone.'
    },
    {
        id: '4',
        name: 'RGB Mechanical Keyboard',
        price: 149,
        oldPrice: 179,
        category: 'Keyboard',
        image: 'images/samsul-NsAGCQU3s7E-unsplash.jpg',
        description: 'Mechanical gaming keyboard with customizable RGB lighting and responsive switches.'
    },
    {
        id: '5',
        name: 'NextGen Console Bundle',
        price: 499,
        oldPrice: 549,
        category: 'Console',
        image: 'images/nikolai-chernichenko-YLDaaA-R3l0-unsplash.jpg',
        description: 'Next-generation gaming console bundle including controller and popular game title.'
    },
    {
        id: '6',
        name: 'Gaming Laptop — 32GB',
        price: 1299,
        oldPrice: 1499,
        category: 'Laptop',
        image: 'images/taylor-r-5Mw0JlOjtTc-unsplash.jpg',
        description: 'Powerful gaming laptop with 32GB RAM, high-end GPU, and fast SSD storage.'
    },
    {
        id: '7',
        name: 'Precision Wireless Controller',
        price: 79,
        oldPrice: 99,
        category: 'Controller',
        image: 'images/ryan-quintal-sYY94OQzOmw-unsplash.jpg',
        description: 'Ergonomic wireless controller with precision analog sticks and customizable buttons.'
    },
    {
        id: '8',
        name: 'ErgoPro Gaming Chair',
        price: 249,
        oldPrice: 299,
        category: 'Chair',
        image: 'images/kadyn-pierce-PruhDU1m1Yk-unsplash.jpg',
        description: 'Ergonomic gaming chair with lumbar support, adjustable armrests, and premium materials.'
    }
];

// Initialize all localStorage data
function initializeAppData() {
    console.log('Initializing application data...');
    
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(sampleProducts));
        console.log('Products initialized');
    }
    
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
        console.log('Users initialized');
    }
    
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
        console.log('Cart initialized');
    }
    
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
        console.log('Favorites initialized');
    }
    
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(null));
        console.log('Current user initialized');
    }
    
    console.log('All data initialized successfully');
}

// Initialize immediately when this script loads
initializeAppData();