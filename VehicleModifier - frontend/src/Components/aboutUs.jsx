import React from "react";

const About = () => {
  return (
    <div className="min-h-screen px-4 py-12 text-black bg-white mt-10">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            <strong>VModifier (VM Business)</strong> is a platform that connects passionate shopkeepers and customers who love modifying their vehicles with premium parts and accessories.
          </p>
        </section>

        {/* Mission, Vision, Values */}
        <section className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-2">🚗 Our Mission</h2>
            <p className="text-gray-700">
              To provide a trusted digital marketplace for shopkeepers and auto-enthusiasts to buy and sell high-quality vehicle parts and modification accessories.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-2">🔧 Our Vision</h2>
            <p className="text-gray-700">
              To become India’s leading platform for vehicle modification needs, helping local sellers grow while offering customers unique and quality parts.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-2">💼 Our Values</h2>
            <p className="text-gray-700">
              Trust, Transparency, Seller Empowerment, Innovation, and Customer Satisfaction.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-center">Our Story</h2>
          <p className="text-gray-700 max-w-4xl mx-auto text-center">
            Launched in 2025, <strong>VM Business</strong> started with a vision to digitalize the auto-modification market by giving shopkeepers a dedicated space to showcase their products. Since then, we’ve grown into a trusted platform where shop owners can sell and customers can discover unique and affordable vehicle parts across India.
          </p>
        </section>

        {/* Our Team */}
        <section>
          <div className="flex justify-center items-center gap-6 text-center">
            {[
              {
                name: "Satyanshu",
                role: "Founder & Developer",
                img: "/team1.png",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-5 rounded-xl shadow hover:scale-105 transition-transform"
              >
                
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-12 border-t border-gray-300 mt-10">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} VModifier. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default About;
