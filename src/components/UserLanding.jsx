import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLanding = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:4000/api/logout', {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e) }
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <div className="bg-white text-gray-800 p-10 rounded-2xl shadow-2xl max-w-lg w-full text-center transform transition hover:scale-105">
                <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                    ¡Bienvenido!
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Has iniciado sesión correctamente en el sistema modelo.
                </p>
                <div className="w-full h-1 bg-gray-200 rounded mb-8">
                    <div className="h-full bg-blue-500 w-1/2 rounded"></div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default UserLanding;
