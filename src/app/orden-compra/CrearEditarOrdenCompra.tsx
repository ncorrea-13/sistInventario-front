'use client';
import { useEffect, useState } from 'react';

interface OrdenCompraFormProps {
  orden?: any;
  onClose: (refrescar: boolean) => void;
}

export default function CrearEditarOrdenCompra({ orden, onClose }: OrdenCompraFormProps) {
  const [tamanoLote, setTamanoLote] = useState('');
  const [montoOrden, setMontoOrden] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [articuloId, setArticuloId] = useState('');
  const [ordenEstadoId, setOrdenEstadoId] = useState('');

  useEffect(() => {
    if (orden) {
      setTamanoLote(String(orden.tamanoLote));
      setMontoOrden(String(orden.montoOrden));
      setProveedorId(String(orden.proveedorId));
      setOrdenEstadoId(String(orden.ordenEstadoId));
    }
  }, [orden]);

  const handleGuardar = async () => {
    try {
      if (!tamanoLote || !montoOrden || !proveedorId || (!orden && !articuloId)) {
        alert('Por favor completá todos los campos requeridos.');
        return;
      }

      if (orden) {
        const payload = {
          ordenCompraId: orden.ordenCompraId,
          datosActualizados: {
            tamanoLote: Number(tamanoLote),
            montoOrden: Number(montoOrden),
            proveedorId: Number(proveedorId),
            ordenEstadoId: Number(ordenEstadoId),
          },
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orden-compra/${orden.ordenCompraId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error();
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orden-compra`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articuloId: Number(articuloId),
            tamanoLote: Number(tamanoLote),
            proveedorId: Number(proveedorId),
            montoOrden: Number(montoOrden),
          }),
        });

        if (!res.ok) throw new Error();
      }

      onClose(true);
    } catch (error) {
      alert('Error al guardar la orden de compra');
      console.error(error);
      onClose(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-4">{orden ? 'Editar' : 'Crear'} Orden de Compra</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleGuardar(); }} className="grid grid-cols-2 gap-4">
        {!orden && (
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">ID Artículo</label>
            <input
              type="number"
              value={articuloId}
              onChange={(e) => setArticuloId(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Tamaño Lote</label>
          <input
            type="number"
            value={tamanoLote}
            onChange={(e) => setTamanoLote(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Monto</label>
          <input
            type="number"
            value={montoOrden}
            onChange={(e) => setMontoOrden(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Proveedor ID</label>
          <input
            type="number"
            value={proveedorId}
            onChange={(e) => setProveedorId(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        {orden && (
          <div>
            <label className="block text-sm font-medium mb-1">Estado ID</label>
            <input
              type="number"
              value={ordenEstadoId}
              onChange={(e) => setOrdenEstadoId(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
        )}
        <div className="col-span-2 flex justify-end gap-2 mt-4">
          <button type="button" onClick={() => onClose(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </form>
    </div>
  );
}
