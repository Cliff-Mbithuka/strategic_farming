import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Auth.css";
import registerImage from "../assets/register-image.jpeg";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Store error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const res = await axios.post(
        "http://localhost:1234/api/auth/register",
        formData
      );

      // Store user in AuthContext and redirect
      login(res.data.user);
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-form">
          <h2>Create an account</h2>
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Show error message */}
          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Sarah Githinji"
            onChange={handleChange}
            value={formData.username}
          />
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            onChange={handleChange}
            value={formData.email}
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="At least 8 characters"
            onChange={handleChange}
            value={formData.password}
          />
          <button className="auth-btn" onClick={handleSubmit}>
            Sign Up
          </button>
        </div>
        <div className="auth-image">
          <img src={registerImage} alt="Register" />
        </div>
      </div>
    </div>
  );
};

export default Register;
