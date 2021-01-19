const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    pic: {
        type: String,
        default:"https://res.cloudinary.com/jagdeepsingh/image/upload/v1611035364/avatar_scab82.png"
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;