import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaLock,
  FaEnvelope,
  FaShieldAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaKey,
  FaRedoAlt,
  FaEye,
  FaEyeSlash,
  FaPaw
} from "react-icons/fa";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const ForgotPassword = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Step 1: email, Step 2: otp, Step 3: new-password, Step 4: success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes timer
  const [resendCooldown, setResendCooldown] = useState(30);

  const otpInputsRef = useRef([]);

  // Timer countdown for OTP
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Resend cooldown timer
  useEffect(() => {
    let cooldownTimer;
    if (step === 2 && resendCooldown > 0) {
      cooldownTimer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(cooldownTimer);
  }, [step, resendCooldown]);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email) {
      Swal.fire("Required", "Please enter your registered email address.", "warning");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosPublic.post("/send-otp", { email });
      if (res.data.success) {
        setStep(2);
        setCountdown(300);
        setResendCooldown(30);
        Swal.fire({
          title: "Code Dispatched! ✉️",
          text: `A 6-digit verification code has been sent to ${email}.`,
          icon: "success",
          confirmButtonColor: "#FBAE02",
        });
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || "Failed to dispatch OTP.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: OTP Input change handler with auto-advance
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // numbers only

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1); // only 1 char
    setOtpDigits(newDigits);

    // Auto advance
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    const nextIndex = Math.min(pasted.length, 5);
    otpInputsRef.current[nextIndex]?.focus();
  };

  // Verify OTP submit
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      Swal.fire("Incomplete Code", "Please enter the complete 6-digit code.", "warning");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosPublic.post("/verify-otp", {
        email,
        otp: fullOtp,
      });

      if (res.data.success) {
        setResetToken(res.data.resetToken);
        setStep(3);
        Swal.fire({
          title: "Verified! 🛡️",
          text: "Verification code confirmed. Now create your new password.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire("Verification Failed", err.response?.data?.error || "Invalid or expired code.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password submit
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      Swal.fire("Too Short", "Password must be at least 6 characters.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire("Mismatch", "New password and confirmation do not match.", "warning");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosPublic.post("/reset-password", {
        resetToken,
        newPassword,
      });

      if (res.data.success) {
        setStep(4);
      }
    } catch (err) {
      Swal.fire("Reset Failed", err.response?.data?.error || "Could not update password.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <Helmet>
        <title>Reset Password || PeddyCare</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden"
      >
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <span className="w-10 h-10 rounded-2xl bg-[#171717] text-[#FBAE02] flex items-center justify-center text-lg font-black shadow-xs">
              <FaPaw />
            </span>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              Peddy<span className="text-[#FBAE02]">Care</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Account Recovery
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {step === 1 && "Enter your email to receive a 6-digit OTP code."}
            {step === 2 && `Enter the 6-digit code sent to ${email}.`}
            {step === 3 && "Create a secure, strong new password for your account."}
            {step === 4 && "Your password has been reset successfully!"}
          </p>
        </div>

        {/* STEP 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-black text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? "Dispatching OTP..." : "Send Verification Code"}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition"
              >
                <FaArrowLeft className="text-[10px]" /> Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: 6-Digit OTP Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* 6 Digit Input Boxes */}
            <div
              className="flex justify-between gap-2 sm:gap-3"
              onPaste={handleOtpPaste}
            >
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-12 h-14 sm:w-13 sm:h-16 text-center text-xl font-black text-gray-900 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FBAE02] focus:bg-white transition"
                />
              ))}
            </div>

            {/* Timer & Resend */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-gray-400 font-semibold flex items-center gap-1">
                Expires in:{" "}
                <span className="font-mono font-black text-amber-600">
                  {formatTime(countdown)}
                </span>
              </span>

              <button
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={handleSendOtp}
                className="font-bold text-[#FBAE02] hover:underline disabled:opacity-40 disabled:no-underline"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Code"}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpDigits.join("").length !== 6}
              className="w-full py-3.5 rounded-2xl bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-black text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-gray-400 hover:text-black transition"
              >
                Change Email Address
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: New Password Form */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-black text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
            >
              {isLoading ? "Saving Password..." : "Set New Password"}
            </button>
          </form>
        )}

        {/* STEP 4: Success Message */}
        {step === 4 && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl">
              <FaCheckCircle />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">
                Password Successfully Reset!
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Your account is now secured with your new password. You can now login.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3.5 rounded-2xl bg-[#171717] hover:bg-black text-[#FBAE02] hover:text-white font-black text-xs uppercase tracking-wider transition shadow-md"
            >
              Proceed to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
