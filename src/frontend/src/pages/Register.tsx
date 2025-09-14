import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/api/auth/register", formData);
      setMessage("✅ Registration successful! Await admin approval.");
      setFormData({
        fullName: "",
        email: "",
        password: "",
   
      });
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
              <h1 className="card-title text-center mb-4">Register</h1>

              <form onSubmit={handleRegister}>
                {Object.keys(formData).map((key) => (
                  <input
                    key={key}
                    type={key === "password" ? "password" : "text"}
                    name={key}
                    className="form-control mb-3"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleChange}
                  />
                ))}

                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>

              {message && (
                <div className={`alert mt-3 ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>
                  {message}
                </div>
              )}

              <p className="text-center text-muted mt-3">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
