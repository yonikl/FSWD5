import PostItem from "./PostItem";
import styles from "../../styles/PostsPage.module.css";

export default function PostList({
  posts,
  selectedPostId,
  onSelect,
  onUpdate,
  onDelete,
  user,
  commentsByPost,
  visibleCommentsPostId,
  toggleComments,
  newComments,
  setNewComments,
  editingComments,
  setEditingComments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) {
  return (
    <ul className={styles.postList}>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          isSelected={selectedPostId === post.id}
          onSelect={onSelect}
          onUpdate={onUpdate}
          onDelete={onDelete}
          user={user}
          comments={commentsByPost[post.id] || []}
          showComments={visibleCommentsPostId === post.id}
          toggleComments={toggleComments}
          newComment={newComments[post.id] || ""}
          setNewComment={(val) =>
            setNewComments((prev) => ({ ...prev, [post.id]: val }))
          }
          editingComments={editingComments}
          setEditingComments={setEditingComments}
          onAddComment={onAddComment}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </ul>
  );
}
