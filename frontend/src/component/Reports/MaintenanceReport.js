import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Reports.css';

function MaintenanceReport() {
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
                        equipmentName: 'Microscope',
                        department: 'Biology Lab',
                        lastMaintenance: '2024-02-15',
                        nextMaintenance: '2024-05-15',
                        status: 'Scheduled',
                        priority: 'Medium'
                    },
                    {
                        id: 2,
                        equipmentName: 'Centrifuge',
                        department: 'Chemistry Lab',
                        lastMaintenance: '2024-01-20',
                        nextMaintenance: '2024-03-20',
                        status: 'Overdue',
                        priority: 'High'
                    }
                ];
                setReports(mockReports);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch maintenance reports');
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="report-container">
            <h1>Equipment Maintenance Reports</h1>
            
            <div className="report-filters">
                <input
                    type="text"
                    placeholder="Search by equipment name or department..."
                    className="search-input"
                />
                <select className="filter-select">
                    <option value="">All Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Completed">Completed</option>
                </select>
                <select className="filter-select">
                    <option value="">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            <div className="report-table-container">
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Equipment Name</th>
                            <th>Department</th>
                            <th>Last Maintenance</th>
                            <th>Next Maintenance</th>
                            <th>Status</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <tr key={report.id}>
                                <td>{report.equipmentName}</td>
                                <td>{report.department}</td>
                                <td>{report.lastMaintenance}</td>
                                <td>{report.nextMaintenance}</td>
                                <td>
                                    <span className={`status-badge ${report.status.toLowerCase()}`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td>
                                    <span className={`priority-badge ${report.priority.toLowerCase()}`}>
                                        {report.priority}
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

export default MaintenanceReport; 