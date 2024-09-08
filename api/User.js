const mongoose = require('mongoose')
const User = mongoose.model('User', new mongoose.Schema({
    id: String,
    fullName: String,
    phoneNumber: String,
    password: String,
    confrimPassword: String,
}))
module.exports = User;