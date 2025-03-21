## Online Store
This project is an online store built using React, Redux Toolkit, React Router, Axios, and Node.js to create a functional and scalable web application. The store allows users to browse products, add them to the cart, place orders, and use discounts. The application includes several pages, such as the homepage, category pages, product pages, and a cart.

## Features
Homepage: Displays a promotional poster, a block of categories, a form to get a discount for the first order, and a block of discounted products.
Categories Page: Displays all available product categories.
Products Page: Displays products by category with filtering and sorting options.
Product Page: Displays detailed information about a product.
Cart: Shows products in the cart, allows changing product quantities, and placing an order.
Order Confirmation Modal: Appears after a successful order placement.
Error Page (404): Displays a message indicating that the page was not found.
Redux for State Management: Used to manage data about products, categories, and the cart.

## API Endpoints
The project uses the following API methods for working with data:

GET /categories/all: Get a list of all categories.
GET /categories/:id: Get products by category.
GET /products/all: Get all products.
GET /products/:id: Get a product by ID.
POST /order/send: Place an order.
POST /sale/send: Request a discount.

## Technologies
* Frontend
React
Redux Toolkit
React Router
Axios for API requests
React Hook Form for form handling
CSS/SCSS for styling

* Backend
Node.js
Express
SQLite for storing categories, products, and orders

## Figma Design
You can view the Figma design for the project here:
Project Design