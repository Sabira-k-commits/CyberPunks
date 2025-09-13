import React, { useState } from "react";
import { Link } from "react-router-dom";


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter both email and password!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // ✅ Fake success response
      setStep("otp");
      setMessage("OTP has been sent to your email (demo only)");
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // ✅ Fake OTP check
      if (otp === "123456") {
        localStorage.setItem("authToken", "demo-token");
        localStorage.setItem("role", "User");

        setMessage("✅ Login successful!");
        window.location.href = "/confidential"; // demo redirect
      } else {
        setMessage("❌ Invalid OTP");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>

        {step === "login" && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp}>
            <p>Enter the 6-digit code sent to your email</p>
            <input
              type="text"
              placeholder="OTP (use 123456 for demo)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit" disabled={loading} className="verify-btn">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {message && (
          <p
            className={`mt-4 ${
              step === "otp" ? "message-error" : "message-success"
            }`}
          >
            {message}
          </p>
        )}

        <p className="redirect-link">
          {step === "login" ? (
            <>
              Don&apos;t have an account? <Link to="/register">Register here</Link>
            </>
          ) : (
            <>
              Back to{" "}
              <button
                type="button"
                onClick={() => setStep("login")}
                className="text-blue-500 font-bold"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
