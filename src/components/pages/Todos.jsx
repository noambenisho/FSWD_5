import React, { useEffect, useState } from "react";

export default function Todos() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("id");

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

//   const updateTodo = async (id, title) => {
//     try {
//       const res = await fetch(`http://localhost:3001/todos/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title }),
//       });

//       if (!res.ok) throw new Error("Failed to update todo");
//     } catch (err) {
//       console.error("Error updating todo:", err);
//     }
//   };

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
            {/* <input
              type="text"
              value={todo.title}
              onChange={(e) =>
                setTodos((prev) =>
                  prev.map((t) =>
                    t.id === todo.id ? { ...t, title: e.target.value } : t
                  )
                )
              }
              style={{ marginRight: "0.5em" }}
            /> */}
            <button onClick={() => deleteTodos(todo)}>-</button>
            {/* <button onClick={() => updateTodo(todo, )}></button> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
