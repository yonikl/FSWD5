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
  return (
    <li className={`${styles.postItem} ${isSelected ? styles.selected : ""}`}>
      <span><strong>ID:</strong> {post.id}</span>


      <h3
        onClick={() => onOpenModal(post)}
        style={{ cursor: "pointer", color: "#007bff", margin: 0 }}
      >
        {post.title}
      </h3>
      <button onClick={() => onOpenModal(post)}>Open Full View</button>
      <button onClick={() => onDelete(post.id)}>Delete</button>
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
