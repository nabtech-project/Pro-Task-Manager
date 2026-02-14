import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://pro-task-manager.onrender.com/";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (token) fetchTasks();
    }, [token]);

    const fetchTasks = async () => {
        const res = await axios.get(`${API}/tasks`, {
            headers: { Authorization: token }
        });
        setTasks(res.data);
    };

    const addTask = async () => {
        await axios.post(`${API}/tasks`, { title }, {
            headers: { Authorization: token }
        });
        setTitle("");
        fetchTasks();
    };

    if (!token) {
        return <Auth setToken={setToken} />;
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Pro Task Manager</h1>
            <input value={title} onChange={e => setTitle(e.target.value)} />
            <button onClick={addTask}>Add</button>

            {tasks.map(task => (
                <div key={task._id}>
                    {task.title} {task.completed ? "✅" : ""}
                </div>
            ))}

            <button onClick={() => {
                localStorage.removeItem("token");
                setToken(null);
            }}>Logout</button>
        </div>
    );
}

function Auth({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const res = await axios.post(`${API}/auth/login`, { email, password });
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
    };

    return (
        <div style={{ padding: 40 }}>
            <h2>Login</h2>
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
        </div>
    );
}

export default App;
