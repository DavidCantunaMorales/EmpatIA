import React, { useState } from 'react';
import { tasksAPI } from '../services/api';
import api from '../services/api';

const TaskResponseModal = ({ task, onClose, onSubmit }) => {
    const [respuesta, setRespuesta] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [previewMode, setPreviewMode] = useState(false);
    const [cordialResponse, setCordialResponse] = useState('');
    const [selectedResponseType, setSelectedResponseType] = useState('cordial');
    const [generatingPreview, setGeneratingPreview] = useState(false);
    const [showOriginalTask, _] = useState(false);

    const generateResponsePreview = async () => {
        if (!respuesta.trim()) {
            setError('Por favor, escribe una respuesta antes de generar la previsualización');
            return;
        }

        setGeneratingPreview(true);
        setError('');

        try {
            const response = await api.post('/tasks/preview-response', {
                respuesta: respuesta,
                taskId: task.id
            });
            setCordialResponse(response.data.cordialResponse);
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

        try {
            const responseToSubmit = selectedResponseType === 'original' ? respuesta : cordialResponse || respuesta;
            await tasksAPI.respondTask(task.id, {
                respuesta: responseToSubmit,
                respuestaOriginal: respuesta,
                tipoRespuestaSeleccionada: selectedResponseType
            });
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
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="m-0 text-gray-800 text-base font-semibold">Mensaje de la Tarea:</h4>
                        </div>

                        {showOriginalTask ? (
                            <p className="m-0 p-3 rounded bg-gray-50 border-l-4 border-gray-500 text-sm leading-relaxed">{task.mensaje}</p>
                        ) : (
                            <p className="m-0 p-3 rounded bg-blue-50 border-l-4 border-blue-500 text-sm leading-relaxed">
                                {task.mensaje_cordial || task.mensaje}
                            </p>
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

                            {!previewMode && (
                                <button
                                    type="button"
                                    onClick={generateResponsePreview}
                                    disabled={generatingPreview || !respuesta.trim()}
                                    className="mt-3 px-4 py-2 bg-blue-500 text-white border-none rounded-md text-sm cursor-pointer transition-colors duration-300 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {generatingPreview ? 'Generando previsualización...' : '🔍 Generar Previsualización'}
                                </button>
                            )}
                        </div>

                        {previewMode && (
                            <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Previsualización de tu Respuesta</h3>

                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Respuesta Original:</h4>
                                    <div className="p-3 bg-white border border-gray-200 rounded text-sm">
                                        {respuesta}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Respuesta Cordial (EmpatIA):</h4>
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                                        {cordialResponse || 'No se pudo generar la versión cordial'}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2 text-gray-600 font-medium">
                                        ¿Qué versión de la respuesta quieres enviar?
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="original"
                                                checked={selectedResponseType === 'original'}
                                                onChange={(e) => setSelectedResponseType(e.target.value)}
                                                className="mr-2"
                                            />
                                            Respuesta Original
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="cordial"
                                                checked={selectedResponseType === 'cordial'}
                                                onChange={(e) => setSelectedResponseType(e.target.value)}
                                                className="mr-2"
                                            />
                                            Respuesta Cordial (Recomendado)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                disabled={loading || !previewMode}
                                className="px-4 py-2 bg-indigo-500 text-white border-none rounded-md cursor-pointer transition-colors duration-300 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Enviando...' : previewMode ? `Enviar (${selectedResponseType === 'original' ? 'Original' : 'Cordial'})` : 'Generar previsualización primero'}
                            </button>
                        </div>
                    </form>

                    {!previewMode && (
                        <div className="mt-4 p-4 bg-blue-50 rounded border-l-4 border-blue-500">
                            <p className="m-0 text-blue-700 text-sm">
                                💡 Genera una previsualización para ver cómo EmpatIA puede mejorar tu respuesta.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskResponseModal;
