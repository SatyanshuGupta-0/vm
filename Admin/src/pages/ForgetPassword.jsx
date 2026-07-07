import { Link } from "react-router-dom"

const ForgetPassword=()=>{

 
    return(
        <>
        <div className="bg-black flex items-center justify-start w-full h-[100vh] text-white" >
            <div className=" w-[600px] h-[100vh] bg-black flex items-center">
            <div onClick={(e) => e.stopPropagation()} className="h-[500px] w-[600px] bg-black rounded-xl z-50 grid items-center justify-center">
          <h1 className="text-white text-3xl text-center">Forget Password</h1>
          <div className="flex justify-center">
            <img className="h-10 w-10" src="/VM2_logo-Photoroom.png" alt="" />
          </div>
          <div className="grid items-center justify-cente h-48 w-72">

            <input className="p-1 text-lg rounded-lg focus:outline-none" type="text" id="email" autoComplete="email" placeholder="Email Id" />

            <button type="submit" className="bg-blue-500 text-white text-center rounded-lg text-lg p-1">Reset</button>

            <p className="text-white text-center">Don't want to reset?<Link to="/login"><a  className="text-blue-400 m-1">Login</a></Link> </p>
          </div>
        </div>
            </div>
            <div className="ml-2">
            <img className="absolute h-[400px] w-[850px] top-20 border-2 border-black rounded-xl" src="/signinpage.png" alt="" />
            <img className="h-[300px] w-[700px] absolute bottom-10 right-8 border-2 border-black rounded-xl" src="/barsemple.png" alt="" />
            </div>
        </div>
        </>
    )

}

export default ForgetPassword