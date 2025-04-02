import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // Fetch tasks from backend
    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const res = await axios.get("http://localhost:5000/list/dis");
            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!newTask.trim()) return alert("Task cannot be empty!");

        try {
            const res = await axios.post("http://localhost:5000/list/ins", { task: newTask });
            setTasks([...tasks, res.data.data]);
            setNewTask("");
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task.");
        }
    }

    async function deleteTask(id) {
        try {
            await axios.delete(`http://localhost:5000/list/del/${id}`);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task.");
        }
    }

    async function updateTask(id) {
        if (editingId === id) {
            try {
                const res = await axios.put(`http://localhost:5000/list/upd/${id}`, { task: editingText });
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
        <div className="to-do-list" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '30px', fontSize: '2.5em' }}>To-Do List</h1>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Enter a task..." 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }}
                />
                <button 
                    type="submit"
                    style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Add Task
                </button>
            </form>

            <ol style={{ listStyle: 'none', padding: 0 }}>
                {tasks.map((task) => (
                    <li key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'white', marginBottom: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}> 
                        {editingId === task._id ? (
                            <input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                style={{ flex: 1, padding: '5px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' }}
                            />
                        ) : (
                            <span>{task.task}</span>
                        )}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => updateTask(task._id)} style={{ padding: '8px 15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                {editingId === task._id ? "Save" : "Update"}
                            </button>
                            <button onClick={() => deleteTask(task._id)} style={{ padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default Home;