import React, { useEffect, useState } from 'react';
import api from '../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Activity {
  _id: string;
  user: string;
  action: string;
  createdAt: string;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/activity');
      setActivities(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch activity:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  if (loading) return <p>Loading activity...</p>;

  return (
    <div className="card">
      <div className="card-header bg-dark text-white">
        <h5>Recent Activity</h5>
      </div>
      <div className="card-body">
        {activities.length === 0 ? (
          <div className="alert alert-info">No recent activity</div>
        ) : (
          <ul className="list-group">
            {activities.map(a => (
              <li key={a._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{a.user}</strong> - {a.action}
                </div>
                <span className="text-muted">{dayjs(a.createdAt).fromNow()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
