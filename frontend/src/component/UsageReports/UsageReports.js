import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import Papa from "papaparse";
import "./UsageReports.css";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../context/AuthContext';
import InventoryNav from "../InventoryNav/InventoryNav";

//state for usage reports
const UsageReports = () => {
    const { token } = useAuth();
    const [usageReports, setUsageReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        projectName: "",
        itemId: "",
        itemName: "",
        quantityUsed: "",
        dateOfUsage: "",
        usedBy: "",
        purpose: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (token) {
            fetchUsageReports();
        }
    }, [token]);

    //filter reports based on search term
    useEffect(() => {
        if (usageReports) {
            const filtered = usageReports.filter(report => 
                report.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.usedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.itemId.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredReports(filtered);
        }
    }, [searchTerm, usageReports]);

    //fetch usage reports from backend
    const fetchUsageReports = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/usage", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch usage reports');
            }
            const data = await response.json();
            setUsageReports(data.usageReports || []);
            setFilteredReports(data.usageReports || []);
            setError(null);
        } catch (error) {
            console.error("Error fetching reports:", error);
            setError(error.message);
            setUsageReports([]);
            setFilteredReports([]);
        } finally {
            setLoading(false);
        }
    };

    //handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.projectName.trim()) newErrors.projectName = "Project Name is required";
        if (!formData.itemId.trim()) newErrors.itemId = "Item ID is required";
        if (!formData.itemName.trim()) newErrors.itemName = "Item Name is required";
        if (!formData.quantityUsed || formData.quantityUsed <= 0) newErrors.quantityUsed = "Quantity Used must be a positive number";
        if (!formData.dateOfUsage) newErrors.dateOfUsage = "Date of Usage is required";
        if (!formData.usedBy.trim()) newErrors.usedBy = "Used By is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `http://localhost:5000/usage/${editingId}` : "http://localhost:5000/usage";

        try {
            const response = await fetch(url, {
                method,
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchUsageReports();
                setFormData({
                    projectName: "",
                    itemId: "",
                    itemName: "",
                    quantityUsed: "",
                    dateOfUsage: "",
                    usedBy: "",
                    purpose: ""
                });
                setEditingId(null);
                setErrors({});
            } else {
                throw new Error('Failed to submit usage report');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setError(error.message);
        }
    };

    //populate form for editing existing report
    const handleEdit = (report) => {
        setEditingId(report._id);
        setFormData({ ...report, dateOfUsage: report.dateOfUsage.split("T")[0] });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/usage/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchUsageReports();
            } else {
                throw new Error('Failed to delete usage report');
            }
        } catch (error) {
            console.error("Error deleting report:", error);
            setError(error.message);
        }
    };

    //prepare data for chart
    const chartData = filteredReports?.map((report) => ({
        name: report.itemName,
        quantity: report.quantityUsed,
    })) || [];

    //download usage report as CSV
    const handleDownloadReport = () => {
        const csvData = filteredReports.map((report) => ({
            "Project Name": report.projectName,
            "Item ID": report.itemId,
            "Item Name": report.itemName,
            "Quantity Used": report.quantityUsed,
            "Date of Usage": new Date(report.dateOfUsage).toLocaleDateString(),
            "Used By": report.usedBy,
            "Purpose": report.purpose || "N/A",
        }));

        //convert data to CSV
        const csv = Papa.unparse(csvData);
        //create download link
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "UsageReport.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const generatePDFReport = () => {
        const doc = new jsPDF();
        const logoUrl = '/itplogo.jpeg';
        const img = new Image();
        img.src = logoUrl;

        doc.addImage(img, 'JPEG', 10, 10, 50, 40);
        let y = 20;
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text("Greenscape (Pvt)Ltd", 60, y);
        y += 10;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("No 10 ,New plaza road, Mababe, Sri lanka", 60, y);
        y += 10;
        doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, y);
        y += 20;

        doc.setDrawColor(0, 128, 0);
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 10;

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Usage Report", 80, y);
        y += 20;

        const tableStartY = y;
        autoTable(doc, {
            startY: tableStartY,
            head: [['Project Name', 'Item ID', 'Item Name', 'Quantity Used', 'Date of Usage', 'Used By', 'Purpose']],
            body: filteredReports.map((report) => [
                report.projectName,
                report.itemId,
                report.itemName,
                report.quantityUsed,
                new Date(report.dateOfUsage).toLocaleDateString(),
                report.usedBy,
                report.purpose || "N/A",
            ]),
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
                halign: 'center',
                valign: 'middle'
            },
            headStyles: {
                fillColor: [40, 167, 69],
                textColor: [255, 255, 255]
            }
        });

        const tableHeight = filteredReports.length * 10;
        y = tableStartY + tableHeight + 60;
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${currentDate}`, 20, y);
        y += 10;
        doc.text("Signature: ________________________", 20, y);

        doc.save('usage_report.pdf');
    };

    return (
        <div className="usage-container">
            <h1 className="usage-title">Usage Reports</h1>
            <InventoryNav />

            {loading && <div className="loading">Loading usage reports...</div>}
            {error && <div className="error">{error}</div>}
            
            {!loading && !error && (
                <>
                    <div className="button-container">
                        <button className="download-btn" onClick={handleDownloadReport}>
                            Download CSV Report
                        </button>
                        <button className="download-btn" onClick={generatePDFReport}>
                            Download PDF Report
                        </button>
                    </div>

                    <div className="search-container">
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search reports..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">Search</button>
                    </div>

                    {/* usage report form */}
                    <div className="maintenance-form-container">
                        <form className="maintenance-form" onSubmit={handleSubmit}>
                            <div className="maintenance-form-row">
                                <div className="maintenance-form-group">
                                    <label>Project Name</label>
                                    <input type="text" name="projectName" placeholder="Project Name" value={formData.projectName} onChange={handleChange} required />
                                    {errors.projectName && <span className="error-message">{errors.projectName}</span>}
                                </div>
                                <div className="maintenance-form-group">
                                    <label>Item ID</label>
                                    <input type="text" name="itemId" placeholder="Item ID" value={formData.itemId} onChange={handleChange} required />
                                    {errors.itemId && <span className="error-message">{errors.itemId}</span>}
                                </div>
                            </div>
                            <div className="maintenance-form-row">
                                <div className="maintenance-form-group">
                                    <label>Item Name</label>
                                    <input type="text" name="itemName" placeholder="Item Name" value={formData.itemName} onChange={handleChange} required />
                                    {errors.itemName && <span className="error-message">{errors.itemName}</span>}
                                </div>
                                <div className="maintenance-form-group">
                                    <label>Quantity Used</label>
                                    <input type="number" name="quantityUsed" placeholder="Quantity Used" value={formData.quantityUsed} onChange={handleChange} required min="1" />
                                    {errors.quantityUsed && <span className="error-message">{errors.quantityUsed}</span>}
                                </div>
                            </div>
                            <div className="maintenance-form-row">
                                <div className="maintenance-form-group">
                                    <label>Date of Usage</label>
                                    <input type="date" name="dateOfUsage" value={formData.dateOfUsage} onChange={handleChange} required />
                                    {errors.dateOfUsage && <span className="error-message">{errors.dateOfUsage}</span>}
                                </div>
                                <div className="maintenance-form-group">
                                    <label>Used By</label>
                                    <input type="text" name="usedBy" placeholder="Used By" value={formData.usedBy} onChange={handleChange} required />
                                    {errors.usedBy && <span className="error-message">{errors.usedBy}</span>}
                                </div>
                            </div>
                            <div className="maintenance-form-row">
                                <div className="maintenance-form-group">
                                    <label>Purpose (Optional)</label>
                                    <input type="text" name="purpose" placeholder="Purpose (Optional)" value={formData.purpose} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="maintenance-form-actions">
                                <button type="submit" className="maintenance-btn">{editingId ? "Update Report" : "Add Report"}</button>
                            </div>
                        </form>
                    </div>

                    <table className="usage-table">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Quantity Used</th>
                                <th>Date of Usage</th>
                                <th>Used By</th>
                                <th>Purpose</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <tr key={report._id}>
                                        <td>{report.projectName}</td>
                                        <td>{report.itemId}</td>
                                        <td>{report.itemName}</td>
                                        <td>{report.quantityUsed}</td>
                                        <td>{new Date(report.dateOfUsage).toLocaleDateString()}</td>
                                        <td>{report.usedBy}</td>
                                        <td>{report.purpose || "N/A"}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => handleEdit(report)}>Update</button>
                                            <button className="delete-btn" onClick={() => handleDelete(report._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">No usage reports found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="charts-flex-container">
                        <div className="chart-card">
                            <h3>Usage Statistics</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="quantity" fill="#2E7D32" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="chart-card">
                            <h3>Usage Trend</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="quantity" stroke="#2E7D32" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UsageReports;