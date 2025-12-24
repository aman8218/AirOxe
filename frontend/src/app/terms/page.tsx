import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link
            href="/"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: December 2025</p>

          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using the AirOxe website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Services</h2>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">You agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Use the services only for lawful purposes</li>
                  <li>Not interfere with the proper functioning of the website</li>
                  <li>Not attempt to gain unauthorized access to any systems</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
              <p className="text-gray-600 leading-relaxed">
                We strive to provide accurate product descriptions and specifications. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free. Products are subject to availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intended Use of Products</h2>
              <p className="text-gray-600 leading-relaxed">
                AirOxe products are designed for lifestyle and urban pollution protection purposes only.
                They are not medical devices and are not intended to diagnose, treat, cure, or prevent
                any disease or medical condition.
              </p>
            </section>


            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders and Payment</h2>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason. Payment must be made at the time of order placement or delivery (for COD orders).
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Prices are subject to change without notice</li>
                  <li>All prices are in Indian Rupees (INR)</li>
                  <li>We accept online payments, COD, and other payment methods as indicated on the website</li>
                  <li>You are responsible for providing accurate delivery information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping and Delivery</h2>
              <p className="text-gray-600 leading-relaxed">
                We aim to deliver products within the estimated timeframe. Delivery times may vary based on location and availability. Risk of loss passes to you upon delivery to the address you provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns and Refunds</h2>
              <p className="text-gray-600 leading-relaxed">
                Please refer to our Refund Policy for detailed information about returns, exchanges, and refunds. We want you to be satisfied with your purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content on this website, including text, graphics, logos, and images, is the property of AirOxe and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                To the maximum extent permitted by law, AirOxe shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
              <p className="text-gray-600 leading-relaxed">
                AirOxe products are provided on an "as is" and "as available" basis.
                We make no medical or clinical claims regarding our products.
                Use of our products is at your own discretion and risk.
              </p>
            </section>


            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. Continued use of our services after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms are governed by the laws of India.
                Any disputes shall be subject to the exclusive jurisdiction of the courts of
                Uttar Pradesh, India.
              </p>
            </section>


            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                For questions about these Terms, please contact us:
              </p>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-900 font-semibold">Email: support@airoxe.in</p>
                <p className="text-gray-600">Phone: +91 98765 43210</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}