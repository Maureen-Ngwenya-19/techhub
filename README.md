# TechVibe - Online Electronics Store

A front-end e-commerce website built with plain HTML, CSS and JavaScript as a
student project. TechVibe sells phones, laptops and accessories, and lets a
visitor browse products, fill a shopping cart and complete a (simulated) checkout.

> **Demo only:** no real payments are taken. Card details are validated in the
> browser and then discarded. Never enter a real card number.

## Features

- **5 pages:** Home, Products, Cart, Checkout and Contact
- **Product catalogue** rendered from a JavaScript array (prices in rand, R)
- **Category filters and live search** that work together
- **Shopping cart:** add items, change quantities, remove items
- **Cart saved in `localStorage`** so it survives page reloads
- **Order summary** with a flat shipping fee and 15% VAT
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
├── script.js       All behaviour (products, cart, validation, forms)
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

- **Prices, VAT and shipping:** edit `SHIPPING_FEE`, `VAT_RATE` and the `products`
  array at the top of `script.js`.
- **Product images:** the `makeImage()` helper draws coloured placeholders. Replace
  the `image` values with paths such as `images/iphone.jpg` to use real photos.

## Known Limitations

- There is no back end, so orders and messages are not actually sent anywhere.
- The product list lives in `script.js`; a real shop would load it from a database.
- Payment is simulated and must not be used with real card details.

## Possible Future Improvements

- Product detail pages and image galleries
- Sorting by price and name
- Wish list and customer reviews
- A Node.js back end with a database and a real payment provider

## Author

Student project by _your name_, _course / module_, _date_.
