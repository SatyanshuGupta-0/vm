require("dotenv").config();
require("../db/VMdb"); // MongoDB connection
require("../controller/Order.Controller");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import all routers
const userRouter = require("../router/VMRegisteration");
const adminRouter = require("../router/VMAdminRoute");
const productRouter = require("../router/VMProductRoute");
const cartRouter = require("../router/VMCartRoute");
const wishlistRouter = require("../router/VMWishlistRoute");
const orderRouter = require("../router/VMOrderRoute");
const addressRouter = require("../router/VMAddressRoute");
const carmodelRouter = require("../router/VMCarModelRoute");
const bannerRouter = require("../router/VMBannerRoute");
const carPartRouter = require("../router/VMCarPartRoute");
const activeUserRouter = require("../router/VMActiveUserRoute");
const toggleRouter = require("../router/VMToggleRoute");
const reviewRouter = require("../router/VMReviewRoute");
const authRouter = require("../router/VMAuthRoute");
const contactRouter = require("../router/VMContactRoute");

// Root route
app.get("/", (req, res) => {
  res.send("hello");
});

app.use(cookieParser());

// Body parser middleware
app.use(express.json({ limit: '10mb' })); // increase limit accordingly
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const allowedOrigins = [
  "https://www.vmodifier.com/",
  "https://vmbusiness.netlify.app",
    "http://192.168.31.244:5000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser clients like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "CORS policy does not allow access from this origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));

// ✳️ This is critical for CORS preflight success
app.options("*", cors(corsOptions));


// Use routers
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/order", orderRouter);
app.use("/api/address", addressRouter);
app.use("/api/carModel", carmodelRouter);
app.use("/api/banner", bannerRouter);
app.use('/api/carpart', carPartRouter);
app.use('/api/activeUser', activeUserRouter);
app.use('/api/toggle', toggleRouter);
app.use('/api/review', reviewRouter);
app.use("/api/auth", authRouter);
app.use("/api/contact", contactRouter);


// Start server
const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();



