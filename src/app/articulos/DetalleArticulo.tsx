'use client';
import { useEffect, useState } from 'react';

interface Proveedor {
  codProveedor: number;
  nombreProv: string;
}

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
  modeloInventario: string;
  proveedorArticulos: ProveedorArticulo[];
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
  const [showAsociar, setShowAsociar] = useState(false);
  const [nuevoProv, setNuevoProv] = useState({
    proveedorId: 0,
    predeterminado: false,
  });

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}`);
        const data = await res.json();
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

  const handleAsociarProveedor = async () => {
    if (nuevoProv.proveedorId === 0) {
      alert("Debe seleccionar un proveedor");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${nuevoProv.proveedorId}/asociar-articulo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articuloId: codArticulo,
          precioUnitaria: 0,
          demoraEntrega: 0,
          cargoPedido: 0,
          predeterminado: nuevoProv.predeterminado,
        }),
      });

      if (res.ok) {
        alert('Proveedor asociado correctamente');
        setShowAsociar(false);
        setNuevoProv({ proveedorId: 0, predeterminado: false });
        onRefrescar();
      } else {
        const errorText = await res.text();
        console.error("❌", errorText);
        alert('Error al asociar proveedor');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!articulo) return <div className="p-4">Cargando...</div>;

  return (
    <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-lg">
      <h2 className="text-2xl font-bold mb-2">{articulo.nombreArticulo}</h2>
      <p className="mb-2"><strong>Descripción:</strong> {articulo.descripcionArticulo}</p>
      <p className="mb-2"><strong>Modelo de Inventario:</strong> {articulo.modeloInventario}</p>
      <p className="mb-2"><strong>Stock:</strong> {articulo.stockActual}</p>

      <h3 className="text-lg font-bold mt-4 mb-2">Proveedores asociados</h3>
      <ul className="list-inside text-sm">
        {articulo.proveedorArticulos?.length > 0 ? (
          articulo.proveedorArticulos.map((prov, i) => (
            <li key={i}>
              {prov.proveedor.nombreProv}
              {prov.predeterminado && <span className="text-green-600 font-bold ml-2">(Predeterminado)</span>}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No hay proveedores asociados</li>
        )}
      </ul>

      <button
        onClick={() => {
          fetchProveedores();
          setShowAsociar(true);
        }}
        className="mt-4 text-blue-600 underline"
      >
        Asociar nuevo proveedor
      </button>

      {showAsociar && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-bold mb-2">Seleccionar proveedor</h4>

          <select
            value={nuevoProv.proveedorId}
            onChange={(e) => setNuevoProv({ ...nuevoProv, proveedorId: Number(e.target.value) })}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value={0}>Seleccione un proveedor</option>
            {proveedores.map((p) => (
              <option key={p.codProveedor} value={p.codProveedor}>{p.nombreProv}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={nuevoProv.predeterminado}
              onChange={(e) => setNuevoProv({ ...nuevoProv, predeterminado: e.target.checked })}
            />
            Es proveedor predeterminado
          </label>

          <div className="flex gap-2 justify-end">
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleAsociarProveedor}>Asociar</button>
            <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setShowAsociar(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6 gap-4">
        <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
