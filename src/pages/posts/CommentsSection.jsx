import styles from "../../styles/PostsPage.module.css";

export default function CommentsSection({
  postId,
  user,
  comments,
  newComment,
  setNewComment,
  editingComments,
  setEditingComments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) {
  return (
    <div className={styles.commentsSection}>
      <h4>Comments</h4>

      {comments.map((comment) => {
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
                  onUpdateComment(postId, comment.id, editingComments[comment.id])
                }
              />
            ) : (
              <p>{comment.body}</p>
            )}

            {isOwner && (
              <button onClick={() => onDeleteComment(postId, comment.id)}>Delete</button>
            )}
          </div>
        );
      })}

      <form
        className={styles.commentForm}
        onSubmit={(e) => onAddComment(e, postId)}
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment…"
          required
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}
