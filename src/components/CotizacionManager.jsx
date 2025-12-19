import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaEdit, FaTrash, FaCheck, FaPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CotizacionManager = () => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [cotizaciones, setCotizaciones] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const fetchCotizaciones = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/cotizaciones');
            setCotizaciones(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar cotizaciones');
        }
    };

    useEffect(() => {
        fetchCotizaciones();
    }, []);

    const onSubmit = async (data) => {
        try {
            if (editingId) {
                await axios.put(`http://localhost:4000/api/cotizaciones/${editingId}`, data);
                toast.success('Cotización actualizada');
                setEditingId(null);
            } else {
                await axios.post('http://localhost:4000/api/cotizaciones', data);
                toast.success('Cotización registrada');
            }
            reset();
            fetchCotizaciones();
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar cotización');
        }
    };

    const handleEdit = (cotizacion) => {
        setEditingId(cotizacion._id);
        setValue('numeroCotizacion', cotizacion.numeroCotizacion);
        setValue('fecha', cotizacion.fecha.split('T')[0]);
        setValue('cliente', cotizacion.cliente);
        setValue('detalleServicio', cotizacion.detalleServicio);
        setValue('tecnico', cotizacion.tecnico);
        setValue('fechaServicio', cotizacion.fechaServicio.split('T')[0]);
        setValue('observacion', cotizacion.observacion);
        setValue('conformidadCliente', cotizacion.conformidadCliente);
        setValue('evidencia', cotizacion.evidencia);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar esta cotización?')) {
            try {
                await axios.delete(`http://localhost:4000/api/cotizaciones/${id}`);
                toast.success('Cotización eliminada');
                fetchCotizaciones();
            } catch (error) {
                console.error(error);
                toast.error('Error al eliminar cotización');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de Servicios</h1>
                        <p className="text-blue-100 mt-2">Registro y control de cotizaciones y trabajos técnicos</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-white/20 p-3 rounded-full">
                            <FaPlus size={24} />
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-10">
                    {/* Formulario */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-10 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                            {editingId ? 'Editar Registro' : 'Nuevo Registro'}
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                                {/* Fila 1 */}
                                <div className="md:col-span-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2"># Cotización</label>
                                    <input
                                        {...register('numeroCotizacion', { required: true })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Ej: COT-2023-001"
                                    />
                                    {errors.numeroCotizacion && <span className="text-red-500 text-xs mt-1">Este campo es requerido</span>}
                                </div>

                                <div className="md:col-span-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
                                    <input
                                        type="date"
                                        {...register('fecha', { required: true })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                    {errors.fecha && <span className="text-red-500 text-xs mt-1">Requerido</span>}
                                </div>

                                <div className="md:col-span-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Servicio</label>
                                    <input
                                        type="date"
                                        {...register('fechaServicio', { required: true })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                    {errors.fechaServicio && <span className="text-red-500 text-xs mt-1">Requerido</span>}
                                </div>

                                {/* Fila 2 */}
                                <div className="md:col-span-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cliente</label>
                                    <input
                                        {...register('cliente', { required: true })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Nombre del cliente o empresa"
                                    />
                                    {errors.cliente && <span className="text-red-500 text-xs mt-1">Requerido</span>}
                                </div>

                                <div className="md:col-span-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Técnico Responsable</label>
                                    <input
                                        {...register('tecnico', { required: true })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Nombre del técnico"
                                    />
                                    {errors.tecnico && <span className="text-red-500 text-xs mt-1">Requerido</span>}
                                </div>

                                {/* Fila 3 */}
                                <div className="md:col-span-12">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Detalle del Servicio</label>
                                    <textarea
                                        {...register('detalleServicio', { required: true })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24 resize-none"
                                        placeholder="Descripción detallada del trabajo a realizar..."
                                    />
                                    {errors.detalleServicio && <span className="text-red-500 text-xs mt-1">Requerido</span>}
                                </div>

                                {/* Fila 4 */}
                                <div className="md:col-span-12">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Observaciones</label>
                                    <textarea
                                        {...register('observacion')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-20 resize-none"
                                        placeholder="Notas adicionales, condiciones especiales, etc."
                                    />
                                </div>

                                {/* Fila 5 */}
                                <div className="md:col-span-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Conformidad Cliente</label>
                                    <input
                                        {...register('conformidadCliente')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                        placeholder="Nombre del firmante"
                                    />
                                </div>

                                <div className="md:col-span-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Evidencia (Cantidad)</label>
                                    <div className="flex items-center gap-6 p-2 bg-white rounded-lg border border-gray-200">
                                        {[1, 2, 3].map((val) => (
                                            <label key={val} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                                                <input
                                                    type="radio"
                                                    value={val}
                                                    {...register('evidencia')}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="text-gray-700 font-medium">{val}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { reset(); setEditingId(null); }}
                                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm"
                                >
                                    Limpiar / Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2"
                                >
                                    {editingId ? <><FaEdit /> Actualizar Registro</> : <><FaCheck /> Guardar Registro</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tabla */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Base de Datos de Servicios</h2>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Total: {cotizaciones.length}</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-6 py-4"># Cotización</th>
                                        <th className="px-6 py-4">Cliente</th>
                                        <th className="px-6 py-4">Servicio</th>
                                        <th className="px-6 py-4">Técnico</th>
                                        <th className="px-6 py-4">Fecha Servicio</th>
                                        <th className="px-6 py-4 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {cotizaciones.map((cot) => (
                                        <tr key={cot._id} className="hover:bg-blue-50 transition-colors duration-150">
                                            <td className="px-6 py-4 font-semibold text-gray-900">{cot.numeroCotizacion}</td>
                                            <td className="px-6 py-4">{cot.cliente}</td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={cot.detalleServicio}>{cot.detalleServicio}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-300">
                                                    {cot.tecnico}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{new Date(cot.fechaServicio).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleEdit(cot)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"
                                                        title="Editar"
                                                    >
                                                        <FaEdit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cot._id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition"
                                                        title="Eliminar"
                                                    >
                                                        <FaTrash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {cotizaciones.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                    <p>No se encontraron registros.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CotizacionManager;
