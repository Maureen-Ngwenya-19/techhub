# TechVibe - Online Electronics Store

A front-end e-commerce website built with plain HTML, CSS and JavaScript as a
student project. TechVibe sells phones, laptops and accessories, and lets a
visitor browse products, fill a shopping cart and complete a (simulated) checkout.

> **Demo only:** no real payments are taken. Card details are validated in the
> browser and then discarded. Never enter a real card number.

## Features

- **5 pages:** Home, Products, Cart, Checkout and Contact
- **14-product catalogue** with brands, ratings, sale badges and specs, rendered from a JavaScript array (prices in rand, R)
- **Category filters, live search and sorting** that work together (categories can also be opened from links such as `products.html?category=phones`)
- **Product detail pop-up** with specifications, stock level and add-to-cart
- **Richer homepage:** hero image, benefits strip, category tiles, deals, brands, reviews and newsletter sign-up
- **Free-delivery progress bar** in the cart and suggested products
- **Contact page** with a map placeholder and an FAQ
- **Shared header and footer** built once in `script.js` (with a mobile menu)
- **Shopping cart:** add items, change quantities, remove items
- **Cart saved in `localStorage`** so it survives page reloads
- **Order summary** with a flat shipping fee (free over R2 000) and 15% VAT
- **Form validation** on checkout (email, 4-digit postal code, 16-digit card,
  future expiry date, CVV) and on the contact form
- **Simulated order processing** using a Promise and `async`/`await`
- **Responsive layout** for phones, tablets and desktops

## Project Structure

```
techvibe/
├── index.html      Homepage with hero banner and featured products
├── products.html   Product list with search and category filters
├── cart.html       Shopping cart and order summary
├── checkout.html   Shipping and payment form
├── contact.html    Contact details and message form
├── style.css       All styling (reset, layout, components, responsive rules)
├── script.js       All behaviour (header/footer, products, cart, validation, forms)
├── images/         SVG product pictures, hero artwork and favicon
└── README.md
```

## How to Run

No installation is needed.

1. Download or clone the project folder.
2. Open `index.html` in a web browser.
3. Browse the products, add some to your cart and try the checkout.

## Concepts Practised

| Area | What was used |
|------|---------------|
| HTML | Semantic tags (`nav`, `main`, `section`, `footer`), forms, labels, `data-` attributes |
| CSS | Flexbox, Grid, media queries, transitions, keyframe animation, sticky/fixed positioning |
| JavaScript | Arrays and objects, `map`, `filter`, `find`, `reduce`, template literals, DOM manipulation, events |
| Browser APIs | `localStorage`, `FormData`, `setTimeout`, Promises and `async`/`await` |
| Good practice | Separating structure, style and behaviour; reusable validation functions; settings kept in constants |

## Customising the Store

- **Prices, VAT and shipping:** edit `SHIPPING_FEE`, `FREE_SHIPPING_OVER`, `VAT_RATE` and the `products`
  array at the top of `script.js`.
- **Product images:** each product points to a file in `images/`. Drop in real photos
  (for example `images/iphone.jpg`) and change the `image` value to match.
- **Menu and footer:** edit `buildLayout()` at the top of `script.js`; every page updates.

## Known Limitations

- There is no back end, so orders and messages are not actually sent anywhere.
- The product list lives in `script.js`; a real shop would load it from a database.
- Payment is simulated and must not be used with real card details.

## Possible Future Improvements

- Separate product detail pages and image galleries
- Wish list and customer reviews
- A Node.js back end with a database and a real payment provider

## Author

Student project by _your name_, _course / module_, _date_.
