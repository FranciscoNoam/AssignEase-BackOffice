const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            },
            message: "Username is invalid",
        },
    },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token_auth: { type: String }
});

const Userdb = mongoose.model('users', userSchema);

module.exports = Userdb;
