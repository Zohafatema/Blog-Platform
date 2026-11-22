import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "Technology",
    content: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);

        const post = res.data;

        if (post.author?._id !== JSON.parse(
          localStorage.getItem("user") || "null"
        )?.id) {
          // Ownership is enforced by the backend on saving.
          // The page still allows the author to load their draft.
        }

        setForm({
          title: post.title,
          category: post.category,
          content: post.content
        });
      } catch {
        setError("Could not load this post.");
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (id) {
        await api.put(`/posts/${id}`, form);
      } else {
        await api.post("/posts", form);
      }

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-heading">
        <span className="small-label">YOUR CREATIVE SPACE</span>
        <h2>{id ? "Edit Your Story" : "Create a Story"}</h2>
        <p>Write something worth sharing.</p>
      </div>

      <form className="editor-form" onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}

        <label>Blog Title</label>

        <input
          type="text"
          placeholder="Give your story a title..."
          value={form.title}
          maxLength={150}
          onChange={e =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <label>Category</label>

        <select
          value={form.category}
          onChange={e =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option>Technology</option>
          <option>Education</option>
          <option>Lifestyle</option>
          <option>Travel</option>
          <option>Business</option>
          <option>General</option>
        </select>

        <label>Your Story</label>

        <textarea
          placeholder="Start writing your story here..."
          rows="14"
          value={form.content}
          maxLength={30000}
          onChange={e =>
            setForm({ ...form, content: e.target.value })
          }
          required
        />

        <div className="editor-footer">
          <span>{form.content.length}/30000 characters</span>

          <button className="primary-btn" disabled={loading}>
            {loading
              ? "Publishing..."
              : id ? "Save Changes" : "Publish Story"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;