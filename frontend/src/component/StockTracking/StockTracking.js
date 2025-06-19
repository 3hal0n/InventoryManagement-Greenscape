import React from 'react'
import InventoryNav from '../InventoryNav/InventoryNav'
import "./StockTracking.css";

const stockItems = [
  { name: "Organic Fertilizer", category: "Fertilizers", quantity: 200 },
  { name: "Rose Saplings", category: "Plants", quantity: 50 },
  { name: "Garden Shovel", category: "Tools", quantity: 30 },
];
function StockTracking() {
  return (
    <div className="stock-page">
      <InventoryNav />
      <main className="stock-content">
        <h1>Stock Tracking</h1>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map((item, index) => (
              <tr key={index} className="stock-row">
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default StockTracking
