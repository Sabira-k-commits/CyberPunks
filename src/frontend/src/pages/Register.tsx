import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !surname || !email || !password || !confirmPassword) {
      setMessage("All fields are required!");
      return;
    }
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email!");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setMessage("✅ Registration successful! (local only, no API call)");
    setName("");
    setSurname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-md-6 col-lg-4 mx-auto">
          <div className="card shadow">
            <div className="card-body p-4">
              <h1 className="card-title text-center mb-4">Register</h1>
              
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Surname"
                    value={surname}
                    onChange={e => setSurname(e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="University Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Register
                </button>
              </form>
              
              {message && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
              
              <p className="text-center text-muted">
                Already have an account? <Link to="/login" className="text-decoration-none">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;