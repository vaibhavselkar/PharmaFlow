'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Truck, 
  Users, 
  Database, 
  BarChart3, 
  Smartphone, 
  Zap, 
  Clock, 
  Search, 
  Package,
  Star,
  CheckCircle,
  TrendingUp,
  Globe,
  Lock,
  Calendar,
  MapPin,
  MessageSquare,
  Award
} from 'lucide-react'

export default function LandingPage() {
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const handleDemoClick = () => {
    setIsDemoLoading(true)
    // Simulate demo loading
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)
  }

  const handleLoginClick = () => {
    window.location.href = '/login'
  }

  const handleRegisterClick = () => {
    window.location.href = '/register'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PharmaFlow</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">Dashboard</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleLoginClick}>
                Login
              </Button>
              <Button onClick={handleRegisterClick}>
                Register
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Badge variant="secondary" className="text-sm">Trusted by 500+ Pharmacies</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-600 ml-2">4.9/5 Rating</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Revolutionize Your
                <span className="text-blue-600"> Pharmacy Operations</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Streamline medicine distribution, optimize inventory management, and enhance delivery 
                efficiency with our comprehensive pharmaceutical supply chain platform. Built for 
                pharmacies, distributors, and delivery agents.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleDemoClick}>
                  {isDemoLoading ? 'Loading Demo...' : 'Try Demo Now'}
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Features
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Secure & Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Mobile Friendly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-600">Real-time Updates</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <Package className="h-8 w-8 text-blue-600 mb-2" />
                    <div className="text-sm font-semibold">1,234</div>
                    <div className="text-xs text-gray-600">Active Orders</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <Users className="h-8 w-8 text-green-600 mb-2" />
                    <div className="text-sm font-semibold">89</div>
                    <div className="text-xs text-gray-600">Delivery Agents</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <Database className="h-8 w-8 text-purple-600 mb-2" />
                    <div className="text-sm font-semibold">15K+</div>
                    <div className="text-xs text-gray-600">Medicine SKUs</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <Truck className="h-8 w-8 text-orange-600 mb-2" />
                    <div className="text-sm font-semibold">98.7%</div>
                    <div className="text-xs text-gray-600">On-time Delivery</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                  <h3 className="font-semibold mb-2">Live Dashboard Preview</h3>
                  <p className="text-sm opacity-90 mb-4">
                    See how our platform transforms your pharmacy operations with real-time insights and seamless workflows.
                  </p>
                  <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                    View Dashboard
                  </Button>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every Role
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Designed specifically for the pharmaceutical industry, our platform addresses the unique 
              challenges faced by pharmacies, distributors, and delivery agents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pharmacy Features */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">For Pharmacies</CardTitle>
                    <CardDescription>Streamline your operations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Inventory Management</h4>
                    <p className="text-sm text-gray-600">Real-time stock tracking and automated reordering</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Search className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Medicine Search</h4>
                    <p className="text-sm text-gray-600">Find alternatives and substitutes instantly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Order Processing</h4>
                    <p className="text-sm text-gray-600">Efficient order management and tracking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Analytics</h4>
                    <p className="text-sm text-gray-600">Sales insights and performance metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distributor Features */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">For Distributors</CardTitle>
                    <CardDescription>Optimize your supply chain</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Database className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Inventory Control</h4>
                    <p className="text-sm text-gray-600">Comprehensive stock management</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Agent Management</h4>
                    <p className="text-sm text-gray-600">Monitor and manage delivery teams</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Performance Analytics</h4>
                    <p className="text-sm text-gray-600">Track delivery efficiency and KPIs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Route Optimization</h4>
                    <p className="text-sm text-gray-600">Smart delivery route planning</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Features */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">For Delivery Agents</CardTitle>
                    <CardDescription>Enhance your deliveries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Smartphone className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Mobile App</h4>
                    <p className="text-sm text-gray-600">User-friendly mobile interface</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Route Navigation</h4>
                    <p className="text-sm text-gray-600">GPS-enabled delivery routes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Communication</h4>
                    <p className="text-sm text-gray-600">Direct contact with pharmacies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Performance Tracking</h4>
                    <p className="text-sm text-gray-600">Track deliveries and earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Intuitive Dashboard Experience
            </h2>
            <p className="text-lg text-gray-600">
              Clean, modern interface designed for efficiency and ease of use
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Pharmacy Dashboard</h3>
                  <Badge variant="outline">Real-time</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Total Orders</span>
                    <span className="text-lg font-bold text-blue-600">1,234</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Pending</span>
                    <span className="text-lg font-bold text-green-600">45</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium">In Transit</span>
                    <span className="text-lg font-bold text-orange-600">156</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Delivered</span>
                    <span className="text-lg font-bold text-purple-600">1,033</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Benefits</CardTitle>
                    <CardDescription>What makes our platform exceptional</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Time Saving</h4>
                        <p className="text-sm text-gray-600">Reduce manual work by 70%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Increased Efficiency</h4>
                        <p className="text-sm text-gray-600">Optimize your workflow</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Shield className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Secure & Compliant</h4>
                        <p className="text-sm text-gray-600">HIPAA compliant data handling</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Smartphone className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Mobile Ready</h4>
                        <p className="text-sm text-gray-600">Works on all devices</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-gray-600">
              Join hundreds of pharmacies and distributors who have transformed their operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Dr. Sarah Johnson</CardTitle>
                    <CardDescription>Pharmacy Owner</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "PharmaFlow has completely transformed how we manage our pharmacy. 
                  The inventory tracking alone has saved us hours every week and 
                  reduced our stockouts by 80%."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mike Chen</CardTitle>
                    <CardDescription>Distribution Manager</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "Our delivery efficiency has improved dramatically. The route optimization 
                  and real-time tracking have made our agents much more productive."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Alex Rodriguez</CardTitle>
                    <CardDescription>Delivery Agent</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "The mobile app makes my job so much easier. I can see all my deliveries 
                  in one place and the navigation is spot on every time."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Pharmacy Operations?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join hundreds of pharmacies and distributors who have already streamlined 
            their operations with PharmaFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">PharmaFlow</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing pharmaceutical supply chain management with cutting-edge technology and user-friendly solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 PharmaFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}