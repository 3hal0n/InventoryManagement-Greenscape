import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import InventoryNav from "../InventoryNav/InventoryNav";

function Dashboard() {
    const { user, isAdmin, isManager } = useAuth();

    return (
        <div className="dashboard">
            <InventoryNav />
            <h1>Welcome, {user?.username}!</h1>
            
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                        {(isAdmin || isManager) && (
                            <Link to="/InventoryDetails" className="action-button">
                                Manage Inventory
                            </Link>
                        )}
                        {(isAdmin || isManager) && (
                            <Link to="/LowStockAlerts" className="action-button">
                                Low Stock Alerts
                            </Link>
                        )}
                        <Link to="/UsageReports" className="action-button">
                            View Usage Reports
                        </Link>
                        {(isAdmin || isManager) && (
                            <Link to="/MaintenanceLogs" className="action-button">
                                Maintenance Reports
                            </Link>
                        )}
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>User Information</h3>
                    <div className="user-details">
                        <p><strong>Role:</strong> {user?.role}</p>
                        <p><strong>Department:</strong> {user?.department}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>System Status</h3>
                    <div className="system-status">
                        <p>All systems operational</p>
                        <p>Last updated: {new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 