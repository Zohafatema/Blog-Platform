import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, BookOpen } from "lucide-react";
import api from "../api";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/posts", {
          params: { search }
        });

        setPosts(res.data);
      } catch {
        setError("Unable to load blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <main>
      <section className="hero">
        <span className="hero-label">
          YOUR IDEAS. YOUR STORIES.
        </span>

        <h1>
          Every story deserves
          <br />
          <span>a place to be told.</span>
        </h1>

        <p>
          Discover interesting stories, share your ideas
          and connect with writers around the world.
        </p>

        <div className="search-box">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="blog-section">
        <div className="section-heading">
          <div>
            <span className="small-label">THE COMMUNITY</span>
            <h2>Latest Stories</h2>
          </div>

          <span className="post-count">
            {posts.length} Articles
          </span>
        </div>

        {loading ? (
          <p className="loading">Loading stories...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={35} />
            <h3>No stories found</h3>
            <p>Try another search or publish the first story.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <article className="blog-card" key={post._id}>
                <span className="category">
                  {post.category}
                </span>

                <h3>{post.title}</h3>

                <p className="excerpt">
                  {post.content.slice(0, 160)}
                  {post.content.length > 160 ? "..." : ""}
                </p>

                <div className="card-footer">
                  <div>
                    <strong>{post.author?.name || "Unknown"}</strong>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link to={`/post/${post._id}`} aria-label={`Read ${post.title}`}>
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;