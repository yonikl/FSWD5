import styles from "../../styles/PostsPage.module.css";
import CommentsSection from "./CommentsSection";

export default function PostItem({
  post,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  user,
  comments,
  showComments,
  toggleComments,
  newComment,
  setNewComment,
  editingComments,
  setEditingComments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onOpenModal
}) {
  const handleCardClick = (e) => {
    // Don't trigger if clicking on buttons or comments section
    if (e.target.closest('button') || e.target.closest(`.${styles.commentsSection}`)) {
      return;
    }
    onOpenModal(post);
  };

  return (
    <li 
      className={`${styles.postItem} ${isSelected ? styles.selected : ""}`}
      onClick={handleCardClick}
    >
      <div className={styles.postContent}>
        <span>Post #{post.id}</span>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
      
      <div className={styles.buttonGroup}>
        <button onClick={() => onOpenModal(post)}>
          View Full Post
        </button>
        <button onClick={() => onDelete(post.id)}>
          Delete Post
        </button>
        <button onClick={() => toggleComments(post.id)}>
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      {showComments && (
        <CommentsSection
          postId={post.id}
          user={user}
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          editingComments={editingComments}
          setEditingComments={setEditingComments}
          onAddComment={onAddComment}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
        />
      )}
    </li>
  );
}
