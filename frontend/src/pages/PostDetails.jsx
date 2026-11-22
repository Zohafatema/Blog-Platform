import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MessageCircle, Trash2, Edit3, ArrowLeft } from "lucide-react";

import api from "../api";
import { useAuth } from "../context/AuthContext";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch {
      setError("Could not load this story.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const isAuthor =
    user && post?.author?._id === (user.id || user._id);

  const addComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      await api.post(`/posts/${id}/comments`, {
        text: comment
      });

      setComment("");
      await fetchPost();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not add comment"
      );
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      await api.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/posts/${id}/comments/${commentId}`);
      await fetchPost();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete comment");
    }
  };

  if (loading) return <p className="loading">Loading story...</p>;

  if (error && !post) return <p className="error">{error}</p>;

  if (!post) return <p>Story not found.</p>;

  return (
    <main className="details-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Back to stories
      </Link>

      <article className="article">
        <span className="category">{post.category}</span>

        <h1>{post.title}</h1>

        <div className="article-meta">
          <span>By {post.author?.name || "Unknown"}</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        {isAuthor && (
          <div className="article-actions">
            <Link to={`/edit/${post._id}`}>
              <Edit3 size={17} /> Edit
            </Link>

            <button onClick={deletePost}>
              <Trash2 size={17} /> Delete
            </button>
          </div>
        )}

        <div className="article-content">
          {post.content}
        </div>
      </article>

      <section className="comments-section">
        <h2>
          <MessageCircle size={22} />
          Comments ({post.comments.length})
        </h2>

        {error && <div className="error">{error}</div>}

        {user ? (
          <form className="comment-form" onSubmit={addComment}>
            <textarea
              placeholder="Share your thoughts..."
              value={comment}
              maxLength={1000}
              onChange={e => setComment(e.target.value)}
              required
            />

            <button className="primary-btn">
              Post Comment
            </button>
          </form>
        ) : (
          <p>
            Please <Link to="/login">login</Link> to leave a comment.
          </p>
        )}

        <div className="comment-list">
          {post.comments.map(item => (
            <div className="comment-card" key={item._id}>
              <div className="comment-top">
                <strong>{item.author?.name || "Unknown"}</strong>

                {user &&
                  item.author?._id === (user.id || user._id) && (
                    <button
                      className="icon-delete"
                      onClick={() => deleteComment(item._id)}
                      aria-label="Delete comment"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
              </div>

              <p>{item.text}</p>

              <span>
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}

          {post.comments.length === 0 && (
            <p className="empty-comments">
              No comments yet. Start the conversation!
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default PostDetails;