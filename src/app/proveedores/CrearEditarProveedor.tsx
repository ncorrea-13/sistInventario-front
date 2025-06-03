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
        ? `${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/proveedor`;

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

  const [proveedor, setProveedor] = useState<ProveedorArticulo | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Partial<ArticuloDetalle>>({});

  useEffect(() => {
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
      
      {editando ? (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { label: 'Nombre del artículo', name: 'nombreArticulo' },
            { label: 'Descripción', name: 'descripcionArticulo' },
            { label: 'Stock actual', name: 'stockActual' },
            { label: 'Costo de almacenamiento', name: 'costoAlmacenamiento' },
            { label: 'Costo de compra', name: 'costoCompra' },
            { label: 'Costo de pedido', name: 'costoPedido' },
            { label: 'Costo de mantenimiento', name: 'costoMantenimiento' },
            { label: 'Demanda anual', name: 'demandaAnual' },
            { label: 'Desviación Demanda L', name: 'desviacionDemandaL' },
            { label: 'Desviación Demanda T', name: 'desviacionDemandaT' },
            { label: 'Nivel de servicio deseado', name: 'nivelServicioDeseado' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                name={field.name}
                type={field.name.includes('stock') || field.name.includes('costo') || field.name.includes('demanda') || field.name.includes('desviacion') || field.name.includes('nivel')
                  ? 'number'
                  : 'text'}
                value={(formData as any)[field.name] ?? ''}
                onChange={handleInputChange}
                className="border rounded px-3 py-1 w-full"
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">{proveedor?.proveedor.nombreProv}</h2>
          <p className="mb-2"><strong>ID:</strong> {proveedor?.id}</p>
          <p className="mb-2"><strong>Cargo por pedido:</strong> {proveedor?.cargoPedido}</p>
          <p className="mb-2"><strong>Demora en entrega:</strong> {proveedor?.demoraEntrega}</p>
          <p className="mb-2"><strong>Precio unitario:</strong> {proveedor?.precioUnitaria}</p>
          <p className="mb-2"><strong>Predeterminado:</strong> {proveedor?.predeterminado}</p>
        </>
      )}
      
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
function setProveedor(data: any) {
  throw new Error('Function not implemented.');
}

function onRefrescar() {
  throw new Error('Function not implemented.');
}

