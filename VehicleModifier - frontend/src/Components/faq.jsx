import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What types of car products do you sell?",
      answer:
        "We offer a wide range of products including spoilers, windshields/screens, light sets, alloy wheels, shiners and polishes, paint coatings, detailing kits, and many other car accessories and maintenance items.",
    },
    {
      question: "Are your products compatible with my car model?",
      answer:
        "Most of our products list the compatible car models in the description. If you're unsure, contact our support team with your car’s make, model, and year, and we’ll confirm compatibility.",
    },
    {
      question: "How can I place an order?",
      answer:
        "Simply browse our store, add your desired products to the cart, and proceed to checkout. You can pay using secure online payment methods including UPI, debit/credit cards, and wallets.",
    },
    {
      question: "Do you offer installation services?",
      answer:
        "We do not offer direct installation services, but we provide detailed installation guides for many products. For complex parts like spoilers or light sets, we recommend professional installation.",
    },
    {
      question: "What are your shipping options?",
      answer:
        "We ship across India using trusted courier partners. Delivery times vary based on your location but typically range from 3–7 business days.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you will receive a tracking link via email/SMS. You can also log in to your account, go to 'Profile > Orders', select your order, and click 'Track Order'.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns for most products within 7 days of delivery, provided the item is unused, in original packaging, and accompanied by proof of purchase. Some items like custom-made parts, opened polish bottles, or used coatings are non-returnable. Visit our Return Policy page for full details.",
    },
    {
      question: "How do I request a refund?",
      answer:
        "Log in to your account, go to 'Profile > Orders', select the order, click 'View Details', and if eligible, you’ll see a 'Request Refund' button. Follow the steps to submit your return request.",
    },
    {
      question: "Do your products come with a warranty?",
      answer:
        "Yes, many products such as light sets and electronics include manufacturer warranties. Warranty details are listed on each product page.",
    },
    {
      question: "Can I get bulk discounts?",
      answer:
        "Yes! For bulk or wholesale orders, please contact our sales team via the Contact Us page for a custom quote.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach us via the Contact Us page, email at support@yourdomain.com, or call us during support hours. We’re here Monday–Friday, 9:00 AM – 6:00 PM.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-gray-700 mb-6">
          Here are answers to some of the most common questions about our car parts, accessories, and services.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-gray-700">
          Still have questions?{" "}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact our support team
          </a>{" "}
          and we’ll be happy to help.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
