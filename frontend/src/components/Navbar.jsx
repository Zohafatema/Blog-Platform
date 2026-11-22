import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <BookOpen size={25} />
        <span>BlogSpace</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Explore</Link>

        {user ? (
          <>
            <Link to="/create" className="nav-create">
              <PlusCircle size={17} />
              Write
            </Link>

            <span className="welcome">
              Hi, {user.name}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="signup-btn">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;