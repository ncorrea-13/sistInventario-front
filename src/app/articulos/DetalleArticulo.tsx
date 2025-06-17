'use client';
import { useEffect, useState } from 'react';

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
  proveedorPredeterminadoId?: number;
  proveedorArticulos?: {
    proveedor: { codProveedor: number; nombreProv: string };
    predeterminado: boolean;
  }[];
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
  const [formData, setFormData] = useState<Partial<ArticuloDetalle>>({});
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}`);
        const data = await res.json();
        setArticulo(data);
        setFormData(data);
      } catch (err) {
        console.error('Error al cargar artículo:', err);
      }
    };
    fetchData();
  }, [codArticulo]);

  useEffect(() => {
    if (editando) {
      const fetchProveedores = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor`);
          const data = await res.json();
          setProveedores(data);
        } catch (err) {
          console.error('Error al cargar proveedores:', err);
        }
      };
      fetchProveedores();
    }
  }, [editando]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("stock") || name.includes("costo") || name.includes("demanda") || name.includes("desviacion") || name.includes("nivel") || name.includes("proveedorPredeterminadoId")
        ? Number(value)
        : value,
    }));
  };

  const handleGuardarCambios = async () => {
    if (!formData.modeloInventario) {
      alert("Debe seleccionar un modelo de inventario.");
      return;
    }

    const cleanData = { ...formData };
    delete (cleanData as any).codArticulo;
    delete (cleanData as any).proveedorArticulos;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      if (res.ok) {
        const actualizado = await res.json();
        setArticulo(actualizado);
        setEditando(false);
        onRefrescar();
      } else {
        const errorText = await res.text();
        console.error("Error backend:", errorText);
        alert('Error al guardar cambios');
      }
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const handleEliminar = async () => {
    if (!confirm("¿Seguro que querés eliminar este artículo?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}/baja`, {
        method: 'PATCH',
      });
      if (res.ok) {
        onRefrescar();
        onClose();
      } else {
        alert("No se pudo eliminar el artículo");
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
            { label: 'Nombre', name: 'nombreArticulo' },
            { label: 'Descripción', name: 'descripcionArticulo' },
            { label: 'Modelo de inventario', name: 'modeloInventario', type: 'select' },
            { label: 'Stock actual', name: 'stockActual' },
            { label: 'Costo almacenamiento', name: 'costoAlmacenamiento' },
            { label: 'Costo compra', name: 'costoCompra' },
            { label: 'Costo pedido', name: 'costoPedido' },
            { label: 'Costo mantenimiento', name: 'costoMantenimiento' },
            { label: 'Demanda anual', name: 'demandaAnual' },
            { label: 'Desviación L', name: 'desviacionDemandaL' },
            { label: 'Desviación T', name: 'desviacionDemandaT' },
            { label: 'Nivel de servicio deseado', name: 'nivelServicioDeseado' },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium block mb-1">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={(formData as any)[field.name] ?? ''}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="modeloFijoLote">Lote Fijo</option>
                  <option value="modeloFijoInventario">Intervalo Fijo</option>
                </select>
              ) : (
                <input
                  name={field.name}
                  type="text"
                  value={(formData as any)[field.name] ?? ''}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 w-full"
                />
              )}
            </div>
          ))}

          <div className="col-span-2">
            <label className="text-sm font-medium block mb-1">Proveedor Predeterminado</label>
            <select
              name="proveedorPredeterminadoId"
              value={formData.proveedorPredeterminadoId ?? ''}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">Seleccionar proveedor</option>
              {proveedores.map((p) => (
                <option key={p.codProveedor} value={p.codProveedor}>
                  {p.nombreProv}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-2">{articulo.nombreArticulo}</h2>
          <p><strong>Descripción:</strong> {articulo.descripcionArticulo}</p>
          <p><strong>Modelo:</strong> {articulo.modeloInventario}</p>
          <p><strong>Stock:</strong> {articulo.stockActual}</p>
          <p><strong>Proveedor predeterminado:</strong> {
            Array.isArray(articulo.proveedorArticulos)
              ? articulo.proveedorArticulos.find(p => p.predeterminado)?.proveedor.nombreProv || 'No definido'
              : 'No definido'
          }</p>
        </>
      )}

      <div className="flex justify-end mt-6 gap-4">
        {editando ? (
          <>
            <button onClick={handleGuardarCambios} className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
            <button onClick={() => setEditando(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
          </>
        ) : (
          <button onClick={() => setEditando(true)} className="bg-yellow-500 text-white px-4 py-2 rounded">Editar</button>
        )}
        <button onClick={handleEliminar} className="bg-red-600 text-white px-4 py-2 rounded">Eliminar</button>
        <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cerrar</button>
      </div>
    </div>
  );
}
