import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          <strong>Last updated:</strong> August 6, 2025
        </p>

        <p className="text-gray-700 mb-6">
          This Privacy Policy explains how we collect, use, and protect your
          personal information when you shop with us for car parts, accessories,
          and related products. By using our website, you agree to the terms of
          this policy.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          1. Information We Collect
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>Personal Information:</strong> Name, email, phone number,
            shipping and billing addresses.
          </li>
          <li>
            <strong>Order Details:</strong> Products purchased, payment
            information, delivery preferences.
          </li>
          <li>
            <strong>Technical Information:</strong> IP address, browser type,
            device details, and usage data.
          </li>
          <li>
            <strong>Account Information:</strong> Login credentials and
            preferences if you create an account.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>To process and deliver your orders.</li>
          <li>To communicate with you about your orders or inquiries.</li>
          <li>
            To improve our products, services, and website experience.
          </li>
          <li>
            To send promotional offers (only if you have opted in).
          </li>
          <li>To comply with legal obligations.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          3. Sharing Your Information
        </h2>
        <p className="text-gray-700 mb-4">
          We do not sell or rent your personal information. We may share your
          data with:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Delivery partners to ship your orders.</li>
          <li>Payment gateways to process transactions securely.</li>
          <li>
            Service providers who help us run our business (e.g., IT support).
          </li>
          <li>
            Legal authorities when required by law or to protect our rights.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          4. Cookies & Tracking
        </h2>
        <p className="text-gray-700 mb-4">
          We use cookies to enhance your shopping experience, such as keeping
          items in your cart and remembering your preferences. You can disable
          cookies in your browser settings, but some features may not work
          properly.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          5. Data Security
        </h2>
        <p className="text-gray-700 mb-4">
          We take reasonable steps to protect your personal information from
          loss, misuse, and unauthorized access. However, no method of
          transmission over the Internet is 100% secure.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          6. Your Rights
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Request access to the data we hold about you.</li>
          <li>Request correction of your personal information.</li>
          <li>Request deletion of your data where legally possible.</li>
          <li>Opt-out of marketing communications.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          7. Changes to This Policy
        </h2>
        <p className="text-gray-700 mb-4">
          We may change this Privacy Policy at any time. Please check this page
          for the latest version.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          8. Contact Us
        </h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy or your personal
          data, please contact us at{" "}
          <a
            href="mailto:vmcustomerhelp@gmail.com"
            className="text-blue-600 hover:underline"
          >
            vmcustomerhelp@gmail.com
          </a>{" "}
          or call <strong>+91-XXXXXXXXXX</strong>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
