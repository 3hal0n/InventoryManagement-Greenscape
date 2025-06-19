import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Reports.css';

function UsageReport() {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // TODO: Replace with actual API call
        const fetchReports = async () => {
            try {
                // Simulated API response
                const mockReports = [
                    {
                        id: 1,
                        itemName: 'Microscope',
                        department: 'Biology Lab',
                        usageCount: 15,
                        lastUsed: '2024-03-15',
                        status: 'Active'
                    },
                    {
                        id: 2,
                        itemName: 'Centrifuge',
                        department: 'Chemistry Lab',
                        usageCount: 8,
                        lastUsed: '2024-03-14',
                        status: 'Maintenance Required'
                    }
                ];
                setReports(mockReports);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch usage reports');
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="report-container">
            <h1>Equipment Usage Reports</h1>
            
            <div className="report-filters">
                <input
                    type="text"
                    placeholder="Search by item name or department..."
                    className="search-input"
                />
                <select className="filter-select">
                    <option value="">All Departments</option>
                    <option value="Biology Lab">Biology Lab</option>
                    <option value="Chemistry Lab">Chemistry Lab</option>
                </select>
            </div>

            <div className="report-table-container">
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Department</th>
                            <th>Usage Count</th>
                            <th>Last Used</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <tr key={report.id}>
                                <td>{report.itemName}</td>
                                <td>{report.department}</td>
                                <td>{report.usageCount}</td>
                                <td>{report.lastUsed}</td>
                                <td>
                                    <span className={`status-badge ${report.status.toLowerCase().replace(' ', '-')}`}>
                                        {report.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UsageReport; 