import { useEffect, useState } from "react";
import styles from "../../styles/FullPostModal.module.css";

export default function FullPostModal({ post, user, onClose }) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (post && showComments) {
      fetch(`http://localhost:3000/comments?postId=${post.id}`)
        .then((res) => res.json())
        .then(setComments);
    }
  }, [post, showComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const comment = {
      postId: post.id,
      name: user.name,
      email: user.email,
      body: newComment,
    };

    const res = await fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });

    const saved = await res.json();
    setComments((prev) => [...prev, saved]);
    setNewComment("");
  };

  if (!post) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>×</button>
        
      
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        {/* ✅ כפתור הצגת תגובות */}
        <button onClick={() => setShowComments((prev) => !prev)}>
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>

        {/* ✅ בלוק תגובות */}
        {showComments && (
          <div className={styles.comments}>
            <h4>Comments</h4>
            <ul>
              {comments.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong>: {c.body}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
