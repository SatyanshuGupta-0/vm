// import { useState } from "react";
// import { FaWallet } from "react-icons/fa";

// const Wallet = () => {
//   const [walletBalance] = useState(2450);
//   const [activeTab, setActiveTab] = useState("transactions");
//   const [withdrawAmount, setWithdrawAmount] = useState("");

//   const transactions = [
//     {
//       id: 1,
//       type: "CREDIT",
//       amount: 99,
//       note: "Commission from Car Polish",
//       date: "25 Dec 2025",
//     },
//     {
//       id: 2,
//       type: "CREDIT",
//       amount: 1350,
//       note: "Commission from Alloy Wheel",
//       date: "24 Dec 2025",
//     },
//     {
//       id: 3,
//       type: "DEBIT",
//       amount: 500,
//       note: "Wallet withdrawal",
//       date: "20 Dec 2025",
//     },
//   ];

//   const commissions = [
//     {
//       id: 1,
//       product: "Car Polish",
//       orderAmount: 999,
//       commissionPercent: 10,
//       earned: 99,
//       status: "APPROVED",
//     },
//     {
//       id: 2,
//       product: "Alloy Wheel",
//       orderAmount: 45000,
//       commissionPercent: 3,
//       earned: 1350,
//       status: "PENDING",
//     },
//   ];

//   return (
//     <div className="p-4 max-w-4xl mx-auto space-y-6 mt-10">
//       {/* 🔒 WALLET CARD */}
//       <div className="rounded-xl p-6 border shadow-md bg-white text-center">
//         <FaWallet size={40} className="mx-auto text-emerald-600 mb-2" />
//         <h2 className="text-lg font-semibold">Wallet Balance</h2>
//         <p className="text-3xl font-bold mt-1">₹ {walletBalance}</p>
//       </div>

//       {/* 🔁 TAB HEADER */}
//       <div className="flex border-b">
//         {[
//           { key: "transactions", label: "Transactions" },
//           { key: "commissions", label: "Commissions" },
//           { key: "withdraw", label: "Withdraw" },
//         ].map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`flex-1 py-3 font-semibold transition ${
//               activeTab === tab.key
//                 ? "border-b-2 border-black text-black"
//                 : "text-gray-400"
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* 📜 TRANSACTIONS */}
//       {activeTab === "transactions" && (
//         <div className="rounded-xl p-5 border shadow-md bg-white">
//           {transactions.map((tx) => (
//             <div
//               key={tx.id}
//               className="flex justify-between items-center border-b py-3"
//             >
//               <div>
//                 <p className="font-medium">{tx.note}</p>
//                 <p className="text-sm text-gray-500">{tx.date}</p>
//               </div>
//               <p
//                 className={`font-semibold ${
//                   tx.type === "CREDIT"
//                     ? "text-green-600"
//                     : "text-red-500"
//                 }`}
//               >
//                 {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 💰 COMMISSIONS */}
//       {activeTab === "commissions" && (
//         <div className="rounded-xl p-5 border shadow-md bg-white">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border">Product</th>
//                   <th className="p-2 border">Order</th>
//                   <th className="p-2 border">%</th>
//                   <th className="p-2 border">Earned</th>
//                   <th className="p-2 border">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {commissions.map((item) => (
//                   <tr key={item.id} className="text-center">
//                     <td className="p-2 border">{item.product}</td>
//                     <td className="p-2 border">₹{item.orderAmount}</td>
//                     <td className="p-2 border">{item.commissionPercent}%</td>
//                     <td className="p-2 border text-green-600 font-semibold">
//                       ₹{item.earned}
//                     </td>
//                     <td className="p-2 border">
//                       <span
//                         className={`px-2 py-1 rounded text-xs ${
//                           item.status === "APPROVED"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* 🏦 WITHDRAW */}
//       {activeTab === "withdraw" && (
//         <div className="rounded-xl p-6 border shadow-md bg-white space-y-4">
//           <h3 className="font-semibold text-lg">Withdraw Money</h3>

//           <input
//             type="number"
//             placeholder="Enter amount"
//             value={withdrawAmount}
//             onChange={(e) => setWithdrawAmount(e.target.value)}
//             className="w-full border rounded px-4 py-2 focus:outline-none"
//           />

//           <input
//             type="text"
//             placeholder="Bank / UPI ID"
//             className="w-full border rounded px-4 py-2 focus:outline-none"
//           />

//           <p className="text-sm text-gray-500">
//             Minimum withdraw amount ₹500
//           </p>

//           <button
//             disabled
//             className="w-full py-2 bg-gray-300 rounded cursor-not-allowed"
//           >
//             Withdraw Request (Coming Soon)
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Wallet;
import { useState } from "react";
import { FaWallet } from "react-icons/fa";

const Wallet = () => {
  const [walletBalance] = useState(2450);
  const [activeTab, setActiveTab] = useState("transactions");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const transactions = [
    {
      id: 1,
      type: "CREDIT",
      amount: 99,
      note: "Commission from Car Polish",
      date: "25 Dec 2025",
    },
    {
      id: 2,
      type: "CREDIT",
      amount: 1350,
      note: "Commission from Alloy Wheel",
      date: "24 Dec 2025",
    },
    {
      id: 3,
      type: "DEBIT",
      amount: 500,
      note: "Wallet withdrawal",
      date: "20 Dec 2025",
    },
  ];

//   const commissions = [
//     {
//       id: 1,
//       product: "Car Polish",
//       orderAmount: 999,
//       commissionPercent: 10,
//       earned: 99,
//       status: "APPROVED",
//     },
//     {
//       id: 2,
//       product: "Alloy Wheel",
//       orderAmount: 45000,
//       commissionPercent: 3,
//       earned: 1350,
//       status: "PENDING",
//     },
//   ];

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 mt-10">
      {/* 🔒 WALLET CARD */}
      <div className="rounded-xl p-6 border shadow-md bg-white text-center">
        <FaWallet size={40} className="mx-auto text-emerald-600 mb-2" />
        <h2 className="text-lg font-semibold">Wallet Balance</h2>
        <p className="text-3xl font-bold mt-1">₹ {walletBalance}</p>
      </div>

      {/* 🔁 TAB HEADER */}
      <div className="flex border-b">
        {[
          { key: "transactions", label: "Transactions" },
        //   { key: "commissions", label: "Commissions" },
          { key: "withdraw", label: "Withdraw" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 font-semibold transition ${
              activeTab === tab.key
                ? "border-b-2 border-black text-black"
                : "text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 📜 TRANSACTIONS */}
      {activeTab === "transactions" && (
        <div className="rounded-xl p-5 border shadow-md bg-white">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between items-center border-b py-3"
            >
              <div>
                <p className="font-medium">{tx.note}</p>
                <p className="text-sm text-gray-500">{tx.date}</p>
              </div>
              <p
                className={`font-semibold ${
                  tx.type === "CREDIT"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 💰 COMMISSIONS */}
      {/* {activeTab === "commissions" && (
        <div className="rounded-xl p-5 border shadow-md bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Order</th>
                  <th className="p-2 border">%</th>
                  <th className="p-2 border">Earned</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="p-2 border">{item.product}</td>
                    <td className="p-2 border">₹{item.orderAmount}</td>
                    <td className="p-2 border">{item.commissionPercent}%</td>
                    <td className="p-2 border text-green-600 font-semibold">
                      ₹{item.earned}
                    </td>
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          item.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} */}

      {/* 🏦 WITHDRAW */}
      {activeTab === "withdraw" && (
        <div className="rounded-xl p-6 border shadow-md bg-white space-y-4">
          <h3 className="font-semibold text-lg">Withdraw Money</h3>

          <input
            type="number"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full border rounded px-4 py-2 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Bank / UPI ID"
            className="w-full border rounded px-4 py-2 focus:outline-none"
          />

          <p className="text-sm text-gray-500">
            Minimum withdraw amount ₹500
          </p>

          <button
            disabled
            className="w-full py-2 bg-gray-300 rounded cursor-not-allowed"
          >
            Withdraw Request (Coming Soon)
          </button>
        </div>
      )}
    </div>
  );
};

export default Wallet;
