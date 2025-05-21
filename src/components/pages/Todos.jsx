import React, { useEffect, useState } from "react";
import TodoForm from "../other/TodoForm";

export default function Todos() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("id");
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const handleToggleComplete = async (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      const res = await fetch(`http://localhost:3001/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: updatedTodo.completed }),
      });

      if (!res.ok) throw new Error("Failed to update todo");

      // Update local state
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updatedTodo : t)));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const deleteTodos = async (todo) => {
    try {
      const res = await fetch(`http://localhost:3001/todos/${todo.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      // Update local state
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortBy === "id") {
      return Number(a.id) - Number(b.id);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "completed") {
      return Number(b.completed) - Number(a.completed);
    } else {
      return 0;
    }
  });

  const getNextNumericId = () => {
    const numericIds = todos
      .map((t) => parseInt(t.id))
      .filter((n) => !isNaN(n));
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
    return maxId + 1;
  };

  // save the changes or create a new todo
  const handleSave = async (todo) => {
    try {
      if (todo.id) {
        const res = await fetch(`http://localhost:3001/todos/${todo.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: todo.title,
            completed: todo.completed,
          }),
        });

        if (!res.ok) throw new Error("Failed to update");

        setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
      } else {
        const newTodo = { ...todo, id: getNextNumericId(), completed: false, userId: user.id };
        const res = await fetch(`http://localhost:3001/todos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        });

        if (!res.ok) throw new Error("Failed to create");

        const saved = await res.json();
        setTodos((prev) => [...prev, saved]);
      }

      setShowForm(false);
    } catch (err) {
      console.error("Error saving todo:", err);
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      fetch(`http://localhost:3001/todos?userId=${savedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          setTodos(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch todos:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading todos...</p>;
  if (!user) return <p>No user logged in</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "1em" }}>
      <h2>{user.username}'s Todos</h2>
      <label>Sort by: </label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="id">ID</option>
        <option value="title">Title</option>
        <option value="completed">Completed</option>
      </select>
      <br />
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
        {sortedTodos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: "0.5em" }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo)}
              style={{ marginRight: "0.5em" }}
            />
            ({todo.id}) <strong>{todo.title}</strong>
            <button onClick={() => deleteTodos(todo)}>-</button>
            <button
              onClick={() => {
                setEditingTodo(todo);
                setShowForm(true);
              }}
              style={{ marginLeft: "0.5em" }}
            >
              ✏️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
