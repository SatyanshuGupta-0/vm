const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-white bg-opacity-90 flex items-center justify-center">
      <div className="flex flex-col-reverse items-center justify-center gap-3 px-4">
        <p className="text-lg font-semibold text-gray-800">Loading...</p>
        <video
          src="/5611d93efd57433aa92091560c72d626 (1).webm"
          autoPlay
          loop
          muted
          playsInline
          className="max-w-full h-20"
        />
      </div>
    </div>
  );
};

export default Loader;
