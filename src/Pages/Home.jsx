import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const res = await axios.get("https://todo-backend-khgt.onrender.com/list/dis");
            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!newTask.trim()) return alert("Task cannot be empty!");

        try {
            const res = await axios.post("https://todo-backend-khgt.onrender.com/list/ins", { task: newTask });
            setTasks([...tasks, res.data.data]);
            setNewTask("");
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task.");
        }
    }

    async function deleteTask(id) {
        try {
            await axios.delete(`https://todo-backend-khgt.onrender.com/list/del/${id}`);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task.");
        }
    }

    async function updateTask(id) {
        if (editingId === id) {
            if (!editingText.trim()) return alert("Updated task cannot be empty!");

            try {
                const res = await axios.put(`https://todo-backend-khgt.onrender.com/list/upd/${id}`, { task: editingText });
                setTasks(tasks.map(task => (task._id === id ? res.data.data : task)));
                setEditingId(null);
                setEditingText("");
            } catch (error) {
                console.error("Error updating task:", error);
                alert("Failed to update task.");
            }
        } else {
            const taskToEdit = tasks.find(task => task._id === id);
            setEditingId(id);
            setEditingText(taskToEdit.task);
        }
    }

    return (
        <div className="to-do-list">
            <h1>To-Do List</h1>

            <form onSubmit={handleSubmit} className="task-form">
                <input 
                    type="text" 
                    placeholder="Enter a task..." 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button type="submit">Add Task</button>
            </form>

            <div className="task-table">
                <div className="task-header">
                    <span className="header-item">Task Date & Time</span>
                    <span className="header-item">Task Name</span>
                    <span className="header-item">Actions</span>
                </div>

                <ol className="task-list">
                    {tasks.map((task) => (
                        <li key={task._id} className="task-item"> 
                            <span className="task-date">{new Date(task.dateTime).toLocaleString()}</span>
                            
                            {editingId === task._id ? (
                                <div className="edit-container">
                                    <input
                                        type="text"
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        className="edit-input"
                                    />
                                    <button onClick={() => updateTask(task._id)} className="update-btn">
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <span className="task-text">{task.task}</span>
                            )}

                            <div className="task-buttons">
                                {editingId !== task._id && (
                                    <button onClick={() => updateTask(task._id)} className="update-btn">
                                        Update
                                    </button>
                                )}
                                <button onClick={() => deleteTask(task._id)} className="delete-btn">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>

            <style>{`
                .to-do-list {
                    max-width: 700px;
                    margin: 40px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }

                h1 {
                    color: #2c3e50;
                    text-align: center;
                    margin-bottom: 30px;
                    font-size: 2.2em;
                }

                .task-form {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .task-form input {
                    flex: 1;
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                    font-size: 16px;
                }

                .task-form button {
                    padding: 10px 20px;
                    background-color: #2ecc71;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: 0.3s ease;
                }

                .task-table {
                    width: 100%;
                }

                .task-header {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px;
                    font-weight: bold;
                    background-color: #ecf0f1;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    text-align: center;
                }

                .header-item {
                    flex: 1;
                    text-align: center;
                }

                .task-list {
                    list-style: none;
                    padding: 0;
                }

                .task-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    background-color: white;
                    margin-bottom: 10px;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    border: 1px solid #ddd;
                }

                .task-date {
                    flex: 1;
                    font-size: 14px;
                    color: #7f8c8d;
                    text-align: center;
                }

                .task-text {
                    flex: 1;
                    font-size: 16px;
                    text-align: center;
                }

                .edit-container {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    flex: 1;
                }

                .edit-input {
                    flex: 1;
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                    font-size: 16px;
                    outline: none;
                }

                .task-buttons {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }

                .update-btn, .delete-btn {
                    padding: 8px 20px;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: 0.3s ease;
                }

                .update-btn {
                    background-color: #3498db;
                }

                .update-btn:hover {
                    background-color: #2980b9;
                }

                .delete-btn {
                    background-color: #e74c3c;
                }

                .delete-btn:hover {
                    background-color: #c0392b;
                }

                @media (max-width: 600px) {
                    .task-item {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .task-buttons {
                        width: 100%;
                        justify-content: space-between;
                    }
                }
            `}</style>
        </div>
    );
}

export default Home;
