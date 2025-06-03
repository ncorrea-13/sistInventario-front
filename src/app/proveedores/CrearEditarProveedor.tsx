'use client';
import React, { useState } from 'react';

export default function CrearEditarProveedor({
  onClose,
  onGuardar,
  proveedorId,
  proveedorNombre = '',
}: {
  onClose: () => void;
  onGuardar: () => void;
  proveedorId?: number;
  proveedorNombre?: string;
}) {
  const [nombre, setNombre] = useState(proveedorNombre);

  const handleGuardar = async () => {
    try {
      const url = proveedorId
        ? `${process.env.NEXT_PUBLIC_API_URL}/proveedores/${proveedorId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/proveedores`;

      const method = proveedorId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreProv: nombre }),
      });

      if (!res.ok) throw new Error('Error al guardar proveedor');

      onGuardar();
      onClose();
    } catch (err) {
      alert('No se pudo guardar el proveedor');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {proveedorId ? 'Editar Proveedor' : 'Crear Proveedor'}
        </h2>
        <label className="block text-sm font-medium mb-2">Nombre</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="bg-gray-400 px-4 py-2 rounded text-white" onClick={onClose}>
            Cancelar
          </button>
          <button className="bg-blue-600 px-4 py-2 rounded text-white" onClick={handleGuardar}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
