import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import TaskResponseModal from './TaskResponseModal';

const TaskList = ({ onTaskResponded }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const tasksData = await tasksAPI.getTasks();
            setTasks(tasksData);
            setError('');
        } catch (err) {
            setError('Error al cargar las tareas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResponseSubmitted = () => {
        fetchTasks();
        setSelectedTask(null);
        if (onTaskResponded) {
            onTaskResponded();
        }
    };

    const getStatusBadge = (estado) => {
        const statusMap = {
            'pendiente': { class: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
            'completada': { class: 'bg-green-100 text-green-800', text: 'Completada' }
        };
        const status = statusMap[estado] || { class: 'bg-gray-100 text-gray-800', text: estado };
        return <span className={`px-3 py-1 rounded-2xl text-sm font-medium ${status.class}`}>{status.text}</span>;
    };

    if (loading) {
        return <div className="flex items-center justify-center p-8 text-lg text-gray-600">Cargando tareas...</div>;
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">{error}</div>;
    }

    return (
        <div className="w-full">
            <h2 className="mb-8 text-gray-800 text-2xl font-semibold">
                {user?.rol === 'lider' ? 'Todas las Tareas' : 'Mis Tareas Asignadas'}
            </h2>

            {tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-600 text-lg">
                    No hay tareas disponibles.
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {tasks.map((task) => (
                        <div key={task.id} className="bg-white rounded-lg p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                                <h3 className="m-0 text-gray-800 text-xl font-semibold">{task.nombre}</h3>
                                {getStatusBadge(task.estado)}
                            </div>

                            <div className="mb-4">
                                <p className="my-1 text-gray-600 text-sm"><strong>Asignado a:</strong> {task.asignado_nombre}</p>
                                <p className="my-1 text-gray-600 text-sm"><strong>Creado por:</strong> {task.creado_por_nombre}</p>
                                <p className="my-1 text-gray-600 text-sm"><strong>Fecha:</strong> {new Date(task.fecha_creacion).toLocaleDateString()}</p>
                            </div>

                            <div className="my-4">
                                <div className="mb-4">
                                    <h4 className="m-0 mb-2 text-gray-800 text-sm font-semibold">Mensaje Original:</h4>
                                    <p className="m-0 p-3 rounded bg-gray-50 border-l-4 border-gray-500 text-sm leading-relaxed">{task.mensaje}</p>
                                </div>

                                {task.mensaje_cordial && (
                                    <div className="mb-4">
                                        <h4 className="m-0 mb-2 text-gray-800 text-sm font-semibold">Mensaje Cordial (IA):</h4>
                                        <p className="m-0 p-3 rounded bg-blue-50 border-l-4 border-blue-500 text-sm leading-relaxed">{task.mensaje_cordial}</p>
                                    </div>
                                )}

                                {task.respuesta && (
                                    <div className="mb-4">
                                        <h4 className="m-0 mb-2 text-gray-800 text-sm font-semibold">Respuesta:</h4>
                                        <p className="m-0 p-3 rounded bg-green-50 border-l-4 border-green-500 text-sm leading-relaxed">{task.respuesta}</p>
                                    </div>
                                )}

                                {task.respuesta_cordial && (
                                    <div className="mb-4">
                                        <h4 className="m-0 mb-2 text-gray-800 text-sm font-semibold">Respuesta Cordial (IA):</h4>
                                        <p className="m-0 p-3 rounded bg-orange-50 border-l-4 border-orange-500 text-sm leading-relaxed">{task.respuesta_cordial}</p>
                                    </div>
                                )}
                            </div>

                            {user?.rol === 'miembro' &&
                                task.asignado_a === user.id &&
                                task.estado === 'pendiente' && (
                                    <button
                                        className="w-full px-3 py-2 bg-indigo-500 text-white border-none rounded-md text-base cursor-pointer transition-colors duration-300 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
                                        onClick={() => setSelectedTask(task)}
                                    >
                                        Responder Tarea
                                    </button>
                                )}
                        </div>
                    ))}
                </div>
            )}

            {selectedTask && (
                <TaskResponseModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onSubmit={handleResponseSubmitted}
                />
            )}
        </div>
    );
};

export default TaskList;
