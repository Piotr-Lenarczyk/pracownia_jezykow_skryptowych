# REST API Server with Express, Node.js, and MongoDB

This project is a RESTful web server built using <b>Node.js</b>, <b>Express</b>, <b>MongoDB</b>, and <b>Axios</b>. It provides API endpoints for managing categories, products, and shopping baskets in an e-commerce setting.

## Features
- CRUD operations for categories and products
- Basket management, including adding products and submitting orders
- Data is stored in a MongoDB database with NodeJS integration using Mongoose
- Automatic testing using Axios


## Prerequisites
Before running this project, ensure you have the following installed:
- <b>Node.js</b> (>= v16 recommended)
- <b>npm</b> (comes with Node.js)
- <b>MongoDB</b> (either locally installed or a cloud-hosted instance)

## Installation
1. Clone the repository
2. Install dependencies: <code>npm install</code>
3. Set up MongoDB connection:
    - If using a cloud-hosted database (e.g., MongoDB Atlas), replace the connection string inside <i>mongoose.connect</i> in <b>server.js</b> with your credentials.
    - If running MongoDB locally, ensure your MongoDB service is up and update the connection URL accordingly.
4. Start the server: <code>npm start</code><br>The API will be available at <code>http://localhost:9000</code>

## API Endpoints

Endpoints will be available relative to the root path

### Categories
- <code>GET /categories</code> – Retrieve all categories
- <code>GET /categories/:id</code> – Retrieve a single category
- <code>POST /categories</code> – Create a new category
- <code>PATCH /categories/:id</code> – Update a category
- <code>DELETE /categories/:id</code> – Delete a category

### Products
- <code>GET /products</code> – Retrieve all products
- <code>GET /products/:id</code> – Retrieve a single product
- <code>POST /products</code> – Create a new product
- <code>PATCH /products/:id</code> – Update a product
- <code>DELETE /products/:id</code> – Delete a product

### Baskets
- <code>GET /baskets</code> – Retrieve all baskets
- <code>GET /baskets/:id</code> – Retrieve a single basket
- <code>POST /baskets</code> – Create a new basket
- <code>POST /baskets/:id/add</code> – Add a product to a basket
- <code>DELETE /baskets/:id/submit</code> – Submit and delete a basket (simulate checkout)

## Running Tests

The project includes automatic API testing using Axios.
To run the tests, simply start the server and let the built-in test cases execute upon startup.
