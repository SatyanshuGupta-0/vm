import { Route, Routes } from 'react-router-dom'
import Applayout from "./Applayout";
import Home from "./Pages/Home";
import Appy from "./Components/3dmodel/appy";
import Search from './Pages/Search';
import "./App.css"
import OTPVerification from './Components/Registration/OTPVerification';
import Login from './Components/Registration/login';
import Signup from './Components/Registration/sign';
import Profile from './Pages/Profile';
import Wishlist from './Components/Profile/wishlist';
import Cart from './Components/Profile/Cart';
import ChangePassword from './Components/Registration/ChangePassword';
import Order from './Components/Profile/MyOrder';
import ViewDetails from './Components/Profile/ViewDetails';
import Booking from './Components/Profile/Booking';
import ProductPage from './Components/productFilter'
import ProductShow from './Components/productShow'
import SearchPage from './Components/searchpage'
import Loader from './Components/Loader';
import Contact from './Components/contact';
import About from './Components/aboutUs';
import ChatWindow from "./Components/chat-bot/chartbot"
import FAQ from './Components/faq';
import TermsOfService from './Components/termsofservice';
import PrivacyPolicy from './Components/privacyPolicy';
import ReturnPolicy from './Components/returnPolicy';
import TataSierra from './Pages/tatasierra';
import Wallet from './Components/wallet';
import TeamMembers from './Components/teammembers';

const app = () => {

    return (
        <>
            <Routes >

                <Route path='/' element={<Applayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="sierra" element={<TataSierra />} />
                    <Route path='3D' element={<Appy />} />
                    <Route path='search' element={<Search />} />
                    <Route path='profile' element={<Profile />} />
                    <Route path='wishlist' element={<Wishlist />} />
                    <Route path='wallet' element={<Wallet />} />
                    <Route path='teammembers' element={<TeamMembers />} />
                    <Route path='cart' element={<Cart />} />
                    <Route path='changepassword' element={<ChangePassword />} />
                    <Route path='order' element={<Order />} />
                    <Route path='booking' element={<Booking />} />
                    <Route path="details/:orderId/:productId" element={<ViewDetails />} />
                    <Route path="product/:id" element={<ProductShow />} />
                    <Route path="searching" element={<SearchPage />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="about" element={<About />} />
                    <Route path="Chat" element={<ChatWindow  />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/return-policy" element={<ReturnPolicy />} />
                </Route>
                   
                <Route path='signup' element={<Signup />} />
                <Route path='login' element={<Login />} />
                <Route path='loading' element={<Loader />} />
                <Route path='OTPVerification' element={<OTPVerification />} />
            </Routes>
        </>
    )

}

export default app;