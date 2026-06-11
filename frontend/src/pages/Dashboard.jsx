import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';



const Dashboard = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/tasks`, config);
            setTasks(res.data.tasks);
        } catch {
            console.log('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    // ✅ Bug 2 Fixed — filteredTasks properly defined
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || task.status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!formData.title) return setFormError('Title is required');
        try {
            setFormLoading(true);
            await axios.post(`${API_URL}/api/tasks`, formData, config);
            setFormData({ title: '', description: '' });
            setShowForm(false);
            setFormError('');
            fetchTasks();
            toast.success('Task added successfully');
        } catch (err) {
            setFormError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editTask.title) return setFormError('Title is required');
        try {
            setFormLoading(true);
            await axios.put(
                `${API_URL}/api/tasks/${editTask._id}`,
                { title: editTask.title, description: editTask.description },
                config
            );
            setEditTask(null);
            fetchTasks();
            toast.success('Task updated successfully');
        } catch (err) {
            setFormError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await axios.patch(`${API_URL}/api/tasks/${id}/toggle`, {}, config);
            setTasks(tasks =>
                tasks.map(task =>
                    task._id === id
                        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
                        : task
                )
            );
            toast.success('Task status updated');
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/tasks/${id}`, config);
            setTasks(tasks => tasks.filter(task => task._id !== id));
            toast.success('Task deleted');
        } catch {
            toast.error('Failed to delete task');
        }
    };

    const pendingCount = tasks.filter((t) => t.status === 'pending').length;
    const completedCount = tasks.filter((t) => t.status === 'completed').length;

    return (
        <div className="min-h-screen overflow-hidden bg-indigo-950 py-8 px-4">

            {/* Background blobs */}
            <div className="fixed top-0 -left-20 h-72 w-72 rounded-full bg-purple-500/40 blur-3xl animate-pulse [animation-duration:3s]" style={{ animationDelay: '5s' }}></div>
            <div className="fixed bottom-0 -right-20 h-72 w-72 rounded-full bg-indigo-400/40 blur-3xl animate-pulse [animation-duration:3s]" style={{ animationDelay: '5s' }}></div>

            <div className="bg-white/40 shadow-2xl backdrop-blur-lg border border-white/20 max-w-6xl mx-auto px-6 pt-6 rounded-2xl">


                <nav className="bg-gray-800 text-white px-4 sm:px-6 py-5 rounded-2xl shadow-lg">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        {/* Left */}
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📋</span>
                            <h1 className="text-lg font-bold tracking-wide">
                                Task Manager
                            </h1>
                        </div>

                        {/* Search */}
                        <div className="w-full lg:flex-1 lg:max-w-md">
                            <input
                                type="text"
                                placeholder="🔍 Search your tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="
                    w-full
                    px-4 py-2.5
                    rounded-lg
                    text-sm
                    bg-white/20
                    text-white
                    placeholder:text-slate-300
                    border border-white/20
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-400
                "
                            />
                        </div>

                        {/* Right */}
                        <div className="flex items-center justify-between lg:justify-end gap-4">
                            <span className="text-sm text-slate-300 truncate">
                                👋 {user?.name}
                            </span>

                            <button
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                                className="bg-red-500 hover:scale-95 active:scale-90 text-white text-sm px-4 py-1.5 rounded-lg"
                            >
                                Logout
                            </button>
                        </div>

                    </div>
                </nav>

                <div className="max-w-3xl mx-auto px-4 py-8">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-indigo-500 text-center">
                            <p className="text-3xl font-bold text-indigo-600">{tasks.length}</p>
                            <p className="text-sm text-gray-500 mt-1">Total Tasks</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-amber-400 text-center">
                            <p className="text-3xl font-bold text-amber-500">{pendingCount}</p>
                            <p className="text-sm text-gray-500 mt-1">Pending</p>
                        </div>
                        <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-emerald-500 text-center">
                            <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
                            <p className="text-sm text-gray-500 mt-1">Completed</p>
                        </div>
                    </div>




                    {/* Filter Buttons */}
                    <div className="flex gap-2 mb-4">
                        {['all', 'pending', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${filter === f
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f === 'all' ? '📋 All' : f === 'pending' ? '⏳ Pending' : '✅ Completed'}
                            </button>
                        ))}
                    </div>

                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">My Tasks</h2>
                        <button
                            onClick={() => { setShowForm(!showForm); setFormError(''); }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                            {showForm ? '✕ Cancel' : '+ Add Task'}
                        </button>
                    </div>

                    {/* Add Task Form */}
                    {showForm && (
                        <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-indigo-100">
                            <h3 className="font-medium text-gray-800 mb-3">Create New Task</h3>
                            {formError && <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">⚠️ {formError}</p>}
                            <form onSubmit={handleAddTask} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Task title *"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                                <textarea
                                    placeholder="Description (optional)"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                                />
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm px-5 py-2 rounded-lg transition-colors"
                                >
                                    {formLoading ? '⏳ Creating Task...' : '✓ Create Task'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Edit Task Form */}
                    {editTask && (
                        <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-amber-100">
                            <h3 className="font-medium text-gray-800 mb-3">✏️ Edit Task</h3>
                            {formError && <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">⚠️ {formError}</p>}
                            <form onSubmit={handleUpdate} className="space-y-3">
                                <input
                                    type="text"
                                    value={editTask.title}
                                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                                <textarea
                                    value={editTask.description}
                                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm px-5 py-2 rounded-lg transition-colors"
                                    >
                                        {formLoading ? '⏳ Saving...' : '✓ Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditTask(null)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-5 py-2 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-16 text-gray-400">⏳ Loading tasks...</div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                            <p className="text-5xl mb-3">📝</p>
                            <p className="text-gray-500">No tasks found — create your first task!</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                            <p className="text-5xl mb-3">🔍</p>
                            <p className="text-gray-500">No tasks match your search or filter</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-center justify-between hover:shadow-md transition-shadow"
                                >
                                    {/* Left */}
                                    <div className="flex min-w-0 items-center justify-center gap-3 flex-1">
                                        <input
                                            type="checkbox"
                                            checked={task.status === 'completed'}
                                            onChange={() => handleToggle(task._id)}
                                            className="mt-1 w-4 h-4 accent-indigo-600 cursor-pointer"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p
                                                onClick={() => setExpanded(expanded === task._id ? null : task._id)}
                                                className={`font-medium font-sans text-xl cursor-pointer
                                                    ${expanded === task._id ? 'break-all' : 'truncate'}
                                                    ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}
                                            >
                                                {task.title}
                                            </p>
                                            {task.description && (
                                                <p className={`text-sm font-mono text-gray-400 mt-0.5
                                                    ${expanded === task._id ? 'break-all' : 'truncate'}`}
                                                >
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                                            ${task.status === 'completed'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'}`}
                                        >
                                            {task.status}
                                        </span>
                                        <button
                                            onClick={() => { setEditTask(task); setShowForm(false); setFormError(''); }}
                                            className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task._id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;