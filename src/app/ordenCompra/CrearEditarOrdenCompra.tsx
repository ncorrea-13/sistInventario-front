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
  const [proveedoresAsociados, setProveedoresAsociados] = useState<any[]>([]);
  const [proveedorPredeterminadoId, setProveedorPredeterminadoId] = useState<string>('');
  const [modeloInventario, setModeloInventario] = useState<string>('');
  const [tamanoLoteSugerido, setTamanoLoteSugerido] = useState<string>('');

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
        .then(data => {
          console.log('Artículos traídos:', data);
          setArticulos(Array.isArray(data) ? data : data.articulos || []);
        })
        .catch(() => setArticulos([]));
    }
  }, [orden]);

  // Nuevo: cargar proveedores y sugerencias al seleccionar artículo
  useEffect(() => {
    if (!orden && articuloId) {
      // 1. Traer detalle del artículo
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${articuloId}`)
        .then(res => res.json())
        .then(data => {
          setModeloInventario(data.modeloInventario || '');
          // Si es lote fijo, sugerir tamaño de lote
          if ((data.modeloInventario === 'Fijo' || data.modeloInventario === 'loteFijo') && data.modeloFijoLote) {
            setTamanoLoteSugerido(String(data.modeloFijoLote.loteOptimo));
            setTamanoLote(String(data.modeloFijoLote.loteOptimo));
          } else {
            setTamanoLoteSugerido('');
          }
          // Proveedores asociados (por compatibilidad con tu backend, revisa si es data.proveedores o data.proveedorArticulos)
          let proveedores = data.proveedorArticulos || data.proveedores || [];
          // Adaptar formato si es necesario
          proveedores = proveedores.map((p: any) => ({
            codProveedor: p.proveedorId || p.codProveedor,
            nombreProv: p.proveedor?.nombreProv || p.nombreProv,
            predeterminado: p.predeterminado,
          }));
          setProveedoresAsociados(proveedores);
          // Buscar predeterminado
          const pred = proveedores.find((p: any) => p.predeterminado);
          if (pred) {
            setProveedorPredeterminadoId(String(pred.codProveedor));
            setProveedorId(String(pred.codProveedor));
          } else if (proveedores.length > 0) {
            setProveedorPredeterminadoId('');
            setProveedorId(String(proveedores[0].codProveedor));
          } else {
            setProveedorPredeterminadoId('');
            setProveedorId('');
          }
        })
        .catch(() => {
          setModeloInventario('');
          setTamanoLoteSugerido('');
          setProveedoresAsociados([]);
          setProveedorPredeterminadoId('');
          setProveedorId('');
        });
    } else if (!orden) {
      setModeloInventario('');
      setTamanoLoteSugerido('');
      setProveedoresAsociados([]);
      setProveedorPredeterminadoId('');
      setProveedorId('');
    }
  }, [articuloId, orden]);

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
        console.log('Payload enviado (editar OC):', payload);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenCompra/${orden.ordenCompraId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error();
      } else {
        const payload = {
          articuloId: Number(articuloId),
          tamanoLote: Number(tamanoLote),
          proveedorId: Number(proveedorId),
        };
        console.log('Payload enviado (crear OC):', payload);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenCompra`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
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
        {/* Proveedores asociados al artículo */}
        {!orden && proveedoresAsociados.length > 0 && (
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Proveedor</label>
            <select
              value={proveedorId}
              onChange={(e) => setProveedorId(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            >
              {proveedoresAsociados.map((prov) => (
                <option
                  key={prov.codProveedor}
                  value={prov.codProveedor}
                  style={prov.predeterminado ? { fontWeight: 'bold', color: '#2563eb' } : {}}
                >
                  {prov.nombreProv} {prov.predeterminado ? '(Predeterminado)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
        {/* Si no hay proveedores asociados */}
        {!orden && articuloId && proveedoresAsociados.length === 0 && (
          <div className="col-span-2 text-red-600 text-sm">No hay proveedores asociados a este artículo.</div>
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
          <label className="block text-sm font-medium mb-1">Tamaño Lote {tamanoLoteSugerido && <span className="text-xs text-blue-600">(Sugerido: {tamanoLoteSugerido})</span>}</label>
          <input
            type="number"
            value={tamanoLote}
            onChange={(e) => setTamanoLote(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
          {/* Mostrar lote óptimo si corresponde */}
          {tamanoLoteSugerido && (
            <div className="text-xs text-blue-700 mt-1">Lote óptimo sugerido por el sistema: <b>{tamanoLoteSugerido}</b></div>
          )}
        </div>

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
        <div className="col-span-2 flex justify-end gap-2 mt-4">
          <button type="button" onClick={() => onClose(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </form>
    </div>
  );
}
