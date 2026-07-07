import React, { useState, useEffect } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import Scene from './Scene';
import { RiArrowDropDownLine } from "react-icons/ri";

function Appy() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSiteClosed, setIsSiteClosed] = useState(false); // <-- NEW STATE

  // 🔹 Fetch toggle state
  useEffect(() => {
    const checkSiteStatus = async () => {
      try {
        const res = await fetchDataFromApi('/api/toggle/toggle'); // make sure this points to the backend
        setIsSiteClosed(res.isClosed);
      } catch (err) {
        console.error("Failed to fetch toggle state:", err);
      }
    };
    checkSiteStatus();
  }, []);

  // 🔹 Fetch cars only if site is not closed
  useEffect(() => {
    if (isSiteClosed) return;

    const fetchCars = async () => {
      try {
        const response = await fetchDataFromApi('/api/carModel');
        const data = response.map(car => ({
          name: car.carName,
          url: car.carModelLink,
          img: car.imageUrl || "/fallback.png"
        }));

        setCars(data);

        const savedCarName = localStorage.getItem("selectedCar");
        const savedCar = data.find((car) => car.name === savedCarName);
        const defaultCar = savedCar || data[0];

        if (defaultCar) loadModel(defaultCar);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    };

    fetchCars();
  }, [isSiteClosed]);

  const loadModel = (car) => {
    if (selectedCar?.name === car.name) {
      setDropdownOpen(false);
      return;
    }

    setLoading(true);
    setModel(car.url);
    setSelectedCar(car);
    setDropdownOpen(false);
    localStorage.setItem("selectedCar", car.name);
  };

  useEffect(() => {
    if (!model) return;

    const checkLoad = () => {
      const value = parseInt(localStorage.getItem("loadmodel"), 10);
      if (value === 100) {
        localStorage.removeItem("loadmodel");
        setLoading(false);
        return true;
      }
      return false;
    };

    if (checkLoad()) return;

    const interval = setInterval(() => {
      if (checkLoad()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [model]);

  // 🔹 Maintenance message
  if (isSiteClosed) {
    return (
      <div className="h-[560px] flex items-center justify-center text-center text-white bg-black/90 top-14 relative">
        <div>
          <h1 className="text-3xl font-bold">Website Under Maintenance</h1>
          <p className="mt-2 text-lg">The 3D viewer is temporarily unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[560px] z-50 relative top-14">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="w-36 text-sm text-center cursor-pointer z-50 m-2" onClick={() => setDropdownOpen(true)}>
        {selectedCar && (
          <div className="flex items-center justify-between bg-black backdrop-blur-sm rounded px-2 py-1">
            <img className="h-10 w-10" src={selectedCar.img} onError={(e) => e.currentTarget.src = '/fallback.png'} alt="car" />
            <span className="text-white font-semibold">{selectedCar.name}</span>
            <RiArrowDropDownLine className="text-white text-2xl" />
          </div>
        )}
      </div>

      {dropdownOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-4 rounded-lg w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">Select Your Car</h2>
            <div className="grid gap-2 bg-black">
              {cars.map((car) => (
                <div key={car.name} className="flex items-center gap-4 p-2 rounded hover:bg-gray-100 cursor-pointer" onClick={() => {
                  loadModel(car);
                  setDropdownOpen(false);
                }}>
                  <img className="h-12 w-12 rounded object-cover" src={car.img} onError={(e) => e.currentTarget.src = '/fallback.png'} alt={car.name} />
                  <span className="font-medium text-gray-800">{car.name}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setDropdownOpen(false)} className="mt-4 w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-700">Cancel</button>
          </div>
        </div>
      )}

      <Scene model={model} />
    </div>
  );
}

export default Appy;
