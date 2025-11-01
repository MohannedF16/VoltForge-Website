// Sample products data
const sampleProducts = [
    {
        id: '1',
        name: 'NVIDIA RTX 4080 — Phantom',
        price: 1199,
        oldPrice: 1399,
        category: 'GPU',
        image: 'images/dao-hi-u-3UAiwOgoSnE-unsplash.jpg',
        description: 'High-performance graphics card with ray tracing technology and AI-powered features for the ultimate gaming experience. Features 16GB GDDR6X memory, DLSS 3.0, and advanced cooling system.'
    },
    {
        id: '2',
        name: 'UltraFast 240Hz OLED Monitor',
        price: 699,
        oldPrice: 799,
        category: 'Monitor',
        image: 'images/mohammadreza-alidoost-8XrE7Kp7FNw-unsplash.jpg',
        description: 'Crystal-clear OLED display with 240Hz refresh rate for buttery-smooth gameplay and vibrant colors. 27-inch 4K resolution with HDR support and 1ms response time.'
    },
    {
        id: '3',
        name: 'ProSurge Wireless Headset',
        price: 199,
        oldPrice: 249,
        category: 'Headset',
        image: 'images/wu-yi-rNCoW7s8oHE-unsplash.jpg',
        description: 'Premium wireless gaming headset with 7.1 surround sound and noise-cancelling microphone. Features 30-hour battery life, RGB lighting, and memory foam ear cushions.'
    },
    {
        id: '4',
        name: 'RGB Mechanical Keyboard',
        price: 149,
        oldPrice: 179,
        category: 'Keyboard',
        image: 'images/samsul-NsAGCQU3s7E-unsplash.jpg',
        description: 'Mechanical gaming keyboard with customizable RGB lighting and responsive switches. Full anti-ghosting, dedicated media controls, and detachable wrist rest.'
    },
    {
        id: '5',
        name: 'NextGen Console Bundle',
        price: 499,
        oldPrice: 549,
        category: 'Console',
        image: 'images/nikolai-chernichenko-YLDaaA-R3l0-unsplash.jpg',
        description: 'Next-generation gaming console bundle including controller and popular game title. 1TB SSD storage, 4K gaming support, and backward compatibility.'
    },
    {
        id: '6',
        name: 'Gaming Laptop — 32GB',
        price: 1299,
        oldPrice: 1499,
        category: 'Laptop',
        image: 'images/taylor-r-5Mw0JlOjtTc-unsplash.jpg',
        description: 'Powerful gaming laptop with 32GB RAM, high-end GPU, and fast SSD storage. 15.6-inch 144Hz display, RGB keyboard, and advanced cooling system.'
    },
    {
        id: '7',
        name: 'Precision Wireless Controller',
        price: 79,
        oldPrice: 99,
        category: 'Controller',
        image: 'images/ryan-quintal-sYY94OQzOmw-unsplash.jpg',
        description: 'Ergonomic wireless controller with precision analog sticks and customizable buttons. Features haptic feedback, 40-hour battery life, and customizable RGB.'
    },
    {
        id: '8',
        name: 'ErgoPro Gaming Chair',
        price: 249,
        oldPrice: 299,
        category: 'Chair',
        image: 'images/kadyn-pierce-PruhDU1m1Yk-unsplash.jpg',
        description: 'Ergonomic gaming chair with lumbar support, adjustable armrests, and premium materials. 4D adjustable, high-density foam, and premium PU leather.'
    }
];

// Initialize products in localStorage if not already set
function initializeData() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
    
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(null));
    }
}

// Initialize when script loads
initializeData();