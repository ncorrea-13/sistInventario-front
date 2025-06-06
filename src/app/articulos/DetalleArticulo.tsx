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
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Partial<ArticuloDetalle>>({});

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}`);
        const data = await res.json();
        setArticulo(data);
        setFormData(data);
      } catch (err) {
        console.error('Error al cargar detalle:', err);
      }
    };
    fetchDetalle();
  }, [codArticulo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("stock") || name.includes("costo") || name.includes("demanda") || name.includes("desviacion") || name.includes("nivel")
        ? Number(value)
        : value,
    }));
  };

 const handleGuardarCambios = async () => {
  if (!formData.modeloInventario) {
    alert("Debe seleccionar un modelo de inventario.");
    return;
  }

  try {
    const cleanData = { ...formData };

    // 💣 Limpiar campos no permitidos
    delete (cleanData as any).codArticulo;
    delete (cleanData as any).proveedores;
    delete (cleanData as any).proveedorArticulos;

    const filteredData = Object.fromEntries(
      Object.entries(cleanData).filter(([_, v]) => v !== undefined)
    );

    console.log("🟢 JSON que se envía al backend:", filteredData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filteredData),
    });

    if (res.ok) {
      const actualizado = await res.json();
      setArticulo(actualizado);
      setEditando(false);
      onRefrescar();
    } else {
      const errorText = await res.text();
      console.error("❌ Error en backend:", errorText);
      alert('Error al guardar los cambios');
    }
  } catch (err) {
    console.error('Error al guardar:', err);
  }
};


  const handleEliminar = async () => {
    if (!confirm('¿Estás seguro de que querés eliminar este artículo?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}/baja`, {
        method: 'PATCH',
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
      {editando ? (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { label: 'Nombre del artículo', name: 'nombreArticulo' },
            { label: 'Descripción', name: 'descripcionArticulo' },
            { label: 'Modelo de inventario', name: 'modeloInventario', type: 'select' },
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
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={(formData as any)[field.name] ?? ''}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-1 w-full"
                >
                  <option value="loteFijo">Lote Fijo</option>
                  <option value="intervaloFijo">Intervalo Fijo</option>
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.name.includes('stock') || field.name.includes('costo') || field.name.includes('demanda') || field.name.includes('desviacion') || field.name.includes('nivel')
                    ? 'number'
                    : 'text'}
                  value={(formData as any)[field.name] ?? ''}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-1 w-full"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-2">{articulo.nombreArticulo}</h2>
          <p className="mb-2"><strong>Descripción:</strong> {articulo.descripcionArticulo}</p>
          <p className="mb-2"><strong>Modelo de Inventario:</strong> {articulo.modeloInventario}</p>
          <p className="mb-2"><strong>Stock:</strong> {articulo.stockActual}</p>
          <ul className="list-disc list-inside text-sm mb-4">
            <li>Almacenamiento: ${articulo.costoAlmacenamiento}</li>
            <li>Compra: ${articulo.costoCompra}</li>
            <li>Pedido: ${articulo.costoPedido}</li>
            <li>Mantenimiento: ${articulo.costoMantenimiento}</li>
          </ul>
          <p className="mb-2"><strong>Demanda anual:</strong> {articulo.demandaAnual}</p>
          <p className="mb-2"><strong>Desviación (L):</strong> {articulo.desviacionDemandaL} | <strong>(T):</strong> {articulo.desviacionDemandaT}</p>
          <p className="mb-2"><strong>Nivel de servicio deseado:</strong> {articulo.nivelServicioDeseado}</p>
        </>
      )}

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
