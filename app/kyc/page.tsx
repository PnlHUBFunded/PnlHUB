"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Copy,
  BarChart3,
  CreditCard,
  HelpCircle,
  LogOut,
  Menu,
  Wallet,
} from "lucide-react"
import { PnlHubLogo } from "@/components/pnlhub-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

interface User {
  name: string
  email: string
  password: string
  initialBalance: number
  monetized: boolean
  profitTarget: number
  kycStatus: "verified" | "not-verified"
  kycRequirements?: KYCRequirements
  kycDocuments?: KYCDocuments
  kycPaid?: boolean
  isBanned?: boolean
  pnlHistory: any[]
  balance: number
  achievedProfit: number
  todaysPnL: number
  last7Days: number[]
}

export default function KYCPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    bankStatement: null as File | null,
    tinCertificate: null as File | null,
  })
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [addressCopied, setAddressCopied] = useState(false)
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

  const handleFileUpload = (field: "bankStatement" | "tinCertificate", file: File | null) => {
    setUploadForm((prev) => ({
      ...prev,
      [field]: file,
    }))
  }

  const handleSubmitDocuments = () => {
    if (!currentUser) return

    const usersStr = localStorage.getItem("users")
    if (usersStr) {
      const users: User[] = JSON.parse(usersStr)
      const userIndex = users.findIndex((u) => u.email === currentUser.email)

      if (userIndex !== -1) {
        const updatedUser = { ...users[userIndex] }

        if (!updatedUser.kycDocuments) {
          updatedUser.kycDocuments = { status: "not-submitted" }
        }

        updatedUser.kycDocuments = {
          ...updatedUser.kycDocuments,
          bankStatement: uploadForm.bankStatement ? `uploaded_${uploadForm.bankStatement.name}` : undefined,
          tinCertificate: uploadForm.tinCertificate ? `uploaded_${uploadForm.tinCertificate.name}` : undefined,
          status: "pending",
          submittedAt: new Date().toISOString(),
        }

        users[userIndex] = updatedUser
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setCurrentUser(updatedUser)

        setUploadForm({
          bankStatement: null,
          tinCertificate: null,
        })
      }
    }
  }

  const handlePaymentConfirmation = () => {
    if (!currentUser || !paymentConfirmed) return

    const usersStr = localStorage.getItem("users")
    if (usersStr) {
      const users: User[] = JSON.parse(usersStr)
      const userIndex = users.findIndex((u) => u.email === currentUser.email)

      if (userIndex !== -1) {
        const updatedUser = { ...users[userIndex] }
        updatedUser.kycPaid = true

        if (!updatedUser.kycDocuments) {
          updatedUser.kycDocuments = { status: "not-submitted" }
        }
        updatedUser.kycDocuments.status = "verified"
        updatedUser.kycDocuments.reviewedAt = new Date().toISOString()
        updatedUser.kycStatus = "verified"

        users[userIndex] = updatedUser
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setCurrentUser(updatedUser)
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setAddressCopied(true)
    setTimeout(() => setAddressCopied(false), 2000)
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

  const getStatusBadge = () => {
    if (currentUser.kycStatus === "verified") {
      return <Badge className="bg-green-600">✅ Verified</Badge>
    }

    const docStatus = currentUser.kycDocuments?.status || "not-submitted"

    switch (docStatus) {
      case "pending":
        return <Badge className="bg-yellow-600">⏳ Pending Review</Badge>
      case "rejected":
        return <Badge className="bg-red-600">❌ Rejected</Badge>
      case "verified":
        return <Badge className="bg-green-600">✅ Verified</Badge>
      default:
        return <Badge className="bg-gray-600">📄 Not Submitted</Badge>
    }
  }

  const canUpload =
    currentUser.kycStatus === "not-verified" &&
    (!currentUser.kycDocuments ||
      currentUser.kycDocuments.status === "not-submitted" ||
      currentUser.kycDocuments.status === "rejected")

  const showBypass =
    currentUser.kycStatus === "not-verified" &&
    currentUser.kycDocuments?.status === "rejected" &&
    currentUser.kycRequirements?.trc20Bypass

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
            <Link
              href="/withdrawal"
              className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Wallet className="h-5 w-5 mr-3" />
              Withdrawal
            </Link>
            <Link href="/kyc" className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg">
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
              <h1 className="text-2xl font-bold text-white ml-4 lg:ml-0">KYC Verification</h1>
            </div>
          </div>
        </header>

        {/* KYC Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Status Card */}
            <Card className="bg-gray-900 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <FileText className="h-6 w-6" />
                    <span>KYC Status</span>
                  </span>
                  {getStatusBadge()}
                </CardTitle>
                <CardDescription className="text-slate-400">Your KYC status</CardDescription>
              </CardHeader>
              <CardContent>
                {currentUser.kycStatus === "verified" && (
                  <Alert className="bg-green-900/20 border-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-200">
                      Your KYC verification is complete! You have full access to all platform features.
                    </AlertDescription>
                  </Alert>
                )}

                {currentUser.kycDocuments?.status === "pending" && (
                  <Alert className="bg-yellow-900/20 border-yellow-700">
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-yellow-200">
                      Your documents are under review. We'll notify you once the verification is complete. Submitted on:{" "}
                      {new Date(currentUser.kycDocuments.submittedAt!).toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                )}

                {currentUser.kycDocuments?.status === "rejected" && (
                  <Alert className="bg-red-900/20 border-red-700">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">
                      Your KYC documents were rejected. Please upload new documents or use the bypass option below.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Document Upload Form */}
            {canUpload && (
              <Card className="bg-gray-900 border-gray-700 mb-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Upload Documents</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Upload the required documents for KYC verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentUser.kycRequirements?.bankStatement && (
                    <div className="space-y-2">
                      <Label htmlFor="bankStatement" className="text-white flex items-center space-x-2">
                        <span>Bank Statement</span>
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      </Label>
                      <Input
                        id="bankStatement"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload("bankStatement", e.target.files?.[0] || null)}
                        className="bg-gray-800 border-gray-600 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
                      />
                      {uploadForm.bankStatement && (
                        <p className="text-green-400 text-sm">✅ {uploadForm.bankStatement.name}</p>
                      )}
                    </div>
                  )}

                  {currentUser.kycRequirements?.tinCertificate && (
                    <div className="space-y-2">
                      <Label htmlFor="tinCertificate" className="text-white flex items-center space-x-2">
                        <span>TIN Certificate</span>
                        <Badge variant="secondary" className="text-xs">
                          Optional
                        </Badge>
                      </Label>
                      <Input
                        id="tinCertificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload("tinCertificate", e.target.files?.[0] || null)}
                        className="bg-gray-800 border-gray-600 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
                      />
                      {uploadForm.tinCertificate && (
                        <p className="text-green-400 text-sm">✅ {uploadForm.tinCertificate.name}</p>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={handleSubmitDocuments}
                    disabled={currentUser.kycRequirements?.bankStatement && !uploadForm.bankStatement}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Submit Documents
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* TRC20 Bypass Option */}
            {showBypass && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <span>KYC Bypass Option</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Skip KYC verification by making a payment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="bg-blue-900/20 border-blue-700">
                    <AlertDescription className="text-blue-200">
                      You can bypass KYC verification by sending ${currentUser.kycRequirements?.bypassAmount} USDT to
                      the address below via TRC20 network.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Payment Amount</Label>
                      <div className="text-2xl font-bold text-green-400">
                        ${currentUser.kycRequirements?.bypassAmount} USDT
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">TRC20 Address</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex-1 p-3 bg-gray-800 rounded-lg font-mono text-white text-sm break-all">
                          {currentUser.kycRequirements?.trc20Address}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(currentUser.kycRequirements?.trc20Address || "")}
                          className="bg-gray-700 hover:bg-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      {addressCopied && <p className="text-green-400 text-sm mt-1">✅ Address copied to clipboard</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="paymentConfirm" checked={paymentConfirmed} onCheckedChange={setPaymentConfirmed} />
                      <Label htmlFor="paymentConfirm" className="text-white">
                        I confirm that I have sent the payment to the above address
                      </Label>
                    </div>

                    <Button
                      onClick={handlePaymentConfirmation}
                      disabled={!paymentConfirmed}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      ✅ Confirm Payment & Complete Verification
                    </Button>
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
