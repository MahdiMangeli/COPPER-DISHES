const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./User.js');
const path = require('path');
const ObjectId = mongoose.Types.ObjectId;
const app = express();
app.use(express.json());
app.use(cors())

const MONGO_URI = 'mongodb+srv://mahdimangeli:Ma13811381***@copperdishes.vuuv7.mongodb.net';
mongoose.connect(MONGO_URI).then(() => {
    console.log("Connection to MongoDB");
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
app.use(express.static(path.join(__dirname, '../')));

const Category = mongoose.model('Category', new mongoose.Schema({
    id: Number,
    name: String,
    images: [String],
    categoryDescription: String,
    categoryHistory: String,
    categoryHistoryDescription: String,
}))
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    price: Number,
    images: [String],
    desc: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    model: String,
    releaseDate: String,
    salesCount: Number,
    views: Number,
}));

const ShoppingCart = mongoose.model('ShoppingCart', new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    image: String,
    price: Number,
    count: Number,
}));

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/users', async (req, res) => {
    const newUser = new User(req.body);
    try {
        await newUser.save();
        res.send(newUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/api/categorys', async (req, res) => {
    try {
        const users = await Category.find();
        res.send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/products', async (req, res) => {
    const { categoryId } = req.query
    try {
        let products;
        if (categoryId) {
            products = await Product.find({ category: categoryId }).populate('category');
        }
        else {
            products = await Product.find().populate('category');
        }
        res.send(products);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/shoppingcarts', async (req, res) => {
    const cartItems = new ShoppingCart({
        productId: req.body.productId,
        userId: req.body.userId,
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        count: req.body.count
    });
    await cartItems.save();
    res.send(cartItems);
});
app.get('/api/shoppingcarts/:userId', async (req, res) => {
    const userId = req.params.userId;
    if (!ObjectId.isValid(userId)) {
        return res.status(400).send({ message: 'شناسه نا معتبر است' })
    }
    try {
        const cartItems = await ShoppingCart.find({ userId: new ObjectId(userId) }).populate('productId');
        res.send(cartItems);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
})
app.put('/api/shoppingcarts/:id/:userId', async (req, res) => {
    const { userId, id } = req.params;
    if (!ObjectId.isValid(id) || !ObjectId.isValid(userId)) {
        return res.status(400).send({ message: 'شناسه نا معتبر است' })
    }
    try {
        const updateItem = await ShoppingCart.findOneAndUpdate(
            { _id: id, userId },
            { $set: { count: req.body.count } },
            { new: true }

        );
        if (!updateItem) {
            return res.status(404).send({ message: 'ایتم یافت نشد' })
        }
        res.send(updateItem);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
})
app.delete('/api/shoppingcarts/:id/:userId', async (req, res) => {
    const { userId, id } = req.params;
    try {
        const cartItem = await ShoppingCart.findOneAndDelete({ _id: id, userId: userId });
        if (!cartItem) {
            return res.status(404).send({ message: 'ایتمی برای حذف یافت نشد یا این ایتم به این کاربر تعلق ندارد' })
        }
        res.send(cartItem);
    } catch (error) {
        res.status(500).send({ message: 'خطایی رخ داد' })
    }
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Runnig on port 3000`)
})