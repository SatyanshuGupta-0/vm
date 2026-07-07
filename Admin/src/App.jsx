import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import AppLayout from "./AppLayout";
import Login from "./pages/login";
import Product from "./pages/Product";
import ProductUpload from "./pages/ProductUpload";
import Order from "./pages/Order";
import User from "./pages/User";
import AdminRegister from "./pages/Register";
import ResetOrForgotPassword from "./pages/forgotpass";
import CarModelUpload from "./pages/CarModelUpload";
import BannerUpload from "./components/Banner";
import ProductView from "./components/ProductView";
import EditProduct from "./components/EditProduct";
import CarModelUpdate from "./components/CarModelUpdate";
import ModelUpdate from "./components/modelupdate";
import Admintoggle from "./components/Admintoggle";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import the new component

const App = () => {
  return (
    <>
      <Routes>
        {/* ✅ Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="Product" element={<Product />} />
          <Route path="toggle" element={<Admintoggle />} />
          <Route path="Product/Add" element={<ProductUpload />} />
          <Route path="Order" element={<Order />} />
          <Route path="User" element={<User />} />
          <Route path="register" element={<AdminRegister />} />
          <Route path="banner" element={<BannerUpload />} />
          <Route path="product/view/:id" element={<ProductView />} />
          <Route path="product/edit/:id" element={<EditProduct />} />
          <Route path="carModelUpload" element={<CarModelUpload />} />
          <Route path="carModelUpdate" element={<CarModelUpdate />} />
          <Route path="car-model/edit/:carModelId" element={<ModelUpdate />} />
          <Route path="ForgetPassword" element={<ResetOrForgotPassword />} />
        </Route>

        {/* 🔓 Public routes */}
        <Route path="/admin-login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
