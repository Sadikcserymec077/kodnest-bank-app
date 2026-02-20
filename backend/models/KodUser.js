const mongoose = require('mongoose');

const kodUserSchema = new mongoose.Schema({
    uid: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 100000.00 },
    phone: { type: String, required: true },
    role: { type: String, enum: ['Customer', 'Manager', 'Admin'], default: 'Customer' }
});

module.exports = mongoose.model('KodUser', kodUserSchema);
