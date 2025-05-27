import styles from "../../styles/TodosPage.module.css";

export default function TodosToolbar({
  sortBy,
  setSortBy,
  searchField,
  setSearchField,
  searchValue,
  setSearchValue,
  newTitle,
  setNewTitle,
  onAdd,
}) {
  return (
    <div className={styles.controlRow}>
      <div className={styles.controlSection}>
        <label htmlFor="field">Search by:</label>
        <select id="field" value={searchField} onChange={(e) => setSearchField(e.target.value)}>
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
        <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
        <button onClick={onAdd}>Add</button>
      </div>
    </div>
  );
}
