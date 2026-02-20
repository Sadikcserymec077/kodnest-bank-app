const mongoose = require('mongoose');

const userTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    uid: { type: Number, required: true },
    expiry: { type: Date, required: true }
});

module.exports = mongoose.model('UserToken', userTokenSchema);
