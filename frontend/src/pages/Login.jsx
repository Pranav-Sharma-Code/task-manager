import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.email || !formData.password)
            return setError('Please fill in all fields');
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" fixed h-screen w-full bg-indigo-950 px-4 flex items-center justify-center">

            <div className="absolute top-0 -left-20 h-40 w-40 sm:h-72 sm:w-72 rounded-full bg-purple-500/40 blur-3xl animate-bounce [animation-duration:2s]"></div>

            <div className="absolute bottom-0 -right-20 h-40 w-40 sm:h-72 sm:w-72 rounded-full bg-indigo-400/40 blur-3xl animate-bounce [animation-duration:2s]"></div>

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg p-6 sm:p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-4xl mb-2">📋</div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back!</h2>
                    <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-4 rounded-lg mb-4 border border-red-200">
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        className=" w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-all hover:scale-95 active:scale-90 duration-100  text-sm "
                    >
                        {loading ? '⏳ Login ho raha hai...' : 'Login →'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;