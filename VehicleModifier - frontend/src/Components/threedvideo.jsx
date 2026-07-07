import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "../utils/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Helpers
const isVideoUrl = (url) => /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
const isImageUrl = (url) => /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(url);

const Threedvideo = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDataFromApi("/api/banner/videourl")
      .then((response) => {
        const urls = response?.url || [];
        setMediaList(urls.map((item) => item.url));
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load banner media");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading banners...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-12 h-96 xs:h-48 md:h-80 w-full bg-white">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        loop={mediaList.length > 1}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {mediaList.map((mediaUrl, idx) => (
          <SwiperSlide key={idx}>
            {isVideoUrl(mediaUrl) ? (
              <video
                src={mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={mediaUrl}
                alt={`slide-${idx}`}
                className="w-full h-full object-cover"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Threedvideo;
