import React, { useEffect, useState } from "react";
import TodoForm from "./TodoForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { TodosService } from "../../api/TodosService.js";
import Spinner from "../../components/Spinner.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import styles from "./Todos.module.css";
import BackButton from "../../components/BackButton.jsx";

export default function Todos() {
  const { activeUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("id");
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchField, setSearchField] = useState("title");
  const [searchValue, setSearchValue] = useState("");

  const handleToggleComplete = async (todo) => {
    try {
      const completed = !todo.completed;
      await TodosService.patch(todo.id, { completed });

      // Update local state
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, completed } : t))
      );
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const deleteTodos = async (todo) => {
    try {
      await TodosService.remove(todo.id);

      // Update local state
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleSave = async (todo) => {
    try {
      if (todo.id) {
        const updated = await TodosService.patch(todo.id, {
          title: todo.title,
          completed: todo.completed,
        });

        setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      } else {
        const newTodo = {
          ...todo,
          completed: false,
          userId: activeUser.id,
        };

        const saved = await TodosService.add(newTodo);
        setTodos((prev) => [...prev, saved]);
      }

      setShowForm(false);
    } catch (err) {
      console.error("Error saving todo:", err);
    }
  };

  useEffect(() => {
    if (activeUser) {
      let query = `?userId=${activeUser.id}`;

      if (searchField === "id") {
        query += `&id=${searchValue.trim()}`;
      } else if (searchField === "title") {
        query += `&title_like=${encodeURIComponent(searchValue.trim())}`;
      } else if (searchField === "completed") {
        const val = searchValue.toLowerCase();
        if (val === "true" || val === "false") {
          query += `&completed=${val}`;
        } else if (val) {
          return;
        } else {
          query = `?userId=${activeUser.id}`;
        }
      }

      const fn = searchValue
        ? TodosService.search(query)
        : TodosService.listByUserSorted(activeUser.id, sortBy);
      setLoading(true);

      fn.then((data) => {
        setTodos(data);
        setLoading(false);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [activeUser?.id, sortBy, showForm, searchValue]);

  if (loading) return <Spinner />;
  if (!activeUser) return <p>No user logged in</p>;

  return (
    <main className={styles.container}>
      <BackButton />
      <section className={styles.hero}>
        <h2>{activeUser.username}&apos;s Todos</h2>

        {/* ─── toolbar ───────────────────────────── */}
        <div className={styles.toolbar}>
          <label>
            Sort by:{" "}
            <select
              className={styles.control}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="id">ID</option>
              <option value="title">Title</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <select
            className={styles.control}
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="completed">Completed</option>
          </select>

          <SearchBar
            className={styles.searchInput}
            value={searchValue}
            onChange={setSearchValue}
            placeholder={`Search by ${searchField}…`}
          />

          <button
            className={styles.addBtn}
            onClick={() => {
              setEditingTodo(null);
              setShowForm(true);
            }}
          >
            Add
          </button>
        </div>

        {showForm && (
          <TodoForm
            initialData={editingTodo}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* ─── Todo grid ─────────────────────────── */}
        <ul className={styles.grid}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`${styles.card} ${todo.completed ? styles.done : ""}`}
            >
              <div>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                />{" "}
                (<strong>{todo.id}</strong>) {todo.title}
              </div>

              <div className={styles.icons}>
                <button
                  className={styles.iconBtn}
                  onClick={() => deleteTodos(todo)}
                >
                  🗑
                </button>
                <button
                  className={styles.iconBtn}
                  onClick={() => {
                    setEditingTodo(todo);
                    setShowForm(true);
                  }}
                >
                  ✏️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
