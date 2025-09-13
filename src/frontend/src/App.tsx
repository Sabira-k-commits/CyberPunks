import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";



const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Default to login */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />    
      </Routes>
    </Router>
  );
};

export default App;
