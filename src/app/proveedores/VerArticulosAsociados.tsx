'use client';
import { useEffect, useState } from 'react';

interface ArticuloAsociado {
  articulo: {
    codArticulo: number;
    nombreArticulo: string;
    descripcionArticulo: string;
  };
  precioUnitaria: number;
  demoraEntrega: number;
  cargoPedido: number;
  predeterminado: boolean;
}

interface VerArticulosAsociadosProps {
  proveedorId: number;
  onClose: () => void;
}

export default function VerArticulosAsociados({ proveedorId, onClose }: VerArticulosAsociadosProps) {
  const [articulosAsociados, setArticulosAsociados] = useState<ArticuloAsociado[]>([]);
  const [articuloEditando, setArticuloEditando] = useState<ArticuloAsociado | null>(null);
  const [precioUnitaria, setPrecioUnitaria] = useState<string>('0');
  const [demoraEntrega, setDemoraEntrega] = useState<string>('0');
  const [cargoPedido, setCargoPedido] = useState<string>('0');

  const fetchArticulosAsociados = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}`);
      const data = await res.json();
      setArticulosAsociados(data);
    } catch (error) {
      console.error('Error al obtener artículos asociados:', error);
    }
  };

  useEffect(() => {
    fetchArticulosAsociados();
  }, [proveedorId]);

  const handleEditar = (articulo: ArticuloAsociado) => {
    setArticuloEditando(articulo);
    setPrecioUnitaria(articulo.precioUnitaria.toString());
    setDemoraEntrega(articulo.demoraEntrega.toString());
    setCargoPedido(articulo.cargoPedido.toString());
  };

  const handleGuardarEdicion = async () => {
    if (!articuloEditando) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}/${articuloEditando.articulo.codArticulo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          precioUnitaria: Number(precioUnitaria),
          demoraEntrega: Number(demoraEntrega),
          cargoPedido: Number(cargoPedido),
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar artículo');

      await fetchArticulosAsociados();
      setArticuloEditando(null);
    } catch (error) {
      alert('Error al actualizar artículo');
      console.error(error);
    }
  };

  const handleEliminar = async (codArticulo: number) => {
    try {
      if (!confirm('¿Estás seguro de que querés eliminar este artículo?')) return;
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}/${codArticulo}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error();
      fetchArticulosAsociados();
    } catch (err) {
      alert('Error al eliminar artículo');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-6xl w-full">
      <h2 className="text-xl font-semibold mb-4">Artículos Asociados</h2>
      
      {articulosAsociados.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No hay artículos asociados a este proveedor</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Artículo</th>
                <th className="py-2 px-4 text-right">Precio Unitario</th>
                <th className="py-2 px-4 text-right">Demora (días)</th>
                <th className="py-2 px-4 text-right">Cargo Pedido</th>
              </tr>
            </thead>
            <tbody>
              {articulosAsociados.map((asociacion) => (
                <tr key={asociacion.articulo.codArticulo} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <div>
                      <div className="font-medium">{asociacion.articulo.nombreArticulo}</div>
                      <div className="text-gray-500 text-xs">{asociacion.articulo.descripcionArticulo}</div>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-right">${asociacion.precioUnitaria.toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">{asociacion.demoraEntrega}</td>
                  <td className="py-2 px-4 text-right">${asociacion.cargoPedido.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {articuloEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Editar Artículo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Precio Unitario</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={precioUnitaria}
                  onChange={(e) => setPrecioUnitaria(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Demora de Entrega (días)</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={demoraEntrega}
                  onChange={(e) => setDemoraEntrega(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cargo por Pedido</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={cargoPedido}
                  onChange={(e) => setCargoPedido(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="bg-gray-400 px-4 py-2 rounded text-white"
                onClick={() => setArticuloEditando(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 px-4 py-2 rounded text-white"
                onClick={handleGuardarEdicion}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          className="bg-gray-400 px-4 py-2 rounded text-white"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
} 