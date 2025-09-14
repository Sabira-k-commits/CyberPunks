import React, { useState, useEffect } from 'react';
import api from '../services/api';
import UserVer from './UserVer';
import BookMod from './BookMod';
import UserManagement from './UserManagement';

interface Stats {
  pendingVerifications: number;
  totalUsers: number;
  pendingBooks: number;
  totalBooks: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    pendingVerifications: 0,
    totalUsers: 0,
    pendingBooks: 0,
    totalBooks: 0
  });

  const [activeComponent, setActiveComponent] = useState<string>('dashboard');

  // ✅ Fetch stats from backend on load
  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/stats'); // make sure this route exists in backend
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
      case 'moderation':
        return <BookMod />;
      case 'users':
        return <UserManagement />;
      default:
        return (
          <>
            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3">
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
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Users</h5>
                    <h2 className="card-text">{stats.totalUsers}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-dark">
                  <div className="card-body">
                    <h5 className="card-title">Pending Books</h5>
                    <h2 className="card-text">{stats.pendingBooks}</h2>
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => setActiveComponent('moderation')}
                    >
                      Moderate
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Books</h5>
                    <h2 className="card-text">{stats.totalBooks}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header bg-dark text-white">
                    <h5>Recent Activity (mock)</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Alice Johnson</strong> - Account verified
                        </div>
                        <span className="text-muted">10 mins ago</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Bob Smith</strong> - Book listing approved
                        </div>
                        <span className="text-muted">30 mins ago</span>
                      </li>
                    </ul>
                  </div>
                </div>
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
                      onClick={() => setActiveComponent('moderation')}
                    >
                      Moderate Books
                    </button>
                    <button
                      className="btn btn-info w-100 mb-2"
                      onClick={() => setActiveComponent('users')}
                    >
                      Manage Users
                    </button>
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
                className={`btn ${activeComponent === 'moderation' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveComponent('moderation')}
              >
                Moderation
              </button>
              <button
                className={`btn ${activeComponent === 'users' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveComponent('users')}
              >
                Users
              </button>
            </div>
          </div>
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
