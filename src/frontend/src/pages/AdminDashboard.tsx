import React, { useState, useEffect } from 'react';
import api from '../services/api';
import UserVer from './UserVer';
import UserManagement from './UserManagement';
import RecentActivity from '../components/RecentActivity';
import Leaderboard from '../components/LeaderBoard';

interface Stats {
  pendingVerifications: number;
  totalUsers: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    pendingVerifications: 0,
    totalUsers: 0
  });

  const [activeComponent, setActiveComponent] = useState<string>('dashboard');

  // ✅ Fetch stats from backend on load
  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ✅ When user is verified, update counts
  const handleUserVerified = () => {
    setStats(prev => ({
      ...prev,
      pendingVerifications: Math.max(prev.pendingVerifications - 1, 0),
      totalUsers: prev.totalUsers + 1,
    }));
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'verification':
        return <UserVer onVerified={handleUserVerified} />;
      case 'users':
        return <UserManagement />;
      case 'add-phishing':
        return <AddPhishingEmail />;
      case 'add-quiz':
        return <AddQuiz />;
      default:
        return (
          <>
            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h5 className="card-title">Pending Verifications</h5>
                    <h2 className="card-text">{stats.pendingVerifications}</h2>
                    <button
                      className="btn btn-light btn-sm"
                      onClick={() => setActiveComponent('verification')}
                    >
                      Review Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Users</h5>
                    <h2 className="card-text">{stats.totalUsers}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row">
              <div className="col-md-8">
                <RecentActivity />
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header bg-dark text-white">
                    <h5>Quick Actions</h5>
                  </div>
                  <div className="card-body">
                    <button
                      className="btn btn-primary w-100 mb-2"
                      onClick={() => setActiveComponent('verification')}
                    >
                      Verify Users
                    </button>
                    <button
                      className="btn btn-warning w-100 mb-2"
                      onClick={() => setActiveComponent('add-phishing')}
                    >
                      Add Phishing Email
                    </button>
                    <button
                      className="btn btn-info w-100 mb-2"
                      onClick={() => setActiveComponent('add-quiz')}
                    >
                      Add Security Quiz
                    </button>
                    <button
                      className="btn btn-secondary w-100 mb-2"
                      onClick={() => setActiveComponent('users')}
                    >
                      Manage Users
                    </button>
                  </div>
                </div>

                {/* Leaderboard */}
                <div className="card mt-3">
                  <div className="card-header bg-light text-dark">
                    <h5>Leaderboard</h5>
                  </div>
                  <div className="card-body p-0">
                    <Leaderboard />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Admin Dashboard</h1>
            <div className="btn-group">
              <button
                className={`btn ${activeComponent === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveComponent('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`btn ${activeComponent === 'verification' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveComponent('verification')}
              >
                Verification
              </button>
              <button
                className={`btn ${activeComponent === 'users' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveComponent('users')}
              >
                Users
              </button>
              <button
                className={`btn ${activeComponent === 'add-phishing' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveComponent('add-phishing')}
              >
                Add Phishing
              </button>
              <button
                className={`btn ${activeComponent === 'add-quiz' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveComponent('add-quiz')}
              >
                Add Quiz
              </button>
            </div>
          </div>
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

// Placeholder components for AddPhishingEmail and AddQuiz
const AddPhishingEmail: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<"true" | "false">("true");
  const [message, setMessage] = useState("");

  const handleAdd = async () => {
    if (!question) return setMessage("❌ Question cannot be empty.");
    try {
      await api.post("/api/admin/phishing", { question, answer: answer === "true" });
      setMessage("✅ Phishing email added!");
      setQuestion("");
      setAnswer("true");
    } catch (err: any) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm border-primary">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Add Phishing Email</h5>
          </div>
          <div className="card-body">
            <textarea
              className="form-control mb-2"
              placeholder="Enter phishing email content..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              rows={3}
            />
            <select
              className="form-select mb-2"
              value={answer}
              onChange={e => setAnswer(e.target.value as "true" | "false")}
            >
              <option value="true">Phishing</option>
              <option value="false">Safe</option>
            </select>
            <button className="btn btn-primary w-100" onClick={handleAdd}>
              Add Email
            </button>
            {message && (
              <div className={`alert mt-2 ${message.includes("✅") ? "alert-success" : "alert-warning"}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple placeholder for adding quizzes
const AddQuiz: React.FC = () => (
  <div className="row justify-content-center">
    <div className="col-md-8 col-lg-6">
      <div className="card shadow-sm border-info">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Add Security Quiz</h5>
        </div>
        <div className="card-body">
          <p>Feature to add quizzes coming soon!</p>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
