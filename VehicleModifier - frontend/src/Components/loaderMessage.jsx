const LoaderMessage = ({message}) => {
  return (
    <div className='flex flex-col items-center justify-center m-4 mt-6'>
          <video
            src='/5611d93efd57433aa92091560c72d626 (1).webm' // Replace with your actual video path
            autoPlay
            loop
            muted
            playsInline
            className='w-32 h-32'
            style={{ background: 'transparent' }}
          />
         {
            message
         }
        </div>
  );
};

export default LoaderMessage;
