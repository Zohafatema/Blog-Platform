import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid login details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="small-label">WELCOME BACK</span>

        <h2>Login</h2>

        <p>Continue your blogging journey.</p>

        {error && <div className="error">{error}</div>}

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={e =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={e =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button className="primary-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;