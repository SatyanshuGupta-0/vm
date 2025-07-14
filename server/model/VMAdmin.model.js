const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  name: {
    type: String,
    default: "Admin",
  },
 refresh_token: {
  type: String,
  default: ""
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
    "guest"         // Not logged in, limited access
  ],
  default: ["guest"]
},
}, {
  timestamps: true,
});

// 🔒 Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Compare password method
adminSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("VMAdmin", adminSchema);
