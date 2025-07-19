"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  DollarSign,
  BarChart3,
  CreditCard,
  HelpCircle,
  LogOut,
  Menu,
  Target,
  Activity,
  FileText,
  Wallet,
  Award,
  XCircle,
  AlertTriangle,
  X,
} from "lucide-react"
import { PnlHubLogo } from "@/components/pnlhub-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"

interface PnLEntry {
  date: string
  amount: number
  description?: string
}

interface User {
  name: string
  email: string
  password: string
  initialBalance: number
  monetized: boolean
  profitTarget: number
  tradeStartDate?: string
  accountPurchaseAmount?: number
  transferredFromServer?: string
  passed?: boolean
  isBanned?: boolean
  banReason?: string
  banDate?: string
  pnlHistory: PnLEntry[]
  balance: number
  achievedProfit: number
  todaysPnL: number
  last7Days: number[]
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
              <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-2">Account Banned</h2>
              <p className="text-red-200 mb-4 text-sm md:text-base">❌ Your account has been banned.</p>

              {/* Show Ban Reason */}
              {currentUser.banReason && (
                <div className="mb-4 p-3 md:p-4 bg-red-900/20 border border-red-700 rounded-lg text-left">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-200 font-medium mb-1 text-sm md:text-base">Reason for Ban:</p>
                      <p className="text-red-300 text-xs md:text-sm">{currentUser.banReason}</p>
                      {currentUser.banDate && (
                        <p className="text-red-400 text-xs mt-2">
                          Banned on: {new Date(currentUser.banDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <p className="text-slate-400 text-xs md:text-sm">Contact support for more information.</p>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-200 text-xs md:text-sm">📧 Email: PnlHUBfunded@gmail.com</p>
              </div>
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-200 text-xs md:text-sm">💬 Discord: Join our support server</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const chartData =
    currentUser.last7Days?.map((pnl, index) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index] || `Day ${index + 1}`,
      pnl: pnl,
    })) || []

  const recentActivity = (currentUser.pnlHistory || []).slice(-7).reverse()

  const progressPercent =
    currentUser.profitTarget > 0 ? Math.min((currentUser.achievedProfit / currentUser.profitTarget) * 100, 100) : 0

  const drawdown =
    currentUser.balance < currentUser.initialBalance
      ? ((currentUser.initialBalance - currentUser.balance) / currentUser.initialBalance) * 100
      : 0

  const hasPassedTarget = currentUser.passed || currentUser.achievedProfit >= currentUser.profitTarget

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 border-b border-gray-800 px-4">
          <PnlHubLogo size="md" />
          <Button variant="ghost" size="sm" className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <Link href="/dashboard" className="flex items-center px-4 py-3 text-white bg-purple-600 rounded-lg">
              <BarChart3 className="h-5 w-5 mr-3" />
              <span className="text-sm md:text-base">Dashboard</span>
            </Link>
            <Link
              href="/payout"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <CreditCard className="h-5 w-5 mr-3" />
              <span className="text-sm md:text-base">Payout</span>
            </Link>
            <Link
              href="/withdrawal"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Wallet className="h-5 w-5 mr-3" />
              <span className="text-sm md:text-base">Withdrawal</span>
            </Link>
            <Link
              href="/certificate"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                hasPassedTarget
                  ? "text-yellow-300 hover:text-yellow-200 hover:bg-yellow-900/20 bg-yellow-900/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Award className={`h-5 w-5 mr-3 ${hasPassedTarget ? "text-yellow-400" : ""}`} />
              <span className="text-sm md:text-base">Certificate</span>
              {hasPassedTarget && (
                <span className="ml-auto bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">NEW</span>
              )}
            </Link>
            <Link
              href="/kyc"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <FileText className="h-5 w-5 mr-3" />
              <span className="text-sm md:text-base">KYC Verification</span>
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              <span className="text-sm md:text-base">Support</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="text-sm md:text-base">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white mr-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-lg md:text-2xl font-bold text-white">
                Welcome, {currentUser.name || currentUser.email.split("@")[0]}
              </h1>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-6">
          {/* Certificate Achievement Banner */}
          {hasPassedTarget && (
            <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-700 mb-6 md:mb-8">
              <CardContent className="pt-4 md:pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-3 md:space-x-4 text-center sm:text-left">
                    <Award className="h-10 w-10 md:h-12 md:w-12 text-yellow-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-yellow-300">🎉 Congratulations!</h3>
                      <p className="text-yellow-200 text-sm md:text-base">
                        You've achieved your profit target! Your certificate is ready for download.
                      </p>
                    </div>
                  </div>
                  <Link href="/certificate">
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold w-full sm:w-auto">
                      <Award className="h-4 w-4 mr-2" />
                      Get Certificate
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-slate-400">Account Size</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold text-white">
                  ${currentUser.initialBalance?.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-slate-400">Account Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold text-white">
                  ${currentUser.balance?.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-slate-400">Daily Profit</CardTitle>
                <DollarSign
                  className={`h-4 w-4 ${(currentUser.todaysPnL || 0) >= 0 ? "text-green-400" : "text-red-400"}`}
                />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-lg md:text-2xl font-bold ${(currentUser.todaysPnL || 0) >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {(currentUser.todaysPnL || 0) >= 0 ? "+" : ""}${currentUser.todaysPnL || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-slate-400">Drawdown</CardTitle>
                <Activity className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold text-red-400">{drawdown.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Profit Target Progress */}
          <Card className="bg-gray-900 border-gray-700 mb-6 md:mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2 text-base md:text-lg">
                <Target className="h-5 w-5" />
                <span>Profit Target Progress</span>
                {hasPassedTarget && <Award className="h-5 w-5 text-yellow-400 ml-2" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between text-sm space-y-1 sm:space-y-0">
                  <span className="text-slate-400">Target: ${currentUser.profitTarget?.toLocaleString() || 0}</span>
                  <span className="text-slate-400">Achieved: ${currentUser.achievedProfit?.toLocaleString() || 0}</span>
                  <span className={`font-medium ${hasPassedTarget ? "text-yellow-400" : "text-white"}`}>
                    {progressPercent.toFixed(1)}%{hasPassedTarget && " ✅"}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-3" />
                {hasPassedTarget && (
                  <p className="text-yellow-400 text-sm font-medium">
                    🎉 Target achieved! Certificate available for download.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Info Section */}
          <Card className="bg-gray-900 border-gray-700 mb-6 md:mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2 text-base md:text-lg">
                <DollarSign className="h-5 w-5" />
                <span>Account Info</span>
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm md:text-base">
                Your account details and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs md:text-sm">📅 Trade Start Date</Label>
                  <div className="text-sm md:text-lg font-medium text-white">
                    {currentUser.tradeStartDate ? new Date(currentUser.tradeStartDate).toLocaleDateString() : "Not set"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs md:text-sm">💰 Account Purchase Amount</Label>
                  <div className="text-sm md:text-lg font-medium text-white">
                    {currentUser.accountPurchaseAmount
                      ? `$${currentUser.accountPurchaseAmount.toLocaleString()}`
                      : "Not set"}
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label className="text-slate-400 text-xs md:text-sm">🖥️ Transferred From Server</Label>
                  <div className="text-sm md:text-lg font-medium text-white break-all">
                    {currentUser.transferredFromServer || "Not set"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
            {/* PnL Chart */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-base md:text-lg">Last 7 Days Performance</CardTitle>
                <CardDescription className="text-slate-400 text-sm md:text-base">
                  Your daily profit and loss overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                        formatter={(value: any) => [`$${value}`, "PnL"]}
                      />
                      <Bar dataKey="pnl" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-base md:text-lg">Recent Activity</CardTitle>
                <CardDescription className="text-slate-400 text-sm md:text-base">Latest PnL entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {recentActivity.length === 0 ? (
                    <p className="text-slate-400 text-center py-6 md:py-8 text-sm md:text-base">No recent activity</p>
                  ) : (
                    recentActivity.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white font-medium text-sm md:text-base">{entry.description || "Trade"}</p>
                          <p className="text-slate-400 text-xs md:text-sm">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div
                          className={`text-base md:text-lg font-bold ${entry.amount >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {entry.amount >= 0 ? "+" : ""}${entry.amount}
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
