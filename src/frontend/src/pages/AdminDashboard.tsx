import React, { useState, useEffect } from 'react';
import UserVer from './UserVer';
import BookMod from './BookMod';
import UserManagement from './UserManagement';

interface Stats {
  pendingVerifications: number;
  totalUsers: number;
  pendingBooks: number;
  totalBooks: number;
}

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    pendingVerifications: 12,
    totalUsers: 245,
    pendingBooks: 8,
    totalBooks: 1523
  });

  const [recentActivity] = useState<Activity[]>([
    { id: 1, user: "Alice Johnson", action: "Account verified", time: "10 mins ago" },
    { id: 2, user: "Bob Smith", action: "Book listing approved", time: "30 mins ago" },
    { id: 3, user: "Charlie Brown", action: "Account registered", time: "1 hour ago" }
  ]);

 const [activeComponent, setActiveComponent] = useState<string>('dashboard');
 

  const renderComponent = () => {
    switch(activeComponent) {
      case 'verification':
        return <UserVer />;
      case 'moderation':
        return <BookMod/>;
      case 'users':
        return <UserManagement />;
      default:
        ///BOOTStrap
        return (
          <>
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

            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header bg-dark text-white">
                    <h5>Recent Activity</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group">
                      {recentActivity.map(activity => (
                        <li key={activity.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{activity.user}</strong> - {activity.action}
                          </div>
                          <span className="text-muted">{activity.time}</span>
                        </li>
                      ))}
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