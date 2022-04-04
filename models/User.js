const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 30
    },
    email: {
        type: String,
        required: true,
        min: 5,
        max: 40
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('User', userSchema);