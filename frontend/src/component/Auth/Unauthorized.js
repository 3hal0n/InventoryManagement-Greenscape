import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

function Unauthorized() {
    return (
        <div className="auth-container">
            <div className="auth-box unauthorized-box">
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
                <div className="unauthorized-actions">
                    <Link to="/dashboard" className="auth-button">
                        Go to Dashboard
                    </Link>
                    <Link to="/" className="auth-button secondary">
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Unauthorized; 