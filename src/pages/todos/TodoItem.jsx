import styles from "../../styles/TodosPage.module.css";

export default function TodoItem({ todo, onEdit, onToggle, onDelete }) {
  return (
    <li className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
      <span>
        <strong>ID:</strong> {todo.id}
      </span>
      <span>
        <strong>Title:</strong>
        <input
          type="text"
          defaultValue={todo.title}
          onBlur={(e) => onEdit(todo.id, e.target.value)}
        />
      </span>
      <span>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
        <label>Completed</label>
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}
