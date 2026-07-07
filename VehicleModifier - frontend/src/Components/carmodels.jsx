import { useState } from "react"

const Carmodels=({link,handlelink})=>{

    return (
        
        <div onClick={()=>handlelink(`${link}`)} className="h-64 xs:w-44 sm:w-52 rounded-lg overflow-hidden  m-4 mt-10">
                    <img className="m-auto bg-center bg-cover" src="" alt="" srcSet="OIP-Photoroom.png" />
                    <div className="h-11 w-52 text-center"> verna</div>
                </div>
    )

}

export default Carmodels;