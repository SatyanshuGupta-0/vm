import React, { useState } from "react";
import { postData } from "../utils/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({ msg: "", type: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await postData("/api/contact/", formData); // update URL for prod
      if (res?.success) {
        setStatus({ msg: "Thank you for your message!", type: "success" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({ msg: res.data.message || "Submission failed", type: "error" });
      }
    } catch (err) {
      setStatus({ msg: "Server error, please try again later.", type: "error" });
    }

    setTimeout(() => setStatus({ msg: "", type: "" }), 4000);
  };

  return (
    <div className="min-h-screen text-black px-4 py-12 mt-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

        {/* Feedback Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-xl">
          <h3 className="text-3xl font-semibold mb-6 text-black">Send Us a Message</h3>

          {status.msg && (
            <div className={`mb-4 p-3 rounded text-center ${status.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border-black border-2 text-black placeholder-gray-600 focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border-black border-2 text-black placeholder-gray-600 focus:outline-none"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full p-3 rounded-lg border-black border-2 text-black placeholder-gray-600 focus:outline-none"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
            >
              Submit Message
            </button>
          </form>
        </div>
        {/* Contact Info Section */}
        <div>
          <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg mb-6">
            We'd love to hear from you. Reach out using the info below or send a message through the form.
          </p>

          <div className="space-y-4 text-black text-md">
            <p><strong>Address:</strong> vill tagra, kalka, panchkula, haryana – 133302 India</p>
            {/* <p><strong>Phone:</strong> +91 7015796438</p> */}
            <p><strong>Email:</strong> vmcustomerhelp@gmail.com</p>
            <p><strong>Support Hours:</strong> Mon - Fri, 9:00AM - 6:00PM</p>
          </div>

          {/* Google Map Embed */}
          <div className="mt-6">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=Times%20Square,%20NY&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="250"
              style={{ borderRadius: "12px" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
