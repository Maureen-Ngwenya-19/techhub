/* =====================================================
   TechVibe - script.js
   Student project: a beginner e-commerce website
   Sections:
     1. Data (products, constants)
     2. Helpers
     3. Product display, filtering and search
     4. Shopping cart (add, update, remove, save)
     5. Cart page
     6. Checkout page
     7. Contact page
     8. Page start-up
===================================================== */


/* ---------- 1. DATA ---------- */

// Store settings (change these in one place)
const SHIPPING_FEE = 100;   // flat shipping fee in rand
const VAT_RATE = 0.15;      // South African VAT is 15%
const CART_KEY = "techvibe-cart";

// Placeholder images are generated in the browser as SVG,
// so the site works offline and never shows broken images.
function makeImage(label, colour) {
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">` +
        `<rect width="300" height="200" fill="${colour}"/>` +
        `<text x="150" y="108" font-family="Arial" font-size="24" ` +
        `font-weight="bold" fill="white" text-anchor="middle">${label}</text>` +
        `</svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

// Our product catalogue (prices in South African rand)
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 24999,
        category: "phones",
        image: makeImage("iPhone 15 Pro", "#3b82f6"),
        description: "Premium smartphone with an amazing camera and performance"
    },
    {
        id: 2,
        name: "MacBook Air",
        price: 21999,
        category: "laptops",
        image: makeImage("MacBook Air", "#10b981"),
        description: "Lightweight laptop perfect for work and creativity"
    },
    {
        id: 3,
        name: "AirPods Pro",
        price: 4299,
        category: "accessories",
        image: makeImage("AirPods Pro", "#f59e0b"),
        description: "Wireless earbuds with noise cancellation"
    },
    {
        id: 4,
        name: "Samsung Galaxy S24",
        price: 18999,
        category: "phones",
        image: makeImage("Galaxy S24", "#8b5cf6"),
        description: "Android phone with incredible features"
    },
    {
        id: 5,
        name: "Dell Laptop",
        price: 12999,
        category: "laptops",
        image: makeImage("Dell Laptop", "#06b6d4"),
        description: "Reliable laptop for everyday computing"
    },
    {
        id: 6,
        name: "Wireless Mouse",
        price: 499,
        category: "accessories",
        image: makeImage("Wireless Mouse", "#ec4899"),
        description: "Ergonomic wireless mouse for productivity"
    }
];

// The shopping cart. It starts empty and is loaded from localStorage.
let cart = [];

// Page elements (these are null on pages that do not have them)
const cartCountElement = document.getElementById("cart-count");
const productsGrid = document.getElementById("products-grid");
const featuredProducts = document.getElementById("featured-products");


/* ---------- 2. HELPERS ---------- */

// 24999 -> "R24 999.00"
function formatPrice(price) {
    return "R" + price.toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Work out subtotal, shipping, VAT and total for the current cart
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
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


/* ---------- 3. PRODUCT DISPLAY, FILTERING AND SEARCH ---------- */

function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
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
            productsGrid.innerHTML = "<p class='no-results'>No products match your search.</p>";
        } else {
            productsGrid.innerHTML = productsToShow.map(createProductCard).join("");
        }
    }

    // Homepage: show the first 3 products as "featured"
    if (featuredProducts) {
        featuredProducts.innerHTML = products.slice(0, 3).map(createProductCard).join("");
    }
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    alert(
        product.name + "\n\n" +
        "Price: " + formatPrice(product.price) + "\n" +
        "Category: " + product.category + "\n\n" +
        product.description
    );
}

// Filters and search work together, so we keep track of both
let activeCategory = "all";
let searchText = "";

function applyFilters() {
    const filtered = products.filter(product => {
        const matchesCategory = activeCategory === "all" || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });
    displayProducts(filtered);
}

function setupFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            activeCategory = this.getAttribute("data-category");
            applyFilters();
        });
    });

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            searchText = this.value.trim().toLowerCase();
            applyFilters();
        });
    }
}


/* ---------- 4. SHOPPING CART ---------- */

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


/* ---------- 5. CART PAGE ---------- */

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
}

function goToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    window.location.href = "checkout.html";
}


/* ---------- 6. CHECKOUT PAGE ---------- */

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
            <a href="index.html" class="btn btn-primary">Continue Shopping</a>
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


/* ---------- 7. CONTACT PAGE ---------- */

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


/* ---------- 8. PAGE START-UP ---------- */

document.addEventListener("DOMContentLoaded", function () {
    loadCart();
    displayProducts();
    setupFilters();

    // Cart page
    displayCartItems();
    updateCartSummary();

    // Checkout and contact pages
    setupCheckoutForm();
    setupContactForm();
});
