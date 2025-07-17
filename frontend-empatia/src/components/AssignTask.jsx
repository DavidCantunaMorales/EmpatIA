import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import api from '../services/api';

const AssignTask = ({ onTaskAssigned }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        asignado_a: '',
        mensaje: ''
    });
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            // Necesitamos crear un endpoint para obtener miembros, por ahora simulamos
            // En el backend podrías agregar: GET /api/auth/members
            const response = await api.get('/auth/members');
            setMembers(response.data);
        } catch (err) {
            console.error('Error al cargar miembros:', err);
            // Si no existe el endpoint, mostrar mensaje
            setError('No se pudieron cargar los miembros. Asegúrate de conocer el ID del usuario.');
        }
    };

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
        setSuccess('');

        try {
            await tasksAPI.assignTask(formData);
            setSuccess('Tarea asignada exitosamente');
            setFormData({ nombre: '', asignado_a: '', mensaje: '' });

            if (onTaskAssigned) {
                onTaskAssigned();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al asignar la tarea');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h2 className="mb-8 text-gray-800 text-2xl font-semibold">Asignar Nueva Tarea</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-8">
                <div className="mb-6">
                    <label htmlFor="nombre" className="block mb-2 text-gray-600 font-medium">
                        Nombre de la Tarea
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Ej: Revisar documento de proyecto"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="asignado_a" className="block mb-2 text-gray-600 font-medium">
                        Asignar a (ID del Usuario)
                    </label>
                    {members.length > 0 ? (
                        <select
                            id="asignado_a"
                            name="asignado_a"
                            value={formData.asignado_a}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        >
                            <option value="">Selecciona un miembro</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.nombre_usuario}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="number"
                            id="asignado_a"
                            name="asignado_a"
                            value={formData.asignado_a}
                            onChange={handleChange}
                            required
                            placeholder="ID del usuario (número)"
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="mensaje" className="block mb-2 text-gray-600 font-medium">
                        Mensaje de la Tarea
                    </label>
                    <textarea
                        id="mensaje"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Describe la tarea que necesitas que se realice..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-base font-inherit resize-y focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-3 py-2 bg-indigo-500 text-white border-none rounded-md text-base cursor-pointer transition-colors duration-300 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? 'Asignando...' : 'Asignar Tarea'}
                </button>
            </form>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-lg text-center">
                <h3 className="m-0 mb-4 text-xl font-semibold">💡 Información sobre EmpatIA</h3>
                <p className="m-0 leading-relaxed opacity-90">
                    Al asignar una tarea, nuestro sistema de IA (DeepSeek) procesará tu mensaje
                    para convertirlo en una versión más cordial y empática, mejorando la
                    comunicación en el equipo.
                </p>
            </div>
        </div>
    );
};

export default AssignTask;
