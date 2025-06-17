'use client';
import { useEffect, useState } from 'react';

interface OrdenCompraFormProps {
  orden?: any;
  onClose: (refrescar: boolean) => void;
}

export default function CrearEditarOrdenCompra({ orden, onClose }: OrdenCompraFormProps) {
  const [numOrdenCompra, setNumOrdenCompra] = useState('');
  const [tamanoLote, setTamanoLote] = useState('');
  //const [montoOrden, setMontoOrden] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [articuloId, setArticuloId] = useState('');
  const [ordenEstadoId, setOrdenEstadoId] = useState('');
  const [articulos, setArticulos] = useState<any[]>([]);

  const ESTADOS_ORDEN = [
    { codEstadoOrden: 1, nombreEstadoOrden: 'PENDIENTE' },
    { codEstadoOrden: 2, nombreEstadoOrden: 'FINALIZADA' },
    { codEstadoOrden: 3, nombreEstadoOrden: 'ENVIADA' },
    { codEstadoOrden: 4, nombreEstadoOrden: 'FINALIZADA' },
  ];

  useEffect(() => {
    if (orden) {
      setNumOrdenCompra(String(orden.numOrdenCompra));
      setTamanoLote(String(orden.tamanoLote));
      //setMontoOrden(String(orden.montoOrden));
      setProveedorId(String(orden.proveedorId));
      setOrdenEstadoId(String(orden.ordenEstadoId));
    }
  }, [orden]);

  useEffect(() => {
    // Solo cargar artículos si estamos creando
    if (!orden) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`)
        .then(res => res.json())
        .then(data => setArticulos(Array.isArray(data) ? data : data.articulos || []))
        .catch(() => setArticulos([]));
    }
  }, [orden]);

  const handleGuardar = async () => {
    try {
      if (!tamanoLote || !proveedorId || (!orden && !articuloId)) {
        alert('Por favor completá todos los campos requeridos.');
        return;
      }

      if (orden) {
        const payload = {
          datosActualizados: {
            numOrdenCompra: Number(numOrdenCompra),
            tamanoLote: Number(tamanoLote),
            proveedorId: Number(proveedorId),
            ordenEstadoId: Number(ordenEstadoId),
          },
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenCompra/${orden.ordenCompraId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error();
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenCompra`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articuloId: Number(articuloId),
            tamanoLote: Number(tamanoLote),
            proveedorId: Number(proveedorId),
            //montoOrden: Number(montoOrden),
          }),
        });

        const responseText = await res.text();
        console.log('Estado de la respuesta:', res.status);
        console.log('Cuerpo de la respuesta:', responseText);

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
            <label className="block text-sm font-medium mb-1">Artículo</label>
            <select
              value={articuloId}
              onChange={(e) => setArticuloId(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="">Seleccioná un artículo</option>
              {articulos.map((art) => (
                <option key={art.codArticulo} value={art.codArticulo}>
                  {art.nombreArticulo}
                </option>
              ))}
            </select>
          </div>
        )}
        {orden && (
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Número de Orden</label>
            <input
              type="text"
              value={numOrdenCompra}
              disabled
              className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
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
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              value={ordenEstadoId}
              onChange={(e) => setOrdenEstadoId(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="">Seleccioná un estado</option>
              {ESTADOS_ORDEN.map((estado) => (
                <option key={estado.codEstadoOrden} value={estado.codEstadoOrden}>
                  {estado.nombreEstadoOrden}
                </option>
              ))}
            </select>
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
