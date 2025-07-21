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
    const [previewMode, setPreviewMode] = useState(false);
    const [cordialMessage, setCordialMessage] = useState('');
    const [selectedMessageType, setSelectedMessageType] = useState('cordial');
    const [generatingPreview, setGeneratingPreview] = useState(false);

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

    const generatePreview = async () => {
        if (!formData.mensaje.trim()) {
            setError('Por favor, escribe un mensaje antes de generar la previsualización');
            return;
        }

        setGeneratingPreview(true);
        setError('');

        try {
            // Crear un endpoint temporal para obtener la previsualización
            const response = await api.post('/tasks/preview', { mensaje: formData.mensaje });
            setCordialMessage(response.data.cordialMessage);
            setPreviewMode(true);
        } catch (err) {
            setError('Error al generar la previsualización');
            console.error('Error:', err);
        } finally {
            setGeneratingPreview(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Preparar los datos con el mensaje seleccionado
            const dataToSubmit = {
                ...formData,
                mensaje: selectedMessageType === 'original' ? formData.mensaje : cordialMessage || formData.mensaje,
                mensajeOriginal: formData.mensaje, // Enviar también el mensaje original
                tipoMensajeSeleccionado: selectedMessageType
            };

            await tasksAPI.assignTask(dataToSubmit);
            setSuccess('Tarea asignada exitosamente');
            setFormData({ nombre: '', asignado_a: '', mensaje: '' });
            setPreviewMode(false);
            setCordialMessage('');
            setSelectedMessageType('cordial');

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
        <div className="">
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
                        Asignar a
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

                    {!previewMode && (
                        <button
                            type="button"
                            onClick={generatePreview}
                            disabled={generatingPreview || !formData.mensaje.trim()}
                            className="mt-3 px-4 py-2 bg-blue-500 text-white border-none rounded-md text-sm cursor-pointer transition-colors duration-300 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {generatingPreview ? 'Generando previsualización...' : '🔍 Generar Previsualización'}
                        </button>
                    )}
                </div>

                {previewMode && (
                    <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Previsualización del Mensaje</h3>

                        <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2">Mensaje Original:</h4>
                            <div className="p-3 bg-white border border-gray-200 rounded text-sm">
                                {formData.mensaje}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2">Mensaje Cordial (EmpatIA):</h4>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                                {cordialMessage || 'No se pudo generar la versión cordial'}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 text-gray-600 font-medium">
                                ¿Qué versión del mensaje quieres enviar?
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="original"
                                        checked={selectedMessageType === 'original'}
                                        onChange={(e) => setSelectedMessageType(e.target.value)}
                                        className="mr-2"
                                    />
                                    Mensaje Original
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="cordial"
                                        checked={selectedMessageType === 'cordial'}
                                        onChange={(e) => setSelectedMessageType(e.target.value)}
                                        className="mr-2"
                                    />
                                    Mensaje Cordial (Recomendado)
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !previewMode}
                    className="w-full px-3 py-2 bg-indigo-500 text-white border-none rounded-md text-base cursor-pointer transition-colors duration-300 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? 'Asignando...' : previewMode ? `Asignar Tarea (${selectedMessageType === 'original' ? 'Mensaje Original' : 'Mensaje Cordial'})` : 'Generar previsualización primero'}
                </button>
            </form>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-lg text-center">
                <h3 className="m-0 mb-4 text-xl font-semibold">💡 Información sobre EmpatIA</h3>
                <p className="m-0 leading-relaxed opacity-90">
                    Al asignar una tarea, nuestro Tutor Experto EmpatIA procesará tu mensaje
                    para convertirlo en una versión más cordial y empática, mejorando la
                    comunicación en el equipo.
                </p>
            </div>
        </div>
    );
};

export default AssignTask;
