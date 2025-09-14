import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Step1: Password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setMessage("Please enter both email and password!");

    setLoading(true);
    setMessage("");
    try {
      const { data } = await api.post("/api/auth/login-step1", { email, password });

      // If MFA is enabled, backend returns { tempToken }
      if (data.tempToken) {
        sessionStorage.setItem("tempToken", data.tempToken);
        setStep("otp");
        setMessage("OTP has been sent to your email");
      } else {
        // MFA not enabled → directly log in
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("role", data.role || "User");
        setMessage("✅ Login successful!");
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else if (data.role === "user") {
          window.location.href = "/user-dashboard";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Step2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return setMessage("Please enter the OTP");

    setLoading(true);
    setMessage("");

    const tempToken = sessionStorage.getItem("tempToken");
    if (!tempToken) {
      setMessage("❌ Temp token missing. Please login again.");
      setStep("login");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post(
        "/api/auth/login-step2",
        { otp },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("role", data.role || "User");
      sessionStorage.removeItem("tempToken");
      setMessage("✅ Login successful!");

      if (data.role === "admin") {
        window.location.href = "/admin";
      } else if (data.role === "user") {
        window.location.href = "/user-dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-md-6 col-lg-4 mx-auto">
          <div className="card shadow">
            <div className="card-body p-4">
              <h1 className="card-title text-center mb-4">Login</h1>

              {step === "login" && (
                <form onSubmit={handleLogin}>
                  <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="User Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
              )}

              {step === "otp" && (
                <form onSubmit={handleVerifyOtp}>
                  <div className="alert alert-info">
                    <small>Enter the 6-digit code sent to your email</small>
                  </div>
                  <input
                    type="text"
                    className="form-control mb-3 text-center"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <button className="btn btn-success w-100" disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("login")}
                    className="btn btn-outline-secondary w-100 mt-2"
                  >
                    Back to Login
                  </button>
                </form>
              )}

              {message && (
                <div
                  className={`alert mt-3 ${
                    message.includes("✅") ? "alert-success" : "alert-danger"
                  }`}
                >
                  {message}
                </div>
              )}

              {step === "login" && (
                <p className="text-center text-muted mt-3">
                  Don't have an account? <Link to="/register">Register here</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
