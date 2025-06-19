import React, { useState, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../../context/AuthContext";
import { Statue } from "../../component/Statue";
import RotatingModel from "../../component/RotatingModel";

import Loader from "../../component/Loader"; // Optional loader for 3D model
import "./Auth.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 853 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-3d-container">
      {/* Login form - positioned on the left */}
      <div className="login-form-wrapper">
        <div className="auth-box glass-effect">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="auth-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>

      {/* 3D Background Canvas - positioned on the right */}
      <figure className="canvas-bg">
        <Canvas
          camera={{
            position: [-5, 3, 5],
            fov: 45,
            near: 0.1,
            far: 1000,
          }}
          dpr={[1, 2]} // Optimize for different screen densities
          style={{ background: "transparent" }}
        >
          {/* Lighting setup */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.4} />

          {/* Environment and effects */}
          <fog attach="fog" args={["#000000", 8, 20]} />

          <Suspense fallback={<Loader />}>
            <RotatingModel
              // scale={isMobile ? 0.25 : 0.4}
              // position={
              //   isMobile ? [2, -0.5, -1.5] : [3, -1, -2]
              // } /* Position model on the right side */
              scale={isMobile ? 0.3 : 0.5}
              position={isMobile ? [2, -0.5, -1.5] : [3, -1, -2]}
              rotation={[0, 0, 0]} // Rotate 90 degrees on Y-axis
            />
          </Suspense>
        </Canvas>
      </figure>
    </section>
  );
}

export default Login;
