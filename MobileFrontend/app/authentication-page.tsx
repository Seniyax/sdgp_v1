"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  // State for form inputs
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, you would call your authentication API here
      console.log("Signing in with:", email, password)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("Successfully signed in!")
      // In a real app, you would redirect to a dashboard or home page
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, you would call your registration API here
      console.log("Signing up with:", name, email, password)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("Account created successfully!")
      // In a real app, you would redirect to a dashboard or home page
    } catch (err) {
      setError("Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle password reset
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, you would call your password reset API here
      console.log("Password reset for:", email)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setResetEmailSent(true)
    } catch (err) {
      setError("Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle social login
  const handleSocialLogin = (provider: string) => {
    console.log(`Signing in with ${provider}`)
    // In a real app, you would redirect to the OAuth provider
  }

  // Render forgot password form
  if (showForgotPassword) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-start bg-white p-4 md:p-8">
        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-[#420F54] md:text-5xl">SlotZi</h1>
        </div>

        {/* Animation Container (placeholder) */}
        <div className="mb-8 flex h-64 w-full max-w-md items-center justify-center rounded-2xl bg-[#F3E4FF]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#420F54"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        {/* Text Section */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#272D2F] md:text-4xl">Forgot Password</h2>
          <p className="mt-2 text-sm text-[#420F54] md:text-base">
            "Don't worry! Enter your email and we'll send you a reset link."
          </p>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-md">
          {!resetEmailSent ? (
            <div className="rounded-lg bg-white p-6 shadow-md">
              {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">{error}</div>}
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl border-[#F3E4FF] bg-[#F3E4FF] px-4"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-[#420F54] text-white hover:bg-[#5a2173]"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <div className="text-center">
                  <button type="button" onClick={() => setShowForgotPassword(false)} className="text-sm text-[#420F54]">
                    Back to login
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mb-4 text-5xl">✉️</div>
              <h2 className="mb-2 text-xl font-semibold text-[#272D2F]">Check your email</h2>
              <p className="mb-4 text-gray-600">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
              <Button
                onClick={() => {
                  setResetEmailSent(false)
                  setEmail("")
                }}
                variant="outline"
                className="mt-2 w-full rounded-xl border-[#420F54] text-[#420F54] hover:bg-[#F3E4FF]"
              >
                Try another email
              </Button>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetEmailSent(false)
                  }}
                  className="text-sm text-[#420F54]"
                >
                  Back to login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Main authentication page
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-white p-4 md:p-8">
      {/* Logo */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-[#420F54] md:text-5xl">SlotZi</h1>
      </div>

      {/* Animation Container (placeholder) */}
      <div className="mb-8 flex h-64 w-full max-w-md items-center justify-center rounded-2xl bg-[#F3E4FF]">
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#420F54"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <div className="mt-4 text-xl font-bold text-[#420F54]">Welcome to SlotZi</div>
        </div>
      </div>

      {/* Text Section */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-[#272D2F] md:text-3xl">Join SlotZi Today</h2>
        <p className="mt-2 text-sm text-[#420F54] md:text-base">
          "Sign in or create an account to start managing your slots with style!"
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 w-full max-w-md rounded-lg bg-green-50 p-3 text-center text-sm text-green-600">
          {success}
        </div>
      )}

      {/* Auth Tabs */}
      <div className="w-full max-w-md">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#F3E4FF]">
            <TabsTrigger value="signin" className="text-[#420F54]">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-[#420F54]">
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Sign In Form */}
          <TabsContent value="signin">
            <div className="rounded-lg bg-white p-6 shadow-md">
              {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">{error}</div>}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl border-[#F3E4FF] bg-[#F3E4FF] px-4"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-xl border-[#F3E4FF] bg-[#F3E4FF] px-4"
                  />
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-[#420F54]">
                    Forgot password?
                  </button>
                </div>
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-[#420F54] text-white hover:bg-[#5a2173]"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In to SlotZi"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white"
                    onClick={() => handleSocialLogin("Google")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white"
                    onClick={() => handleSocialLogin("Facebook")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="#1877F2"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white"
                    onClick={() => handleSocialLogin("Apple")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="#000000"
                        d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.92 12.29 4.24 17.2 6 19.9c.89 1.29 1.93 2.74 3.29 2.69s1.82-.89 3.39-.89 2 .89 3.4.87 2.28-1.27 3.13-2.57a11 11 0 0 0 1.41-2.9 4.39 4.39 0 0 1-2.66-4.47z"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Sign Up Form */}
          <TabsContent value="signup">
            <div className="rounded-lg bg-white p-6 shadow-md">
              {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">{error}</div>}
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 rounded-xl border-[#F3E4FF] bg-[#F3E4FF] px-4"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl border-[#F3E4FF] bg-[#F3E4FF] px-4"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-xl border-[#F3E4FF] bg-[#F3E4FF] px-4"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-[#420F54] text-white hover:bg-[#5a2173]"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Join SlotZi"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white"
                    onClick={() => handleSocialLogin("Google")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white"
                    onClick={() => handleSocialLogin("Facebook")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="#1877F2"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white"
                    onClick={() => handleSocialLogin("Apple")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="#000000"
                        d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.92 12.29 4.24 17.2 6 19.9c.89 1.29 1.93 2.74 3.29 2.69s1.82-.89 3.39-.89 2 .89 3.4.87 2.28-1.27 3.13-2.57a11 11 0 0 0 1.41-2.9 4.39 4.39 0 0 1-2.66-4.47z"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} SlotZi. All rights reserved.</p>
      </div>
    </div>
  )
}

