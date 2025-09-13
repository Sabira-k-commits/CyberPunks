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
      if (otp === "123456") {
        localStorage.setItem("authToken", "demo-token");
        localStorage.setItem("role", "User");
        setMessage("✅ Login successful!");
        window.location.href = "/confidential";
      } else {
        setMessage("❌ Invalid OTP");
      }
      setLoading(false);
    }, 1000);
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
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="University Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn btn-primary w-100"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
              )}

              {step === "otp" && (
                <form onSubmit={handleVerifyOtp}>
                  <div className="alert alert-info">
                    <small>Enter the 6-digit code sent to your email</small>
                  </div>
                  
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control text-center"
                      placeholder="Enter OTP (use 123456 for demo)"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn btn-success w-100"
                  >
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
                <div className={`alert mt-3 ${
                  message.includes('✅') ? 'alert-success' : 
                  message.includes('sent') ? 'alert-info' : 'alert-danger'
                }`}>
                  {message}
                </div>
              )}

              {step === "login" && (
                <p className="text-center text-muted mt-3">
                  Don't have an account? <Link to="/register" className="text-decoration-none">Register here</Link>
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