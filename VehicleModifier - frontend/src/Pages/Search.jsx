import Searchengine from "../Components/searchengine";
import { FaFilter } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";


const Search=()=>{
    return(
        <>
        <div className="drop-shadow-lg bg-white fixed h-12 w-full flex items-center justify-between z-20">
            <FaFilter className="w-10 text-xl" />
            <div className="">
                <Searchengine/>
            </div>
            <IoCartOutline className="w-10 text-2xl"/>
        </div>
        <div className="fixed h-[100vh] w-full backdrop-blur-sm">

        </div>
     
        </>
    )

}

export default Search;