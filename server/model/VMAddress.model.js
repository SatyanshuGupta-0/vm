const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    address_line: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    pincode: {
        type: String
    },
    country: {
        type: String
    },
    mobile: {
        type: Number,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user", // optional but recommended to add ref here if you use populate
        default: null
    }
}, {
    timestamps: true // fixed typo here
});

const AddressModel = mongoose.model("Address", addressSchema); // Capital A to match ref

module.exports = AddressModel;
