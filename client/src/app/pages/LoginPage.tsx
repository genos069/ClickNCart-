import { getSession, saveSession, clearSession } from "../../services/session";

import { Link } from "react-router-dom";
import { Button } from "../components/ui/button.js";
import { Input } from "../components/ui/input.js";
import { Label } from "../components/ui/label.js";
import { ShoppingCart, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../services/authServices.js";

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Get user from localStorage
  const userInfo = getSession();

  useEffect(() => {
    if (userInfo?.token) {
      navigate("/profile");
    }
  }, [userInfo?.token, navigate]);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  // LOGIN STATE
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // SIGNUP STATE
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e: any) => {
    setLoginData({ ...loginData, [e.target.id.split("-")[1]]: e.target.value });
  };

  const handleSignupChange = (e: any) => {
    setSignupData({
      ...signupData,
      [e.target.id.split("-")[1]]: e.target.value,
    });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const { data } = await loginUser(loginData);

      // Save token
      saveSession(data);

      alert("Login successful ✅");

      navigate("/"); // redirect to home
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed ❌");
    }
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      return alert("Passwords do not match ❌");
    }

    try {
      const { data } = await registerUser({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });

      saveSession(data);

      alert("Account created ✅");

      navigate("/");
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="w-full max-w-6xl relative">
        {/* Main Container */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Login Form */}
            <div
              className={`${isSignUp ? "hidden lg:flex" : "flex"} items-center justify-center p-8 lg:p-12 transition-all duration-700 ${
                isSignUp ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <div
                className={`w-full max-w-md transition-all duration-700 ${
                  isSignUp
                    ? "lg:opacity-0 lg:invisible lg:translate-x-10"
                    : "lg:opacity-100 lg:visible lg:translate-x-0"
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

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        onChange={handleLoginChange}
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
                        onChange={handleLoginChange}
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

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => navigate("/forgot-password")}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12"
                  >
                    Sign In
                  </Button>
                </form>

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
              className={`${isSignUp ? "flex" : "hidden lg:flex"} items-center justify-center p-8 lg:p-12 transition-all duration-700 ${
                isSignUp ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <div
                className={`w-full max-w-md transition-all duration-700 ${
                  isSignUp
                    ? "lg:opacity-100 lg:visible lg:translate-x-0"
                    : "lg:opacity-0 lg:invisible lg:-translate-x-10"
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

                <form onSubmit={handleSignup} className="space-y-5">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        onChange={handleSignupChange}
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
                        onChange={handleSignupChange}
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
                        minLength={8}
                        maxLength={72}
                        type={showPassword ? "text" : "password"}
                        onChange={handleSignupChange}
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
                    <Label htmlFor="signup-confirm-password">
                      Confirm Password
                    </Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="signup-confirmPassword"
                        type={showPassword ? "text" : "password"}
                        onChange={handleSignupChange}
                        placeholder="••••••••"
                        className="pl-10 h-12 border-purple-200 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                  >
                    Create Account
                  </Button>
                </form>

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
                  isSignUp
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
              >
                {isSignUp && (
                  <div className="space-y-6">
                    <h2 className="text-4xl font-bold">Hello, Friend!</h2>
                    <p className="text-blue-100 text-lg">
                      Already have an account? Sign in to access your
                      personalized shopping experience.
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
                  !isSignUp
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }`}
              >
                {!isSignUp && (
                  <div className="space-y-6">
                    <h2 className="text-4xl font-bold">New Here?</h2>
                    <p className="text-blue-100 text-lg">
                      Create an account and discover amazing products tailored
                      just for you!
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
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Back to SmartShop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
