import './App.css';
import InventoryHome from "./component/InventoryHome/InventoryHome";
import InventoryNav from './component/InventoryNav/InventoryNav';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import LowStockAlerts from "./component/LowStockAlerts/LowStockAlerts";
import MaintenanceLogs from "./component/MaintenanceLogs/MaintenanceLogs";
import StockTracking from "./component/StockTracking/StockTracking";
import UsageReports from "./component/UsageReports/UsageReports";
import InventoryDetails from "./component/InventoryDetails/InventoryDetails";
import AddInventory from "./component/AddInventory/AddInventory";
import UpdateInventory from './component/UpdateInventory/UpdateInventory';


function App() {
  return (
    <div>
      <InventoryNav></InventoryNav>
      <React.Fragment>
        <Routes>
        <Route path="/" element={<InventoryDetails/>}/>
        <Route path="/InventoryHome" element={<InventoryHome/>}/>
            
            <Route path="/LowStockAlerts" element={<LowStockAlerts/>}/>
            <Route path="/MaintenanceLogs" element={<MaintenanceLogs/>}/>
            <Route path="/StockTracking" element={<StockTracking/>}/>
            <Route path="/UsageReports" element={<UsageReports/>}/>
            <Route path="/InventoryDetails" element={<InventoryDetails/>}/>
            <Route path="/AddInventory" element={<AddInventory/>}/>
            <Route path="/AddInventory/:InventoryId" element={<UpdateInventory/>}/>
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
