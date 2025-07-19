"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import html2canvas from "html2canvas"
import {
  Award,
  BarChart3,
  CreditCard,
  HelpCircle,
  LogOut,
  Menu,
  FileText,
  Wallet,
  CheckCircle,
  XCircle,
  Target,
} from "lucide-react"
import { PnlHubLogo } from "@/components/pnlhub-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
  achievedProfit: number
  passed: boolean
  isBanned?: boolean
  certificateOverrides?: {
    name?: string
    certificateNumber?: string
    accountSize?: number
  }
  certificates?: Certificate[]
  balance: number
  todaysPnL: number
  last7Days: number[]
}

export default function CertificatePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadMessage, setDownloadMessage] = useState("")
  const certificateRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  /* -------------------------------------------------------------------- */
  /*                            DATA HELPERS                              */
  /* -------------------------------------------------------------------- */

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser")
    if (!userStr) {
      router.push("/login")
      return
    }

    const user: User = JSON.parse(userStr)
    const usersStr = localStorage.getItem("users")
    if (usersStr) {
      const users: User[] = JSON.parse(usersStr)
      const freshUser = users.find((u) => u.email === user.email) || user
      setCurrentUser(freshUser)
      localStorage.setItem("currentUser", JSON.stringify(freshUser))
    } else {
      setCurrentUser(user)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const generateCertificateNumber = (): string => {
    const allCerts: Certificate[] = JSON.parse(localStorage.getItem("allCertificates") || "[]")
    return `PNL-${(allCerts.length + 1).toString().padStart(3, "0")}`
  }

  /** Creates & persists a certificate object, returning it */
  const createCertificate = (): Certificate | null => {
    if (!currentUser) return null

    const cert: Certificate = {
      id: `cert_${Date.now()}`,
      certificateNumber: currentUser.certificateOverrides?.certificateNumber || generateCertificateNumber(),
      userName: currentUser.certificateOverrides?.name || currentUser.name || currentUser.email.split("@")[0],
      accountSize: currentUser.certificateOverrides?.accountSize || currentUser.initialBalance,
      dateIssued: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      dateGenerated: new Date().toISOString(),
    }

    /* persist certificate in user & global store */
    const usersStr = localStorage.getItem("users")
    if (usersStr) {
      const users: User[] = JSON.parse(usersStr)
      const idx = users.findIndex((u) => u.email === currentUser.email)
      if (idx !== -1) {
        users[idx].certificates = [...(users[idx].certificates || []), cert]
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("currentUser", JSON.stringify(users[idx]))
        setCurrentUser(users[idx])
      }
    }
    const all = JSON.parse(localStorage.getItem("allCertificates") || "[]")
    all.push(cert)
    localStorage.setItem("allCertificates", JSON.stringify(all))

    return cert
  }

  const downloadCertificate = async () => {
    if (!certificateRef.current || !currentUser) return
    setIsGenerating(true)
    setDownloadMessage("")
    try {
      const cert = createCertificate()
      await new Promise((r) => setTimeout(r, 300))

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      })
      const link = document.createElement("a")
      link.download = `PnlHUB_Certificate_${cert?.certificateNumber}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
      setDownloadMessage("✅ Certificate downloaded successfully!")
    } catch {
      setDownloadMessage("❌ Error generating certificate. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  /* -------------------------------------------------------------------- */
  /*                         RENDER EARLY STATES                          */
  /* -------------------------------------------------------------------- */

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (currentUser.isBanned) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-red-700">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-4">Account Banned</h2>
            <p className="text-red-200 mb-2">Your account has been banned. Contact support for assistance.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasPassedTarget = currentUser.passed || currentUser.achievedProfit >= currentUser.profitTarget
  const progressPercent =
    currentUser.profitTarget > 0 ? Math.min((currentUser.achievedProfit / currentUser.profitTarget) * 100, 100) : 0

  /* -------------------------------------------------------------------- */
  /*                               RENDER                                 */
  /* -------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-black flex">
      {/* ---------------------------  SIDEBAR  --------------------------- */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <PnlHubLogo size="md" />
        </div>
        <nav className="mt-8 px-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link
            href="/payout"
            className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
          >
            <CreditCard className="h-5 w-5 mr-3" />
            Payout
          </Link>
          <Link
            href="/withdrawal"
            className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
          >
            <Wallet className="h-5 w-5 mr-3" />
            Withdrawal
          </Link>
          <Link href="/certificate" className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg">
            <Award className="h-5 w-5 mr-3" />
            Certificate
          </Link>
          <Link
            href="/kyc"
            className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
          >
            <FileText className="h-5 w-5 mr-3" />
            KYC Verification
          </Link>
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
          >
            <HelpCircle className="h-5 w-5 mr-3" />
            Support
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* -------------------------- MAIN AREA --------------------------- */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen((p) => !p)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-white ml-4 lg:ml-0">Certificate</h1>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 max-w-6xl mx-auto space-y-8">
          {/* Eligibility Card */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Award className="h-6 w-6" />
                <span>Certificate Status</span>
              </CardTitle>
              <CardDescription className="text-slate-400">Your trading achievement certificate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-6 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  {hasPassedTarget ? (
                    <CheckCircle className="h-12 w-12 text-green-400" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-400" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {hasPassedTarget ? "Certificate Available" : "Certificate Not Available"}
                    </h3>
                    <p className="text-slate-400">
                      {hasPassedTarget
                        ? "Congratulations! You've achieved your profit target."
                        : `Achieve your profit target of $${currentUser.profitTarget.toLocaleString()} to unlock your certificate.`}
                    </p>
                  </div>
                </div>
                <Badge className={`text-lg px-4 py-2 ${hasPassedTarget ? "bg-green-600" : "bg-slate-600"}`}>
                  {hasPassedTarget ? "Eligible ✅" : "Not Eligible ❌"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card (only if not passed) */}
          {!hasPassedTarget && (
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Target className="h-5 w-5" />
                  <span>Progress to Certificate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Target: ${currentUser.profitTarget.toLocaleString()}</span>
                    <span className="text-slate-400">Achieved: ${currentUser.achievedProfit.toLocaleString()}</span>
                    <span className="font-medium text-white">{progressPercent.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certificate Preview + Download */}
          {hasPassedTarget && (
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Award className="h-5 w-5" />
                  <span>Your Certificate</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* CERTIFICATE CANVAS / PREVIEW */}
                <div
                  ref={certificateRef}
                  className="certificate-container relative mx-auto w-full max-w-xl aspect-[4/3] bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-cyan-100 opacity-20" />
                  <div className="relative z-10 text-center px-8">
                    <h2 className="text-3xl font-bold mb-4">Certificate of Achievement</h2>
                    <p className="text-lg mb-2">
                      This certifies that{" "}
                      <span className="font-semibold">
                        {currentUser.certificateOverrides?.name || currentUser.name || currentUser.email.split("@")[0]}
                      </span>
                    </p>
                    <p className="mb-4">has successfully achieved</p>
                    <p className="text-2xl font-bold mb-6">the Profit Target Requirement</p>
                    <p className="text-sm">
                      Certificate No: {currentUser.certificateOverrides?.certificateNumber || "Pending"}
                    </p>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="space-y-4 text-center">
                  <Button
                    onClick={downloadCertificate}
                    disabled={isGenerating}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isGenerating ? "Generating..." : "Download Certificate"}
                  </Button>
                  {downloadMessage && (
                    <p className={`text-sm ${downloadMessage.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>
                      {downloadMessage}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
