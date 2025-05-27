import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/TodosPage.module.css";
import Navbar from "../../components/Navbar";
import TodosToolbar from "./TodosToolbar";
import TodoList from "./TodoList";

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [searchField, setSearchField] = useState("title");
  const [searchValue, setSearchValue] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("activeUser");
    if (!stored) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    fetch(`http://localhost:3000/todos?userId=${parsedUser.id}`)
      .then((res) => res.json())
      .then(setTodos);
  }, [navigate]);

  const handleSearch = () => {
    const value = searchValue.toLowerCase();
    return todos.filter((todo) => {
      if (searchField === "id") return todo.id.toString() === value;
      if (searchField === "title") return todo.title.toLowerCase().includes(value);
      if (searchField === "completed")
        return value === "true" ? todo.completed : value === "false" ? !todo.completed : true;
      return true;
    });
  };

  const sortedTodos = handleSearch().sort((a, b) => {
    if (sortBy === "id") return a.id - b.id;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "completed") return a.completed - b.completed;
    return 0;
  });

  const handleAddTodo = async () => {
    if (!newTitle.trim()) return;
    const resAll = await fetch("http://localhost:3000/todos");
    const allTodos = await resAll.json();
    const maxId = allTodos.reduce((max, todo) => Math.max(max, Number(todo.id)), 0);
    const newId = (maxId + 1).toString();

    const newTodo = {
      id: newId,
      userId: Number(user.id),
      title: newTitle,
      completed: false,
    };
    const res = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    const created = await res.json();
    setTodos((prev) => [...prev, created]);
    setNewTitle("");
  };

  const handleDeleteTodo = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleEditTitle = async (id, newTitle) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const updated = { ...todo, title: newTitle };
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleToggleCompleted = async (todo) => {
    const updated = { ...todo, completed: !todo.completed };
    await fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: updated.completed }),
    });
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
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
        <h2>Todos for {user.name}</h2>

        <TodosToolbar
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchField={searchField}
          setSearchField={setSearchField}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onAdd={handleAddTodo}
        />

        <TodoList
          todos={sortedTodos}
          onEdit={handleEditTitle}
          onToggle={handleToggleCompleted}
          onDelete={handleDeleteTodo}
        />
      </div>
    </>
  );
}
