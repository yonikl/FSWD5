import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/PostsPage.module.css";
import Navbar from "../../components/Navbar";
import PostsSearchBar from "./PostsSearchBar";
import AddPostForm from "./AddPostForm";
import PostList from "./PostList";
import FullPostModal from "./FullPostModal";

export default function PostsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [modalPost, setModalPost] = useState(null);
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
    const value = searchValue.toLowerCase();
    return posts.filter((post) => {
      if (searchField === "id") return post.id.toString() === value;
      if (searchField === "title") return post.title.toLowerCase().includes(value);
      return true;
    });
  };

  const sortedPosts = handleSearch().sort((a, b) => {
    if (searchField === "id") return a.id - b.id;
    if (searchField === "title") return a.title.localeCompare(b.title);
    return 0;
  });

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

  if (!user) return null;

  return (
    <>
      <Navbar
        user={user}
        onLogout={() => {
          localStorage.removeItem("activeUser");
          navigate("/login");
        }}
        onHome={() => navigate("/home")}
      />

      <div className={styles.container}>
        <h2>Posts</h2>

        <PostsSearchBar
          searchField={searchField}
          setSearchField={setSearchField}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={handleSearch}
        />

        <AddPostForm
          newPost={newPost}
          onChange={handlePostChange}
          onSubmit={handleAddPost}
        />

        <PostList
          posts={sortedPosts}
          selectedPostId={selectedPostId}
          onSelect={handleSelect}
          onUpdate={handleUpdatePost}
          onDelete={handleDeletePost}
          user={user}
          commentsByPost={commentsByPost}
          visibleCommentsPostId={visibleCommentsPostId}
          toggleComments={toggleComments}
          newComments={newComments}
          setNewComments={setNewComments}
          editingComments={editingComments}
          setEditingComments={setEditingComments}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          onOpenModal={setModalPost}
        />
        <FullPostModal
          post={modalPost}
          user={user}
          onClose={() => setModalPost(null)}
        />
      </div>
    </>
  );
}
