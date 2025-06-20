'use client';
import React, { useEffect, useState } from 'react';
import CrearEditarProveedor from './CrearEditarProveedor';

interface ProveedorDetalle {
  codProveedor:number;
  cargoPedido:number;
  demoraEntrega:number;
    precioUnitaria:number;
    predeterminado:boolean;
    nombreProveedor: string;
    articulos: {
    codArticulo: number;
    nombreArticulo: string;
    descripcionArticulo: string;


  }[];
}

export default function DetalleProveedor({
  codProveedor,
  onClose,
  onRefrescar,
}: {
  codProveedor: number;
  onClose: () => void;
  onRefrescar: () => void;
}){
  const [proveedor, setProveedor] = useState<ProveedorDetalle | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Partial<ProveedorDetalle>>({});

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${codProveedor}`);
        const data = await res.json();
        setProveedor(data);
        setFormData(data);
      } catch (err) {
        console.error('Error al cargar detalle:', err);
      }
    };
    fetchDetalle();
  }, [codProveedor]);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${codProveedor}`, {
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

  const handleEliminar = async () => {
    if (!confirm('¿Estás seguro de que querés eliminar este artículo?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${codProveedor}/baja`, {
        method: 'PATCH',
      });
      if (res.ok) {
        onRefrescar();
        onClose();
      } else {
        alert('No se pudo eliminar el proveedor');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!proveedor) return <div className="p-4">Cargando...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Detalle del Proveedor</h2>
      <p>
        <strong>ID:</strong> {proveedor.codProveedor}
      </p>
      <p>
        <strong>Nombre:</strong> {proveedor.nombreProveedor}
      </p>

      <h3 className="text-lg font-bold mt-4 mb-2">Articulos asociados</h3>
      <ul className="list-inside text-sm">
        {proveedor.articulos.length > 0 ? (
          proveedor.articulos.map((prov, i) => (
            <li key={i}>
              {prov.nombreArticulo} - {prov.descripcionArticulo} (ID: {prov.codArticulo})
            </li>
          ))
        ) : (
          <li className="text-gray-500">No hay articulos asociados</li>
        )}
      </ul>

      <div className="flex justify-end mt-6 gap-4">
        {editando ? (
          <>
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleGuardarCambios}>Guardar</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditando(false)}>Cancelar</button>
          </>
        ) : (
          <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => setEditando(true)}>Editar</button>
        )}
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleEliminar}>Eliminar</button>
        <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
