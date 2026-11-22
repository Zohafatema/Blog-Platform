import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      await register(form);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="small-label">JOIN BLOGSPACE</span>

        <h2>Create Account</h2>

        <p>Start sharing your stories with the world.</p>

        {error && <div className="error">{error}</div>}

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={form.name}
          maxLength={60}
          onChange={e =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

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
          placeholder="Minimum 8 characters"
          value={form.password}
          minLength={8}
          maxLength={72}
          onChange={e =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button className="primary-btn" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;