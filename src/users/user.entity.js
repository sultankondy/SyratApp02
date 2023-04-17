const mongoose = require('mongoose');

const UserShcema = new mongoose.Schema(
    {
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isAdmin: {
            type: Boolean,
            default: false
        },
    }, {timestamps: true}
);

const User = mongoose.model("User", UserShcema)

module.exports = User;
