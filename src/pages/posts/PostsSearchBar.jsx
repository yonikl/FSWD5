import styles from "../../styles/PostsPage.module.css";

export default function PostsSearchBar({
  searchField,
  setSearchField,
  searchValue,
  setSearchValue,
  onSearch,
}) {
  return (
    <div className={styles.searchBar}>
      <label>Search by:</label>
      <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
        <option value="id">ID</option>
        <option value="title">Title</option>
      </select>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
}
