import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ShoppingCart, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="w-full max-w-6xl relative">
        {/* Main Container */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Login Form */}
            <div
              className={`flex items-center justify-center p-8 lg:p-12 transition-all duration-700 ${
                isSignUp ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <div
                className={`w-full max-w-md transition-all duration-700 ${
                  isSignUp ? "lg:opacity-0 lg:invisible lg:translate-x-10" : "lg:opacity-100 lg:visible lg:translate-x-0"
                }`}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600">Sign in to continue shopping</p>
                </div>

                <form className="space-y-5">
                  <div>
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-12 border-blue-200 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-12 border-blue-200 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12"
                  >
                    Sign In
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12 border-blue-200 hover:bg-blue-50">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" className="h-12 border-blue-200 hover:bg-blue-50">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600 lg:hidden">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>

            {/* Sign Up Form */}
            <div
              className={`flex items-center justify-center p-8 lg:p-12 transition-all duration-700 ${
                isSignUp ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <div
                className={`w-full max-w-md transition-all duration-700 ${
                  isSignUp ? "lg:opacity-100 lg:visible lg:translate-x-0" : "lg:opacity-0 lg:invisible lg:-translate-x-10"
                }`}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Create Account
                  </h2>
                  <p className="text-gray-600">Join us and start shopping</p>
                </div>

                <form className="space-y-5">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 h-12 border-purple-200 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-12 border-purple-200 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-12 border-purple-200 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="signup-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 h-12 border-purple-200 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-4 h-4 mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="#" className="text-purple-600 hover:text-purple-700">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-purple-600 hover:text-purple-700">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                  >
                    Create Account
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12 border-purple-200 hover:bg-purple-50">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" className="h-12 border-purple-200 hover:bg-purple-50">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600 lg:hidden">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Sliding Overlay Panel */}
          <div
            className={`hidden lg:block absolute top-0 bottom-0 w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 transition-all duration-700 ease-in-out ${
              isSignUp ? "left-0 rounded-r-[40px]" : "left-1/2 rounded-l-[40px]"
            }`}
          >
            <div className="h-full flex items-center justify-center p-12 text-white">
              <div
                className={`text-center transition-all duration-700 ${
                  isSignUp ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
              >
                {isSignUp && (
                  <div className="space-y-6">
                    <h2 className="text-4xl font-bold">Hello, Friend!</h2>
                    <p className="text-blue-100 text-lg">
                      Already have an account? Sign in to access your personalized shopping experience.
                    </p>
                    <Button
                      onClick={() => setIsSignUp(false)}
                      variant="outline"
                      size="lg"
                      className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                    >
                      Sign In
                    </Button>
                    <div className="pt-8">
                      <div className="w-64 h-64 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-32 h-32 text-white/80" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`text-center transition-all duration-700 absolute ${
                  !isSignUp ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
              >
                {!isSignUp && (
                  <div className="space-y-6">
                    <h2 className="text-4xl font-bold">New Here?</h2>
                    <p className="text-blue-100 text-lg">
                      Create an account and discover amazing products tailored just for you!
                    </p>
                    <Button
                      onClick={() => setIsSignUp(true)}
                      variant="outline"
                      size="lg"
                      className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                    >
                      Sign Up
                    </Button>
                    <div className="pt-8">
                      <div className="w-64 h-64 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <User className="w-32 h-32 text-white/80" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Back to SmartShop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
