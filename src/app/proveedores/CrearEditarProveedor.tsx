'use client';
import React, { useState } from 'react';

interface ProveedorData {
  nombreProv: string;
  direccion: string;
  telefono: string;
  email: string;
}

export default function CrearEditarProveedor({
  onClose,
  onGuardar,
  proveedorId,
  proveedorData = {
    nombreProv: '',
    direccion: '',
    telefono: '',
    email: '',
  },
}: {
  onClose: () => void;
  onGuardar: () => void;
  proveedorId?: number;
  proveedorData?: ProveedorData;
}) {
  const [formData, setFormData] = useState<ProveedorData>(proveedorData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardar = async () => {
    try {
      // Validar campos requeridos
      if (!formData.nombreProv.trim()) {
        alert('El nombre del proveedor es requerido');
        return;
      }

      const url = proveedorId
        ? `${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/proveedor`;

      const method = proveedorId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error('Error del servidor:', errorData);
        throw new Error('Error al guardar proveedor');
      }

      onGuardar();
      onClose();
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('No se pudo guardar el proveedor');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {proveedorId ? 'Editar Proveedor' : 'Crear Proveedor'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              name="nombreProv"
              className="w-full border px-3 py-2 rounded"
              value={formData.nombreProv}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dirección</label>
            <input
              type="text"
              name="direccion"
              className="w-full border px-3 py-2 rounded"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Teléfono</label>
            <input
              type="text"
              name="telefono"
              className="w-full border px-3 py-2 rounded"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border px-3 py-2 rounded"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button 
            type="button"
            className="bg-gray-400 px-4 py-2 rounded text-white" 
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="button"
            className="bg-blue-600 px-4 py-2 rounded text-white" 
            onClick={handleGuardar}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
