import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateInventory.css';

function UpdateInventory() {
  const [inputs, setInputs] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { InventoryId } = useParams();

  const categories = [
    "Vehicles & Machinery",
    "Construction & Maintenance Supplies",
    "Gardening Tools & Equipment",
    "Pesticides & Herbicides",
    "Other"
  ];

  const maintenanceSchedules = ["Every Day", "Every Week", "Every Month"];

  // Fetch inventory data by ID
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/inventories/${InventoryId}`);
        setInputs(res.data.inventory);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setLoading(false);
      }
    };
    fetchInventory();
  }, [InventoryId]);

  // Input validation: Only allow letters, numbers, space, dash, period
  const handleChange = (e) => {
    const { name, value } = e.target;
    const validText = /^[a-zA-Z0-9\s.-]*$/;

    if ((name === "itemName" || name === "supplier") && !validText.test(value)) {
      return; // Block special characters
    }

    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit updated inventory
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/inventories/${InventoryId}`, {
        itemName: inputs.itemName,
        category: inputs.category,
        quantity: Number(inputs.quantity),
        supplier: inputs.supplier,
        price: Number(inputs.price),
        maintenanceSchedule: inputs.maintenanceSchedule,
      });
      navigate('/InventoryDetails');
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  if (loading || !inputs) return <h2>Loading...</h2>;

  return (
    <div className="form-container">
      <h1>Update Inventory</h1>
      <form onSubmit={handleSubmit} className="inventory-form">
        <label>Item Name:</label>
        <input
          type="text"
          name="itemName"
          value={inputs.itemName || ""}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <select
          name="category"
          value={inputs.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category, idx) => (
            <option key={idx} value={category}>{category}</option>
          ))}
        </select>

        <label>Quantity:</label>
        <input
          type="number"
          name="quantity"
          min="1"
          value={inputs.quantity || ""}
          onChange={handleChange}
          required
        />

        <label>Supplier:</label>
        <input
          type="text"
          name="supplier"
          value={inputs.supplier || ""}
          onChange={handleChange}
          required
        />

        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          name="price"
          min="1"
          value={inputs.price || ""}
          onChange={handleChange}
          required
        />

        <label>Maintenance Schedule:</label>
        <select
          name="maintenanceSchedule"
          value={inputs.maintenanceSchedule}
          onChange={handleChange}
          required
        >
          <option value="">Select a schedule</option>
          {maintenanceSchedules.map((schedule, idx) => (
            <option key={idx} value={schedule}>{schedule}</option>
          ))}
        </select>

        <button type="submit" className="submit-btn">Update Inventory</button>
      </form>
    </div>
  );
}

export default UpdateInventory;
