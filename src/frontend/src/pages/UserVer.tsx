import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  points: number;
}

interface Props {
  onVerified?: () => void;
  onDenied?: () => void; // optional callback for denied users
}

const UserVer: React.FC<Props> = ({ onVerified, onDenied }) => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch pending users
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/users/pending');
      setPendingUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch pending users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Verify a user
  const handleVerify = async (id: string) => {
    try {
      await api.patch(`/api/admin/verify/${id}`);
      setPendingUsers(prev => prev.filter(u => u._id !== id));
      onVerified?.(); // update dashboard stats if callback provided
    } catch (err) {
      console.error("❌ Failed to verify user:", err);
    }
  };

  // Deny a user
  const handleDeny = async (id: string) => {
    try {
      await api.patch(`/api/admin/users/${id}/deny`);
      setPendingUsers(prev => prev.filter(u => u._id !== id));
      onDenied?.();
    } catch (err) {
      console.error("❌ Failed to deny user:", err);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  if (loading) return <p>Loading pending users...</p>;

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h2>Pending Users: {pendingUsers.length}</h2>
      </div>
      <div className="card-body">
        {pendingUsers.length === 0 ? (
          <div className="alert alert-success">No pending users!</div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Points</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map(u => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                  <td>{u.points}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleVerify(u._id)}
                    >
                      Verify
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeny(u._id)}
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserVer;
