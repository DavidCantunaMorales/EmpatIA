import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaskList from './TaskList';
import AssignTask from './AssignTask';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('tasks');
    const [refreshTasks, setRefreshTasks] = useState(0);

    const handleTaskAssigned = () => {
        setRefreshTasks(prev => prev + 1);
        setActiveTab('tasks');
    };

    const handleTaskResponded = () => {
        setRefreshTasks(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md py-4">
                <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
                    <h1 className="text-gray-800 text-3xl font-semibold m-0">EmpatIA - Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span>Bienvenido, {user?.nombre_usuario}</span>
                        <span className="bg-indigo-500 text-white px-2 py-1 rounded-2xl text-sm font-medium">
                            ({user?.rol})
                        </span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-gray-500 text-white border-none rounded-md cursor-pointer transition-colors duration-300 hover:bg-gray-600"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <nav className="bg-white border-b border-gray-200 px-8 max-w-6xl mx-auto">
                <button
                    className={`border-none px-6 py-4 cursor-pointer border-b-4 border-transparent transition-all duration-300 text-base ${activeTab === 'tasks'
                            ? 'text-indigo-500 border-b-indigo-500'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                    onClick={() => setActiveTab('tasks')}
                >
                    Mis Tareas
                </button>
                {user?.rol === 'lider' && (
                    <button
                        className={`border-none px-6 py-4 cursor-pointer border-b-4 border-transparent transition-all duration-300 text-base ${activeTab === 'assign'
                                ? 'text-indigo-500 border-b-indigo-500'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab('assign')}
                    >
                        Asignar Tarea
                    </button>
                )}
            </nav>

            <main className="max-w-6xl mx-auto p-8">
                {activeTab === 'tasks' && (
                    <TaskList
                        key={refreshTasks}
                        onTaskResponded={handleTaskResponded}
                    />
                )}
                {activeTab === 'assign' && user?.rol === 'lider' && (
                    <AssignTask onTaskAssigned={handleTaskAssigned} />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
