import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [stats, setStats] = useState({ activeUsers: 0, onlineUsers: 0, usersByRole: {} });
    const [activeTab, setActiveTab] = useState('dashboard'); // Default to dashboard

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchAudit();
    }, []);

    // Reset pagination when tab changes or search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm]);

    const getToken = () => localStorage.getItem('token');

    const fetchStats = async () => {
        try {
            // According to routes: router.get("/roles/admin/stats", getStats);
            // And app uses /api prefix
            // But let's check if auth.routes.js is mounted on /api
            // Yes: app.use('/api', rutapp);
            //const res = await axios.get('http://localhost:4000/api/roles/admin/stats');
            const res = await axios.get(import.meta.env.VITE_URL_BACKEND + '/api/roles/admin/stats');
            setStats(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchUsers = async () => {
        try {
            const token = getToken();
            if (!token) return;
            const res = await axios.get(import.meta.env.VITE_URL_BACKEND + '/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Error cargando usuarios");
        }
    };

    const fetchAudit = async () => {
        try {
            const token = getToken();
            if (!token) return;
            const res = await axios.get(import.meta.env.VITE_URL_BACKEND + '/api/admin/audit', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAuditLogs(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            const token = getToken();
            await axios.patch(import.meta.env.VITE_URL_BACKEND + '/api/admin/users/${id}/role', { role: newRole }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success("Rol actualizado");
            fetchUsers();
        } catch (error) {
            toast.error("Error al actualizar rol");
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = getToken();
            await axios.patch(import.meta.env.VITE_URL_BACKEND + '/api/admin/users/${id}/status', { active: newStatus }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success("Estado actualizado");
            fetchUsers();
        } catch (error) {
            toast.error("Error al actualizar estado");
        }
    };

    const handleLogout = async () => {
        try {
            const token = getToken();
            await axios.post(import.meta.env.VITE_URL_BACKEND + '/api/logout', {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e) }
        localStorage.removeItem('token');
        navigate('/');
    };

    // Filter Logic
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellidos?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAudit = auditLogs.filter(log =>
        (log.userId?.email || 'Sistema').toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic (based on filtered results)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const currentAuditLogs = filteredAudit.slice(indexOfFirstItem, indexOfLastItem);

    const totalPagesUsers = Math.ceil(filteredUsers.length / itemsPerPage);
    const totalPagesAudit = Math.ceil(filteredAudit.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = (totalPages) => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex justify-center mt-4 space-x-2">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition">
                        Cerrar Sesión
                    </button>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('dashboard'); setSearchTerm(''); }}
                            className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Dashboard
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
                            className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Usuarios
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('audit'); setSearchTerm(''); }}
                            className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === 'audit' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Auditoría
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-400">
                            🔍
                        </span>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                            <h2 className="text-xl font-bold text-gray-700 mb-2">Usuarios Activos</h2>
                            <p className="text-4xl font-extrabold text-blue-600">{stats.activeUsers || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                            <h2 className="text-xl font-bold text-gray-700 mb-2">Usuarios En Línea</h2>
                            <p className="text-4xl font-extrabold text-green-600">{stats.onlineUsers || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                            <h2 className="text-xl font-bold text-gray-700 mb-2">Usuarios por Rol</h2>
                            <div className="space-y-2">
                                {stats.usersByRole && Object.entries(stats.usersByRole).length > 0 ? (
                                    Object.entries(stats.usersByRole).map(([role, count]) => (
                                        <div key={role} className="flex justify-between items-center text-sm">
                                            <span className="capitalize text-gray-600">{role}:</span>
                                            <span className="font-bold text-purple-600">{count}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm">No hay datos</p>
                                )}
                            </div>
                        </div>

                        {/* More widgets can start here */}
                        <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-xl shadow-lg mt-4">
                            <h2 className="text-lg font-semibold mb-4 text-gray-700">Bienvenido al Panel de Control</h2>
                            <p className="text-gray-600">Desde aquí puedes gestionar usuarios, ver auditorías y monitorear el estado del sistema en tiempo real.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider border-b border-gray-200">
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Nombre</th>
                                        <th className="p-4">Teléfono</th>
                                        <th className="p-4">Rol</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4">En línea</th>
                                        <th className="p-4">Último Login</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentUsers.length > 0 ? currentUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition">
                                            <td className="p-4 text-sm font-medium text-gray-900">{user.email}</td>
                                            <td className="p-4 text-sm text-gray-600">{user.nombres} {user.apellidos}</td>
                                            <td className="p-4 text-sm text-gray-600">{user.telefono}</td>
                                            <td className="p-4">
                                                <select
                                                    value={user.role || 'user'}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="supervisor">Supervisor</option>
                                                    <option value="asistente">Asistente</option>
                                                </select>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleStatusChange(user._id, !user.active)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                >
                                                    {user.active ? 'Activo' : 'Inactivo'}
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-block w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                            </td>
                                            <td className="p-4 text-xs text-gray-500">
                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="p-4 text-center text-gray-500">
                                                No se encontraron resultados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {renderPagination(totalPagesUsers)}
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider border-b border-gray-200">
                                        <th className="p-4">Fecha</th>
                                        <th className="p-4">Usuario</th>
                                        <th className="p-4">Acción</th>
                                        <th className="p-4">Detalles</th>
                                        <th className="p-4">IP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentAuditLogs.length > 0 ? currentAuditLogs.map((log) => (
                                        <tr key={log._id} className="hover:bg-gray-50 transition">
                                            <td className="p-4 text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                                            <td className="p-4 text-sm font-medium text-gray-900">{log.userId?.email || log.userId || 'Sistema'}</td>
                                            <td className="p-4 text-sm">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">{log.action}</span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">{log.details}</td>
                                            <td className="p-4 text-xs text-gray-500">{log.ip}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="p-4 text-center text-gray-500">
                                                No se encontraron resultados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {renderPagination(totalPagesAudit)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
