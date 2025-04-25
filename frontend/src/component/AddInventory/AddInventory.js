import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryNav from '../InventoryNav/InventoryNav';
import axios from "axios";
import "./AddInventory.css";

function AddInventory() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    itemName: "",
    category: "",
    quantity: "",
    supplier: "",
    price: "",
    maintenanceSchedule: "",
  });
  const [errors, setErrors] = useState({});

  const categories = ["Vehicles & Machinery", "Construction & Maintenance Supplies", "Gardening Tools & Equipment", "Pesticides & Herbicides", "Other"];
  const maintenanceSchedules = ["Every Day", "Every Week", "Every Month"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  //To clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
//validations
  const validateForm = () => {
    const newErrors = {};
    const numberRegex = /^\d+$/;
    const priceRegex = /^\d+(\.\d{1,2})?$/;

    if (!inputs.itemName.trim()) {
      newErrors.itemName = "Item Name is required.";
    } else if (numberRegex.test(inputs.itemName.trim())) {
      newErrors.itemName = "Item Name cannot be just numbers.";
    }

  
    if (!inputs.category.trim()) {
      newErrors.category = "Category is required.";
    }

   
    if (!inputs.quantity) {
      newErrors.quantity = "Quantity is required.";
    } else if (isNaN(inputs.quantity) || inputs.quantity <= 0) {
      newErrors.quantity = "Quantity must be a positive number.";
    }

    
    if (!inputs.supplier.trim()) {
      newErrors.supplier = "Supplier is required.";
    } else if (numberRegex.test(inputs.supplier.trim())) {
      newErrors.supplier = "Supplier cannot be just numbers.";
    }

    
    if (!inputs.price) {
      newErrors.price = "Price is required.";
    } else if (!priceRegex.test(inputs.price)) {
      newErrors.price = "Price must be a valid number (e.g., 10 or 10.50).";
    } else if (parseFloat(inputs.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    
    if (!inputs.maintenanceSchedule.trim()) {
      newErrors.maintenanceSchedule = "Maintenance Schedule is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      sendRequest().then(() => history('/InventoryDetails'));
    }
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/inventories", {
        itemName: inputs.itemName,
        category: inputs.category,
        quantity: Number(inputs.quantity),
        supplier: inputs.supplier,
        price: Number(inputs.price),
        maintenanceSchedule: inputs.maintenanceSchedule,
      });

      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      alert("Failed to add inventory. Please check server logs.");
    }
  };

  return (
    <div>
      <InventoryNav />
      <div className="form-container">
        <h1>Add Inventory</h1>
        <form onSubmit={handleSubmit} className="inventory-form">
          <label>Item Name:</label>
          <input 
            type="text" 
            name="itemName" 
            value={inputs.itemName} 
            onChange={handleChange} 
            className={errors.itemName ? 'error-input' : ''}
          />
          {errors.itemName && <span className="error-message">{errors.itemName}</span>}

          <label>Category:</label>
          <select 
            name="category" 
            value={inputs.category} 
            onChange={handleChange} 
            className={errors.category ? 'error-input' : ''}
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}

          <label>Quantity:</label>
          <input 
            type="number" 
            name="quantity" 
            value={inputs.quantity} 
            onChange={handleChange} 
            min="1" 
            className={errors.quantity ? 'error-input' : ''}
          />
          {errors.quantity && <span className="error-message">{errors.quantity}</span>}

          <label>Supplier:</label>
          <input 
            type="text" 
            name="supplier" 
            value={inputs.supplier} 
            onChange={handleChange} 
            className={errors.supplier ? 'error-input' : ''}
          />
          {errors.supplier && <span className="error-message">{errors.supplier}</span>}

          <label>Price:</label>
          <input 
            type="number" 
            step="0.01" 
            name="price" 
            value={inputs.price} 
            onChange={handleChange} 
            min="0.01" 
            className={errors.price ? 'error-input' : ''}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}

          <label>Maintenance Schedule:</label>
          <select 
            name="maintenanceSchedule" 
            value={inputs.maintenanceSchedule} 
            onChange={handleChange} 
            className={errors.maintenanceSchedule ? 'error-input' : ''}
          >
            <option value="">Select a schedule</option>
            {maintenanceSchedules.map((schedule, index) => (
              <option key={index} value={schedule}>
                {schedule}
              </option>
            ))}
          </select>
          {errors.maintenanceSchedule && <span className="error-message">{errors.maintenanceSchedule}</span>}

          <button type="submit" className="submit-btn">Add Inventory</button>
        </form>
      </div>
    </div>
  );
}

export default AddInventory;