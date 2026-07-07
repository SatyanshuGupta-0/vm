const Dropdown = () => {
    return (
        <>
            <div className="flex items-center justify-center mb-10">
                <div className="h-96 w-72 bg-white grid grid-cols-1 items-center">
                    <div className="border-b-black h-20 w-full self-start bg-black text-white flex">
                        <p className="text-center p-1">BRAND
                            <div className="border-2 border-white rounded-lg h-10 w-40">
                            </div>
                        </p>
                        <p className="text-center p-1">SIZE
                            <div className="border-2 border-white rounded-lg h-10 w-10">
                            </div>
                        </p>

                    </div>
                    <div className="border-b-black h-20 w-full bg-red-600"></div>
                </div>
            </div>
        </>
    )
}

export default Dropdown;