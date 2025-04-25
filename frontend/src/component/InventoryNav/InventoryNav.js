import React from 'react';
import { NavLink, useLocation } from "react-router-dom";
import "./InventoryNav.css";

function InventoryNav() {
  const location = useLocation();

  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div>
      <nav className="inventory-nav">
        <ul>
          <li>
            <NavLink 
              to="/InventoryDetails" 
              className={`nav-link ${isActive('/InventoryDetails') ? 'active' : ''}`}
            >
              <span className="icon">📦</span> Dashboard
            </NavLink>
          </li>

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

          <li>
            <NavLink 
              to="/UsageReports" 
              className={`nav-link ${isActive('/UsageReports') ? 'active' : ''}`}
            >
              <span className="icon">📊</span> Usage Reports
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/AddInventory" 
              className={`nav-link ${isActive('/AddInventory') ? 'active' : ''}`}
            >
              <span className="icon">➕</span> Add Inventory
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default InventoryNav;