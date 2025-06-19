import React from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import "./InventoryNav.css";

function InventoryNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isManager } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className="inventory-nav">
        
        <ul>
          <li>
            <li>
            <NavLink 
              to="/Dashboard"
              className={`nav-link ${isActive('/Dashboard') ? 'active' : ''}`} 
              
            >
              <span className="icon">📦</span> Dashboard
            </NavLink>
          </li>

            <NavLink 
              to="/InventoryDetails" 
              className={`nav-link ${isActive('/InventoryDetails') ? 'active' : ''}`}
            >
              <span className="icon">📦</span> Inventory Details
            </NavLink>
          </li>

          {(isAdmin || isManager) && (
            <>
              <li>
                <NavLink 
                  to="/LowStockAlerts" 
                  className={`nav-link ${isActive('/LowStockAlerts') ? 'active' : ''}`}
                >
                  <span className="icon warning">⚠️</span> Low-Stock Alerts
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to="/MaintenanceLogs" 
                  className={`nav-link ${isActive('/MaintenanceLogs') ? 'active' : ''}`}
                >
                  <span className="icon">🛠️</span> Maintenance Logs
                </NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink 
              to="/UsageReports" 
              className={`nav-link ${isActive('/UsageReports') ? 'active' : ''}`}
            >
              <span className="icon">📊</span> Usage Reports
            </NavLink>
          </li>

          {(isAdmin || isManager) && (
            <li>
              <NavLink 
                to="/AddInventory" 
                className={`nav-link ${isActive('/AddInventory') ? 'active' : ''}`}
              >
                <span className="icon">➕</span> Add Inventory
              </NavLink>
            </li>
          )}

          <li>
            {user && (
            <div className="user-section">
              <span className="icon">
                {user.username} ({user.role})
              </span>
              
            </div>
          )}
          </li>
          <li>
            <button onClick={handleLogout} className="icon">
                Logout
              </button>
          </li>
          
        </ul>
      </nav>
    </div>
  );
}

export default InventoryNav;