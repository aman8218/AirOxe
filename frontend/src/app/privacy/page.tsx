import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: December 2025
              <br />
              This Privacy Policy applies to the website <Link href="/" className='font-bold'>airoxe.in</Link> operated by AirOxe.
            </p>
            {/* <p className="text-gray-600 mb-8">Last updated: December 2025</p> */}
            <div className="prose prose-lg max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We collect personal information that you voluntarily provide to us when you
                  register on our website, place an order, join our waitlist, or contact us.
                  This may include your name, email address, phone number, shipping address,
                  and payment-related details (processed securely by third-party gateways).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Process and deliver orders</li>
                  <li>Communicate order updates and support requests</li>
                  <li>Send product updates and marketing emails (with consent)</li>
                  <li>Improve website performance and user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Payments & Third-Party Services
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Payments on AirOxe are processed securely through trusted third-party
                  payment gateways such as Razorpay. We do not store or process your
                  credit/debit card details on our servers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Cookies & Analytics
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may use cookies and analytics tools to understand user behavior,
                  improve our services, and enhance your browsing experience. You can
                  choose to disable cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement reasonable security practices and procedures to protect
                  your personal data from unauthorized access, misuse, or disclosure,
                  in compliance with applicable Indian laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Your Rights
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  You have the right to access, update, or request deletion of your personal
                  information. You may contact us anytime to exercise these rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Policy Updates
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be
                  posted on this page with an updated revision date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions regarding this Privacy Policy, please contact us at:
                  <br />
                  <strong>Email:</strong> support@airoxe.in
                </p>
              </section>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}