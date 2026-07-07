// import React, { useState } from "react";
// import { Helmet } from "react-helmet-async";

// /* ---------------- STATE TAX DATA ---------------- */

// const states = {
//   Delhi: { rto: 10, insurance: 3 },
//   Maharashtra: { rto: 11, insurance: 3.2 },
//   UttarPradesh: { rto: 9, insurance: 3 },
//   Karnataka: { rto: 13, insurance: 3.5 },
// };

// /* ---------------- COLOR IMAGES ---------------- */

// const colors = {
//   White:
//     "https://asset.autocarindia.com/static/models/colors/20251120_142209_d6e25bea.jpg?w=728&q=75",
//   Black:
//     "https://cdn-s3.autocarindia.com/Tata/sierra/DSC_3177.JPG?w=728&q=75",
//   Blue:
//     "https://imgd.aeplcdn.com/664x374/n/cw/ec/141113/sierra-exterior-left-front-three-quarter.jpeg",
// };

// /* ---------------- VARIANTS WITH FUEL PRICE DIFF ---------------- */

// const variants = [
//   {
//     name: "Sierra Base",
//     transmission: "Manual",
//     image: colors.White,
//     isBase: true,
//     fuels: {
//       Petrol: { exShowroom: 1200000, mileage: "15–17 km/l" },
//       Diesel: { exShowroom: 1320000, mileage: "18–20 km/l" },
//     },
//   },
//   {
//     name: "Sierra Mid",
//     transmission: "Manual",
//     image: colors.Black,
//     fuels: {
//       Petrol: { exShowroom: 1380000, mileage: "15–17 km/l" },
//       Diesel: { exShowroom: 1510000, mileage: "18–20 km/l" },
//     },
//   },
//   {
//     name: "Sierra Top",
//     transmission: "Automatic",
//     image: colors.Blue,
//     fuels: {
//       Petrol: { exShowroom: 1580000, mileage: "14–16 km/l" },
//       Diesel: { exShowroom: 1720000, mileage: "17–19 km/l" },
//     },
//   },
// ];

// /* ---------------- COMPONENT ---------------- */

// const TataSierra = () => {
//   const [state, setState] = useState("Delhi");
//   const [color, setColor] = useState("White");
//   const [activeFuel, setActiveFuel] = useState({});

//   return (
//     <>
//       {/* ---------------- SEO ---------------- */}
//       <Helmet>
//         <title>
//           Tata Sierra 2025 On Road Price, Petrol vs Diesel, Variants & Mileage
//         </title>

//         <meta
//           name="description"
//           content="Check Tata Sierra 2025 petrol and diesel on-road price with full tax breakup, mileage, images, variants comparison and detailed review."
//         />

//         <link
//           rel="canonical"
//           href="https://www.yoursite.com/tata-sierra-2025"
//         />

//         <meta property="og:title" content="Tata Sierra 2025 Price & Variants" />
//         <meta
//           property="og:description"
//           content="Petrol vs Diesel Tata Sierra price comparison with state-wise on-road cost."
//         />
//         <meta property="og:image" content={colors.White} />
//       </Helmet>

//       {/* ---------------- PAGE ---------------- */}
//       <div className="max-w-6xl mx-auto px-4 py-10">
//         {/* HEADER */}
//         <h1 className="text-3xl md:text-4xl font-bold text-center">
//           Tata Sierra 2025 – Petrol & Diesel On Road Price
//         </h1>

//         <p className="text-center text-gray-600 mt-3">
//           Compare Tata Sierra petrol vs diesel price, mileage, variants,
//           images and full tax breakup state-wise.
//         </p>

//         {/* MAIN IMAGE */}
//         <div className="mt-8">
//           <img
//             src={colors[color]}
//             alt={`Tata Sierra ${color}`}
//             className="w-full rounded-2xl shadow"
//           />
//         </div>

//         {/* COLOR SELECT */}
//         <div className="flex justify-center gap-3 mt-4">
//           {Object.keys(colors).map((c) => (
//             <button
//               key={c}
//               onClick={() => setColor(c)}
//               className={`px-4 py-2 rounded-full border ${
//                 color === c ? "bg-black text-white" : "bg-white"
//               }`}
//             >
//               {c}
//             </button>
//           ))}
//         </div>

//         {/* STATE SELECT */}
//         <div className="mt-10 text-center">
//           <select
//             value={state}
//             onChange={(e) => setState(e.target.value)}
//             className="border p-2 rounded"
//           >
//             {Object.keys(states).map((s) => (
//               <option key={s}>{s}</option>
//             ))}
//           </select>
//         </div>

//         {/* VARIANTS */}
//         <div className="mt-12 grid md:grid-cols-2 gap-8">
//           {variants.map((v, i) => {
//             const selectedFuel = activeFuel[i] || "Petrol";
//             const fuelData = v.fuels[selectedFuel];

//             const rto =
//               (fuelData.exShowroom * states[state].rto) / 100;
//             const insurance =
//               (fuelData.exShowroom * states[state].insurance) / 100;
//             const tcs = fuelData.exShowroom > 1000000 ? 12000 : 0;
//             const fastag = 600;

//             const onRoad =
//               fuelData.exShowroom + rto + insurance + tcs + fastag;

//             return (
//               <div
//                 key={i}
//                 className={`rounded-xl shadow border overflow-hidden ${
//                   v.isBase ? "ring-2 ring-black" : ""
//                 }`}
//               >
//                 <img
//                   src={v.image}
//                   alt={`${v.name} ${selectedFuel}`}
//                   className="w-full h-56 object-cover"
//                 />

//                 <div className="p-6">
//                   {v.isBase && (
//                     <span className="text-xs bg-black text-white px-3 py-1 rounded-full">
//                       Base Variant
//                     </span>
//                   )}

//                   <h3 className="text-xl font-semibold mt-2">
//                     {v.name}
//                   </h3>

//                   <p className="text-sm text-gray-600">
//                     {v.transmission}
//                   </p>

//                   {/* FUEL TOGGLE */}
//                   <div className="flex gap-2 mt-3">
//                     {Object.keys(v.fuels).map((fuel) => (
//                       <button
//                         key={fuel}
//                         onClick={() =>
//                           setActiveFuel({ ...activeFuel, [i]: fuel })
//                         }
//                         className={`px-3 py-1 rounded-full text-sm border ${
//                           selectedFuel === fuel
//                             ? "bg-black text-white"
//                             : "bg-white"
//                         }`}
//                       >
//                         {fuel}
//                       </button>
//                     ))}
//                   </div>

//                   {/* PRICE */}
//                   <div className="mt-4 text-sm text-gray-700 space-y-1">
//                     <p>
//                       Ex-Showroom: ₹
//                       {fuelData.exShowroom.toLocaleString()}
//                     </p>
//                     <p>RTO: ₹{rto.toLocaleString()}</p>
//                     <p>Insurance: ₹{insurance.toLocaleString()}</p>
//                     <p>TCS: ₹{tcs.toLocaleString()}</p>
//                     <p>FASTag: ₹{fastag}</p>

//                     <hr />

//                     <p className="text-lg font-bold">
//                       On-Road ({state}): ₹{onRoad.toLocaleString()}
//                     </p>
//                   </div>

//                   <p className="text-green-700 font-medium mt-2">
//                     Mileage: {fuelData.mileage}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* BLOG */}
//         <div className="mt-16 prose max-w-none">
//   <h2>Petrol vs Diesel – Which Tata Sierra Should You Buy?</h2>

//   <p>
//     One of the biggest questions buyers have before purchasing the Tata Sierra
//     2025 is whether to choose the petrol or diesel variant. Both options cater
//     to different types of users, driving conditions, and budgets. Understanding
//     the real-world differences can help you make the right decision.
//   </p>

//   <h3>Tata Sierra Petrol Variant – Pros & Cons</h3>
//   <p>
//     The petrol Tata Sierra is designed for buyers who primarily drive in urban
//     environments. Petrol engines are known for smoother acceleration, quieter
//     operation, and lower initial cost compared to diesel.
//   </p>

//   <ul>
//     <li>Lower ex-showroom and on-road price</li>
//     <li>Smoother and quieter engine performance</li>
//     <li>Ideal for city driving and short daily commutes</li>
//     <li>Lower maintenance cost in the long term</li>
//   </ul>

//   <p>
//     However, petrol variants may not be the best option for users with heavy
//     highway usage due to relatively lower fuel efficiency.
//   </p>

//   <h3>Tata Sierra Diesel Variant – Pros & Cons</h3>
//   <p>
//     The diesel Tata Sierra is aimed at buyers who travel long distances
//     frequently or prefer stronger performance. Diesel engines produce higher
//     torque, making them suitable for highways, hilly roads, and load carrying.
//   </p>

//   <ul>
//     <li>Higher torque for better highway performance</li>
//     <li>Better mileage compared to petrol</li>
//     <li>Ideal for long-distance and highway driving</li>
//     <li>Stronger pulling power</li>
//   </ul>

//   <p>
//     The diesel variant comes at a higher price due to the cost of the engine and
//     higher taxes, but this difference can be recovered over time through better
//     fuel efficiency.
//   </p>

//   <h3>Petrol vs Diesel Mileage Comparison</h3>
//   <p>
//     Mileage plays a crucial role in deciding the fuel type. The petrol Tata
//     Sierra is expected to deliver around <strong>15–17 km/l</strong>, while the
//     diesel version may offer <strong>18–20 km/l</strong>, depending on driving
//     conditions and load.
//   </p>

//   <h3>Running Cost & Maintenance</h3>
//   <p>
//     Petrol vehicles generally have lower service and maintenance costs. Diesel
//     vehicles, while more efficient, may involve slightly higher servicing
//     expenses. If your annual running is below 10,000 km, petrol is usually more
//     economical. For users driving more than 15,000 km per year, diesel becomes a
//     better financial choice.
//   </p>

//   <h3>Who Should Buy Petrol Tata Sierra?</h3>
//   <ul>
//     <li>City users with daily short commutes</li>
//     <li>Buyers looking for lower upfront cost</li>
//     <li>Users who prefer silent and smooth driving</li>
//   </ul>

//   <h3>Who Should Buy Diesel Tata Sierra?</h3>
//   <ul>
//     <li>Highway and long-distance drivers</li>
//     <li>Users who want better mileage</li>
//     <li>Buyers who prefer strong performance and torque</li>
//   </ul>

//   <h3>Final Verdict</h3>
//   <p>
//     If your usage is mostly within the city and you want a budget-friendly
//     option, the petrol Tata Sierra is the right choice. However, if you travel
//     frequently on highways or want better fuel efficiency and power, the diesel
//     Tata Sierra offers better long-term value.
//   </p>
// </div>


//         <p className="mt-10 text-center text-sm text-gray-500">
//           ⚠️ Prices are indicative and may vary at the time of launch.
//         </p>
//       </div>
//     </>
//   );
// };

// export default TataSierra;
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

/* ---------------- STATE TAX DATA ---------------- */
const states = {
  Delhi: { rto: 10, insurance: 3 },
  Maharashtra: { rto: 11, insurance: 3.2 },
  UttarPradesh: { rto: 9, insurance: 3 },
  Karnataka: { rto: 13, insurance: 3.5 },
};

/* ---------------- COLOR IMAGES ---------------- */
const colors = {
  White:
    "https://asset.autocarindia.com/static/models/colors/20251120_142209_d6e25bea.jpg?w=728&q=75",
  Black:
    "https://cdn-s3.autocarindia.com/Tata/sierra/DSC_3177.JPG?w=728&q=75",
  Blue:
    "https://imgd.aeplcdn.com/664x374/n/cw/ec/141113/sierra-exterior-left-front-three-quarter.jpeg",
};

/* ---------------- VARIANTS WITH FUEL PRICE ---------------- */
const variants = [
  {
    name: "Sierra Base",
    transmission: "Manual",
    image: colors.White,
    isBase: true,
    fuels: {
      Petrol: { exShowroom: 1200000, mileage: "15–17 km/l" },
      Diesel: { exShowroom: 1320000, mileage: "18–20 km/l" },
    },
  },
  {
    name: "Sierra Mid",
    transmission: "Manual",
    image: colors.Black,
    fuels: {
      Petrol: { exShowroom: 1380000, mileage: "15–17 km/l" },
      Diesel: { exShowroom: 1510000, mileage: "18–20 km/l" },
    },
  },
  {
    name: "Sierra Top",
    transmission: "Automatic",
    image: colors.Blue,
    fuels: {
      Petrol: { exShowroom: 1580000, mileage: "14–16 km/l" },
      Diesel: { exShowroom: 1720000, mileage: "17–19 km/l" },
    },
  },
];

/* ---------------- OTHER CARS ---------------- */
const otherCars = [
  {
    name: "Hyundai Verna",
    transmission: "Automatic / Manual",
    image: "https://www.hindustanimages.com/hyundai-verna.jpg",
    link: "/hyundai-verna-2025",
  },
  {
    name: "Kia Seltos",
    transmission: "Automatic / Manual",
    image: "https://www.hindustanimages.com/kia-seltos.jpg",
    link: "/kia-seltos-2025",
  },
  {
    name: "Maruti Ciaz",
    transmission: "Automatic / Manual",
    image: "https://www.hindustanimages.com/maruti-ciaz.jpg",
    link: "/maruti-ciaz-2025",
  },
];

/* ---------------- COMPONENT ---------------- */
const TataSierra = () => {
  const [state, setState] = useState("Delhi");
  const [color, setColor] = useState("White");
  const [activeFuel, setActiveFuel] = useState({});
  const [activeVariant, setActiveVariant] = useState(0);

  const selectedVariant = variants[activeVariant];
  const selectedFuel = activeFuel[activeVariant] || "Petrol";
  const fuelData = selectedVariant.fuels[selectedFuel];

  const rto = (fuelData.exShowroom * states[state].rto) / 100;
  const insurance = (fuelData.exShowroom * states[state].insurance) / 100;
  const tcs = fuelData.exShowroom > 1000000 ? 12000 : 0;
  const fastag = 600;
  const onRoad = fuelData.exShowroom + rto + insurance + tcs + fastag;

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>
          Tata Sierra 2025 On Road Price, Petrol vs Diesel, Variants & Mileage
        </title>
        <meta
          name="description"
          content="Check Tata Sierra 2025 petrol and diesel on-road price with full tax breakup, mileage, images, variants comparison and detailed review."
        />
      </Helmet>

      {/* PAGE */}
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
        {/* ---------------- MAIN CONTENT ---------------- */}
        <div className="md:w-3/4 flex flex-col gap-6">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
            Tata Sierra 2025 – Petrol & Diesel On Road Price
          </h1>
          <p className="text-center md:text-left text-gray-600 mt-2">
            Compare Tata Sierra petrol vs diesel price, mileage, variants,
            images and full tax breakup state-wise.
          </p>

          {/* Main Image */}
          <div className="mt-4">
            <img
              src={colors[color]}
              alt={`Tata Sierra ${color}`}
              className="w-full rounded-2xl shadow"
            />
          </div>

          {/* Color Select */}
          <div className="flex justify-start gap-3 mt-4">
            {Object.keys(colors).map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 rounded-full border ${
                  color === c ? "bg-black text-white" : "bg-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* State Select */}
          <div className="mt-4">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border p-2 rounded"
            >
              {Object.keys(states).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Variant & Fuel Toggle */}
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            {variants.map((v, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveVariant(i);
                  // Auto-select color based on variant
                  if (v.image === colors.White) setColor("White");
                  else if (v.image === colors.Black) setColor("Black");
                  else setColor("Blue");
                }}
                className={`px-3 py-1 border rounded ${
                  activeVariant === i
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                {v.name} ({v.transmission})
              </button>
            ))}
          </div>

          {/* Fuel Toggle */}
          <div className="flex gap-2 mt-3">
            {Object.keys(selectedVariant.fuels).map((fuel) => (
              <button
                key={fuel}
                onClick={() =>
                  setActiveFuel({ ...activeFuel, [activeVariant]: fuel })
                }
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedFuel === fuel ? "bg-black text-white" : "bg-white"
                }`}
              >
                {fuel}
              </button>
            ))}
          </div>

          {/* Price Details */}
          <div className="mt-4 text-sm text-gray-700 space-y-1 border p-4 rounded shadow">
            <p>Ex-Showroom: ₹{fuelData.exShowroom.toLocaleString()}</p>
            <p>RTO: ₹{rto.toLocaleString()}</p>
            <p>Insurance: ₹{insurance.toLocaleString()}</p>
            <p>TCS: ₹{tcs.toLocaleString()}</p>
            <p>FASTag: ₹{fastag}</p>
            <hr className="my-2" />
            <p className="text-lg font-bold">
              On-Road ({state}): ₹{onRoad.toLocaleString()}
            </p>
            <p className="text-green-700 font-medium mt-1">
              Mileage: {fuelData.mileage}
            </p>
          </div>

          {/* Blog / Review */}
          <div className="mt-8 prose max-w-none">
            <h2>Petrol vs Diesel – Which Tata Sierra Should You Buy?</h2>
            <p>
              One of the biggest questions buyers have before purchasing the Tata
              Sierra 2025 is whether to choose the petrol or diesel variant. Both
              options cater to different types of users, driving conditions, and
              budgets.
            </p>
            <h3>Tata Sierra Petrol Variant – Pros & Cons</h3>
            <ul>
              <li>Lower ex-showroom and on-road price</li>
              <li>Smoother and quieter engine performance</li>
              <li>Ideal for city driving and short daily commutes</li>
              <li>Lower maintenance cost in the long term</li>
            </ul>
            <h3>Tata Sierra Diesel Variant – Pros & Cons</h3>
            <ul>
              <li>Higher torque for better highway performance</li>
              <li>Better mileage compared to petrol</li>
              <li>Ideal for long-distance and highway driving</li>
              <li>Stronger pulling power</li>
            </ul>
          </div>
        </div>

        {/* ---------------- RIGHT SIDEBAR ---------------- */}
        <div className="md:w-1/4 sticky top-20 space-y-4">
          <h3 className="font-bold text-lg mb-2">Other Cars You May Like</h3>
          {otherCars.map((car, idx) => (
            <a
              key={idx}
              href={car.link}
              className="flex gap-3 p-2 border rounded hover:shadow-md transition"
            >
              <img
                src={car.image}
                alt={car.name}
                className="w-20 h-12 object-cover rounded"
              />
              <div>
                <p className="text-sm font-semibold">{car.name}</p>
                <p className="text-xs text-gray-500">{car.transmission}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default TataSierra;
