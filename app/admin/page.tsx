"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Trash2, Edit, UserPlus, TrendingUp, Lock, Plus, Award, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PnLEntry {
  date: string
  amount: number
  description?: string
}

interface KYCRequirements {
  bankStatement: boolean
  tinCertificate: boolean
  trc20Bypass: boolean
  bypassAmount: number
  trc20Address: string
}

interface KYCDocuments {
  bankStatement?: string
  tinCertificate?: string
  status: "not-submitted" | "pending" | "verified" | "rejected"
  submittedAt?: string
  reviewedAt?: string
}

interface Certificate {
  id: string
  certificateNumber: string
  userName: string
  accountSize: number
  dateIssued: string
  dateGenerated: string
}

interface User {
  name: string
  email: string
  password: string
  initialBalance: number
  monetized: boolean
  profitTarget: number
  kycStatus: "verified" | "not-verified"
  tradeStartDate: string
  accountPurchaseAmount: number
  transferredFromServer: string
  approvedWithdrawalAmount: number
  withdrawalRequested: boolean
  walletAddress: string
  passed: boolean
  isBanned: boolean
  banReason?: string
  banDate?: string
  certificateOverrides?: {
    name?: string
    certificateNumber?: string
    accountSize?: number
  }
  certificates?: Certificate[]
  kycRequirements?: KYCRequirements
  kycDocuments?: KYCDocuments
  kycPaid?: boolean
  pnlHistory: PnLEntry[]
  balance: number
  achievedProfit: number
  todaysPnL: number
  last7Days: number[]
}

const ADMIN_PASSWORD = "1254452112544521"

// Helper functions
const calculateUserStats = (user: Partial<User>) => {
  const pnlHistory = user.pnlHistory || []
  const achievedProfit = pnlHistory.reduce((sum, entry) => sum + entry.amount, 0)
  const balance = (user.initialBalance || 0) + achievedProfit

  // Calculate today's PnL
  const today = new Date().toISOString().split("T")[0]
  const todaysPnL = pnlHistory.filter((entry) => entry.date === today).reduce((sum, entry) => sum + entry.amount, 0)

  // Calculate last 7 days
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    const dayPnL = pnlHistory.filter((entry) => entry.date === dateStr).reduce((sum, entry) => sum + entry.amount, 0)
    last7Days.push(dayPnL)
  }

  return {
    balance,
    achievedProfit,
    todaysPnL,
    last7Days,
  }
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"users" | "pnl" | "certificates">("users")
  const [banModalOpen, setBanModalOpen] = useState<number | null>(null)
  const [banReason, setBanReason] = useState("")

  // User form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    initialBalance: 0,
    monetized: false,
    profitTarget: 0,
    kycStatus: "verified" as "verified" | "not-verified",
    tradeStartDate: "",
    accountPurchaseAmount: 0,
    transferredFromServer: "",
    approvedWithdrawalAmount: 0,
    withdrawalRequested: false,
    walletAddress: "",
    passed: false,
    isBanned: false,
    banReason: "",
    certificateOverrides: {
      name: "",
      certificateNumber: "",
      accountSize: 0,
    },
    kycRequirements: {
      bankStatement: true,
      tinCertificate: false,
      trc20Bypass: false,
      bypassAmount: 10,
      trc20Address: "",
    },
  })

  // PnL form state
  const [pnlForm, setPnlForm] = useState({
    selectedUser: "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    description: "",
  })

  const router = useRouter()

  useEffect(() => {
    const authStatus = sessionStorage.getItem("adminAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      loadUsers()
    }
  }, [])

  const loadUsers = () => {
    const savedUsers = localStorage.getItem("users")
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers)
      const updatedUsers = parsedUsers.map((user: User) => {
        const stats = calculateUserStats(user)
        return {
          ...user,
          name: user.name || user.email.split("@")[0],
          pnlHistory: user.pnlHistory || [],
          profitTarget: user.profitTarget || 0,
          passed: user.passed || false,
          certificateOverrides: user.certificateOverrides || {},
          certificates: user.certificates || [],
          ...stats,
        }
      })
      setUsers(updatedUsers)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("adminAuthenticated", "true")
      loadUsers()
      setPasswordError("")
    } else {
      setPasswordError("Incorrect password")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }
  }

  const saveUsers = (updatedUsers: User[]) => {
    const usersWithStats = updatedUsers.map((user) => {
      const stats = calculateUserStats(user)
      return { ...user, ...stats }
    })
    setUsers(usersWithStats)
    localStorage.setItem("users", JSON.stringify(usersWithStats))
  }

  const handleBanUser = (userIndex: number, reason: string) => {
    const updatedUsers = [...users]
    updatedUsers[userIndex].isBanned = true
    updatedUsers[userIndex].banReason = reason
    updatedUsers[userIndex].banDate = new Date().toISOString()
    saveUsers(updatedUsers)
    setBanModalOpen(null)
    setBanReason("")
  }

  const handleUnbanUser = (userIndex: number) => {
    const updatedUsers = [...users]
    updatedUsers[userIndex].isBanned = false
    updatedUsers[userIndex].banReason = undefined
    updatedUsers[userIndex].banDate = undefined
    saveUsers(updatedUsers)
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUser.name && newUser.email && newUser.password) {
      const user: User = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        initialBalance: newUser.initialBalance,
        monetized: newUser.monetized,
        profitTarget: newUser.profitTarget,
        kycStatus: newUser.kycStatus,
        tradeStartDate: newUser.tradeStartDate,
        accountPurchaseAmount: newUser.accountPurchaseAmount,
        transferredFromServer: newUser.transferredFromServer,
        approvedWithdrawalAmount: newUser.approvedWithdrawalAmount,
        withdrawalRequested: newUser.withdrawalRequested,
        walletAddress: newUser.walletAddress,
        passed: newUser.passed,
        isBanned: newUser.isBanned,
        banReason: newUser.isBanned ? newUser.banReason : undefined,
        banDate: newUser.isBanned ? new Date().toISOString() : undefined,
        certificateOverrides: {
          name: newUser.certificateOverrides.name || undefined,
          certificateNumber: newUser.certificateOverrides.certificateNumber || undefined,
          accountSize: newUser.certificateOverrides.accountSize || undefined,
        },
        certificates: [],
        kycRequirements: newUser.kycStatus === "not-verified" ? newUser.kycRequirements : undefined,
        kycDocuments:
          newUser.kycStatus === "not-verified"
            ? {
                status: "not-submitted",
              }
            : undefined,
        kycPaid: false,
        pnlHistory: [],
        balance: newUser.initialBalance,
        achievedProfit: 0,
        todaysPnL: 0,
        last7Days: [0, 0, 0, 0, 0, 0, 0],
      }

      if (editingIndex !== null) {
        const updatedUsers = [...users]
        updatedUsers[editingIndex] = { ...updatedUsers[editingIndex], ...user }
        saveUsers(updatedUsers)
        setEditingIndex(null)
      } else {
        saveUsers([...users, user])
      }

      setNewUser({
        name: "",
        email: "",
        password: "",
        initialBalance: 0,
        monetized: false,
        profitTarget: 0,
        kycStatus: "verified",
        tradeStartDate: "",
        accountPurchaseAmount: 0,
        transferredFromServer: "",
        approvedWithdrawalAmount: 0,
        withdrawalRequested: false,
        walletAddress: "",
        passed: false,
        isBanned: false,
        banReason: "",
        certificateOverrides: {
          name: "",
          certificateNumber: "",
          accountSize: 0,
        },
        kycRequirements: {
          bankStatement: true,
          tinCertificate: false,
          trc20Bypass: false,
          bypassAmount: 10,
          trc20Address: "",
        },
      })
    }
  }

  const handleAddPnL = (e: React.FormEvent) => {
    e.preventDefault()
    if (pnlForm.selectedUser && pnlForm.date && pnlForm.amount !== 0) {
      const userIndex = users.findIndex((u) => u.email === pnlForm.selectedUser)
      if (userIndex !== -1) {
        const updatedUsers = [...users]
        const newEntry: PnLEntry = {
          date: pnlForm.date,
          amount: pnlForm.amount,
          description: pnlForm.description || undefined,
        }

        updatedUsers[userIndex].pnlHistory.push(newEntry)
        saveUsers(updatedUsers)

        setPnlForm({
          selectedUser: "",
          date: new Date().toISOString().split("T")[0],
          amount: 0,
          description: "",
        })
      }
    }
  }

  const handleEditUser = (index: number) => {
    const user = users[index]
    setNewUser({
      name: user.name,
      email: user.email,
      password: user.password,
      initialBalance: user.initialBalance,
      monetized: user.monetized,
      profitTarget: user.profitTarget,
      kycStatus: user.kycStatus || "verified",
      tradeStartDate: user.tradeStartDate || "",
      accountPurchaseAmount: user.accountPurchaseAmount || 0,
      transferredFromServer: user.transferredFromServer || "",
      approvedWithdrawalAmount: user.approvedWithdrawalAmount || 0,
      withdrawalRequested: user.withdrawalRequested || false,
      walletAddress: user.walletAddress || "",
      passed: user.passed || false,
      isBanned: user.isBanned || false,
      banReason: user.banReason || "",
      certificateOverrides: {
        name: user.certificateOverrides?.name || "",
        certificateNumber: user.certificateOverrides?.certificateNumber || "",
        accountSize: user.certificateOverrides?.accountSize || 0,
      },
      kycRequirements: user.kycRequirements || {
        bankStatement: true,
        tinCertificate: false,
        trc20Bypass: false,
        bypassAmount: 10,
        trc20Address: "",
      },
    })
    setEditingIndex(index)
  }

  const handleDeleteUser = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index)
    saveUsers(updatedUsers)
  }

  const handleKYCStatusChange = (userIndex: number, status: "verified" | "rejected") => {
    const updatedUsers = [...users]
    if (!updatedUsers[userIndex].kycDocuments) {
      updatedUsers[userIndex].kycDocuments = { status: "not-submitted" }
    }
    updatedUsers[userIndex].kycDocuments!.status = status
    updatedUsers[userIndex].kycDocuments!.reviewedAt = new Date().toISOString()
    if (status === "verified") {
      updatedUsers[userIndex].kycStatus = "verified"
    }
    saveUsers(updatedUsers)
  }

  const getAllCertificates = () => {
    return JSON.parse(localStorage.getItem("allCertificates") || "[]")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardHeader className="text-center">
            <Lock className="h-10 w-10 md:h-12 md:w-12 text-purple-400 mx-auto mb-4" />
            <CardTitle className="text-white text-lg md:text-xl">Admin Access</CardTitle>
            <CardDescription className="text-slate-400 text-sm md:text-base">
              Enter the admin password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordError && (
                <Alert className="bg-red-500/20 border-red-500/50 text-red-200">
                  <AlertDescription className="text-sm">{passwordError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm md:text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white h-12"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 h-12">
                Access Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-400" />
            <span className="text-xl md:text-2xl font-bold">PnlHUB Admin</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              onClick={() => {
                sessionStorage.removeItem("adminAuthenticated")
                setIsAuthenticated(false)
              }}
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800 bg-transparent text-sm"
            >
              Logout
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800 bg-transparent text-sm"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex space-x-4 md:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "users"
                  ? "border-purple-400 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab("pnl")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "pnl"
                  ? "border-purple-400 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              PnL Manager
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "certificates"
                  ? "border-purple-400 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Certificates
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {activeTab === "users" && (
          <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
            {/* Add/Edit User Form */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white text-base md:text-lg">
                  <UserPlus className="h-5 w-5" />
                  <span>{editingIndex !== null ? "Edit User" : "Add New User"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white text-sm">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white text-sm"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white text-sm"
                        placeholder="trader@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white text-sm">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white text-sm"
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="initialBalance" className="text-white text-sm">
                        Initial Balance
                      </Label>
                      <Input
                        id="initialBalance"
                        type="number"
                        value={newUser.initialBalance}
                        onChange={(e) => setNewUser({ ...newUser, initialBalance: Number(e.target.value) })}
                        className="bg-gray-800 border-gray-600 text-white text-sm"
                        placeholder="5000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profitTarget" className="text-white text-sm">
                        Profit Target
                      </Label>
                      <Input
                        id="profitTarget"
                        type="number"
                        value={newUser.profitTarget}
                        onChange={(e) => setNewUser({ ...newUser, profitTarget: Number(e.target.value) })}
                        className="bg-gray-800 border-gray-600 text-white text-sm"
                        placeholder="1000"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="monetized"
                        checked={newUser.monetized}
                        onCheckedChange={(checked) => setNewUser({ ...newUser, monetized: checked })}
                      />
                      <Label htmlFor="monetized" className="text-white text-sm">
                        Monetization Toggle
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="passed"
                        checked={newUser.passed}
                        onCheckedChange={(checked) => setNewUser({ ...newUser, passed: checked })}
                      />
                      <Label htmlFor="passed" className="text-white text-sm">
                        🏆 Passed (Certificate Eligible)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isBanned"
                        checked={newUser.isBanned}
                        onCheckedChange={(checked) => setNewUser({ ...newUser, isBanned: checked })}
                      />
                      <Label htmlFor="isBanned" className="text-white text-sm">
                        🚫 Banned (Restrict Access)
                      </Label>
                    </div>
                  </div>

                  {/* Ban Reason Field */}
                  {newUser.isBanned && (
                    <div className="space-y-2">
                      <Label htmlFor="banReason" className="text-white text-sm">
                        🚫 Ban Reason
                      </Label>
                      <Textarea
                        id="banReason"
                        value={newUser.banReason}
                        onChange={(e) => setNewUser({ ...newUser, banReason: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white text-sm"
                        placeholder="Enter reason for ban..."
                        rows={3}
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    {editingIndex !== null ? "Update User" : "Add User"}
                  </Button>

                  {editingIndex !== null && (
                    <Button
                      type="button"
                      onClick={() => {
                        setEditingIndex(null)
                        setNewUser({
                          name: "",
                          email: "",
                          password: "",
                          initialBalance: 0,
                          monetized: false,
                          profitTarget: 0,
                          kycStatus: "verified",
                          tradeStartDate: "",
                          accountPurchaseAmount: 0,
                          transferredFromServer: "",
                          approvedWithdrawalAmount: 0,
                          withdrawalRequested: false,
                          walletAddress: "",
                          passed: false,
                          isBanned: false,
                          banReason: "",
                          certificateOverrides: {
                            name: "",
                            certificateNumber: "",
                            accountSize: 0,
                          },
                          kycRequirements: {
                            bankStatement: true,
                            tinCertificate: false,
                            trc20Bypass: false,
                            bypassAmount: 10,
                            trc20Address: "",
                          },
                        })
                      }}
                      variant="outline"
                      className="w-full border-gray-600 text-white hover:bg-gray-700"
                    >
                      Cancel Edit
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Users Overview Table */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-base md:text-lg">All Users ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <p className="text-slate-400 text-center py-6 md:py-8 text-sm">No users found</p>
                  ) : (
                    users.map((user, index) => {
                      const progressPercent =
                        user.profitTarget > 0 ? (user.achievedProfit / user.profitTarget) * 100 : 0
                      const hasPassedTarget = user.passed || user.achievedProfit >= user.profitTarget
                      return (
                        <div key={index} className="p-3 md:p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-white font-medium text-sm md:text-base">{user.name}</p>
                              <p className="text-slate-400 text-xs md:text-sm break-all">{user.email}</p>
                            </div>
                            <div className="flex items-center space-x-1 md:space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditUser(index)}
                                className="border-slate-600 text-white hover:bg-slate-600 p-2"
                              >
                                <Edit className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(index)}
                                className="p-2"
                              >
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                            <div>
                              <p className="text-slate-400">Balance</p>
                              <p className="text-white font-medium">${user.balance.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Target</p>
                              <p className="text-white font-medium">${user.profitTarget.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Achieved</p>
                              <p className="text-white font-medium">${user.achievedProfit.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Withdrawal</p>
                              <p className="text-white font-medium">
                                ${(user.approvedWithdrawalAmount || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3">
                            <Progress value={Math.min(progressPercent, 100)} className="h-2" />
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1 md:gap-2">
                            <Badge
                              variant={user.monetized ? "default" : "secondary"}
                              className={`${user.monetized ? "bg-green-600" : "bg-slate-600"} text-xs`}
                            >
                              {user.monetized ? "Monetized ✅" : "Not Monetized ❌"}
                            </Badge>

                            <Badge
                              variant={hasPassedTarget ? "default" : "secondary"}
                              className={`${hasPassedTarget ? "bg-yellow-600" : "bg-slate-600"} text-xs`}
                            >
                              {hasPassedTarget ? "🏆 Passed" : "❌ Not Passed"}
                            </Badge>

                            {user.isBanned && <Badge className="bg-red-600 text-xs">🚫 BANNED</Badge>}
                          </div>

                          {/* Ban/Unban Controls */}
                          <div className="mt-3 flex gap-2">
                            {user.isBanned ? (
                              <Button
                                size="sm"
                                onClick={() => handleUnbanUser(index)}
                                className="bg-green-600 hover:bg-green-700 text-xs"
                              >
                                ✅ Unban User
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => setBanModalOpen(index)}
                                className="bg-red-600 hover:bg-red-700 text-xs"
                              >
                                🚫 Ban User
                              </Button>
                            )}
                          </div>

                          {/* Show Ban Reason if banned */}
                          {user.isBanned && user.banReason && (
                            <div className="mt-3 p-2 md:p-3 bg-red-900/20 border border-red-700 rounded-lg">
                              <div className="flex items-start space-x-2">
                                <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-red-200 text-xs md:text-sm font-medium">Ban Reason:</p>
                                  <p className="text-red-300 text-xs">{user.banReason}</p>
                                  {user.banDate && (
                                    <p className="text-red-400 text-xs mt-1">
                                      Banned on: {new Date(user.banDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "pnl" && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white text-base md:text-lg">
                  <Plus className="h-5 w-5" />
                  <span>Add PnL Entry</span>
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm md:text-base">
                  Add daily performance data for users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPnL} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-select" className="text-white text-sm">
                      Select User
                    </Label>
                    <Select
                      value={pnlForm.selectedUser}
                      onValueChange={(value) => setPnlForm({ ...pnlForm, selectedUser: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {users.map((user) => (
                          <SelectItem key={user.email} value={user.email} className="text-white">
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-white text-sm">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={pnlForm.date}
                        onChange={(e) => setPnlForm({ ...pnlForm, date: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-white text-sm">
                        Amount (Profit/Loss)
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={pnlForm.amount}
                        onChange={(e) => setPnlForm({ ...pnlForm, amount: Number(e.target.value) })}
                        className="bg-gray-800 border-gray-600 text-white text-sm"
                        placeholder="150.50 or -75.25"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white text-sm">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      value={pnlForm.description}
                      onChange={(e) => setPnlForm({ ...pnlForm, description: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white text-sm"
                      placeholder="Trade, Purchase, etc."
                      rows={2}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Add PnL Entry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="max-w-6xl mx-auto">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white text-base md:text-lg">
                  <Award className="h-5 w-5" />
                  <span>All Certificates</span>
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm md:text-base">
                  View all generated certificates across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getAllCertificates().length === 0 ? (
                    <p className="text-slate-400 text-center py-6 md:py-8 text-sm">No certificates generated yet</p>
                  ) : (
                    getAllCertificates().map((cert: Certificate, index: number) => (
                      <div key={cert.id} className="p-3 md:p-4 bg-gray-800 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                          <div>
                            <p className="text-slate-400 text-xs md:text-sm">Certificate #</p>
                            <p className="text-white font-medium text-sm md:text-base">{cert.certificateNumber}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs md:text-sm">User Name</p>
                            <p className="text-white font-medium text-sm md:text-base">{cert.userName}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs md:text-sm">Account Size</p>
                            <p className="text-white font-medium text-sm md:text-base">
                              ${cert.accountSize.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs md:text-sm">Date Issued</p>
                            <p className="text-white font-medium text-sm md:text-base">{cert.dateIssued}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-slate-400 text-xs">
                            Generated: {new Date(cert.dateGenerated).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Ban Modal */}
      {banModalOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-gray-900 border-red-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2 text-base md:text-lg">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span>Ban User</span>
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm md:text-base">
                Provide a reason for banning {users[banModalOpen]?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="banReasonModal" className="text-white text-sm">
                  Ban Reason
                </Label>
                <Textarea
                  id="banReasonModal"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white text-sm"
                  placeholder="Enter reason for ban (e.g., Terms violation, Suspicious activity, etc.)"
                  rows={3}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  onClick={() => {
                    if (banReason.trim()) {
                      handleBanUser(banModalOpen, banReason.trim())
                    }
                  }}
                  disabled={!banReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Ban User
                </Button>
                <Button
                  onClick={() => {
                    setBanModalOpen(null)
                    setBanReason("")
                  }}
                  variant="outline"
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
