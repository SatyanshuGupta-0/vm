// Applayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Components/footer";
import Navbar from "./Components/navbar";
import Phonenavbar from "./Components/PhoneNavbar";
import Loader from "./Components/Loader";
import { useState, useEffect, useRef } from "react";
import { postData } from "./utils/api";

const Applayout = () => {
  const location = useLocation();
  const [viewLeftside, setsidevalue] = useState("48px");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // API in-flight counter
  const inFlightRef = useRef(0);
  const [apiBusy, setApiBusy] = useState(false);

  // route-change loading (shows at least short period)
  const [routeLoading, setRouteLoading] = useState(false);

  // derived loading state
  const isLoading = routeLoading || apiBusy;

  // Generate and store sessionId once per device
  useEffect(() => {
    if (!localStorage.getItem("sessionId")) {
      const sessionId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("sessionId", sessionId);
    }
  }, []);

  // Ping activeUser endpoint every 2s with sessionId
  useEffect(() => {
    const ping = async () => {
      try {
        const sessionId = localStorage.getItem("sessionId");
        await postData("/api/activeUser/ping", { sessionId });
      } catch (err) {
        console.error("Ping failed:", err);
      }
    };

    ping();
    const interval = setInterval(ping, 2000);
    return () => clearInterval(interval);
  }, []);

  // Update isMobile on window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Callback from navbar to update sidebar width
  const sidevalue = (value) => {
    setsidevalue(value);
  };

  // Listen to API start/end events
  useEffect(() => {
    const onStart = () => {
      inFlightRef.current += 1;
      setApiBusy(true);
    };
    const onEnd = () => {
      inFlightRef.current = Math.max(0, inFlightRef.current - 1);
      if (inFlightRef.current === 0) {
        // small delay to prevent flicker for rapid requests
        setTimeout(() => setApiBusy(false), 200);
      }
    };

    window.addEventListener("api-request-start", onStart);
    window.addEventListener("api-request-end", onEnd);

    return () => {
      window.removeEventListener("api-request-start", onStart);
      window.removeEventListener("api-request-end", onEnd);
    };
  }, []);

  // Show loader on route change
  useEffect(() => {
    // when pathname changes, show routeLoading briefly
    setRouteLoading(true);
    const minVisible = 400; // ms
    const t = setTimeout(() => {
      setRouteLoading(false);
    }, minVisible);

    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <>
      {isMobile ? <Phonenavbar sidevalue={sidevalue} /> : <Navbar sidevalue={sidevalue} />}

      <div
        style={{
          marginLeft: isMobile ? "0px" : viewLeftside,
          transition: "margin-left 0.2s ease",
        }}
      >
        {/* show loader while route is changing OR API calls are in-flight */}
        {isLoading && <Loader />}

        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default Applayout;
