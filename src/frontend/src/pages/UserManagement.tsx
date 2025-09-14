import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  fullName: string;
  email: string;
  status: 'active' | 'suspended' | 'inactive';
  role: 'user' | 'admin';
  joined: string;
  lastActive: string;
}

interface Activity {
  _id: string;
  user: string;
  action: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Activity modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityLoading, setActivityLoading] = useState<boolean>(false);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/users'); 
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update status
  const updateUserStatus = async (id: string, status: 'active' | 'suspended' | 'inactive') => {
    try {
      await api.patch(`/api/admin/users/${id}/status`, { status });
      setUsers(users.map(user => user._id === id ? { ...user, status } : user));
    } catch (err) {
      console.error("❌ Failed to update user status:", err);
    }
  };

  // Fetch user activity
  const fetchUserActivity = async (user: User) => {
    setSelectedUser(user);
    setActivityLoading(true);
    setShowModal(true);
    try {
      const res = await api.get(`/api/admin/users/${user._id}/activity`); 
      setActivities(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch activity:", err);
    } finally {
      setActivityLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="card">
      <div className="card-header bg-info text-white">
        <h2>User Management</h2>
        <p className="mb-0">Total Users: {users.length}</p>
      </div>
      <div className="card-body">
        {/* Search + Filter */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <select 
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{user.joined}</td>
                  <td>{user.lastActive}</td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-info btn-sm"
                        onClick={() => fetchUserActivity(user)}
                      >
                        View
                      </button>
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => updateUserStatus(user._id, 'suspended')}
                        disabled={user.status === 'suspended'}
                      >
                        Suspend
                      </button>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => updateUserStatus(user._id, 'active')}
                        disabled={user.status === 'active'}
                      >
                        Activate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity Modal */}
        {showModal && selectedUser && (
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedUser.fullName}'s Activity</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  {activityLoading ? (
                    <p>Loading activity...</p>
                  ) : activities.length === 0 ? (
                    <p>No recent activity found.</p>
                  ) : (
                    <ul className="list-group">
                      {activities.map(act => (
                        <li key={act._id} className="list-group-item">
                          <strong>{new Date(act.createdAt).toLocaleString()}:</strong> {act.action}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserManagement;
