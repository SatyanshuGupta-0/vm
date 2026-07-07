import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        background: `
          radial-gradient(circle at top right,rgba(43, 123, 223, 0.6), transparent 70%),
          linear-gradient(120deg, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.8) 50%)
        `,
      }}
      className="text-gray-300 px-6 py-20 "
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div>
          <img
            className="h-7  pl-1"
            src="/logo_VM.png"
            alt="Logo"
          />
          <h1 className="text-white text-2xl font-bold mb-4">VModifier</h1>
          <p className="text-sm">
            Premium car accessories and customization, built to perfection. Your ride, your style.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-white font-semibold mb-4">Quick Links</h2>
          <div className="space-y-2 text-sm">
            <Link to="/">
              <p className="hover:text-white pb-2">Home</p>
            </Link>
            {/* <Link to="/product">
            <p className="hover:text-white pb-2">Products</p>
            </Link> */}
            <Link to="/about">
              <p className="hover:text-white pb-2">About Us</p>
            </Link>
            <Link to="/contact">
              <p className="hover:text-white pb-2">Contact</p>
            </Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-white font-semibold mb-4">Support</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/faq" className="hover:text-white">FAQ</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/return-policy" className="hover:text-white">Return Policy</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        {/* <div>
          <h2 className="text-white font-semibold mb-4">Subscribe</h2>
          <p className="text-sm mb-3">Get updates on new products and offers.</p>
          <form className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full sm:w-auto flex-1 px-3 py-2 rounded-md text-gray-900"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div> */}
        <div>
          <p> vill tagra, kalka, panchkula, haryana – 133302
            India
          </p>
          <p>
            CALL: +91-7015796438
          </p>


        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm">
        {/* Socials */}
        <div className="flex gap-4 mb-4 sm:mb-0">
          {/* <a href="#" className="hover:text-white"><FaFacebookF /></a> */}
          {/* <a href="#" className="hover:text-white"><FaTwitter /></a> */}
          <a href="https://www.instagram.com/vmodifier?igsh=MTZ5OGw5MGV2eW9rdg==" className="hover:text-white"><FaInstagram /></a>
          <a href="https://youtube.com/@vmodifier?si=RQX7vjqTpyyNJ0fL" className="hover:text-white"><FaYoutube /></a>
        </div>

        {/* Copyright */}
        <p className="text-center sm:text-right">
          &copy; {new Date().getFullYear()} VModifier. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
