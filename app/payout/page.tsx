"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  BarChart3,
  HelpCircle,
  LogOut,
  Menu,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  Wallet,
  AlertTriangle,
} from "lucide-react"
import { PnlHubLogo } from "@/components/pnlhub-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  email: string
  password: string
  balance: number
  monetized: boolean
  isBanned?: boolean
  banReason?: string
  banDate?: string
}

export default function PayoutPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (currentUser?.isBanned) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-gray-900 border-red-700">
          <CardContent className="pt-6 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">Account Banned</h2>
              <p className="text-red-200 mb-4">❌ Your account has been banned.</p>

              {/* Show Ban Reason */}
              {currentUser.banReason && (
                <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg text-left">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-200 font-medium mb-1">Reason for Ban:</p>
                      <p className="text-red-300 text-sm">{currentUser.banReason}</p>
                      {currentUser.banDate && (
                        <p className="text-red-400 text-xs mt-2">
                          Banned on: {new Date(currentUser.banDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <p className="text-slate-400 text-sm">Contact support for more information.</p>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-200 text-sm">📧 Email: pnlhubfunded@gmail.com</p>
              </div>
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-200 text-sm">💬 Discord: Join our support server</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <PnlHubLogo size="md" />
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link href="/payout" className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg">
              <CreditCard className="h-5 w-5 mr-3" />
              Payout
            </Link>
            <Link
              href="/withdrawal"
              className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Wallet className="h-5 w-5 mr-3" />
              Withdrawal
            </Link>
            <Link
              href="/kyc"
              className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <FileText className="h-5 w-5 mr-3" />
              KYC Verification
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              Support
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-bold text-white ml-4 lg:ml-0">Payout Status</h1>
            </div>
          </div>
        </header>

        {/* Payout Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Payout Status Card */}
            <Card className="bg-gray-900 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <CreditCard className="h-6 w-6" />
                  <span>Payout Eligibility</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Your current payout status and eligibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {currentUser.monetized ? (
                      <CheckCircle className="h-12 w-12 text-green-400" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-400" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {currentUser.monetized ? "Monetized Account" : "Not Monetized"}
                      </h3>
                      <p className="text-slate-400">
                        {currentUser.monetized
                          ? "You are eligible for daily payouts"
                          : "Complete the evaluation process to get monetized"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={currentUser.monetized ? "default" : "secondary"}
                    className={`text-lg px-4 py-2 ${currentUser.monetized ? "bg-green-600" : "bg-slate-600"}`}
                  >
                    {currentUser.monetized ? "Monetized ✅" : "Not Monetized ❌"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Account Balance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">${currentUser.balance.toLocaleString()}</div>
                  <p className="text-slate-400 mt-2">Current trading balance</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Profit Split</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">{currentUser.monetized ? "80%" : "0%"}</div>
                  <p className="text-slate-400 mt-2">Your share of profits</p>
                </CardContent>
              </Card>
            </div>

            {/* Payout Information */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Payout Information</CardTitle>
                <CardDescription className="text-slate-400">How payouts work at PnlHUB</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Daily Payouts</h4>
                    <p className="text-slate-400 text-sm">Receive your profits every day once you're monetized</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Instant Processing</h4>
                    <p className="text-slate-400 text-sm">Payouts are processed within 24 hours of request</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">No Minimum</h4>
                    <p className="text-slate-400 text-sm">No minimum payout amount required</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Multiple Methods</h4>
                    <p className="text-slate-400 text-sm">Bank transfer, PayPal, crypto, and more</p>
                  </div>
                </div>

                {!currentUser.monetized && (
                  <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <h4 className="font-semibold text-yellow-400 mb-2">Get Monetized</h4>
                    <p className="text-yellow-200 text-sm mb-4">
                      To become eligible for payouts, you need to complete our evaluation process and demonstrate
                      consistent profitability.
                    </p>
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">Start Evaluation</Button>
                  </div>
                )}

                {currentUser.monetized && (
                  <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">Ready for Payouts</h4>
                    <p className="text-green-200 text-sm mb-4">
                      Your account is monetized and eligible for daily payouts. Keep trading profitably to earn your
                      share!
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Request Payout</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
