import express from 'express'
import axios from 'axios'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import cors from 'cors'

export const app = express()

app.use(express.json())

// app.use(cors)

app.listen(8000, (error) => {
    if (!error) {
        console.log("REST API on http://localhost:8000")
    } else {
        console.log("Error: " + error)
    }
})

app.get('/', function (req, res) {
    res.send("Hello World!")
})

//axios.create({});
// Connection to MongoDB
mongoose.connect('mongodb+srv://admin:dLVOCV0b3qIPBc3m@cluster0.xnoar.mongodb.net/eshop')
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    })

// File storage
 const storage = multer.diskStorage({
     destination: './upload/images',
     filename: (req, file, callback) => {
         return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
     }
 })

 const upload = multer({storage: storage})

 app.use('/images', express.static('upload/images'))

 app.post("/upload", upload.single('product'), (req, res) => {
     res.json({
         success: true,
         imageUrl: `http://localhost:8000/images/${req.file.filename}`
     })
 })

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

app.get('/categories', async function (req, res) {
    let categories = await Category.find({});
    console.log(categories)
    res.send(categories)
})

app.get('/categories/:id', async function (req, res) {
    try {
        let category = await Category.findById(req.params.id);
        console.log(category)
        res.send(category)
    } catch (error) {
        console.log(error)
    }
})

app.post('/categories', async function (req, res) {
    const category = new Category({
        name: req.body.name
    });
    console.log(res.statusCode)
    console.log(category);
    await category.save();
    res.json({
        statusCode: res.statusCode,
        category: category
    })
})

app.patch('/categories/:id', async function (req, res) {
    try {
        let category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true});
        console.log(category)
        res.send(category)
    } catch (error) {
        console.log(error);
    }
})

app.delete('/categories/:id', async function (req, res) {
    try {
        let category = await Category.findByIdAndDelete(req.params.id);
        console.log(category)
        res.json({
            statusCode: res.statusCode,
            caegory: category
        })
    } catch (error) {
        console.log(error);
    }
})

app.get('/products', async function (req, res) {
    let products = await Product.find({});
    console.log(products)
    res.send(products);
})


app.get('/products/:id', async function (req, res) {
    try {
        let product = await Product.findById(req.params.id);
        console.log(product)
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
    console.log(res.statusCode)
    console.log(product);
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
        console.log(product)
        res.send(product)
    } catch (error) {
        console.log(error);
    }
})

app.delete('/products/:id', async function (req, res) {
    try {
        let product = await Product.findByIdAndDelete(req.params.id);
        console.log(product)
        res.json({
            statusCode: res.statusCode,
            product: product
        })
    } catch (error) {
        console.log(error);
    }
})
