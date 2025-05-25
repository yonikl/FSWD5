import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/PostsPage.module.css";

export default function PostsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchField, setSearchField] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [visibleCommentsPostId, setVisibleCommentsPostId] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [editingComments, setEditingComments] = useState({});
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  useEffect(() => {
    const stored = localStorage.getItem("activeUser");
    if (!stored) {
      navigate("/login");
    } else {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetch(`http://localhost:3000/posts?userId=${parsed.id}`)
        .then((res) => res.json())
        .then(setPosts);
    }
  }, [navigate]);

  const handleSearch = () => {
    let url = `http://localhost:3000/posts?userId=${userId}`;
    if (searchField === "id") url += `&id=${searchValue}`;
    else if (searchField === "title") url += `&title_like=${encodeURIComponent(searchValue)}`;

    fetch(url).then((res) => res.json()).then(setPosts);
  };

  const handleSelect = (id) => {
    setSelectedPostId(id === selectedPostId ? null : id);
  };

  const toggleComments = async (postId) => {
    if (visibleCommentsPostId === postId) {
      setVisibleCommentsPostId(null);
      return;
    }

    if (!commentsByPost[postId]) {
      const res = await fetch(`http://localhost:3000/comments?postId=${postId}`);
      const data = await res.json();
      setCommentsByPost((prev) => ({ ...prev, [postId]: data }));
    }

    setVisibleCommentsPostId(postId);
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const body = newComments[postId];
    if (!body || !user) return;

    const newComment = {
      postId,
      name: user.name,
      email: user.email,
      body,
    };

    const res = await fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });
    const saved = await res.json();

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), saved],
    }));
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleUpdateComment = async (postId, commentId, newBody) => {
    await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: newBody }),
    });

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: prev[postId].map((c) =>
        c.id === commentId ? { ...c, body: newBody } : c
      ),
    }));
  };

  const handleDeleteComment = async (postId, commentId) => {
    await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "DELETE",
    });

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: prev[postId].filter((c) => c.id !== commentId),
    }));
  };

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    const post = {
      ...newPost,
      userId: user.id,
    };

    const res = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    const saved = await res.json();
    setPosts((prev) => [...prev, saved]);
    setNewPost({ title: "", body: "" });
  };
  const handleDeletePost = async (id) => {
    await fetch(`http://localhost:3000/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdatePost = async (id, field, value) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const updated = { ...post, [field]: value };
    await fetch(`http://localhost:3000/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });

    setPosts((prev) =>
      prev.map((p) => (p.id === id ? updated : p))
    );
  };

  return (
    <div className={styles.container}>
      <h2>Posts</h2>

      <div className={styles.searchBar}>
        <label>Search by:</label>
        <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
          <option value="id">ID</option>
          <option value="title">Title</option>
        </select>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <form className={styles.addForm} onSubmit={handleAddPost}>
        <input
          name="title"
          placeholder="Post title"
          value={newPost.title}
          onChange={handlePostChange}
          required
        />
        <textarea
          name="body"
          placeholder="Post content"
          value={newPost.body}
          onChange={handlePostChange}
          required
        />
        <button type="submit">Add Post</button>
      </form>

      <ul className={styles.postList}>
        {posts.map((post) => (
          <li
            key={post.id}
            className={`${styles.postItem} ${
              selectedPostId === post.id ? styles.selected : ""
            }`}
          >
            <span><strong>ID:</strong> {post.id}</span>

            <input
              type="text"
              value={post.title}
              onChange={(e) => handleUpdatePost(post.id, "title", e.target.value)}
              onBlur={(e) => handleUpdatePost(post.id, "title", e.target.value)}
            />

            {selectedPostId === post.id && (
              <textarea
                className={styles.postBody}
                value={post.body}
                onChange={(e) => handleUpdatePost(post.id, "body", e.target.value)}
                onBlur={(e) => handleUpdatePost(post.id, "body", e.target.value)}
              />
            )}

            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            <button onClick={() => handleSelect(post.id)}>
              {selectedPostId === post.id ? "Hide" : "View"} Body
            </button>
            <button onClick={() => toggleComments(post.id)}>Show Comments</button>

            {visibleCommentsPostId === post.id && (
              <div className={styles.commentsSection}>
                <h4>Comments</h4>

                {(commentsByPost[post.id] || []).map((comment) => {
                  const isOwner = user && comment.email === user.email;
                  return (
                    <div key={comment.id} className={styles.commentItem}>
                      <strong>{comment.name}</strong>
                      {isOwner ? (
                        <textarea
                          value={editingComments[comment.id] ?? comment.body}
                          onChange={(e) =>
                            setEditingComments((prev) => ({
                              ...prev,
                              [comment.id]: e.target.value,
                            }))
                          }
                          onBlur={() =>
                            handleUpdateComment(
                              post.id,
                              comment.id,
                              editingComments[comment.id]
                            )
                          }
                        />
                      ) : (
                        <p>{comment.body}</p>
                      )}

                      {isOwner && (
                        <button
                          onClick={() =>
                            handleDeleteComment(post.id, comment.id)
                          }
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  );
                })}

                <form
                  className={styles.commentForm}
                  onSubmit={(e) => handleAddComment(e, post.id)}
                >
                  <textarea
                    value={newComments[post.id] || ""}
                    onChange={(e) =>
                      setNewComments((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder="Write a comment…"
                    required
                  />
                  <button type="submit">Add Comment</button>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
