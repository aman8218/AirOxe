import Link from "next/link";
import { ArrowLeft, Package, Truck, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShippingPage() {
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
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: December 2025</p>

        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fast & Reliable Delivery</h2>
            <p className="text-gray-600 leading-relaxed">
              At AirOxe, we understand the importance of timely delivery. We work with trusted shipping partners to ensure your products reach you safely and on time. Below you'll find all the information you need about our shipping process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Coverage</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">We currently ship to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All major cities and metro areas across India</li>
                <li>Pin codes covered by our delivery partners</li>
                <li>Remote areas may have extended delivery times</li>
                <li>Enter your pin code at checkout to verify delivery availability</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Timeline</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Metro Cities</h3>
                </div>
                <p className="text-gray-700">2-3 business days</p>
                <p className="text-sm text-gray-600 mt-2">Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Other Cities</h3>
                </div>
                <p className="text-gray-700">4-6 business days</p>
                <p className="text-sm text-gray-600 mt-2">Tier 2 & Tier 3 cities, towns, and remote areas</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic">
              * Delivery times are estimated and may vary due to unforeseen circumstances like weather, festivals, or courier delays.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Charges</h2>
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center space-x-3 mb-3">
                <Package className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-green-900">FREE Shipping!</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We offer FREE standard shipping on all orders across India. No minimum order value required. Your health and safety are our priority, so we've made shipping completely free for all our customers.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Processing</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">Here's what happens after you place your order:</p>
              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li>
                  <strong className="text-gray-900">Order Confirmation:</strong> You'll receive an email confirmation immediately after placing your order
                </li>
                <li>
                  <strong className="text-gray-900">Processing Time:</strong> Orders are processed within 24 hours on business days
                </li>
                <li>
                  <strong className="text-gray-900">Shipment Notification:</strong> Once shipped, you'll receive a tracking number via email/SMS
                </li>
                <li>
                  <strong className="text-gray-900">In Transit:</strong> Track your order in real-time using the tracking link
                </li>
                <li>
                  <strong className="text-gray-900">Delivery:</strong> Our partner will deliver to your doorstep
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Track your order easily:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Visit "My Orders" section in your account</li>
              <li>Use the tracking link sent via email/SMS</li>
              <li>Contact our support team with your order number</li>
              <li>Get real-time updates on your shipment status</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Packaging</h2>
            <p className="text-gray-600 leading-relaxed">
              All products are carefully packaged to ensure they reach you in perfect condition. We use:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-4">
              <li>Tamper-proof sealed packaging for masks</li>
              <li>Bubble wrap and protective materials for fragile items</li>
              <li>Eco-friendly packaging materials wherever possible</li>
              <li>Discreet packaging for your privacy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Attempts</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                Our delivery partners will make multiple attempts to deliver your order:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Up to 3 delivery attempts will be made</li>
                <li>You'll be notified before each delivery attempt</li>
                <li>If all attempts fail, the order will be returned to our warehouse</li>
                <li>Return shipping charges may apply for reshipment</li>
                <li>Ensure someone is available to receive the package</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Address Change</h2>
            <p className="text-gray-600 leading-relaxed">
              Need to change your delivery address? Contact us immediately after placing your order. Address changes can only be made before the order is shipped. Once shipped, the address cannot be modified.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Holidays & Peak Seasons</h2>
            <p className="text-gray-600 leading-relaxed">
              During festivals, national holidays, or peak shopping seasons (like Diwali, New Year), delivery times may be extended by 1-3 days. We'll keep you informed of any delays via email or SMS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Damaged or Lost Shipments</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">If your shipment is damaged or lost:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contact us immediately with order details and photos (if damaged)</li>
                <li>We'll investigate with our shipping partner</li>
                <li>Replacement or full refund will be provided</li>
                <li>No additional charges for replacement shipment</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">International Shipping</h2>
            <p className="text-gray-600 leading-relaxed">
              Currently, we only ship within India. International shipping is not available at this time. We're working to expand our reach globally. Stay tuned for updates!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Our Shipping Team</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Have questions about your shipment? We're here to help:
            </p>
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <p className="text-gray-900 font-semibold">Response Time: Within 24 hours</p>
                </div>
                <p className="text-gray-900 font-semibold">Email: support@airoxe.in</p>
              </div>
            </div>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-gray-500 italic">
              This shipping policy is subject to change. Please check this page regularly for updates. For the most current information, contact our customer support team.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}