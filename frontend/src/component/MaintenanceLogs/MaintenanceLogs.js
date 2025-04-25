import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MaintenanceLogs.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);

const MaintenanceLogs = () => {
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({
        itemId: '',
        itemName: '',
        maintenanceType: '',
        maintenanceDate: '',
        performedBy: '',
        cost: '',
        nextMaintenanceDate: '',
        status: ''
    });
    //To store state for form validation errors
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchLogs();
    }, []);

    //fetch maintenance logs from the server
    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/maintenance');
            setLogs(response.data.maintenanceRecords);
        } catch (error) {
            console.error('Error fetching maintenance logs:', error);
        }
    };

    //handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const minYear = 2020;
        const maxYear = currentYear + 5;

        if (!formData.itemId.trim()) newErrors.itemId = 'Item ID is required';
        if (!formData.itemName.trim()) newErrors.itemName = 'Item Name is required';
        if (!formData.maintenanceType) newErrors.maintenanceType = 'Maintenance Type is required';
        
        if (!formData.maintenanceDate) {
            newErrors.maintenanceDate = 'Maintenance Date is required';
        } else {
            const maintenanceDate = new Date(formData.maintenanceDate);
            const maintenanceYear = maintenanceDate.getFullYear();
            if (maintenanceYear < minYear || maintenanceYear > maxYear) {
                newErrors.maintenanceDate = `Date must be between ${minYear} and ${maxYear}`;
            }
        }

        if (!formData.performedBy.trim()) newErrors.performedBy = 'Performed By is required';
        if (formData.cost && isNaN(formData.cost)) newErrors.cost = 'Cost must be a number';
        if (formData.cost && parseFloat(formData.cost) < 0) newErrors.cost = 'Cost cannot be negative';
        if (!formData.status) newErrors.status = 'Status is required';

        if (formData.nextMaintenanceDate) {
            const nextMaintenanceDate = new Date(formData.nextMaintenanceDate);
            const nextYear = nextMaintenanceDate.getFullYear();
            
            if (nextYear < minYear || nextYear > maxYear) {
                newErrors.nextMaintenanceDate = `Date must be between ${minYear} and ${maxYear}`;
            }
            
            if (formData.maintenanceDate && !newErrors.maintenanceDate) {
                const maintenanceDate = new Date(formData.maintenanceDate);
                if (nextMaintenanceDate <= maintenanceDate) {
                    newErrors.nextMaintenanceDate = 'Next Maintenance Date must be after the current Maintenance Date';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; //don't submit if validation fails

        try {
            await axios.post('http://localhost:5000/maintenance', formData);
            fetchLogs();
            //reset form after successful submission
            setFormData({
                itemId: '',
                itemName: '',
                maintenanceType: '',
                maintenanceDate: '',
                performedBy: '',
                cost: '',
                nextMaintenanceDate: '',
                status: ''
            });
            setErrors({});
        } catch (error) {
            console.error('Error adding maintenance log:', error);
        }
    };

    const handleUpdate = async (id) => {
        if (!validateForm()) return;
        try {
            await axios.put(`http://localhost:5000/maintenance/${id}`, formData);
            fetchLogs();
        } catch (error) {
            console.error('Error updating maintenance log:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/maintenance/${id}`);
            fetchLogs();
        } catch (error) {
            console.error('Error deleting maintenance log:', error);
        }
    };

    //populate form fields with data for updating
    const populateFormForUpdate = (log) => {
        setFormData({
            itemId: log.itemId,
            itemName: log.itemName,
            maintenanceType: log.maintenanceType,
            maintenanceDate: log.maintenanceDate,
            performedBy: log.performedBy,
            cost: log.cost,
            nextMaintenanceDate: log.nextMaintenanceDate,
            status: log.status
        });
    };

    const generateReport = () => {
        const doc = new jsPDF();
        const logoUrl = '/itplogo.jpeg';
        const img = new Image();
        img.src = logoUrl;

        doc.addImage(img, 'PNG', 10, 10, 50, 30);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        doc.text('Greenscape (Pvt)Ltd', 60, 20);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('No 10 ,New plaza road, Malabe, Sri lanka', 60, 28);
        doc.text('Phone: +055 2246 761 | Email: infogreenscape@gmail.com', 60, 34);

        doc.setDrawColor(0, 128, 0);
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);

        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Maintenance Report', 80, 50);

        doc.autoTable({
            startY: 55,
            head: [['Item ID', 'Item Name', 'Maintenance Type', 'Date', 'Performed By', 'Cost', 'Next Date', 'Status']],
            body: logs.map((log) => [
                log.itemId,
                log.itemName,
                log.maintenanceType,
                new Date(log.maintenanceDate).toLocaleDateString(),
                log.performedBy,
                log.cost,
                log.nextMaintenanceDate ? new Date(log.nextMaintenanceDate).toLocaleDateString() : 'N/A',
                log.status,
            ]),
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
                halign: 'center',
                valign: 'middle',
            },
            headStyles: {
                fillColor: [40, 167, 69],
                textColor: [255, 255, 255],
            },
        });

        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${currentDate}`, 20, doc.lastAutoTable.finalY + 20);
        doc.text('Signature: ________________________', 20, doc.lastAutoTable.finalY + 30);

        doc.save('maintenance_logs_report.pdf');
    };

    return (
        <div className="maintenance-logs-container">
            <h1 className="maintenance-title">Maintenance Logs</h1>
            <form className="maintenance-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="itemId"
                        placeholder="Item ID"
                        value={formData.itemId}
                        onChange={handleChange}
                        className={errors.itemId ? 'error-input' : ''}
                    />
                    {errors.itemId && <span className="error-message">{errors.itemId}</span>}
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        name="itemName"
                        placeholder="Item Name"
                        value={formData.itemName}
                        onChange={handleChange}
                        className={errors.itemName ? 'error-input' : ''}
                    />
                    {errors.itemName && <span className="error-message">{errors.itemName}</span>}
                </div>

{/* maintenance type dropdown */}
                <div className="form-group">
                    <select
                        name="maintenanceType"
                        value={formData.maintenanceType}
                        onChange={handleChange}
                        className={errors.maintenanceType ? 'error-input' : ''}
                    >
                        <option value="">Select Maintenance Type</option>
                        <option value="Repair">Repair</option>
                        <option value="Replacement">Replacement</option>
                        <option value="Inspection">Inspection</option>
                        <option value="Cleaning">Cleaning</option>
                    </select>
                    {errors.maintenanceType && <span className="error-message">{errors.maintenanceType}</span>}
                </div>

                <div className="form-group">
                    <input
                        type="date"
                        name="maintenanceDate"
                        value={formData.maintenanceDate}
                        onChange={handleChange}
                        className={errors.maintenanceDate ? 'error-input' : ''}
                    />
                    {errors.maintenanceDate && <span className="error-message">{errors.maintenanceDate}</span>}
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        name="performedBy"
                        placeholder="Performed By"
                        value={formData.performedBy}
                        onChange={handleChange}
                        className={errors.performedBy ? 'error-input' : ''}
                    />
                    {errors.performedBy && <span className="error-message">{errors.performedBy}</span>}
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        name="cost"
                        placeholder="Cost"
                        value={formData.cost}
                        onChange={handleChange}
                        min="0"
                        className={errors.cost ? 'error-input' : ''}
                    />
                    {errors.cost && <span className="error-message">{errors.cost}</span>}
                </div>

                <div className="form-group">
                    <input
                        type="date"
                        name="nextMaintenanceDate"
                        value={formData.nextMaintenanceDate}
                        onChange={handleChange}
                        className={errors.nextMaintenanceDate ? 'error-input' : ''}
                    />
                    {errors.nextMaintenanceDate && <span className="error-message">{errors.nextMaintenanceDate}</span>}
                </div>

                <div className="form-group">
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={errors.status ? 'error-input' : ''}
                    >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                    </select>
                    {errors.status && <span className="error-message">{errors.status}</span>}
                </div>

                <button type="submit" className="form-submit-btn">Add Log</button>
            </form>

            <button className="generate-report-btn" onClick={generateReport}>
                Generate Report
            </button>

            <div className="table-wrapper">
                <table className="maintenance-table">
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Item Name</th>
                            <th>Maintenance Type</th>
                            <th>Date</th>
                            <th>Performed By</th>
                            <th>Cost</th>
                            <th>Next Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>{log.itemId}</td>
                                <td>{log.itemName}</td>
                                <td>{log.maintenanceType}</td>
                                <td>{new Date(log.maintenanceDate).toLocaleDateString()}</td>
                                <td>{log.performedBy}</td>
                                <td>{log.cost}</td>
                                <td>{log.nextMaintenanceDate ? new Date(log.nextMaintenanceDate).toLocaleDateString() : 'N/A'}</td>
                                <td>{log.status}</td>
                                <td>
                                    <button 
                                        className="update-btn"
                                        onClick={() => populateFormForUpdate(log)}
                                    >
                                        Update
                                    </button>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(log._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaintenanceLogs;