import styles from "../../styles/PostsPage.module.css";

export default function AddPostForm({ newPost, onChange, onSubmit }) {
  return (
    <form className={styles.addForm} onSubmit={onSubmit}>
      <input
        name="title"
        placeholder="Post title"
        value={newPost.title}
        onChange={onChange}
        required
      />
      <textarea
        name="body"
        placeholder="Post content"
        value={newPost.body}
        onChange={onChange}
        required
      />
      <button type="submit">Add Post</button>
    </form>
  );
}
