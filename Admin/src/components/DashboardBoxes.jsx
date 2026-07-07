// import { FaBoxOpen } from "react-icons/fa";
// import { GiChart } from "react-icons/gi";
// import { FiPieChart } from "react-icons/fi";
// import {
//   RiProductHuntLine,
//   RiMoneyRupeeCircleFill,
//   RiUser3Line,
// } from "react-icons/ri";

// import NewOrderTable from "./NewOrderTable";
// import ProductTable from "./ProductTable";
// import Salechart from "./Salechart";
// import UserTable from "./UserTable";
// import LiveUserTracker from "./LiveUserTracker";
// import PieChart from "./PieChart";
// import WorldUserMap from "./WorldUserMap";
// import CarModelTable from "./CarModelUpdate";
// import Admintoggle from "./Admintoggle";
// import AdminTable from "./adminTable"

// const DashboardBoxes = () => {
//   return (
//     <>
//       {/* 🔷 Summary Boxes */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
//         {/* New Order */}
//         <div className="flex items-center border-2 border-black border-opacity-20 rounded-lg p-4 gap-3 hover:bg-[#f1f1f1]">
//           <FaBoxOpen className="h-10 w-10 text-purple-500" />
//           <div className="flex-1">
//             <h3 className="font-bold">New Order</h3>
//             <p>1,390</p>
//           </div>
//           <GiChart className="h-12 w-12 text-purple-500" />
//         </div>

//         {/* Sales */}
//         <div className="flex items-center border-2 border-black border-opacity-20 rounded-lg p-4 gap-3 hover:bg-[#f1f1f1]">
//           <FiPieChart className="h-10 w-10 text-green-500" />
//           <div className="flex-1">
//             <h3 className="font-bold">Sales</h3>
//             <p>$5,000</p>
//           </div>
//           <GiChart className="h-12 w-12 text-green-500" />
//         </div>

//         {/* Revenue */}
//         <div className="flex items-center border-2 border-black border-opacity-20 rounded-lg p-4 gap-3 hover:bg-[#f1f1f1]">
//           <RiMoneyRupeeCircleFill className="h-10 w-10 text-pink-500" />
//           <div className="flex-1">
//             <h3 className="font-bold">Revenue</h3>
//             <p>₹1,390</p>
//           </div>
//           <GiChart className="h-12 w-12 text-pink-500" />
//         </div>

//         {/* Total Product */}
//         <div className="flex items-center border-2 border-black border-opacity-20 rounded-lg p-4 gap-3 hover:bg-[#f1f1f1]">
//           <RiProductHuntLine className="h-10 w-10 text-blue-500" />
//           <div className="flex-1">
//             <h3 className="font-bold">Total Product</h3>
//             <p>1,390</p>
//           </div>
//           <GiChart className="h-12 w-12 text-blue-500" />
//         </div>

//         {/* Live Users */}
//         <div className="flex items-center border-2 border-black border-opacity-20 rounded-lg p-4 gap-3 hover:bg-[#f1f1f1]">
//           <RiUser3Line className="h-10 w-10 text-green-500" />
//           <div className="flex-1">
//             <h3 className="font-bold">Live Users</h3>
//             <LiveUserTracker />
//           </div>
//           <GiChart className="h-12 w-12 text-green-500" />
//         </div>
//       </div>

//       {/* 🔧 Toggle Admin Controls */}
//       <Admintoggle />

//       {/* 📦 Order Table */}
//       <NewOrderTable />

//       {/* 📦 Product Table */}
//       <ProductTable />

//       {/* 📊 Charts Row */}
//       <div className="flex flex-wrap p-4 gap-4 justify-between">
//         <div className="flex-1 min-w-[300px]">
//           <Salechart />
//         </div>
//         <div className="flex flex-col gap-4 min-w-[300px]">
//           <PieChart />
//           <PieChart />
//         </div>
//       </div>

//       {/* 👥 Users Table */}
//       <UserTable />
//       <AdminTable />

//       {/* 🚘 Car Models Table */}
//       <CarModelTable />

//       {/* 🌍 World Map */}
//       {/* <WorldUserMap /> */}
//     </>
//   );
// };

// export default DashboardBoxes;

import { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { GiChart } from "react-icons/gi";
import { FiPieChart } from "react-icons/fi";
import {
  RiProductHuntLine,
  RiMoneyRupeeCircleFill,
  RiUser3Line,
} from "react-icons/ri";

import NewOrderTable from "./NewOrderTable";
import ProductTable from "./ProductTable";
import Salechart from "./Salechart";
import UserTable from "./UserTable";
import LiveUserTracker from "./LiveUserTracker";
import PieChart from "./PieChart";
import WorldUserMap from "./WorldUserMap";
import CarModelTable from "./CarModelUpdate";
import Admintoggle from "./Admintoggle";
import AdminTable from "./adminTable";
import { fetchDataFromApi } from "../utils/api"; // adjust path if needed

const DashboardBoxes = () => {
  const [newOrders, setNewOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const blockedRoles = ["superadmin"]; // block only superadmin from filtered products
  const userRole = localStorage.getItem("name");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Role-based product API
        let productRes;
        if (!blockedRoles.includes(userRole)) {
          productRes = await fetchDataFromApi("/api/product/getProducts");
        } else {
          productRes = await fetchDataFromApi("/api/product/getAllProducts");
        }

        setTotalProducts(productRes.length || 0);

        // Orders
        const ordersRes = await fetchDataFromApi("/api/order/all-orders");
        const placedOrders = ordersRes.data.filter(order => order.status === "Placed");
        setNewOrders(placedOrders.length || 0);

        const deliveredOrders = ordersRes.data.filter(order => order.status === "Delivered");
        // const totalRevenue = deliveredOrders.map((order) => (order.subTotalAmt));
        const totalRevenue = deliveredOrders.reduce(
        (acc, order) => acc + (order.subTotalAmt|| 0),
        0
      );
        setTotalSales(totalRevenue);


      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      {/* 🔷 Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {/* New Order */}
        <div className="flex items-center border-2 border-black border-opacity-20 rounded-lg p-4 gap-3 hover:bg-[#f1f1f1]">
          <FaBoxOpen className="h-10 w-10 text-purple-500" />
          <div className="flex-1">
            <h3 className="font-bold">New Order</h3>
            <p>{newOrders.toLocaleString()}</p>
          </div>
          <GiChart className="h-12 w-12 text-purple-500" />
        </div>

        {/* Sales */}
        <div className="flex items-center border-2 border-black border-opacity-20 rounded-lg p-4 gap-3 hover:bg-[#f1f1f1]">
          <FiPieChart className="h-10 w-10 text-green-500" />
          <div className="flex-1">
            <h3 className="font-bold">Sales</h3>
            <p>₹{totalSales.toLocaleString()}</p>
          </div>
          <GiChart className="h-12 w-12 text-green-500" />
        </div>

        {/* Revenue */}
        {/* <div className="flex items-center border-2 border-black border-opacity-20 rounded-lg p-4 gap-3 hover:bg-[#f1f1f1]">
          <RiMoneyRupeeCircleFill className="h-10 w-10 text-pink-500" />
          <div className="flex-1">
            <h3 className="font-bold">Revenue</h3>
            <p>₹{totalRevenue.toLocaleString()}</p>
          </div>
          <GiChart className="h-12 w-12 text-pink-500" />
        </div> */}

        {/* Total Product */}
        <div className="flex items-center border-2 border-black border-opacity-20 rounded-lg p-4 gap-3 hover:bg-[#f1f1f1]">
          <RiProductHuntLine className="h-10 w-10 text-blue-500" />
          <div className="flex-1">
            <h3 className="font-bold">Total Product</h3>
            <p>{totalProducts.toLocaleString()}</p>
          </div>
          <GiChart className="h-12 w-12 text-blue-500" />
        </div>

        {/* Live Users */}
        <div className="flex items-center border-2 border-black border-opacity-20 rounded-lg p-4 gap-3 hover:bg-[#f1f1f1]">
          <RiUser3Line className="h-10 w-10 text-green-500" />
          <div className="flex-1">
            <h3 className="font-bold">Live Users</h3>
            <LiveUserTracker />
          </div>
          <GiChart className="h-12 w-12 text-green-500" />
        </div>
      </div>

      {/* 🔧 Toggle Admin Controls */}
      <Admintoggle />

      {/* 📦 Order Table */}
      <NewOrderTable />

      {/* 📦 Product Table */}
      <ProductTable />

      {/* 📊 Charts Row */}
      <div className="flex flex-wrap p-4 gap-4 justify-between">
        <div className="flex-1 min-w-[300px]">
          <Salechart />
        </div>
        <div className="flex flex-col gap-4 min-w-[300px]">
          <PieChart />
          <PieChart />
        </div>
      </div>

      {/* 👥 Users Table */}
      <UserTable />
      <AdminTable />

      {/* 🚘 Car Models Table */}
      <CarModelTable />

      {/* 🌍 World Map */}
      {/* <WorldUserMap /> */}
    </>
  );
};

export default DashboardBoxes;
