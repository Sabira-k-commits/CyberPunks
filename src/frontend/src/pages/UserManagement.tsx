import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  fullName: string;
  email: string;
  status: 'active' | 'suspended' | 'inactive';
  role: 'student' | 'admin';
  joined: string;
  lastActive: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // ✅ Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/users'); // <-- make sure this route exists in backend
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

  const updateUserStatus = async (id: string, status: 'active' | 'suspended' | 'inactive') => {
    try {
      await api.patch(`/api/admin/users/${id}/status`, { status }); // backend should handle this
      setUsers(users.map(user => 
        user._id === id ? { ...user, status } : user
      ));
    } catch (err) {
      console.error("❌ Failed to update user status:", err);
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
                  <td>
                    {user.fullName}
                    {user.role === 'admin' && <span className="badge bg-primary ms-1">Admin</span>}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      user.status === 'active' ? 'bg-success' : 
                      user.status === 'suspended' ? 'bg-danger' : 'bg-secondary'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.joined}</td>
                  <td>{user.lastActive}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-info btn-sm">
                        <i className="bi bi-eye me-1"></i> View
                      </button>
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => updateUserStatus(user._id, 'suspended')}
                        disabled={user.status === 'suspended'}
                      >
                        <i className="bi bi-slash-circle me-1"></i> Suspend
                      </button>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => updateUserStatus(user._id, 'active')}
                        disabled={user.status === 'active'}
                      >
                        <i className="bi bi-check-circle me-1"></i> Activate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Statistics */}
        <div className="mt-4">
          <h4>User Statistics</h4>
          <div className="row">
            <div className="col-md-3">
              <div className="card bg-success text-white text-center">
                <div className="card-body">
                  <h5 className="card-title">Active Users</h5>
                  <h3 className="card-text">
                    {users.filter(u => u.status === 'active').length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-danger text-white text-center">
                <div className="card-body">
                  <h5 className="card-title">Suspended Users</h5>
                  <h3 className="card-text">
                    {users.filter(u => u.status === 'suspended').length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-secondary text-white text-center">
                <div className="card-body">
                  <h5 className="card-title">Students</h5>
                  <h3 className="card-text">
                    {users.filter(u => u.role === 'student').length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-primary text-white text-center">
                <div className="card-body">
                  <h5 className="card-title">Admins</h5>
                  <h3 className="card-text">
                    {users.filter(u => u.role === 'admin').length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
