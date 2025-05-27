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
}) {
  return (
    <li className={`${styles.postItem} ${isSelected ? styles.selected : ""}`}>
      <span><strong>ID:</strong> {post.id}</span>

      <input
        type="text"
        value={post.title}
        onChange={(e) => onUpdate(post.id, "title", e.target.value)}
        onBlur={(e) => onUpdate(post.id, "title", e.target.value)}
      />

      {isSelected && (
        <textarea
          className={styles.postBody}
          value={post.body}
          onChange={(e) => onUpdate(post.id, "body", e.target.value)}
          onBlur={(e) => onUpdate(post.id, "body", e.target.value)}
        />
      )}

      <button onClick={() => onDelete(post.id)}>Delete</button>
      <button onClick={() => onSelect(post.id)}>
        {isSelected ? "Hide" : "View"} Body
      </button>
      <button onClick={() => toggleComments(post.id)}>Show Comments</button>

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
