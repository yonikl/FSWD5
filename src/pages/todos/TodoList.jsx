import TodoItem from "./TodoItem";
import styles from "../../styles/TodosPage.module.css";

export default function TodoList({ todos, onEdit, onToggle, onDelete }) {
  return (
    <ul className={styles.todoList}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
