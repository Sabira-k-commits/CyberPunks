import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserVer from "./pages/UserVer";


const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Default to login */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} /> 

      {/*/routing  for AdminDashboard*/}

    <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/login/AdminDashboard" element={<Navigate to="/admin" replace />} />

    {/*/routing  for User verification*/}
     <Route path="/verify/*" element={<UserVer />} />
          <Route path="/AdminDashboard/UserVer" element={<Navigate to="/verify" replace />} />
        </Routes>
      </Router>
  );
};

export default App;
