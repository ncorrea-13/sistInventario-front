'use client';
import React, { useEffect, useState } from 'react';

interface ProveedorArticulo {
  id: number;
  precioUnitaria: number;
  demoraEntrega: number;
  cargoPedido: number;
  predeterminado: boolean;
  proveedor: {
    nombreProv: string;
  };
}

interface ArticuloDetalle {
  codArticulo: number;
  nombreArticulo: string;
  descripcionArticulo: string;
  stockActual: number;
  costoAlmacenamiento: number;
  costoCompra: number;
  costoPedido: number;
  costoMantenimiento: number;
  demandaAnual: number;
  desviacionDemandaL: number;
  desviacionDemandaT: number;
  nivelServicioDeseado: number;
  proveedorArticulos: ProveedorArticulo[];
}

interface Props {
  onClose: () => void;
  onGuardar: () => void;
  proveedorId?: number;
  proveedorNombre?: string;
}

export default function CrearEditarProveedor({ onClose, onGuardar, proveedorId, proveedorNombre }: Props) {
  const [nombre, setNombre] = useState(proveedorNombre || '');

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    try {
      const url = proveedorId
        ? `${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/proveedor`;

      const res = await fetch(url, {
        method: proveedorId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreProv: nombre.trim() }),
      });

      if (!res.ok) throw new Error();
      onGuardar();
      onClose();
    } catch (err) {
      alert('Error al guardar proveedor');
      console.error(err);
    }
  };

  const [proveedor, setProveedor] = useState<ProveedorArticulo | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Partial<ArticuloDetalle>>({});

  useEffect(() => {
    if (!proveedorId) return;
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${proveedorId}`);
        const data = await res.json();
        setProveedor(data);
        setFormData(data);
      } catch (err) {
        console.error('Error al cargar detalle:', err);
      }
    };
    fetchDetalle();
  }, [proveedorId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("stock") || name.includes("costo") || name.includes("demanda") || name.includes("desviacion") || name.includes("nivel")
        ? Number(value)
        : value,
    }));
  };
  
  const handleGuardarCambios = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${proveedorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const actualizado = await res.json();
        setProveedor(actualizado);
        setEditando(false);
        onRefrescar();
      } else {
        alert('Error al guardar los cambios');
      }
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  function setMostrarModal(arg0: boolean) {
    throw new Error('Function not implemented.');
  }

  function setProveedorSeleccionado(prov: any) {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
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
function setProveedor(data: any) {
  throw new Error('Function not implemented.');
}

function onRefrescar() {
  throw new Error('Function not implemented.');
}

