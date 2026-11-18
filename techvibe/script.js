/* =====================================================
   TechVibe - script.js
   Student project: a beginner e-commerce website
   Sections:
     0. Shared header and footer
     1. Data (products, constants)
     2. Helpers
     3. Product display, filtering, sorting and search
     4. Product detail pop-up
     5. Shopping cart (add, update, remove, save)
     6. Cart page
     7. Checkout page
     8. Contact page and newsletter
     9. Page start-up
===================================================== */


/* ---------- 0. SHARED HEADER AND FOOTER ----------
   Every page has <header id="site-header"> and <footer id="site-footer">.
   They are filled in here so the menu only has to be edited in one place.
   This runs first so the cart counter exists before we look for it below. */

function buildLayout() {
    const page = location.pathname.split("/").pop() || "index.html";
    const link = (href, text) =>
        `<li><a href="${href}" ${page === href ? 'class="current" aria-current="page"' : ""}>${text}</a></li>`;

    const logo = `
        <h2 class="logo"><a href="index.html">
            <img class="logo-mark" src="images/favicon.svg" alt="" width="30" height="30">TechVibe
        </a></h2>`;

    const header = document.getElementById("site-header");
    if (header) {
        header.className = "site-header";
        header.innerHTML = `
            <div class="announcement">Free delivery on orders over R2 000 &nbsp;|&nbsp; 30-day returns &nbsp;|&nbsp; 12-month warranty</div>
            <nav class="navbar" aria-label="Main menu">
                <div class="nav-container">
                    ${logo}
                    <button class="menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false">&#9776;</button>
                    <ul class="nav-menu" id="nav-menu">
                        ${link("index.html", "Home")}
                        ${link("products.html", "Products")}
                        ${link("contact.html", "Contact")}
                        <li><a href="cart.html" class="cart-link ${page === "cart.html" ? "current" : ""}">Cart (<span id="cart-count">0</span>)</a></li>
                    </ul>
                </div>
            </nav>`;
        document.getElementById("menu-toggle").addEventListener("click", function () {
            const open = document.getElementById("nav-menu").classList.toggle("open");
            this.setAttribute("aria-expanded", open);
        });
    }

    const footer = document.getElementById("site-footer");
    if (footer) {
        footer.className = "footer";
        footer.innerHTML = `
            <div class="footer-grid">
                <div class="footer-brand">
                    ${logo}
                    <p>South Africa's friendly electronics store. Phones, laptops and accessories from brands you trust, delivered to your door.</p>
                </div>
                <div>
                    <h4>Shop</h4>
                    <ul>
                        <li><a href="products.html?category=phones">Phones</a></li>
                        <li><a href="products.html?category=laptops">Laptops</a></li>
                        <li><a href="products.html?category=tablets">Tablets</a></li>
                        <li><a href="products.html?category=accessories">Accessories</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Help</h4>
                    <ul>
                        <li><a href="contact.html">Contact us</a></li>
                        <li><a href="contact.html#faq">Delivery and returns</a></li>
                        <li><a href="contact.html#faq">Warranty</a></li>
                        <li><a href="cart.html">Your cart</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Visit us</h4>
                    <ul>
                        <li>123 Tech Street, Johannesburg</li>
                        <li>011 555 0123</li>
                        <li>support@techvibe.example</li>
                        <li>Mon-Fri 9AM-6PM, Sat 10AM-4PM</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">&copy; 2026 TechVibe. All rights reserved. Student project demo: no real orders or payments.</div>`;
    }
}
buildLayout();


/* ---------- 1. DATA ---------- */

// Store settings (change these in one place)
const SHIPPING_FEE = 100;            // flat shipping fee in rand
const FREE_SHIPPING_OVER = 2000;     // orders above this ship free
const VAT_RATE = 0.15;               // South African VAT is 15%
const CART_KEY = "techvibe-cart";

// Our product catalogue (prices in South African rand).
// Images are SVG files in the images/ folder. Replace them with real photos any time.
const products = [
    {
        id: 1, name: "iPhone 15 Pro", brand: "Apple", price: 24999, category: "phones",
        image: "images/iphone.svg", badge: "best", featured: true, rating: 4.8, reviews: 214, stock: 12,
        description: "Premium smartphone with an amazing camera and performance",
        specs: { Display: "6.1-inch OLED", Storage: "256 GB", Camera: "48 MP triple", Battery: "Up to 23 h video" }
    },
    {
        id: 2, name: "MacBook Air", brand: "Apple", price: 21999, oldPrice: 23999, category: "laptops",
        image: "images/macbook.svg", featured: true, rating: 4.9, reviews: 187, stock: 7,
        description: "Lightweight laptop perfect for work and creativity",
        specs: { Display: "13.6-inch Retina", Memory: "8 GB", Storage: "256 GB SSD", Battery: "Up to 18 h" }
    },
    {
        id: 3, name: "AirPods Pro", brand: "Apple", price: 4299, category: "accessories",
        image: "images/airpods.svg", rating: 4.7, reviews: 342, stock: 30,
        description: "Wireless earbuds with noise cancellation",
        specs: { Type: "In-ear, wireless", "Noise control": "Active cancellation", Battery: "6 h (30 h with case)", Charging: "USB-C" }
    },
    {
        id: 4, name: "Samsung Galaxy S24", brand: "Samsung", price: 18999, oldPrice: 21499, category: "phones",
        image: "images/galaxy.svg", rating: 4.6, reviews: 158, stock: 4,
        description: "Android phone with incredible features",
        specs: { Display: "6.2-inch AMOLED", Storage: "256 GB", Camera: "50 MP triple", Battery: "4 000 mAh" }
    },
    {
        id: 5, name: "Dell Inspiron 15", brand: "Dell", price: 12999, category: "laptops",
        image: "images/dell.svg", rating: 4.3, reviews: 96, stock: 15,
        description: "Reliable laptop for everyday computing",
        specs: { Display: "15.6-inch Full HD", Memory: "16 GB", Storage: "512 GB SSD", Processor: "Intel Core i5" }
    },
    {
        id: 6, name: "Wireless Mouse", brand: "Logitech", price: 499, category: "accessories",
        image: "images/mouse.svg", rating: 4.5, reviews: 410, stock: 60,
        description: "Ergonomic wireless mouse for productivity",
        specs: { Connection: "2.4 GHz and Bluetooth", Battery: "Up to 12 months", Buttons: "6", Colour: "Pink" }
    },
    {
        id: 7, name: "Google Pixel 8", brand: "Google", price: 15999, category: "phones",
        image: "images/pixel.svg", badge: "new", rating: 4.5, reviews: 74, stock: 9,
        description: "Pure Android with a brilliant AI-powered camera",
        specs: { Display: "6.2-inch OLED", Storage: "128 GB", Camera: "50 MP dual", Updates: "7 years" }
    },
    {
        id: 8, name: "Lenovo ThinkPad E14", brand: "Lenovo", price: 15499, category: "laptops",
        image: "images/thinkpad.svg", rating: 4.4, reviews: 61, stock: 8,
        description: "Business-grade laptop with a great keyboard",
        specs: { Display: "14-inch Full HD", Memory: "16 GB", Storage: "512 GB SSD", Weight: "1.4 kg" }
    },
    {
        id: 9, name: "Sony WH-1000XM5", brand: "Sony", price: 7999, oldPrice: 8999, category: "accessories",
        image: "images/headphones.svg", featured: true, rating: 4.8, reviews: 265, stock: 11,
        description: "Industry-leading noise cancelling headphones",
        specs: { Type: "Over-ear, wireless", Battery: "30 hours", Charging: "USB-C quick charge", Weight: "250 g" }
    },
    {
        id: 10, name: "Smart Watch Series 9", brand: "Apple", price: 8999, category: "accessories",
        image: "images/watch.svg", badge: "new", rating: 4.7, reviews: 133, stock: 14,
        description: "Track your health, workouts and notifications",
        specs: { Display: "Always-on Retina", Sensors: "Heart rate, ECG, SpO2", Battery: "18 hours", Water: "50 m resistant" }
    },
    {
        id: 11, name: "Galaxy Tab S9", brand: "Samsung", price: 13999, category: "tablets",
        image: "images/tablet.svg", rating: 4.6, reviews: 52, stock: 6,
        description: "Big, bright tablet with an S Pen included",
        specs: { Display: "11-inch AMOLED", Storage: "128 GB", Battery: "8 400 mAh", Extras: "S Pen included" }
    },
    {
        id: 12, name: "Mechanical Keyboard", brand: "Keychron", price: 1299, oldPrice: 1599, category: "accessories",
        image: "images/keyboard.svg", rating: 4.5, reviews: 119, stock: 25,
        description: "Compact mechanical keyboard with satisfying clicky keys",
        specs: { Switches: "Hot-swappable", Layout: "75%", Connection: "Bluetooth and USB-C", Backlight: "White LED" }
    },
    {
        id: 13, name: "Bluetooth Speaker", brand: "JBL", price: 1899, category: "accessories",
        image: "images/speaker.svg", badge: "best", rating: 4.6, reviews: 288, stock: 3,
        description: "Powerful, waterproof sound for the braai or the beach",
        specs: { Battery: "12 hours", Water: "IP67 waterproof", Connection: "Bluetooth 5.3", Weight: "540 g" }
    },
    {
        id: 14, name: "Power Bank 20000mAh", brand: "Anker", price: 749, category: "accessories",
        image: "images/powerbank.svg", rating: 4.4, reviews: 176, stock: 40,
        description: "Keep your phone charged through load shedding",
        specs: { Capacity: "20 000 mAh", Ports: "2x USB-C, 1x USB-A", Charging: "22.5 W fast charge", Weight: "350 g" }
    }
];

// The shopping cart. It starts empty and is loaded from localStorage.
let cart = [];

// Page elements (these are null on pages that do not have them)
const cartCountElement = document.getElementById("cart-count");
const productsGrid = document.getElementById("products-grid");
const featuredProducts = document.getElementById("featured-products");
const dealProducts = document.getElementById("deal-products");
const recommendedProducts = document.getElementById("recommended-products");


/* ---------- 2. HELPERS ---------- */

// 24999 -> "R24 999.00"
function formatPrice(price) {
    return "R" + price.toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// 4.6 -> "★★★★★" style string (rounded to the nearest whole star)
function starString(rating) {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
}

// Work out subtotal, shipping, VAT and total for the current cart
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 && subtotal < FREE_SHIPPING_OVER ? SHIPPING_FEE : 0;
    const tax = subtotal * VAT_RATE;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

// Put a value into an element if that element exists on this page
function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
}

// Small pop-up message
function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.setAttribute("role", "status");
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCardNumber(cardNumber) {
    return /^\d{16}$/.test(cardNumber.replace(/\s/g, ""));
}

function validateExpiry(expiry) {
    // Must look like MM/YY and not be in the past
    const match = /^(\d{2})\/(\d{2})$/.exec(expiry.trim());
    if (!match) return false;
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    return year > now.getFullYear() ||
        (year === now.getFullYear() && month >= now.getMonth() + 1);
}

function validateCvv(cvv) {
    return /^\d{3,4}$/.test(cvv.trim());
}

function validatePostalCode(code) {
    return /^\d{4}$/.test(code.trim());   // South African postal codes
}

function validatePhone(phone) {
    return /^(\+27|0)\d{9}$/.test(phone.replace(/[\s-]/g, ""));
}


/* ---------- 3. PRODUCT DISPLAY, FILTERING, SORTING AND SEARCH ---------- */

function createProductCard(product) {
    const badgeText = product.oldPrice ? "Sale" : product.badge === "new" ? "New" : product.badge === "best" ? "Best seller" : "";
    const badgeClass = product.oldPrice ? "" : product.badge || "";
    const badge = badgeText ? `<span class="product-badge ${badgeClass}">${badgeText}</span>` : "";
    const oldPrice = product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : "";

    return `
        <div class="product-card">
            ${badge}
            <img src="${product.image}" alt="${product.name}" class="product-image"
                 width="600" height="450" loading="lazy" onclick="viewProduct(${product.id})">
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="rating" aria-label="Rated ${product.rating} out of 5">${starString(product.rating)}<small>(${product.reviews})</small></div>
                <div class="product-price">${formatPrice(product.price)}${oldPrice}</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="viewProduct(${product.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

function displayProducts(productsToShow = products) {
    if (productsGrid) {
        if (productsToShow.length === 0) {
            productsGrid.innerHTML = "<p class='no-results'>No products match your search. Try another word or category.</p>";
        } else {
            productsGrid.innerHTML = productsToShow.map(createProductCard).join("");
        }
        const count = document.getElementById("results-count");
        if (count) count.textContent = `Showing ${productsToShow.length} of ${products.length} products`;
    }

    // Homepage sections
    if (featuredProducts) {
        featuredProducts.innerHTML = products.filter(p => p.featured).map(createProductCard).join("");
    }
    if (dealProducts) {
        dealProducts.innerHTML = products.filter(p => p.oldPrice).slice(0, 3).map(createProductCard).join("");
    }
    // Cart page: suggest products that are not already in the cart
    if (recommendedProducts) {
        const inCart = cart.map(item => item.id);
        recommendedProducts.innerHTML = products
            .filter(p => !inCart.includes(p.id)).slice(0, 4).map(createProductCard).join("");
    }
}

// Filters, search and sorting all work together, so we keep track of each
let activeCategory = "all";
let searchText = "";
let sortMode = "featured";

function sortProducts(list) {
    const sorted = [...list];   // copy so the original order is kept
    if (sortMode === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sortMode === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sortMode === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
}

function applyFilters() {
    const filtered = products.filter(product => {
        const matchesCategory = activeCategory === "all" || product.category === activeCategory;
        const matchesSearch = (product.name + " " + product.brand + " " + product.description)
            .toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });
    displayProducts(sortProducts(filtered));
}

function setupFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");

    function selectCategory(category) {
        activeCategory = category;
        filterButtons.forEach(btn =>
            btn.classList.toggle("active", btn.getAttribute("data-category") === category));
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            selectCategory(this.getAttribute("data-category"));
            applyFilters();
        });
    });

    // Links like products.html?category=phones open with that filter on
    const fromLink = new URLSearchParams(location.search).get("category");
    if (fromLink && document.querySelector(`.filter-btn[data-category="${fromLink}"]`)) {
        selectCategory(fromLink);
    }

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            searchText = this.value.trim().toLowerCase();
            applyFilters();
        });
    }

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
        sortSelect.addEventListener("change", function () {
            sortMode = this.value;
            applyFilters();
        });
    }

    if (productsGrid) applyFilters();
}


/* ---------- 4. PRODUCT DETAIL POP-UP ---------- */

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    closeProduct();   // never show two at once

    const specs = Object.entries(product.specs)
        .map(([name, value]) => `<li><span>${name}</span><strong>${value}</strong></li>`).join("");
    const lowStock = product.stock <= 5;
    const oldPrice = product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : "";

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "product-modal";
    overlay.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-label="${product.name} details">
            <button class="modal-close" aria-label="Close" onclick="closeProduct()">&times;</button>
            <img src="${product.image}" alt="${product.name}">
            <div class="modal-body">
                <div class="product-brand">${product.brand}</div>
                <h2>${product.name}</h2>
                <div class="rating">${starString(product.rating)}<small>${product.rating} (${product.reviews} reviews)</small></div>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}${oldPrice}</div>
                <p class="stock ${lowStock ? "low" : ""}">${lowStock ? "Only " + product.stock + " left in stock" : "In stock"}</p>
                <ul class="spec-list">${specs}</ul>
                <button class="btn btn-primary full-width" onclick="addToCart(${product.id}); closeProduct();">Add to Cart</button>
            </div>
        </div>`;
    overlay.addEventListener("click", e => { if (e.target === overlay) closeProduct(); });
    document.body.appendChild(overlay);
}

function closeProduct() {
    const modal = document.getElementById("product-modal");
    if (modal) modal.remove();
}

document.addEventListener("keydown", e => { if (e.key === "Escape") closeProduct(); });


/* ---------- 5. SHOPPING CART ---------- */

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) cartCountElement.textContent = totalItems;
}

function saveCart() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error("Could not save cart:", error);
    }
}

function loadCart() {
    try {
        const savedCart = localStorage.getItem(CART_KEY);
        cart = savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error("Could not load cart:", error);
        cart = [];
    }
    updateCartCount();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error("Product not found!");
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    updateCartCount();
    saveCart();
    showNotification(product.name + " added to cart!");
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    item.quantity = newQuantity;
    updateCartCount();
    saveCart();
    displayCartItems();
    updateCartSummary();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveCart();
    displayCartItems();
    updateCartSummary();
    showNotification("Item removed from cart");
}


/* ---------- 6. CART PAGE ---------- */

function createCartItemHTML(item) {
    return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">${formatPrice(item.price)} each</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" aria-label="Decrease quantity"
                        onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" aria-label="Increase quantity"
                        onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `;
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCartElement = document.getElementById("empty-cart");
    const cartLayout = document.querySelector(".cart-layout");

    // Only run on the cart page
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        if (cartLayout) cartLayout.style.display = "none";
        if (emptyCartElement) emptyCartElement.style.display = "block";
    } else {
        if (cartLayout) cartLayout.style.display = "grid";
        if (emptyCartElement) emptyCartElement.style.display = "none";
        cartItemsContainer.innerHTML = cart.map(createCartItemHTML).join("");
    }
}

function updateCartSummary() {
    const totals = calculateTotals();
    setText("cart-subtotal", formatPrice(totals.subtotal));
    setText("cart-shipping", totals.shipping > 0 ? formatPrice(totals.shipping) : "Free");
    setText("cart-tax", formatPrice(totals.tax));
    setText("cart-total", formatPrice(totals.total));

    // "Add R x more for free delivery" message and progress bar
    const note = document.getElementById("shipping-text");
    const bar = document.getElementById("shipping-bar");
    if (note && bar) {
        const remaining = FREE_SHIPPING_OVER - totals.subtotal;
        note.textContent = remaining > 0
            ? `Add ${formatPrice(remaining)} more to get free delivery`
            : "You've unlocked free delivery!";
        bar.style.width = Math.min(100, (totals.subtotal / FREE_SHIPPING_OVER) * 100) + "%";
    }
}

function goToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    window.location.href = "checkout.html";
}


/* ---------- 7. CHECKOUT PAGE ---------- */

function displayCheckoutItems() {
    const container = document.getElementById("checkout-items");
    if (!container || cart.length === 0) return;

    container.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.image}" alt="${item.name}" class="checkout-item-image">
            <div class="checkout-item-details">
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="checkout-item-price">${formatPrice(item.price * item.quantity)}</div>
        </div>
    `).join("");
}

function updateCheckoutSummary() {
    const totals = calculateTotals();
    setText("checkout-subtotal", formatPrice(totals.subtotal));
    setText("checkout-shipping", totals.shipping > 0 ? formatPrice(totals.shipping) : "Free");
    setText("checkout-tax", formatPrice(totals.tax));
    setText("checkout-total", formatPrice(totals.total));
}

// Simulated order processing. A real shop would send the data to a server.
// IMPORTANT: card details are never stored or sent anywhere in this project.
function processOrder() {
    return new Promise(resolve => {
        setTimeout(() => {
            const order = {
                success: true,
                orderNumber: "TV-" + Date.now(),
                total: calculateTotals().total
            };
            cart = [];
            updateCartCount();
            saveCart();
            resolve(order);
        }, 1500);
    });
}

function showOrderSuccess(orderInfo) {
    const container = document.querySelector(".container");
    container.innerHTML = `
        <div class="success-message">
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase.</p>
            <p><strong>Order Number:</strong> ${orderInfo.orderNumber}</p>
            <p><strong>Amount (demo only):</strong> ${formatPrice(orderInfo.total)}</p>
            <p>This is a student project, so no real payment was taken.</p>
            <a href="index.html" class="btn">Continue Shopping</a>
        </div>
    `;
}

function setupCheckoutForm() {
    const checkoutForm = document.getElementById("checkout-form");
    if (!checkoutForm) return;

    // Nothing to buy? Send the visitor back to the products page.
    if (cart.length === 0) {
        alert("Your cart is empty!");
        window.location.href = "products.html";
        return;
    }

    displayCheckoutItems();
    updateCheckoutSummary();

    checkoutForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(checkoutForm));
        const errors = [];

        if (!data.firstName.trim()) errors.push("First name is required");
        if (!data.lastName.trim()) errors.push("Last name is required");
        if (!validateEmail(data.email)) errors.push("Please enter a valid email address");
        if (!data.address.trim()) errors.push("Street address is required");
        if (!data.city.trim()) errors.push("City is required");
        if (!data.province) errors.push("Please select a province");
        if (!validatePostalCode(data.postalCode)) errors.push("Postal code must be 4 digits");
        if (!validateCardNumber(data.cardNumber)) errors.push("Card number must be 16 digits");
        if (!validateExpiry(data.expiryDate)) errors.push("Expiry date must be a future date (MM/YY)");
        if (!validateCvv(data.cvv)) errors.push("CVV must be 3 or 4 digits");

        if (errors.length > 0) {
            alert("Please fix the following errors:\n\n" + errors.join("\n"));
            return;
        }

        const submitBtn = checkoutForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Processing...";
        submitBtn.disabled = true;

        try {
            const result = await processOrder();
            if (result.success) showOrderSuccess(result);
        } catch (error) {
            alert("There was an error processing your order. Please try again.");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}


/* ---------- 8. CONTACT PAGE AND NEWSLETTER ---------- */

function setupContactForm() {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(contactForm));
        const errors = [];

        if (!data.name.trim()) errors.push("Name is required");
        if (!validateEmail(data.email)) errors.push("Please enter a valid email address");
        if (data.phone.trim() && !validatePhone(data.phone)) {
            errors.push("Phone number must be a valid South African number");
        }
        if (!data.subject) errors.push("Please select a subject");
        if (data.message.trim().length < 10) errors.push("Message must be at least 10 characters long");

        if (errors.length > 0) {
            alert("Please fix the following errors:\n\n" + errors.join("\n"));
            return;
        }

        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        // Simulate sending the message
        setTimeout(() => {
            showNotification("Thank you! We'll get back to you soon.");
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

function setupNewsletter() {
    const form = document.getElementById("newsletter-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = form.elements["email"].value;
        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        showNotification("You're subscribed! Watch your inbox for deals.");
        form.reset();
    });
}


/* ---------- 9. PAGE START-UP ---------- */

document.addEventListener("DOMContentLoaded", function () {
    loadCart();
    displayProducts();
    setupFilters();

    // Cart page
    displayCartItems();
    updateCartSummary();

    // Checkout, contact and newsletter
    setupCheckoutForm();
    setupContactForm();
    setupNewsletter();
});
