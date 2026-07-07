const Booking = () => {
    return (
        <>

        
            <div className="h-16 w-full"></div>
            <div className="border-2 border-black border-opacity-10 rounded-md">
                <div className="flex">
                    <div className="h-96 w-[60vw] overflow-hidden flex items-center justify-center" >
                        <img className="h-96 bg-cover" src="/OIP-Photoroom.png" alt="" />
                    </div>
                    <div className="flex flex-col gap-10 p-10">
                        <h1>car name</h1>
                        <h1>model</h1>
                        <h1>colour</h1>
                        <h1>base</h1>
                    </div>
                </div>


                <div className="p-3">
                    <div className="m-3 border-2 border-black border-opacity-10 rounded-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="p-3">Products List</h3>
                        </div>
                    </div>
                    
                    <div className="flex p-5 gap-10 border-2 border-black border-opacity-10 rounded-md">
                        <img className="h-40 w-40" src="/EBKMA-STREET-18-10.5-WHEELS-LENSO-90-Z-Photoroom.png" alt="" />
                        <div className="flex gap-20 ">
                            <h1>name</h1>
                            <p>12-00</p>
                            <p>color</p>
                        </div>
                    </div>
                </div>


                <div className="border-2 border-black rounded-md p-5">
                    <div>
                        <h1>Total Price</h1>
                    </div>

                </div>
            </div>

        </>
    )
}
export default Booking;