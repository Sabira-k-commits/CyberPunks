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
    <div className="register-container">
      <div className="register-card">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={e => setSurname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <br />
          <button type="submit">Register</button>
        </form>
        {message && <p className="message-error">{message}</p>}
        <p className="redirect-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
