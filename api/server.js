const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors())

const mongoURL = 'mongodb+srv://mahdimangeli:Ma13811381***@copperdishes.vuuv7.mongodb.net';
mongoose.connect(mongoURL).then(() => {
    console.log("Connection to MongoDB");
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

const User = mongoose.model('User', new mongoose.Schema({
    id: String,
    fullName: String,
    phoneNumber: String,
    password: String,
    confrimPassword: String,
}))
const categories = mongoose.model('category', new mongoose.Schema({
    name: String,
    images: String,
    categoryDescription: String,
    categoryHistory: String,
    categoryHistoryDescription: String,
}))
const products = mongoose.model('cart', new mongoose.Schema({
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

const shoppingCart = mongoose.model('cart', new mongoose.Schema({
    userId: String,
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
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.send(products)
});

data.products.forEach(async (product) => {
    const newProduct = new products
})


app.listen(3000, () => {
    console.log(`Server Runnig on port 3000`)

})