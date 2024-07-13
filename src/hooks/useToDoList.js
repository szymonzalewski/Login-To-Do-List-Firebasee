import { useState, useEffect } from "react";
import axios from "axios";

const useToDoList = (token) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5033/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskName) => {
    if (taskName.trim() !== "") {
      try {
        const response = await axios.post(
          "http://localhost:5033/tasks",
          {
            name: taskName,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setTasks((prevTasks) => [
          ...prevTasks,
          { id: response.data.id, name: taskName },
        ]);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5033/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTask = async (id, updatedName) => {
    try {
      await axios.put(
        `http://localhost:5033/tasks/${id}`,
        { name: updatedName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, name: updatedName } : task,
        ),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const moveTaskUp = (index) => {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  const moveTaskDown = (index) => {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    moveTaskUp,
    moveTaskDown,
    loading,
    error,
  };
};

export default useToDoList;
