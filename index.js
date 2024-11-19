import express from 'express'
import axios from 'axios'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import cors from 'cors'

export const app = express()
const port = 9000

app.use(express.json())

// app.use(cors)

app.listen(port, (error) => {
    if (!error) {
        console.log(`REST API on http://localhost:${port}`)
    } else {
        console.log("Error: " + error)
    }
})

app.get('/', function (req, res) {
    res.send("Hello World!")
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
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
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
        new_price: req.body.new_price,
        old_price: req.body.old_price,
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
            console.log(error)
        } else {
            res.status(400).send({})
            return
        }
    }
    try {
        let product = await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            category: category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
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

// API testing

const tester = axios.create({
    baseURL: `http://localhost:${port}`,
    timeout: 5000
})

tester.get('/categories')
    .then(function (response) {
        console.log("GET all categories")
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

tester.get('/products')
    .then(function (response) {
        console.log("GET all products")
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

tester.get('/categories', {
        params: {
            id: '67373c504ab9dc44d74bdf88'
        }
    })
    .then(function (response) {
        console.log("GET single category")
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

tester.get('/products', {
    params: {
        id: '673c53dc3651ff40fb2490de'
    }
})
    .then(function (response) {
        console.log("GET single product")
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

tester.post('/categories', {
    name: 'ProductX'
})
    .then(function (response) {
        console.log("POST category")
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

tester.post('/products', {
    name: 'ProductX',
    category: {
        name: 'CategoryX'
    },
    old_price: 10,
    new_price: 8
})
    .then(function (response) {
        console.log("POST product")
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

tester.patch('/categories/673c53dc3651ff40fb2490de', {
    name: 'Category_Test'
})
    .then(function (response) {
        console.log("PATCH category")
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

tester.patch('/products/673b321435b470a4bd37793a', {
    name: 'ProductX',
    category: {
        name: 'CategoryX'
    },
    old_price: 11,
    new_price: 7
})
    .then(function (response) {
        console.log("PATCH product")
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

tester.delete('/categories/673c70fc9d6d26dea1475fc4')
    .then(function (response) {
        console.log("DELETE category")
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })

tester.delete('/products/673c70fd9d6d26dea1475fd5')
    .then(function (response) {
        console.log("DELETE product")
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {

    })
