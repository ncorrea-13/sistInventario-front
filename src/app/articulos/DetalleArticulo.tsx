'use client';
import { useEffect, useState } from 'react';
import CrearEditarArticulo from './CrearEditarArticulos';

interface Proveedor {
  codProveedor: number;
  nombreProv: string;
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
  modeloInventario: string;
  proveedores: Proveedor[];
}

export default function DetalleArticulo({
  codArticulo,
  onClose,
  onRefrescar,
}: {
  codArticulo: number;
  onClose: () => void;
  onRefrescar: () => void;
}) {
  const [articulo, setArticulo] = useState<ArticuloDetalle | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [showAsignarPred, setShowAsignarPred] = useState(false);
  const [proveedorPredId, setProveedorPredId] = useState<number | null>(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}`);
        const data = await res.json();
        console.log('Detalle artículo:', data);
        setArticulo(data);
      } catch (err) {
        console.error('Error al cargar detalle:', err);
      }
    };
    fetchDetalle();
  }, [codArticulo, onRefrescar]);

  const fetchProveedores = async () => {
     try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor`);
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    
    }
  };

  const handleAsignarPredeterminado = async () => {
    if (!proveedorPredId || !articulo) {
      alert('Debe seleccionar un proveedor asociado');
      return;
    }
    try {
      const body = {
        nombreArticulo: articulo.nombreArticulo,
        modeloInventario: articulo.modeloInventario,
        demandaAnual: articulo.demandaAnual,
        costoPedido: articulo.costoPedido,
        costoAlmacenamiento: articulo.costoAlmacenamiento,
        desviacionDemandaT: articulo.desviacionDemandaT,
        nivelServicioDeseado: articulo.nivelServicioDeseado,
        stockActual: articulo.stockActual,
        provId: proveedorPredId
      };
      console.log('Body enviado al backend:', body);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${articulo.codArticulo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al actualizar el proveedor predeterminado');
      alert('Proveedor predeterminado actualizado');
      setShowAsignarPred(false);
      setProveedorPredId(null);
      onRefrescar();
    } catch (err) {
      alert('Error al actualizar el proveedor predeterminado');
      console.error(err);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar este artículo?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}/baja`, {
        method: 'PATCH',
      });
      if (res.ok) {
        alert('Artículo eliminado correctamente');
        onClose();
        onRefrescar();
      } else {
        alert('Error al eliminar el artículo');
      }
    } catch (err) {
      alert('Error al eliminar el artículo');
      console.error(err);
    }
  };

  if (!articulo) return <div className="p-4">Cargando...</div>;

  if (editando) {
    return (
      <CrearEditarArticulo
        articuloInicial={articulo}
        onClose={() => setEditando(false)}
        onGuardar={() => {
          setEditando(false);
          onRefrescar();
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-lg">
      <h2 className="text-2xl font-bold mb-2">{articulo.nombreArticulo}</h2>
      <p className="mb-2"><strong>Descripción:</strong> {articulo.descripcionArticulo}</p>
      <p className="mb-2"><strong>Modelo de Inventario:</strong> {articulo.modeloInventario}</p>
      <p className="mb-2"><strong>Stock:</strong> {articulo.stockActual}</p>

      <h3 className="text-lg font-bold mt-4 mb-2">Proveedores asociados</h3>
      <ul className="list-inside text-sm">
        {(articulo.proveedores || []).length > 0 ? (
          articulo.proveedores.map((prov, i) => (
            <li key={i}>
              {prov.nombreProv}
              {/* Aquí podrías marcar el predeterminado si tienes esa info */}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No hay proveedores asociados</li>
        )}
      </ul>

      <button
        onClick={() => setShowAsignarPred(true)}
        className="mt-4 text-blue-600 underline"
      >
        Asignar proveedor predeterminado
      </button>

      {showAsignarPred && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-bold mb-2">Seleccionar proveedor predeterminado</h4>
          {((articulo.proveedores || []).length === 0) ? (
            <div className="text-red-600 mb-2">No hay proveedores asociados para seleccionar.</div>
          ) : (
            <>
              <select
                value={proveedorPredId ?? 0}
                onChange={e => setProveedorPredId(Number(e.target.value))}
                className="w-full mb-2 p-2 border rounded"
              >
                <option value={0}>Seleccione un proveedor</option>
                {(articulo.proveedores || []).map((prov) => (
                  <option key={prov.codProveedor} value={prov.codProveedor}>{prov.nombreProv}</option>
                ))}
              </select>
              <div className="flex gap-2 justify-end">
                <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleAsignarPredeterminado}>Guardar</button>
              </div>
            </>
          )}
          <div className="flex gap-2 justify-end mt-2">
            <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setShowAsignarPred(false)}>Cerrar</button>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6 gap-4">
        <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>Cerrar</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditando(true)}>Editar</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleEliminar}>Eliminar</button>
      </div>
    </div>
  );
}
