import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        nombre_usuario: '',
        contrasena: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-center mb-8 text-gray-800 text-3xl font-semibold">Iniciar Sesión - EmpatIA</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nombre_usuario" className="block mb-2 text-gray-600 font-medium">
                            Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            id="nombre_usuario"
                            name="nombre_usuario"
                            value={formData.nombre_usuario}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="contrasena" className="block mb-2 text-gray-600 font-medium">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-3 py-2 bg-indigo-500 text-white border-none rounded-md text-base cursor-pointer transition-colors duration-300 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    ¿No tienes una cuenta? <Link to="/register" className="text-indigo-500 no-underline hover:underline">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
