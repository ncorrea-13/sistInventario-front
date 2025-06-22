'use client';
import { useEffect, useState } from 'react';

interface OrdenCompraFormProps {
  orden?: any;
  articulos: any[];
  onClose: (refrescar: boolean) => void;
}

export default function CrearEditarOrdenCompra({ orden, articulos, onClose }: OrdenCompraFormProps) {
  const [numOrdenCompra, setNumOrdenCompra] = useState('');
  const [tamanoLote, setTamanoLote] = useState('');
  //const [montoOrden, setMontoOrden] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [articuloId, setArticuloId] = useState('');
  const [ordenEstadoId, setOrdenEstadoId] = useState('');
  const [proveedoresAsociados, setProveedoresAsociados] = useState<any[]>([]);
  const [proveedorPredeterminadoId, setProveedorPredeterminadoId] = useState<string>('');
  const [modeloInventario, setModeloInventario] = useState<string>('');
  const [tamanoLoteSugerido, setTamanoLoteSugerido] = useState<string>('');

  const ESTADOS_ORDEN = [
    { codEstadoOrden: 1, nombreEstadoOrden: 'Pendiente' },
    { codEstadoOrden: 2, nombreEstadoOrden: 'Enviada' },
    { codEstadoOrden: 3, nombreEstadoOrden: 'Finalizada' },
    { codEstadoOrden: 4, nombreEstadoOrden: 'Cancelada' },
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
    // Si estamos en modo edición, encontrar el artículo completo en la lista pasada por props
    if (orden && orden.detalles && orden.detalles.length > 0) {
      const articuloIdActual = orden.detalles[0].articuloId;
      const articuloCompleto = articulos.find(a => a.codArticulo === articuloIdActual);
      
      if (articuloCompleto && articuloCompleto.proveedorArticulos) {
        const proveedores = articuloCompleto.proveedorArticulos.map((pa: any) => ({
          ...pa.proveedor,
          predeterminado: pa.predeterminado,
        }));
        setProveedoresAsociados(proveedores);
      }
    }
  }, [orden, articulos]);

  // Nuevo: Cargar proveedores y sugerencias al seleccionar artículo
  useEffect(() => {
    // Si se selecciona un artículo y estamos en modo creación
    if (!orden && articuloId) {
      const articuloSeleccionado = articulos.find(
        (a) => a.codArticulo === Number(articuloId)
      );

      if (articuloSeleccionado) {
        // Establecer modelo y lote sugerido
        setModeloInventario(articuloSeleccionado.modeloInventario || '');
          const loteSugerido = String(
            articuloSeleccionado.modeloFijoLote?.loteOptimo || articuloSeleccionado.loteOptimo || 1
          );
          console.log(articuloSeleccionado);
          setTamanoLoteSugerido(loteSugerido);
          setTamanoLote(loteSugerido); // Autocompletar


        // Filtrar y establecer proveedores asociados
        const proveedores = (articuloSeleccionado.proveedorArticulos || []).map(
          (pa: any) => ({
            ...pa.proveedor,
            predeterminado: pa.predeterminado,
          })
        );
        setProveedoresAsociados(proveedores);

        // Establecer proveedor predeterminado o el primero de la lista
        const pred = proveedores.find((p: any) => p.predeterminado);
        if (pred) {
          setProveedorId(String(pred.codProveedor));
        } else if (proveedores.length > 0) {
          setProveedorId(String(proveedores[0].codProveedor));
        } else {
          setProveedorId('');
        }
      }
    } else if (!orden) {
      // Limpiar si no hay artículo seleccionado en modo creación
      setProveedoresAsociados([]);
      setModeloInventario('');
      setTamanoLoteSugerido('');
      setProveedorId('');
      setTamanoLote('');
    }
  }, [articuloId, articulos, orden]);

  const handleGuardar = async () => {
    try {
      if (!tamanoLote || !proveedorId || (!orden && !articuloId)) {
        alert('Por favor completá todos los campos requeridos.');
        return;
      }

      // Solo al crear, verificar si ya existe una OC pendiente o enviada para el artículo
      if (!orden) {
        const resCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenCompra`);
        const ordenes = await resCheck.json();
        const existeOC = Array.isArray(ordenes) && ordenes.some((oc: any) => {
          const tieneArticulo = oc.detalles && oc.detalles.some((d: any) => d.articuloId === Number(articuloId));
          const estado = oc.ordenEstado?.nombreEstadoOrden || (oc.ordenEstadoId && (['Pendiente', 'Enviada'].includes(oc.ordenEstadoId)));
          return tieneArticulo && (oc.ordenEstado?.nombreEstadoOrden === 'Pendiente' || oc.ordenEstado?.nombreEstadoOrden === 'Enviada');
        });
        if (existeOC) {
          const continuar = window.confirm('Ya existe una orden de compra para este artículo ¿Desea continuar?');
          if (!continuar) return;
        }
      }

      if (orden) {
        const payload = {
          datosActualizados: {
            numOrdenCompra: Number(numOrdenCompra),
            tamanoLote: Number(tamanoLote),
            proveedorId: Number(proveedorId),
            articuloId: Number(articuloId),
            ordenEstadoId: Number(ordenEstadoId),
          },
        };
        console.log('Payload enviado (editar OC):', payload);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenCompra/${orden.numOrdenCompra}`, {
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
        {/* Proveedor solo en edición */}
        {orden && (
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
        <div>
          <label className="block text-sm font-medium mb-1">Tamaño Lote {tamanoLoteSugerido && <span className="text-xs text-blue-600">(Sugerido: {tamanoLoteSugerido})</span>}</label>
          <input
            type="number"
            value={tamanoLote}
            onChange={(e) => setTamanoLote(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
            disabled={!orden && !articuloId}
          />
          {/* Mostrar lote óptimo si corresponde */}
          {tamanoLoteSugerido && (
            <div className="text-xs text-blue-700 mt-1">Lote óptimo sugerido por el sistema: <b>{tamanoLoteSugerido}</b></div>
          )}
        </div>
        {/* Estado solo en edición */}
        {orden && (
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              value={ordenEstadoId}
              onChange={(e) => setOrdenEstadoId(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
              disabled
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

