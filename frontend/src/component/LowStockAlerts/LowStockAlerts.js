import React, { useEffect, useState } from 'react';
import axios from "axios";
import InventoryNav from '../InventoryNav/InventoryNav';
import "./LowStockAlerts.css";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFilePdf, FaSearch, FaTruck, FaTag, FaSort, FaEdit, FaSave, FaTimes, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

//api endpoint
const URL = "http://localhost:5000/inventories";

//fetch inventory data
const fetchHandler = async () => {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching inventory data:", error);
        throw error;
    }
};

// Update reorder level
const updateReorderLevel = async (id, reorderLevel) => {
    try {
        await axios.put(`${URL}/${id}/reorder-level`, { reorderLevel });
    } catch (error) {
        console.error("Error updating reorder level:", error);
        throw error;
    }
};

// update reorder amount API call
const updateReorderAmount = async (id, reorderAmount) => {
    try {
        await axios.put(`${URL}/${id}/reorder-amount`, { reorderAmount });
    } catch (error) {
        console.error("Error updating reorder amount:", error);
        throw error;
    }
};

function LowStockAlerts() {
    const [lowStockItems, setLowStockItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("urgency");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tempReorderLevel, setTempReorderLevel] = useState(0);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [emailStatus, setEmailStatus] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [tempReorderAmount, setTempReorderAmount] = useState(0);

    const handleSaveReorderAmount = async (item) => {
        try {
            await updateReorderAmount(item._id, tempReorderAmount);
            const updatedItems = lowStockItems.map(i => 
                i._id === item._id 
                    ? { ...i, reorderAmount: tempReorderAmount }
                    : i
            );
            setLowStockItems(updatedItems);
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update reorder amount:", error);
        }
    };

    //fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchHandler();
                if (data && data.inventories) {
                    const lowStock = data.inventories.map(item => ({ 
                        ...item, 
                        reorderLevel: item.reorderLevel || 0,
                        urgency: item.reorderLevel ? item.quantity / item.reorderLevel : 0
                    })).filter(item => item.reorderLevel && item.quantity <= item.reorderLevel);
                    setLowStockItems(lowStock);
                    setFilteredItems(lowStock);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    //Filters and sorting
    useEffect(() => {
        let result = [...lowStockItems];
        
        //search filter
        if (searchTerm) {
            result = result.filter(item => 
                item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        //supplier filter
        if (supplierFilter !== "all") {
            result = result.filter(item => item.supplier === supplierFilter);
        }
        //category filter
        if (categoryFilter !== "all") {
            result = result.filter(item => item.category === categoryFilter);
        }
        //sort by
        if (sortBy === "urgency") {
            result.sort((a, b) => a.urgency - b.urgency);
        } else if (sortBy === "name") {
            result.sort((a, b) => a.itemName.localeCompare(b.itemName));
        } else if (sortBy === "quantity") {
            result.sort((a, b) => a.quantity - b.quantity);
        }
        
        setFilteredItems(result);
    }, [searchTerm, supplierFilter, categoryFilter, sortBy, lowStockItems]);

    //Generate PDF report
    const generatePDFReport = () => {
        const doc = new jsPDF();
        const logoUrl = '/itplogo.jpeg';
        const img = new Image();
        img.src = logoUrl;

        doc.addImage(img, 'JPEG', 10, 10, 50, 40);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Greenscape (Pvt)Ltd", 60, 30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("No 10 ,New plaza road, Mababe, Sri lanka", 60, 40);
        doc.text("Phone: +055 2246 761 | Email: infogreenscape@gmail.com", 60, 50);

        doc.setDrawColor(0, 128, 0);
        doc.setLineWidth(0.5);
        doc.line(20, 60, 190, 60);

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Low Stock Alerts Report", 80, 70);

        autoTable(doc, {
            startY: 80,
            head: [['Item Name', 'Category', 'Supplier', 'Current Qty', 'Reorder Level','Reorder Amount']],
            body: filteredItems.map((item) => [
                item.itemName,
                item.category,
                item.supplier,
                item.quantity,
                item.reorderLevel,
                item.reorderAmount || 0
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

        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${currentDate}`, 20, doc.lastAutoTable.finalY + 20);
        doc.text("Signature: ________________________", 20, doc.lastAutoTable.finalY + 30);

        return doc;
    };

    const handleSendEmail = async () => {
        if (!recipientEmail) {
            setEmailStatus("Please enter a valid email address");
            return;
        }

        try {
            setEmailStatus("Sending email...");
            const doc = generatePDFReport();
            // Convert PDF to base64 string
            const pdfData = doc.output('datauristring').split(',')[1];

            const response = await axios.post('http://localhost:5000/inventories/send-email', {
                pdfData,
                recipientEmail
            });

            if (response.data.message === "Email sent successfully") {
                setEmailStatus("");
                setShowEmailInput(false);
                setRecipientEmail("");
                setShowSuccessMessage(true);
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000);
            } else {
                setEmailStatus(`Error: ${response.data.details || 'Unknown error occurred'}`);
            }
        } catch (error) {
            console.error("Error sending email:", error);
            const errorMessage = error.response?.data?.details || error.message || 'Failed to send email. Please try again.';
            setEmailStatus(`Error: ${errorMessage}`);
        }
    };

    //Get unique suppliers and categories dropdowns
    const suppliers = [...new Set(lowStockItems.map(item => item.supplier))];
    const categories = [...new Set(lowStockItems.map(item => item.category))];
    
    /*const handleSendReport = () => {
        // Create the WhatsApp Chat URL
        const phoneNumber = "+94789654158";
        const message = "Selected User Reports";
        const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        
        // Open the WhatsApp chat in new window
        window.open(whatsappUrl, "_blank");
    };*/

    //Handle edit save
    const handleSaveReorderLevel = async (item) => {
        try {
            await updateReorderLevel(item._id, tempReorderLevel);
            const updatedItems = lowStockItems.map(i => 
                i._id === item._id 
                    ? { ...i, reorderLevel: tempReorderLevel, urgency: i.quantity / tempReorderLevel } 
                    : i
            );
            setLowStockItems(updatedItems);
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update reorder level:", error);
        }
    };

    return (
        <div className="low-stock-page">
            <InventoryNav />
            <main className="alerts-content">
                {showSuccessMessage && (
                    <div className="success-message">
                        <FaCheckCircle /> Email sent successfully!
                    </div>
                )}
                <div className="header-section">
                    <h1>Low Stock Alerts</h1>
                    <div className="action-buttons">
                        <button className="download-btn" onClick={() => generatePDFReport().save('low_stock_alerts_report.pdf')}>
                            <FaFilePdf /> Download PDF
                        </button>
                        <button className="email-btn" onClick={() => setShowEmailInput(true)}>
                            <FaEnvelope /> Send Email
                        </button>
                    </div>
                </div>

                {showEmailInput && (
                    <div className="email-input-container">
                        <input
                            type="email"
                            placeholder="Enter recipient email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="email-input"
                        />
                        <button onClick={handleSendEmail} className="send-email-btn">
                            Send
                        </button>
                        <button onClick={() => setShowEmailInput(false)} className="cancel-email-btn">
                            Cancel
                        </button>
                        {emailStatus && <p className="email-status">{emailStatus}</p>}
                    </div>
                )}

                <div className="control-panel">
                    <div className="search-filter">
                        <div className="search-box">
                            <FaSearch />
                            <input 
                                type="text" 
                                placeholder="Search items..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="filter-group">
                            <label>
                                <FaTruck /> Supplier:
                                <select 
                                    value={supplierFilter} 
                                    onChange={(e) => setSupplierFilter(e.target.value)}
                                >
                                    <option value="all">All Suppliers</option>
                                    {suppliers.map(supplier => (
                                        <option key={supplier} value={supplier}>{supplier}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        
                        <div className="filter-group">
                            <label>
                                <FaTag /> Category:
                                <select 
                                    value={categoryFilter} 
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        
                        <div className="filter-group">
                            <label>
                                <FaSort /> Sort By:
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="urgency">Urgency (Most Critical First)</option>
                                    <option value="name">Name (A-Z)</option>
                                    <option value="quantity">Quantity (Lowest First)</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="table-container">
                    {loading ? (
                        <div className="loading-spinner">
                            <p>Loading low stock items...</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Current Qty</th>
                                    <th>Reorder Level</th>
                                    <th>Reorder Amount</th>
                                    <th>Supplier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <tr key={item._id} className={`alert-row ${item.quantity <= 1 ? 'critical' : ''}`}>
                                            <td>{item.itemName}</td>
                                            <td>{item.category}</td>
                                            <td>
                                                <span className={`quantity-badge ${item.quantity <= 1 ? 'critical' : 'warning'}`}>
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td>
                                                {editingId === item._id ? (
                                                    <div className="reorder-edit">
                                                        <input 
                                                            type="number" 
                                                            value={tempReorderLevel}
                                                            onChange={(e) => setTempReorderLevel(Number(e.target.value))}
                                                            min="0"
                                                        />
                                                        <button onClick={() => handleSaveReorderLevel(item)}>
                                                            <FaSave />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)}>
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="reorder-display">
                                                        {item.reorderLevel}
                                                        <button 
                                                            onClick={() => {
                                                                setEditingId(item._id);
                                                                setTempReorderLevel(item.reorderLevel);
                                                            }}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {editingId === item._id ? (
                                                    <div className="reorder-edit">
                                                        <input
                                                            type="number"
                                                            value={tempReorderAmount}
                                                            onChange={(e) => setTempReorderAmount(Number(e.target.value))}
                                                            min="0"
                                                        />
                                                        <button onClick={() => handleSaveReorderAmount(item)}>
                                                            <FaSave />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)}>
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="reorder-display">
                                                        {item.reorderAmount || 0}
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(item._id);
                                                                setTempReorderAmount(item.reorderAmount || 0);
                                                            }}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>

                                            <td>{item.supplier}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="no-alerts">
                                            {lowStockItems.length === 0 ? 
                                                "No low stock items" : 
                                                "No items match your filters"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}

export default LowStockAlerts;