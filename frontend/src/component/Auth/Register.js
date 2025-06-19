import React, { useState, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import RotatingModel from '../RotatingModel';
import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from 'react-responsive';
import Loader from '../../component/Loader';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        role: 'employee' //Default role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();
    const isMobile = useMediaQuery({ maxWidth: 853 });

    const departments = [
        'Inventory Management',
        'Maintenance',
        'Operations',
        'Administration'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const result = await register(registerData);
            
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="login-3d-container">
            <div className="login-form-wrapper register-form-wrapper">
                <div className="auth-box glass-effect">
                    <h2>Register</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Choose a username"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter password"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm password"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Department:</label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept, index) => (
                                    <option key={index} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            type="submit" 
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    <p className="auth-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
            <figure className="canvas-bg">
                <Canvas
                    camera={{
                        position: [-5, 3, 5],
                        fov: 45,
                        near: 0.1,
                        far: 1000,
                    }}
                    dpr={[1, 2]}
                    style={{ background: "transparent" }}
                >
                    <ambientLight intensity={0.6} />
                    <directionalLight
                        position={[5, 5, 5]}
                        intensity={0.8}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />
                    <pointLight position={[-5, 5, -5]} intensity={0.4} />
                    <fog attach="fog" args={["#000000", 8, 20]} />
                    <Suspense fallback={<Loader />}>
                        <RotatingModel
                            scale={isMobile ? 0.3 : 0.5}
                            position={isMobile ? [2, -0.5, -1.5] : [3, -1, -2]}
                            rotation={[0, 0, 0]}
                        />
                    </Suspense>
                </Canvas>
            </figure>
        </section>
    );
}

export default Register; 