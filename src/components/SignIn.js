import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Auth.css";
import loginImage from "../assets/login-image.jpeg";

const SignIn = () => {
  const [formData, setFormData] = useState({
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
        "http://localhost:1234/api/auth/login",
        formData
      );

      // Store token in localStorage
      localStorage.setItem("token", res.data.token);
      document.cookie = `token=${res.data.token}; path=/; secure=${
        process.env.NODE_ENV === "production"
      }`;
      // In your frontend (where you store the token)
      console.log("Stored token:", localStorage.getItem("token"));
      // Store user in AuthContext and navigate
      login(res.data.user);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid credentials.");
    }
  };

  const handleGoogleSignIn = () => {
    window.open("http://localhost:1234/api/auth/google", "_self");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-form">
          <h2>Welcome back! 👋</h2>
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Display error messages */}
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="At least 8 characters"
            onChange={handleChange}
            value={formData.password}
            required
          />
          <a href="/forgot-password" className="forgot-password">
            Forgot Password?
          </a>
          <button className="auth-btn" onClick={handleSubmit}>
            Sign In
          </button>
          <div className="divider">OR</div>
          <button className="google-btn" onClick={handleGoogleSignIn}>
            Sign In with Google
          </button>
          <p className="switch-auth">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
        <div className="auth-image">
          <img src={loginImage} alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
