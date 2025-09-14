// Leaderboard.tsx
import React from "react";

interface LeaderboardEntry {
  name: string;
  points: number;
}

// Mock data
const mockLeaderboard: LeaderboardEntry[] = [
  { name: "Tebatso Mahlathini", points: 120 },
  { name: "Alice Johnson", points: 95 },
  { name: "Bob Smith", points: 85 },
  { name: "Carol Williams", points: 75 },
  { name: "David Lee", points: 60 },
];

const Leaderboard: React.FC = () => {
  return (
    <div className="card mt-4">
      <div className="card-header bg-primary text-white">
        <h5>🏆 Leaderboard</h5>
      </div>
      <div className="card-body">
        <table className="table table-striped table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((user, index) => (
              <tr key={user.name}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
