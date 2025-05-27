import React, { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { TodosService } from "../api/TodosService.js";
import Spinner from "../components/Spinner.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { AlbumsService } from "../api/AlbumsService.js";

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
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, completed } : t)));
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

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    let query = `/todos?userId=${activeUser.id}`;

    if (searchField === "id") {
      query += `&id=${searchValue.trim()}`;
    } else if (searchField === "title") {
      query += `&title_like=${encodeURIComponent(searchValue.trim())}`;
    } else if (searchField === "completed") {
      const val = searchValue.toLowerCase();
      if (val === "true" || val === "false") {
        query += `&completed=${val}`;
      } else {
        alert("Enter true or false for completed status.");
        return;
      }
    }

    setLoading(true);
    TodosService.search(query)
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Search failed:", err);
        setLoading(false);
      });
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
        } else {
          alert("Enter true or false for completed status.");
          return;
        }
      }
      
      const fn = searchValue
        ? TodosService.search(query)
        : TodosService.listByUserSorted(activeUser.id, sortBy);
      setLoading(true);

      fn
        .then((data) => {
          setTodos(data);
          setLoading(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [ activeUser?.id, sortBy, showForm, searchValue ]);

  if (loading) return <Spinner />;
  if (!activeUser) return <p>No user logged in</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "1em" }}>
      <h2>{activeUser.username}'s Todos</h2>
      <label>Sort by: </label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="id">ID</option>
        <option value="title">Title</option>
        <option value="completed">Completed</option>
      </select>
      <br />
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        style={{ marginTop: "0.5em" }}
      >
        <option value="id">ID</option>    
        <option value="title">Title</option>
        <option value="completed">Completed</option>
      </select>
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
      />
      <button
        onClick={() => {
          setEditingTodo(null);
          setShowForm(true);
        }}
      >
        Add
      </button>

      {showForm && (
        <TodoForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          initialData={editingTodo}
        />
      )}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: "0.5em" }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo)}
              style={{ marginRight: "0.5em" }}
            />
            ({todo.id}) <strong>{todo.title}</strong>
            <button onClick={() => deleteTodos(todo)}
             style={{ background: "none", cursor: "pointer", fontSize: "1.1em", marginLeft: "0.5em" }}>
                🗑️
            </button>
            <button
              onClick={() => {
                setEditingTodo(todo);
                setShowForm(true);
              }}
                style={{ background: "none", cursor: "pointer", fontSize: "1.1em", marginLeft: "0.2em" }}
            >
              ✏️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
