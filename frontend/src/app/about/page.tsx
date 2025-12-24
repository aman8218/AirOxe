import Link from "next/link";
import { ArrowLeft, Heart, Shield, Sparkles, Users, Wind, Leaf, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-12">
                <Link
                    href="/"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                </Link>

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AirOxe</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Breathing clean air shouldn't be a luxury. We're building the future of clean-air living for India, one breath at a time.
                    </p>
                </div>

                {/* Who We Are */}
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                        <Users className="w-8 h-8 text-blue-600" />
                        <h2 className="text-3xl font-bold text-gray-900">Who We Are</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg mb-4">
                        AirOxe is an Indian D2C startup on a mission to make clean air accessible to everyone. We design premium, reusable anti-pollution products that fit seamlessly into your daily life—whether you're commuting through Delhi's traffic, jogging in the morning, or simply stepping out for groceries.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        We're not just selling products; we're building a lifestyle movement around clean air. Because in a country where air quality makes headlines, protection should be stylish, sustainable, and accessible.
                    </p>
                </div>

                {/* Why We Started */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-200">
                        <div className="flex items-center space-x-3 mb-6">
                            <Wind className="w-8 h-8 text-orange-600" />
                            <h2 className="text-3xl font-bold text-gray-900">Why We Started</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Every winter, cities like Delhi, Mumbai, and Bangalore wake up to hazardous air quality. Parents worry about their kids playing outside. Commuters struggle with pollution during their daily rides. Elderly citizens face breathing difficulties.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            We saw the problem up close. Disposable masks littering streets. Uncomfortable designs people refused to wear. Imported products that didn't fit Indian faces or budgets. We knew there had to be a better way.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
                        <div className="flex items-center space-x-3 mb-6">
                            <Target className="w-8 h-8 text-blue-600" />
                            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            <strong className="text-gray-900">Clean Air. Smart Living.</strong>
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We're here to make breathing clean air as natural as drinking clean water. Our mission is to create thoughtfully designed products that protect you from pollution without compromising on style, comfort, or sustainability.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            We believe clean air should be convenient, affordable, and something you actually want to use—not just have to use.
                        </p>
                    </div>
                </div>

                {/* What Makes Us Different */}
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Makes AirOxe Different</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Advanced Protection</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Thoughtfully designed multi-layer filtration for everyday pollution exposure. Designed for Indian pollution levels, tested for real-world conditions.
                            </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Comfort First</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Breathable materials, adjustable fits, and designs you'll actually want to wear all day. No more foggy glasses or ear pain.
                            </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Truly Reusable</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Washable, durable, built to last. Say goodbye to single-use waste and hello to sustainable protection.
                            </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Lifestyle, Not Medical</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We design for daily life—commutes, workouts, outdoor activities. Protection that fits your lifestyle, not the other way around.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Vision */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                        <Wind className="w-8 h-8 text-white" />
                        <h2 className="text-3xl font-bold">Our Vision for the Future</h2>
                    </div>
                    <p className="text-blue-50 leading-relaxed text-lg mb-6">
                        We started with masks because that's what people needed most urgently. But we're not stopping there.
                    </p>
                    <p className="text-blue-50 leading-relaxed text-lg mb-6">
                        Soon, AirOxe will expand into a complete clean-air lifestyle ecosystem—indoor air purifiers, portable filtration devices, smart air quality monitors, and more. Our goal is to help you breathe clean air wherever you are: at home, in your car, at work, or outdoors.
                    </p>
                    <p className="text-white leading-relaxed text-lg font-semibold">
                        Because everyone deserves clean air. It's not a privilege—it's a right.
                    </p>
                </div>

                {/* Values */}
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Stand For</h2>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Honest Protection</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We don't make medical claims we can't back up. Our products are designed for everyday pollution protection, tested rigorously, and we're transparent about what they can and can't do.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Leaf className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainability Matters</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    In a country drowning in plastic waste, we're committed to reusable, washable products. Every AirOxe product replaces hundreds of disposable alternatives.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Heart className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Made for India</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Designed for Indian faces, built for Indian conditions, priced for Indian families. We understand the unique challenges of pollution in Indian cities because we live here too.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Community First</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We listen to our customers. Every product iteration comes from real feedback, real problems, and real lives. You're not just buying a product—you're joining a movement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the Clean Air Movement</h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                        Every breath matters. Start your journey to cleaner air with AirOxe today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-blue-500 transition"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-8">
                    AirOxe products are designed for lifestyle and pollution protection and are not medical devices.
                </p>

            </div>
            <Footer />
        </div>
    );
}