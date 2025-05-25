import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/TodosPage.module.css";

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
      if (searchField === "completed") return value === "true" ? todo.completed : value === "false" ? !todo.completed : true;
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
    const newTodo = {
      userId: user.id,
      title: newTitle,
      completed: false,
    };
    const res = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    const created = await res.json();
    setTodos([...todos, created]);
    setNewTitle("");
  };

  const handleDeleteTodo = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleEditTitle = async (id, newTitle) => {
    const updatedTodo = todos.find((todo) => todo.id === id);
    if (!updatedTodo) return;

    const updated = { ...updatedTodo, title: newTitle };
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  return (
    <div className={styles.container}>
      <h2>Todos for {user?.name}</h2>

      <div className={styles.controlRow}>
        <div className={styles.controlSection}>
          <label htmlFor="field">Search by:</label>
          <select
            id="field"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="completed">Completed</option>
          </select>

          <input
            type="text"
            placeholder="Enter search value..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className={styles.controlSection}>
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className={styles.controlSection}>
          <label htmlFor="new">Add Todo:</label>
          <input
            id="new"
            type="text"
            placeholder="New todo title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={handleAddTodo}>Add</button>
        </div>
      </div>

      <ul className={styles.todoList}>
        {sortedTodos.map((todo) => (
          <li key={todo.id} className={styles.todoItem}>
            <span>
              <strong>ID:</strong> {todo.id}
            </span>
            <span>
              <strong>Title:</strong>
              <input
                type="text"
                defaultValue={todo.title}
                onBlur={(e) => handleEditTitle(todo.id, e.target.value)}
              />
            </span>
            <span>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={async () => {
                  const updatedTodo = {
                    ...todo,
                    completed: !todo.completed,
                  };
                  await fetch(`http://localhost:3000/todos/${todo.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ completed: updatedTodo.completed }),
                  });

                  setTodos((prev) =>
                    prev.map((t) => (t.id === todo.id ? updatedTodo : t))
                  );
                }}
              />
              Completed
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
