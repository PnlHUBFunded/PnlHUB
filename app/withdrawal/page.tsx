"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Wallet,
  BarChart3,
  CreditCard,
  HelpCircle,
  LogOut,
  Menu,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
} from "lucide-react"
import { PnlHubLogo } from "@/components/pnlhub-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  name: string
  email: string
  password: string
  initialBalance: number
  monetized: boolean
  profitTarget: number
  approvedWithdrawalAmount?: number
  withdrawalRequested?: boolean
  walletAddress?: string
  isBanned?: boolean
  pnlHistory: any[]
  balance: number
  achievedProfit: number
  todaysPnL: number
  last7Days: number[]
}

export default function WithdrawalPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser")
    if (userStr) {
      const user = JSON.parse(userStr)
      const usersStr = localStorage.getItem("users")

      if (usersStr) {
        const users: User[] = JSON.parse(usersStr)
        const updatedUser = users.find((u) => u.email === user.email)

        if (updatedUser) {
          setCurrentUser(updatedUser)
          localStorage.setItem("currentUser", JSON.stringify(updatedUser))
          setWalletAddress(updatedUser.walletAddress || "")
        } else {
          setCurrentUser(user)
        }
      } else {
        setCurrentUser(user)
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !walletAddress.trim()) return

    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const usersStr = localStorage.getItem("users")
      if (usersStr) {
        const users: User[] = JSON.parse(usersStr)
        const userIndex = users.findIndex((u) => u.email === currentUser.email)

        if (userIndex !== -1) {
          const updatedUser = { ...users[userIndex] }
          updatedUser.withdrawalRequested = true
          updatedUser.walletAddress = walletAddress

          users[userIndex] = updatedUser
          localStorage.setItem("users", JSON.stringify(users))
          localStorage.setItem("currentUser", JSON.stringify(updatedUser))
          setCurrentUser(updatedUser)

          setSubmitMessage("Withdrawal request submitted successfully! You will receive your funds within 24 hours.")
        }
      }
    } catch (error) {
      setSubmitMessage("An error occurred while submitting your withdrawal request.")
    } finally {
      setIsSubmitting(false)
    }
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
        <Card className="w-full max-w-md bg-gray-900 border-red-700">
          <CardContent className="pt-6 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">Account Banned</h2>
              <p className="text-red-200 mb-4">❌ Your account has been banned.</p>
              <p className="text-slate-400 text-sm">Contact support for more information.</p>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-200 text-sm">📧 Email: support@pnlhub.com</p>
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
            <Link
              href="/payout"
              className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <CreditCard className="h-5 w-5 mr-3" />
              Payout
            </Link>
            <Link href="/withdrawal" className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg">
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
              <h1 className="text-2xl font-bold text-white ml-4 lg:ml-0">Withdrawal</h1>
            </div>
          </div>
        </header>

        {/* Withdrawal Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Monetization Status */}
            <Card className="bg-gray-900 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Wallet className="h-6 w-6" />
                  <span>Withdrawal Status</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Your withdrawal eligibility and status</CardDescription>
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
                        {currentUser.monetized ? "Withdrawals Enabled" : "Withdrawals Disabled"}
                      </h3>
                      <p className="text-slate-400">
                        {currentUser.monetized
                          ? "You can request withdrawals from your approved amount"
                          : "You are not monetized yet. Withdrawals are disabled."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Form or Disabled Message */}
            {currentUser.monetized ? (
              <>
                {/* Approved Amount Display */}
                <Card className="bg-gray-900 border-gray-700 mb-8">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Available for Withdrawal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      ${(currentUser.approvedWithdrawalAmount || 0).toLocaleString()}
                    </div>
                    <p className="text-slate-400">Approved withdrawable amount</p>
                  </CardContent>
                </Card>

                {/* Withdrawal Request Status */}
                {currentUser.withdrawalRequested && (
                  <Alert className="bg-yellow-900/20 border-yellow-700 mb-8">
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-yellow-200">
                      You have a pending withdrawal request. Your funds will be processed within 24 hours to your
                      registered wallet address.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Withdrawal Form */}
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Wallet className="h-5 w-5" />
                      <span>Request Withdrawal</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Submit a withdrawal request to receive your approved funds
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleWithdrawalRequest} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="walletAddress" className="text-white">
                          TRC20 Wallet Address
                        </Label>
                        <Input
                          id="walletAddress"
                          type="text"
                          placeholder="Enter your TRC20 wallet address (e.g., TXN...)"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                          required
                          disabled={currentUser.withdrawalRequested}
                        />
                        <p className="text-slate-400 text-sm">
                          Make sure this is a valid TRC20 USDT wallet address. Funds will be sent to this address.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-white">
                          Withdrawal Amount
                        </Label>
                        <Input
                          id="amount"
                          type="text"
                          value={`$${(currentUser.approvedWithdrawalAmount || 0).toLocaleString()} USDT`}
                          className="bg-gray-800 border-gray-600 text-white"
                          readOnly
                          disabled
                        />
                        <p className="text-slate-400 text-sm">
                          This is your approved withdrawal amount set by the admin.
                        </p>
                      </div>

                      {submitMessage && (
                        <Alert
                          className={`${
                            submitMessage.includes("successfully")
                              ? "bg-green-900/20 border-green-700"
                              : "bg-red-900/20 border-red-700"
                          }`}
                        >
                          <AlertDescription
                            className={submitMessage.includes("successfully") ? "text-green-200" : "text-red-200"}
                          >
                            {submitMessage}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={
                          isSubmitting ||
                          currentUser.withdrawalRequested ||
                          !walletAddress.trim() ||
                          (currentUser.approvedWithdrawalAmount || 0) <= 0
                        }
                      >
                        {isSubmitting
                          ? "Submitting..."
                          : currentUser.withdrawalRequested
                            ? "Withdrawal Already Requested"
                            : "Request Withdrawal"}
                      </Button>

                      {(currentUser.approvedWithdrawalAmount || 0) <= 0 && (
                        <p className="text-yellow-400 text-sm text-center">
                          No approved withdrawal amount available. Contact admin for approval.
                        </p>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Not Monetized Message */
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-4">Withdrawals Not Available</h3>
                    <p className="text-slate-400 text-lg mb-6">
                      You are not monetized yet. Withdrawals are disabled until you complete the monetization process.
                    </p>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">To Enable Withdrawals:</h4>
                        <ul className="text-slate-400 text-sm space-y-1 text-left">
                          <li>• Complete the evaluation process</li>
                          <li>• Demonstrate consistent profitability</li>
                          <li>• Get approved by our risk management team</li>
                          <li>• Achieve monetization status</li>
                        </ul>
                      </div>
                      <Link href="/dashboard">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">Return to Dashboard</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
