import React from "react";
import { Link } from "react-router-dom";


const ReturnPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-full mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4">Return & Refund Policy</h1>
                <p className="text-sm text-gray-500 mb-6">
                    <strong>Last updated:</strong> August 6, 2025
                </p>

                <p className="text-gray-700 mb-6">
                    Thank you for shopping with us. We specialize in **car parts, accessories, and car care products** such as spoilers, lights, infotainment screens, alloy wheels, bumpers, wax, ceramic coating, paint correction kits, and shiners.
                    This policy explains our return, exchange, and refund rules.
                </p>

                {/* Return Window */}
                <h2 className="text-xl font-semibold mt-6 mb-3">1. Return Window</h2>
                <p className="text-gray-700 mb-4">
                    You can request a return within <strong>7 days</strong> of delivery if the item meets all conditions below:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>Unused, uninstalled, and in the same condition you received it.</li>
                    <li>In original packaging with all accessories/manuals intact.</li>
                    <li>No scratches, dents, paint damage, or modifications.</li>
                    <li>For liquids (shiners, ceramic coatings, polishes), bottles must be sealed and unopened.</li>
                </ul>

                {/* Fitment */}
                <h2 className="text-xl font-semibold mt-6 mb-3">2. Fitment Responsibility</h2>
                <p className="text-gray-700 mb-4">
                    Car parts are **vehicle-specific**. Check your car's make, model, year, and variant before ordering.
                    Wrong-fitment returns are accepted but you’ll pay for return shipping + a restocking fee.
                </p>

                {/* Non-returnable */}
                <h2 className="text-xl font-semibold mt-6 mb-3">3. Non-Returnable Items</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>Installed or used car parts (e.g., spoilers already drilled/mounted).</li>
                    <li>Opened liquids, wax, polish, ceramic coating, or paint correction kits.</li>
                    <li>Painted/custom-colored parts.</li>
                    <li>Electronics (lights, screens) after wiring or installation.</li>
                    <li>Opened adhesive tapes, sealants, or fitting kits.</li>
                </ul>

                {/* Fragile Items */}
                <h2 className="text-xl font-semibold mt-6 mb-3">4. Fragile Item Returns</h2>
                <p className="text-gray-700 mb-4">
                    For fragile items like lights, screens, and mirrors, check the product **upon delivery** and report damage within <strong>48 hours</strong> with photos/videos.
                    Once installed, damage claims will not be accepted.
                </p>

                {/* Hazardous Products */}
                <h2 className="text-xl font-semibold mt-6 mb-3">5. Hazardous or Chemical Products</h2>
                <p className="text-gray-700 mb-4">
                    Car care products containing chemicals (ceramic coating, paint correctors, shiners) can only be returned if **unopened and in original sealed packaging** due to safety and contamination concerns.
                </p>

                {/* Return Process */}
                <h2 className="text-xl font-semibold mt-6 mb-3">6. Return Process</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
                    <li>Email <a href="mailto:vmcustomerhelp@gmail.com" className="text-blue-600">vmcustomerhelp@gmail.com</a> or call <strong>+91-7015796438</strong>.</li>
                    <li>Share your order number, photos, and reason for return.</li>
                    <li>Wait for a Return Authorization (RA) number before shipping.</li>
                    <li>Pack securely in original box with all included items.</li>
                </ol>


                <p className="text-gray-700 mb-4">
                    <strong>In-app return flow:</strong> You can also request a return from your account:
                    Go to{" "}
                    <Link to="/order" className="text-blue-600 hover:underline">
                        Profile &gt; Orders
                    </Link>
                    , open the order and click <em>View Details</em> for the product you want to refund.
                    If the order/item is eligible and a return has not already been requested, you will see a{" "}
                    <span className="font-semibold">Request Refund</span> button at the bottom of the View Details page — click it.
                </p>



                {/* Refunds */}
                <h2 className="text-xl font-semibold mt-6 mb-3">7. Refunds</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>Refunds go to the original payment method after inspection.</li>
                    <li>Processing takes 5–10 business days depending on your bank.</li>
                    <li>A restocking fee (10–15%) applies for buyer remorse or wrong orders.</li>
                </ul>

                {/* Exchanges */}
                <h2 className="text-xl font-semibold mt-6 mb-3">8. Exchanges</h2>
                <p className="text-gray-700 mb-4">
                    If you got the wrong product or it was damaged in shipping, we’ll replace it free of cost.
                    Exchanges for a different model/variant are allowed within the return window — charges may apply.
                </p>

                {/* Damaged or Defective */}
                <h2 className="text-xl font-semibold mt-6 mb-3">9. Damaged or Defective Products</h2>
                <p className="text-gray-700 mb-4">
                    If the product arrives damaged, share unboxing photos/videos within 48 hours for a replacement or refund.
                </p>

                {/* Shipping */}
                <h2 className="text-xl font-semibold mt-6 mb-3">10. Shipping Costs</h2>
                <p className="text-gray-700 mb-4">
                    - Buyer pays for return shipping unless it’s our fault (wrong item/damaged).
                    - Use a tracked courier to avoid lost packages.
                    - Large items (bumpers, spoilers, wheels) may have higher return shipping costs.
                </p>

                {/* Contact */}
                <h2 className="text-xl font-semibold mt-6 mb-3">11. Contact Us</h2>
                <p className="text-gray-700">
                    Email: <a href="mailto:vmcustomerhelp@gmail.com" className="text-blue-600 hover:underline">vmcustomerhelp@gmail.com</a>
                    Phone: <strong>+91-7015796438</strong> (Mon–Sat, 9:00–18:00 IST)
                </p>

                <p className="text-sm text-gray-500 mt-8">
                    This policy applies only to purchases from our website.
                    We may change this policy at any time. Please check this page for the latest version.
                </p>
            </div>
        </div>
    );
};

export default ReturnPolicy;
