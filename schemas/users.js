let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username không được trùng"],
        required: [true, "Username là bắt buộc"]
    },
    password: {
        type: String,
        required: [true, "Password là bắt buộc"]
    },
    email: {
        type: String,
        unique: [true, "Email không được trùng"],
        required: [true, "Email là bắt buộc"]
    },
    fullName: {
        type: String,
        default: ""
    },
    avatarUrl: {
        type: String,
        default: "https://i.sstatic.net/l60Hf.png"
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    loginCount: {
        type: Number,
        default: 0,
        min: [0, "loginCount không được nhỏ hơn 0"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);