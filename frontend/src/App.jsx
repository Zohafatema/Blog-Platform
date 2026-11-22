import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/post/:id" element={<PostDetails />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<CreatePost />} />
          </Route>
        </Routes>

        <footer className="footer">
          <h3>BlogSpace.</h3>
          <p>Stories connect us. Ideas inspire us.</p>
          <span>© 2026 BlogSpace. All rights reserved.</span>
        </footer>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;