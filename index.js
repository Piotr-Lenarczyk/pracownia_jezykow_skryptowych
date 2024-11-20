import express from 'express'
import axios from 'axios'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import cors from 'cors'

export const app = express()
const port = 9000

app.use(express.json())

// app.use(cors)

function sleep(miliseconds) {
    let currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {

    }
}

app.listen(port, (error) => {
    if (!error) {
        console.log(`REST API on http://localhost:${port}`)
    } else {
        console.log("Error: " + error)
    }
})

app.get('/', function (req, res) {
    res.json({message: "Hello World!"})
})

// Connection to MongoDB
mongoose.connect('mongodb+srv://admin:dLVOCV0b3qIPBc3m@cluster0.xnoar.mongodb.net/eshop')
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    })


// Model definition
const Category = mongoose.model('Category', {
    name: {
        type: String,
        required: true
    }
})

const Product = mongoose.model('Product', {
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
})

const Basket = mongoose.model('Basket', {
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    },
})

// API endpoints

app.get('/categories', async function (req, res) {
    let categories = await Category.find({});
    res.send(categories)
})

app.get('/categories/:id', async function (req, res) {
    try {
        let category = await Category.findById(req.params.id);
        res.send(category)
    } catch (error) {
        console.log(error)
    }
})

app.post('/categories', async function (req, res) {
    const category = new Category({
        name: req.body.name
    });
    await category.save();
    res.json({
        statusCode: res.statusCode,
        category: category
    })
})

app.patch('/categories/:id', async function (req, res) {
    try {
        let category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.send(category)
    } catch (error) {
        console.log(error);
    }
})

app.delete('/categories/:id', async function (req, res) {
    try {
        let category = await Category.findByIdAndDelete(req.params.id);
        res.json({
            statusCode: res.statusCode,
            category: category
        })
    } catch (error) {
        console.log(error);
    }
})

app.get('/products', async function (req, res) {
    let products = await Product.find({});
    res.send(products);
})


app.get('/products/:id', async function (req, res) {
    try {
        let product = await Product.findById(req.params.id);
        res.send(product)
    } catch (error) {
        console.log(error);
    }
})

app.post('/products', async function (req, res) {
    let category
    try {
        category = await Category.find({"name": req.body.category.name}).exec()
        if (category.length === 0) {
            category = new Category({
                name: req.body.category.name
            })
            await category.save();
        } else {
            category = category[0];
        }
    } catch (error) {
        console.log(error);
    }
    const product = new Product({
        name: req.body.name,
        category: category,
        price: req.body.price
    });
    await product.save();
    res.json({
        statusCode: res.statusCode,
        product: product
    })
})

app.patch('/products/:id', async function (req, res) {
    let category
    try {
        category = await Category.find({"name": req.body.category.name}).exec()
        if (category.length === 0) {
            category = new Category({
                name: req.body.category.name
            })
            await category.save()
        } else {
            category = category[0];
        }
    } catch (error) {
        if (error instanceof TypeError) {

        } else {
            res.status(400).send({})
            return
        }
    }
    try {
        let product = await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            category: category,
            price: req.body.price,
        }, {
            new: true
        });
        res.send(product)
    } catch (error) {
        console.log(error);
    }
})

app.delete('/products/:id', async function (req, res) {
    try {
        let product = await Product.findByIdAndDelete(req.params.id);
        res.json({
            statusCode: res.statusCode,
            product: product
        })
    } catch (error) {
        console.log(error);
    }
})

app.get('/baskets', async function (req, res) {
    let baskets = await Basket.find({});
    res.send(baskets)
})

app.get('/baskets/:id', async function (req, res) {
    try {
        let basket = await Basket.findById(req.params.id);
        res.send(basket)
    } catch (error) {
        console.log(error)
    }
})

app.post('/baskets', async function (req, res) {
    const basket = new Basket({
    })
    await basket.save()
    res.json(basket)
})

app.post('/baskets/:id/add', async function (req, res) {
    try {
        let product = await Product.findById(req.body.id);
        let basket = await Basket.findById(req.params.id);
        let price = product.price
        basket.products.push(product)
        basket.totalPrice += price
        basket.save()
        res.json(basket)
    } catch (error) {
        if (error.stack.includes("CastError: Cast to ObjectId failed for value")) {
            if (error.message.includes("Basket")) {
                res.status(400)
                res.json({
                    message: "No basket with provided ID found"
                })
                return
            } else if (error.message.includes("Product")) {
                res.status(400)
                res.json({
                    message: "No basket with provided ID found"
                })
            }
        }
        console.log(error)
    }
})

app.delete('/baskets/:id', async function (req, res) {
    try {
        let basket = await Basket.findByIdAndDelete(req.params.id);
        res.json({
            statusCode: res.statusCode,
            basket: basket
        })
    } catch (error) {
        console.log(error);
    }
})

app.delete('/baskets/:id/submit', async function (req, res) {
    console.log("Validating data...")
    try {
        let basket = await Basket.findByIdAndDelete(req.params.id);
        console.log("Waiting for payment confirmation...")
        sleep(5000)
        res.json({
            statusCode: res.statusCode,
            basket: basket
        })
    } catch (error) {
        console.log(error);
    }
})

// API testing

const tester = axios.create({
    baseURL: `http://localhost:${port}`,
    timeout: 5000
})

let testCategoryId
let testProductId
let testBasketId

await tester.get('/categories')
    .then(function (response) {
        console.log("Running automatic tests with axios...")
        console.log("--- CATEGORIES ---")
        if (response.status === 200) {
            console.log("GET all categories OK")
        } else {
            console.log("GET all categories FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.post('/categories', {
    name: 'Category-Test'
    })
    .then(function (response) {
        if (response.status === 200) {
            console.log("POST category OK")
        } else {
            console.log("POST category FAIL")
        }
        testCategoryId = new mongoose.Types.ObjectId(response.data.category._id)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.get(`/categories/${testCategoryId}`)
    .then(function (response) {
        if (response.status === 200) {
            console.log("GET category OK")
        } else {
            console.log("GET category FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.patch(`/categories/${testCategoryId}`, {
    name: 'Category_Test'
    })
    .then(function (response) {
        if (response.status === 200) {
            console.log("PATCH category OK")
        } else {
            console.log("PATCH category FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.delete(`/categories/${testCategoryId}`)
    .then(function (response) {
        if (response.status === 200) {
            console.log("DELETE category OK")
        } else {
            console.log("DELETE category FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.get('/products')
    .then(function (response) {
        console.log("--- PRODUCTS ---")
        if (response.status === 200) {
            console.log("GET all products OK")
        } else {
            console.log("GET all products FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

// Category already exists in the database
await tester.post('/products', {
    name: 'ProductX',
    category: {
        name: 'category'
    },
    price: 8
    })
    .then(function (response) {
        console.log("--- Case: Category already exists ---")
        if (response.status === 200) {
            console.log("POST product OK")
        } else {
            console.log("POST product FAIL")
        }
        testProductId = new mongoose.Types.ObjectId(response.data.product._id)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.get(`/products/${testProductId}`)
    .then(function (response) {
        if (response.status === 200) {
            console.log("GET product OK")
        } else {
            console.log("GET product FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.patch(`/products/${testProductId}`, {
    name: 'ProductY'
    })
    .then(function (response) {
        if (response.status === 200) {
            console.log("PATCH product OK")
        } else {
            console.log("PATCH product FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.delete(`/products/${testProductId}`)
    .then(function (response) {
        if (response.status === 200) {
            console.log("DELETE product OK")
        } else {
            console.log("DELETE product FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

// Category does not exist in the database
await tester.post('/products', {
    name: 'ProductX',
    category: {
        name: 'category_new'
    },
    price: 8
})
    .then(function (response) {
        console.log("--- Case: Category does not exist ---")
        if (response.status === 200) {
            console.log("POST product OK")
        } else {
            console.log("POST product FAIL")
        }
        testProductId = new mongoose.Types.ObjectId(response.data.product._id)
        testCategoryId = new mongoose.Types.ObjectId(response.data.product.category._id)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.get(`/products/${testProductId}`)
    .then(function (response) {
        if (response.status === 200) {
            console.log("GET product OK")
        } else {
            console.log("GET product FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.patch(`/products/${testProductId}`, {
    name: 'ProductY'
})
    .then(function (response) {
        if (response.status === 200) {
            console.log("PATCH product OK")
        } else {
            console.log("PATCH product FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.delete(`/products/${testProductId}`)
    .then(function (response) {
        if (response.status === 200) {
            console.log("DELETE product OK")
        } else {
            console.log("DELETE product FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

await tester.delete(`/categories/${testCategoryId}`)
    .then(function (response) {
        if (response.status === 200) {
            console.log("DELETE category OK")
        } else {
            console.log("DELETE category FAIL")
        }
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })
