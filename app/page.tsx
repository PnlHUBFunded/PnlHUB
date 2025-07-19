import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, DollarSign, Zap, Calendar, Star } from "lucide-react"
import { PnlHubLogo } from "@/components/pnlhub-logo"
import Link from "next/link"

const features = [
  {
    icon: DollarSign,
    title: "Daily Payouts",
    description: "Get paid every day for your profitable trades with instant withdrawals",
  },
  {
    icon: Zap,
    title: "Instant Funding",
    description: "Get funded immediately after passing our evaluation process",
  },
  {
    icon: Calendar,
    title: "No Minimum Trading Days",
    description: "Start earning from day one without waiting periods",
  },
]

const pricingPlans = [
  {
    title: "5K Account",
    price: "$40",
    features: ["$5,000 Starting Balance", "Up to 80% Profit Split", "Daily Payouts", "24/7 Support"],
    popular: false,
  },
  {
    title: "10K Account",
    price: "$70",
    features: ["$10,000 Starting Balance", "Up to 85% Profit Split", "Daily Payouts", "Priority Support"],
    popular: true,
  },
  {
    title: "50K Account",
    price: "$120",
    features: ["$50,000 Starting Balance", "Up to 90% Profit Split", "Daily Payouts", "VIP Support"],
    popular: false,
  },
]

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Professional Trader",
    content: "PnlHUB changed my trading career. The daily payouts are incredible!",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Forex Trader",
    content: "Best prop firm I've worked with. Instant funding and great support.",
    rating: 5,
  },
  {
    name: "Mike Rodriguez",
    role: "Crypto Trader",
    content: "Finally a prop firm that actually pays out daily. Highly recommend!",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 lg:px-6 h-16 flex items-center border-b border-gray-800">
        <div className="flex items-center justify-center">
          <PnlHubLogo size="md" />
        </div>
        <nav className="ml-auto flex gap-2 sm:gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-2"
          >
            Login
          </Link>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white">
                  Accelerate Your Trading with{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    PnlHUB
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-white/80 text-base md:text-lg lg:text-xl xl:text-2xl px-4">
                  Join the most profitable prop trading firm. Get funded instantly, earn daily payouts, and scale your
                  trading career to new heights.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105"
                  >
                    Join Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-8 md:py-16 lg:py-24 bg-gray-900/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                Why Choose PnlHUB?
              </h2>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto px-4">
                We provide the best trading conditions in the industry
              </p>
            </div>
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  <CardHeader className="text-center">
                    <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-purple-400 mx-auto mb-4" />
                    <CardTitle className="text-white text-lg md:text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/80 text-center text-sm md:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-8 md:py-16 lg:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                Choose Your Account Size
              </h2>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto px-4">
                Start with the account size that fits your trading style
              </p>
            </div>
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105 ${plan.popular ? "ring-2 ring-purple-400" : ""}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-white text-xl md:text-2xl">{plan.title}</CardTitle>
                    <div className="text-3xl md:text-4xl font-bold text-purple-400">{plan.price}</div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-white/80 flex items-center text-sm md:text-base">
                          <Star className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0">
                      Get Funded
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-8 md:py-16 lg:py-24 bg-gray-900/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                What Our Traders Say
              </h2>
            </div>
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-white/80 mb-4 text-sm md:text-base">"{testimonial.content}"</p>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-white/60 text-sm">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Live Payments Section */}
        <section className="w-full py-8 md:py-12 lg:py-16 bg-gray-900/30 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto mb-6 md:mb-8">
            <div className="text-center">
              <Link href="/admin">
                <h2 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4 cursor-pointer hover:text-purple-400 transition-colors">
                  Live Payments
                </h2>
              </Link>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
                Real-time payouts to our traders worldwide
              </p>
            </div>
          </div>

          {/* Sliding Payment Notifications */}
          <div className="relative">
            {/* First Row - Left to Right */}
            <div className="flex animate-scroll-left mb-4">
              <div className="flex space-x-4 min-w-max">
                {[
                  { name: "Alex Johnson", amount: 1247.5, time: "3 min ago", country: "🇺🇸" },
                  { name: "Sarah Chen", amount: 892.3, time: "7 min ago", country: "🇨🇦" },
                  { name: "Mike Rodriguez", amount: 2156.8, time: "12 min ago", country: "🇲🇽" },
                  { name: "Emma Thompson", amount: 675.25, time: "18 min ago", country: "🇬🇧" },
                  { name: "David Kim", amount: 1834.9, time: "25 min ago", country: "🇰🇷" },
                  { name: "Lisa Anderson", amount: 943.75, time: "31 min ago", country: "🇦🇺" },
                  { name: "Carlos Silva", amount: 1567.4, time: "45 min ago", country: "🇧🇷" },
                  { name: "Anna Müller", amount: 1123.6, time: "1h 12m ago", country: "🇩🇪" },
                  { name: "James Wilson", amount: 789.2, time: "1h 28m ago", country: "🇺🇸" },
                  { name: "Maria Garcia", amount: 2034.15, time: "1h 45m ago", country: "🇪🇸" },
                ].map((payment, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 md:p-4 min-w-[240px] md:min-w-[280px] flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium text-sm md:text-base truncate">{payment.name}</span>
                        <span className="text-base md:text-lg">{payment.country}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-bold text-sm md:text-base">
                          ${payment.amount.toLocaleString()}
                        </span>
                        <span className="text-white/60 text-xs md:text-sm">{payment.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {[
                  { name: "Alex Johnson", amount: 1247.5, time: "3 min ago", country: "🇺🇸" },
                  { name: "Sarah Chen", amount: 892.3, time: "7 min ago", country: "🇨🇦" },
                  { name: "Mike Rodriguez", amount: 2156.8, time: "12 min ago", country: "🇲🇽" },
                  { name: "Emma Thompson", amount: 675.25, time: "18 min ago", country: "🇬🇧" },
                  { name: "David Kim", amount: 1834.9, time: "25 min ago", country: "🇰🇷" },
                  { name: "Lisa Anderson", amount: 943.75, time: "31 min ago", country: "🇦🇺" },
                  { name: "Carlos Silva", amount: 1567.4, time: "45 min ago", country: "🇧🇷" },
                  { name: "Anna Müller", amount: 1123.6, time: "1h 12m ago", country: "🇩🇪" },
                  { name: "James Wilson", amount: 789.2, time: "1h 28m ago", country: "🇺🇸" },
                  { name: "Maria Garcia", amount: 2034.15, time: "1h 45m ago", country: "🇪🇸" },
                ].map((payment, index) => (
                  <div
                    key={`dup1-${index}`}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 md:p-4 min-w-[240px] md:min-w-[280px] flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium text-sm md:text-base truncate">{payment.name}</span>
                        <span className="text-base md:text-lg">{payment.country}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-bold text-sm md:text-base">
                          ${payment.amount.toLocaleString()}
                        </span>
                        <span className="text-white/60 text-xs md:text-sm">{payment.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second Row - Right to Left */}
            <div className="flex animate-scroll-right">
              <div className="flex space-x-4 min-w-max">
                {[
                  { name: "Marcus Thompson", amount: 1456.8, time: "1 min ago", country: "🇿🇦" },
                  { name: "Isabella Costa", amount: 987.45, time: "5 min ago", country: "🇧🇷" },
                  { name: "Raj Patel", amount: 1789.3, time: "9 min ago", country: "🇮🇳" },
                  { name: "Elena Volkov", amount: 1234.7, time: "15 min ago", country: "🇷🇺" },
                  { name: "Hassan Ali", amount: 856.9, time: "22 min ago", country: "🇦🇪" },
                  { name: "Lucia Romano", amount: 1678.25, time: "29 min ago", country: "🇮🇹" },
                  { name: "Erik Johansson", amount: 1345.6, time: "36 min ago", country: "🇸🇪" },
                  { name: "Mei Lin", amount: 923.4, time: "43 min ago", country: "🇸🇬" },
                  { name: "Connor Walsh", amount: 1567.85, time: "52 min ago", country: "🇮🇪" },
                  { name: "Zhang Wei", amount: 2145.3, time: "1h 5m ago", country: "🇨🇳" },
                ].map((payment, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 md:p-4 min-w-[240px] md:min-w-[280px] flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium text-sm md:text-base truncate">{payment.name}</span>
                        <span className="text-base md:text-lg">{payment.country}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-bold text-sm md:text-base">
                          ${payment.amount.toLocaleString()}
                        </span>
                        <span className="text-white/60 text-xs md:text-sm">{payment.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {[
                  { name: "Marcus Thompson", amount: 1456.8, time: "1 min ago", country: "🇿🇦" },
                  { name: "Isabella Costa", amount: 987.45, time: "5 min ago", country: "🇧🇷" },
                  { name: "Raj Patel", amount: 1789.3, time: "9 min ago", country: "🇮🇳" },
                  { name: "Elena Volkov", amount: 1234.7, time: "15 min ago", country: "🇷🇺" },
                  { name: "Hassan Ali", amount: 856.9, time: "22 min ago", country: "🇦🇪" },
                  { name: "Lucia Romano", amount: 1678.25, time: "29 min ago", country: "🇮🇹" },
                  { name: "Erik Johansson", amount: 1345.6, time: "36 min ago", country: "🇸🇪" },
                  { name: "Mei Lin", amount: 923.4, time: "43 min ago", country: "🇸🇬" },
                  { name: "Connor Walsh", amount: 1567.85, time: "52 min ago", country: "🇮🇪" },
                  { name: "Zhang Wei", amount: 2145.3, time: "1h 5m ago", country: "🇨🇳" },
                ].map((payment, index) => (
                  <div
                    key={`dup2-${index}`}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 md:p-4 min-w-[240px] md:min-w-[280px] flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium text-sm md:text-base truncate">{payment.name}</span>
                        <span className="text-base md:text-lg">{payment.country}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-bold text-sm md:text-base">
                          ${payment.amount.toLocaleString()}
                        </span>
                        <span className="text-white/60 text-xs md:text-sm">{payment.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-6 bg-gray-900/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <PnlHubLogo size="sm" />
            <nav className="flex gap-4 sm:gap-6">
              <Link href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                Discord
              </Link>
              <Link href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                Instagram
              </Link>
            </nav>
          </div>
          <div className="mt-4 text-center text-white/60 text-sm">© 2024 PnlHUB. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
