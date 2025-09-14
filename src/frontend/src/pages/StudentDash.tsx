// components/StudentDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BookMarket from './BookMarket'
import SellBKForm from './SellBKForm';
import MyListing from './MyListing';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const hash = location.hash.substring(1);
    if (hash) setActiveTab(hash);
  }, [location]);

  const renderContent = () => {
    switch(activeTab) {
      case 'marketplace': return <BookMarket />;
      case 'sell': return <SellBKForm />; //to sell books online
      case 'my-books': return <MyListing />; // users books
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Student Marketplace</h1>
            <div className="btn-group">
              {['dashboard', 'marketplace', 'sell', 'my-books'].map(tab => (
                <button
                  key={tab}
                  className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => {
                    setActiveTab(tab);
                    window.location.hash = tab;
                  }}
                >
                  {tab.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const DashboardHome: React.FC = () => (
  <div>
    <div className="row">
      <div className="col-md-4">
        <div className="card bg-primary text-white">
          <div className="card-body text-center">
            <h5>Books Available</h5>
            <h2>24</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card bg-success text-white">
          <div className="card-body text-center">
            <h5>My Listings</h5>
            <h2>3</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card bg-info text-white">
          <div className="card-body text-center">
            <h5>Messages</h5>
            <h2>2</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default StudentDashboard;