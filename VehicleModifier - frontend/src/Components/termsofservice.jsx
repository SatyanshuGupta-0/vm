import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-gray-700 mb-4">
          <strong>Last updated:</strong> August 6, 2025
        </p>

        <p className="text-gray-700 mb-6">
          By accessing or using our website, you agree to be bound by these Terms of Service.  
          Please read them carefully before using our services.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">1. Eligibility</h2>
        <p className="text-gray-700 mb-4">
          You must be at least 18 years old to purchase products from our site.  
          By using our website, you confirm that you have the legal authority to enter into this agreement.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Products & Descriptions</h2>
        <p className="text-gray-700 mb-4">
          We sell car parts, accessories, and maintenance products such as spoilers, screens,  
          light sets, polish/shiner, paint coatings, and detailing kits. While we strive to provide  
          accurate product descriptions, we do not warrant that the information is error-free.  
          Images are for reference only; actual products may vary slightly.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. Orders & Payments</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>All prices are listed in INR (₹) unless otherwise stated.</li>
          <li>We reserve the right to refuse or cancel any order.</li>
          <li>Payment must be made in full before dispatch.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">4. Shipping & Delivery</h2>
        <p className="text-gray-700 mb-4">
          Delivery times vary depending on your location. Delays may occur due to courier services,  
          public holidays, or unforeseen circumstances. Shipping costs will be displayed at checkout.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. Returns & Refunds</h2>
        <p className="text-gray-700 mb-4">
          Our return policy allows returns within 7 days of receiving your product, subject to  
          certain conditions. Please review our full{" "}
          <a href="/return-policy" className="text-blue-600 hover:underline">
            Return & Refund Policy
          </a>{" "}
          for details.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">6. Warranty</h2>
        <p className="text-gray-700 mb-4">
          Some products come with a manufacturer warranty. Warranty details are provided  
          on individual product pages. Misuse, improper installation, or normal wear and tear  
          are not covered under warranty.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">
          We are not responsible for any damage, injury, or loss resulting from the use or  
          misuse of our products. Always ensure proper installation and follow safety  
          guidelines when using automotive parts and accessories.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
        <p className="text-gray-700 mb-4">
          All content on this website — including text, images, logos, and designs — is our  
          property or that of our suppliers and is protected by copyright laws.  
          Unauthorized use is prohibited.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">9. Governing Law</h2>
        <p className="text-gray-700 mb-4">
          These terms are governed by the laws of India. Any disputes will be handled in  
          the courts of [Your City, State].
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">10. Changes to Terms</h2>
        <p className="text-gray-700 mb-4">
          We may update these Terms of Service at any time. Continued use of our site  
          after changes indicates acceptance of the new terms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">11. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about these Terms of Service, please contact us at{" "}
          <a href="mailto:vmcustomerhelp@gmail.com" className="text-blue-600 hover:underline">
            vmcustomerhelp@gmail.com
          </a>{" "}
          or visit our{" "}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact Us
          </a>{" "}
          page.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
