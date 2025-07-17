import React, { useState } from 'react';
import { tasksAPI } from '../services/api';

const TaskResponseModal = ({ task, onClose, onSubmit }) => {
    const [respuesta, setRespuesta] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await tasksAPI.respondTask(task.id, { respuesta });
            onSubmit();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar la respuesta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg max-w-2xl w-11/12 max-h-4/5 overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="m-0 text-gray-800 text-xl font-semibold">Responder Tarea: {task.nombre}</h3>
                    <button
                        className="bg-none border-none text-2xl cursor-pointer text-gray-600 p-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-8 p-4 bg-gray-50 rounded">
                        <h4 className="m-0 mb-2 text-gray-800 text-base font-semibold">Mensaje Original:</h4>
                        <p className="m-0 p-3 rounded bg-gray-50 border-l-4 border-gray-500 text-sm leading-relaxed">{task.mensaje}</p>

                        {task.mensaje_cordial && (
                            <>
                                <h4 className="m-0 mb-2 mt-4 text-gray-800 text-base font-semibold">Mensaje Cordial (IA):</h4>
                                <p className="m-0 p-3 rounded bg-blue-50 border-l-4 border-blue-500 text-sm leading-relaxed">{task.mensaje_cordial}</p>
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="respuesta" className="block mb-2 text-gray-600 font-medium">Tu Respuesta:</label>
                            <textarea
                                id="respuesta"
                                value={respuesta}
                                onChange={(e) => setRespuesta(e.target.value)}
                                required
                                rows="4"
                                placeholder="Escribe tu respuesta a esta tarea..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-base font-inherit resize-y focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>

                        <div className="flex gap-4 justify-end mb-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-500 text-white border-none rounded-md cursor-pointer transition-colors duration-300 hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-indigo-500 text-white border-none rounded-md cursor-pointer transition-colors duration-300 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Enviando...' : 'Enviar Respuesta'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 p-4 bg-blue-50 rounded border-l-4 border-blue-500">
                        <p className="m-0 text-blue-700 text-sm">
                            💡 Tu respuesta también será procesada por IA para generar una versión más cordial.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskResponseModal;
