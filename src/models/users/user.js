"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    contacts: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    passwordResetAt: String,
    resetToken: String,
    resetTokenExpiresAt: Date
});
exports["default"] = mongoose_1.model('User', userSchema);
