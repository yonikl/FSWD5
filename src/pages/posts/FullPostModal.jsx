import { useEffect, useState,useRef } from "react";
import styles from "../../styles/FullPostModal.module.css";
import CommentsSection from "./CommentsSection";

export default function FullPostModal({ post, user, onClose, onCommentChange ,onPostUpdate }) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [editingComments, setEditingComments] = useState({});

  const titleRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) titleRef.current.value = post.title;
    if (bodyRef.current) bodyRef.current.value = post.body;
  }, [post]);

  useEffect(() => {
    if (post) {
      fetch(`http://localhost:3000/comments?postId=${post.id}`)
        .then((res) => res.json())
        .then(data => {
          setComments(data);
          // Update parent component's comments
          onCommentChange?.(post.id, data);
        });
    }
  }, [post, onCommentChange]);

  const handleAddComment = async (e) => {
    e.preventDefault();
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
    const updatedComments = [...comments, saved];
    setComments(updatedComments);
    // Update parent component's comments
    onCommentChange?.(post.id, updatedComments);
    setNewComment("");
  };

  const handleUpdatePost = async () => {
    const updatedTitle = titleRef.current.value;
    const updatedBody = bodyRef.current.value;

    await fetch(`http://localhost:3000/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: updatedTitle, body: updatedBody }),
    });

    onPostUpdate?.(post.id, updatedTitle, updatedBody);
  };
  const handleUpdateComment = async (commentId, newBody) => {
    await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: newBody }),
    });
    const updatedComments = comments.map((c) => 
      c.id === commentId ? { ...c, body: newBody } : c
    );
    setComments(updatedComments);
    // Update parent component's comments
    onCommentChange?.(post.id, updatedComments);
  };

  const handleDeleteComment = async (commentId) => {
    await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "DELETE",
    });
    const updatedComments = comments.filter((c) => c.id !== commentId);
    setComments(updatedComments);
    // Update parent component's comments
    onCommentChange?.(post.id, updatedComments);
  };

  if (!post) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>
        
        <div className={styles.postContent}>
          <span className={styles.postId}>Post #{post.id}</span>
          <input
            type="text"
            className={styles.editableTitle}
            defaultValue={post.title}
            ref={titleRef}
            onBlur={handleUpdatePost}
          />

          <textarea
            className={styles.editableBody}
            defaultValue={post.body}
            ref={bodyRef}
            onBlur={handleUpdatePost}
          />
        </div>

        <div className={styles.commentsSection}>
          <div className={styles.commentsHeader}>
            <h3>Comments</h3>
            <button 
              className={styles.toggleComments}
              onClick={() => setShowComments(!showComments)}
            >
              {showComments ? "Hide Comments" : "Show Comments"}
            </button>
          </div>

          {showComments && (
            <>
              <div className={styles.commentsList}>
                {comments.map((comment) => {
                  const isOwner = user && comment.email === user.email;
                  return (
                    <div key={comment.id} className={styles.commentItem}>
                      <div className={styles.commentHeader}>
                        <strong>{comment.name}</strong>
                        {isOwner && (
                          <button
                            className={styles.deleteComment}
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
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
                            handleUpdateComment(comment.id, editingComments[comment.id])
                          }
                          className={styles.commentEdit}
                        />
                      ) : (
                        <p>{comment.body}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <form className={styles.commentForm} onSubmit={handleAddComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  required
                />
                <button type="submit">Add Comment</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
