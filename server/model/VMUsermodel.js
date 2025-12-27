const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"]
    },
    email: {
        type: String,
        required: [true, "provide email"],
        unique: true
    },
    password: {
        type: String,
        required: false, // required only if no googleId
    },
    
    avatar: {
        url: {
            type: String,
            default: ""
        },
        publicId: {
            type: String,
            default: null
        }
    },
    mobile: {
        type: Number,
        default: null
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    access_token: {
        type: String,
        default: ""
    },
    refresh_token: {
  type: String,
  default: ""
},

    last_login_date: {
        type: Date,
        default: ""
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Address"
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "cartProduct"
        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "order"
        }
    ],
    wishlist: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Wishlist"
        }
    ],
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    role: {
        type: [String],
        enum: [
            "superadmin",   // Highest level, full access to everything
            "admin",        // Manage users, orders, products, settings
            "manager",      // Oversee operations, reports, team members
            "support",      // Handles customer queries and support tickets
            "accountant",   // Access to financial data, invoices, refunds
            "hr",           // Manage employees, roles, attendance
            "auditor",      // Read-only access for audits
            "editor",       // Can edit content like banners, descriptions
            "vendor",       // 3rd party product sellers (if marketplace)
            "USER",     // Regular shopper, can view and purchase
            "guest"         // Not logged in, limited access
        ],
        default: ["USER"]
    },
//     referralCode: {
//   type: String,
//   unique: true
// },
// referredBy: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User",
//   default: null
// },
// walletBalance: {
//   type: Number,
//   default: 0
// },

    saveChanges: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "SaveChange"
        }
    ]
}, {
    timestamps: true
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;


