import React, { useState } from "react";
import useToDoList from "../hooks/useToDoList";

const UserPage = ({ handleLogout, userName, token }) => {
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskName, setEditingTaskName] = useState("");
  const {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    moveTaskUp,
    moveTaskDown,
    loading,
    error,
  } = useToDoList(token);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  async function handleAddTask() {
    await addTask(newTask);
    setNewTask("");
  }

  function handleEditTaskChange(event) {
    setEditingTaskName(event.target.value);
  }

  async function handleUpdateTask() {
    if (editingTaskId) {
      await updateTask(editingTaskId, editingTaskName);
      setEditingTaskId(null);
      setEditingTaskName("");
    }
  }

  function startEditingTask(id, name) {
    setEditingTaskId(id);
    setEditingTaskName(name);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>User Page</h2>
      <p>Welcome, {userName}!</p>
      <button onClick={handleLogout}>Logout</button>
      <div className="to-do-list">
        <h1>To-Do List</h1>
        <div>
          <input
            type="text"
            placeholder="Enter new task..."
            value={newTask}
            onChange={handleInputChange}
          />
          <button className="add-button" onClick={handleAddTask}>
            Add
          </button>
        </div>
        <ol>
          {tasks.map((task, index) => (
            <li key={task.id}>
              {editingTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editingTaskName}
                    onChange={handleEditTaskChange}
                  />
                  <button className="update-button" onClick={handleUpdateTask}>
                    Update
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setEditingTaskId(null);
                      setEditingTaskName("");
                    }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="text">{task.name}</span>
                  <button
                    className="edit-button"
                    onClick={() => startEditingTask(task.id, task.name)}>
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                  <button
                    className="move-button"
                    onClick={() => moveTaskUp(index)}>
                    👆
                  </button>
                  <button
                    className="move-button"
                    onClick={() => moveTaskDown(index)}>
                    👇
                  </button>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default UserPage;
