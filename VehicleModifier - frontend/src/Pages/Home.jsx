import Allproduct from "../Components/allproduct";
import FilterSidebar from "../Components/FilterSidebar";
import ProductSearch from "../Components/searchengine";
import Wishlist from "../Components/Profile/wishlist"
// import Threecarmodels from "../Components/threecarmodels";
import Threedvideo from "../Components/threedvideo";
import MarqueeLine from "../Components/marqueeline";
// import Admin from "../Components/Admin";
const Home = ()=>{
    return(
        <>
        {/* <Admin/> */}
    {/* <FilterSidebar/> */}
    <div className="md:flex pb-3">
  <Threedvideo />
  {/* <Wishlist className="hidden md:flex" /> */}
  
</div>
<MarqueeLine/>

    <div className="my-5 mx-4">
    <ProductSearch />
    </div>
    <Allproduct />
    {/* <Threecarmodels /> */}
    </>
    )

}

export default Home;