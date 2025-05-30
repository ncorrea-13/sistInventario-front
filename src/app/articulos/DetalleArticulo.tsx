'use client';
import { useEffect, useState } from 'react';

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
  }, [codArticulo]);

  const handleEliminar = async () => {
    if (!confirm('¿Estás seguro de que querés eliminar este artículo?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onRefrescar();
        onClose();
      } else {
        alert('No se pudo eliminar el artículo');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!articulo) return <div className="p-4">Cargando...</div>;

  return (
    <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{articulo.nombreArticulo}</h2>
      <p className="mb-2"><strong>Descripción:</strong> {articulo.descripcionArticulo}</p>
      <p className="mb-2"><strong>Stock:</strong> {articulo.stockActual}</p>
      <p className="mb-2"><strong>Costos:</strong></p>
      <ul className="list-disc list-inside text-sm mb-4">
        <li>Almacenamiento: ${articulo.costoAlmacenamiento}</li>
        <li>Compra: ${articulo.costoCompra}</li>
        <li>Pedido: ${articulo.costoPedido}</li>
        <li>Mantenimiento: ${articulo.costoMantenimiento}</li>
      </ul>
      <p className="mb-2"><strong>Demanda anual:</strong> {articulo.demandaAnual}</p>
      <p className="mb-4"><strong>Desviación (L):</strong> {articulo.desviacionDemandaL} | <strong>(T):</strong> {articulo.desviacionDemandaT}</p>

  <h3 className="text-lg font-bold mt-4 mb-2">Proveedores asociados</h3>
<ul className="list-inside text-sm">
  {articulo.proveedorArticulos?.length > 0 ? (
    articulo.proveedorArticulos.map((prov, i) => (
      <li key={i}>
        {prov.proveedor.nombreProv} - ${prov.precioUnitaria} - demora: {prov.demoraEntrega} días
        {prov.predeterminado && <span className="text-green-600 font-bold ml-2">(Predeterminado)</span>}
      </li>
    ))
  ) : (
    <li className="text-gray-500">No hay proveedores asociados</li>
  )}
</ul>


      <div className="flex justify-end mt-6 gap-4">
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          onClick={() => alert('Función de edición en construcción')}
        >
          Editar
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={handleEliminar}
        >
          Eliminar
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
