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
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
                    <h1 className="text-gray-800 text-3xl font-semibold m-0">EmpatIA - Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-medium uppercase">{user?.nombre_usuario}</span>
                        <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {user?.rol === 'lider' ? 'Líder' : 'Colaborador'}
                        </span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-gray-500 text-white border-none rounded-md cursor-pointer transition-colors duration-300 hover:bg-gray-600 font-medium"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="flex">
                        <button
                            className={`border-none px-6 py-4 cursor-pointer border-b-2 border-transparent transition-all duration-300 text-base font-medium ${activeTab === 'tasks'
                                ? 'text-indigo-600 border-b-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                            onClick={() => setActiveTab('tasks')}
                        >
                            Mis Tareas
                        </button>
                        {user?.rol === 'lider' && (
                            <button
                                className={`border-none px-6 py-4 cursor-pointer border-b-2 border-transparent transition-all duration-300 text-base font-medium ${activeTab === 'assign'
                                    ? 'text-indigo-600 border-b-indigo-600 bg-indigo-50'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                                onClick={() => setActiveTab('assign')}
                            >
                                Asignar Tarea
                            </button>
                        )}
                    </div>
                </div>
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
