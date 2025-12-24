import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Refund Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: December 2025</p>

        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-600 leading-relaxed">
              At AirOxe, customer satisfaction is our priority. We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help with our transparent refund and return policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Eligibility</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                Due to the nature of personal health and hygiene products, masks are
                eligible for return only if they are:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Unopened and unused</li>
                <li>In original, sealed packaging</li>
                <li>Damaged or defective on arrival</li>
                <li>Incorrect product delivered</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Returnable Items</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For health and safety reasons, the following items cannot be returned or refunded:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Opened or used masks</li>
              <li>Products with broken hygiene seals</li>
              <li>Items damaged due to customer handling</li>
              <li>Products returned without original packaging</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hygiene & Safety Disclaimer</h2>
            <p className="text-gray-600 leading-relaxed">
              AirOxe products are personal-use items designed for pollution protection.
              Once opened or used, masks cannot be returned due to hygiene and safety concerns,
              unless the product is defective or damaged upon delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Request a Return</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">To initiate a return:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact our support team at support@airoxe.com within 7 days of delivery</li>
                <li>Provide your order number and reason for return</li>
                <li>Wait for return authorization and instructions</li>
                <li>Pack the product securely in original packaging</li>
                <li>Ship the product to the provided address</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">Once we receive and inspect your return:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Inspection takes 2-3 business days</li>
                <li>Approved refunds are processed within 5-7 business days</li>
                <li>Refunds are issued to the original payment method</li>
                <li>For COD orders, refund via bank transfer or store credit</li>
                <li>Shipping charges are non-refundable unless product is defective</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Defective or Damaged Products</h2>
            <p className="text-gray-600 leading-relaxed">
              If you receive a defective or damaged product, please contact us immediately with photos. We will arrange for a replacement or full refund, including shipping charges, at no cost to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h2>
            <p className="text-gray-600 leading-relaxed">
              We currently do not offer direct exchanges. If you need a different product, please return the original item for a refund and place a new order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellations</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">You can cancel your order:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Before shipment: Full refund</li>
                <li>After shipment: Follow return policy</li>
                <li>Contact us immediately to request cancellation</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Shipping</h2>
            <p className="text-gray-600 leading-relaxed">
              Customers are responsible for return shipping costs unless the product is defective or we made an error. We recommend using a trackable shipping service for your protection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Late or Missing Refunds</h2>
            <p className="text-gray-600 leading-relaxed">
              If you haven't received your refund within the expected timeframe, please check with your bank first. If you still haven't received it, contact us at support@airoxe.in with your order details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For any questions about returns or refunds:
            </p>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-900 font-semibold">Email: support@airoxe.in</p>
              <p className="text-gray-600">Phone: +91 98765 43210</p>
              <p className="text-gray-600 mt-2">Business Hours: Mon-Fri, 9 AM - 6 PM IST</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}