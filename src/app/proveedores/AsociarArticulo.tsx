'use client';
import { useEffect, useState } from 'react';

interface Articulo {
  codArticulo: number;
  nombreArticulo: string;
  descripcionArticulo: string;
}

interface AsociarArticuloProps {
  proveedorId: number;
  onClose: () => void;
  onGuardar: () => void;
}

export default function AsociarArticulo({ proveedorId, onClose, onGuardar }: AsociarArticuloProps) {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<number | null>(null);
  const [demoraEntrega, setDemoraEntrega] = useState<string>('0');
  const [precioUnitaria, setPrecioUnitaria] = useState<string>('0');
  const [cargoPedido, setCargoPedido] = useState<string>('0');

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`);
        const data = await res.json();
        setArticulos(data);
      } catch (error) {
        console.error('Error al obtener artículos:', error);
      }
    };
    fetchArticulos();
  }, [proveedorId]);

  const handleGuardar = async () => {
    if (!articuloSeleccionado) {
      alert('Por favor seleccione un artículo');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articuloId: articuloSeleccionado,
          demoraEntrega: Number(demoraEntrega),
          precioUnitaria: Number(precioUnitaria),
          cargoPedido: Number(cargoPedido),
        }),
      });

      if (!res.ok) throw new Error('Este articulo ya esta asociado a este proveedor');
      onGuardar();
      onClose();
    } catch (error) {
      alert('Este articulo ya esta asociado a este proveedor');
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Asociar Artículo</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Seleccionar Artículo</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={articuloSeleccionado || ''}
            onChange={(e) => setArticuloSeleccionado(Number(e.target.value))}
          >
            <option value="">Seleccione un artículo</option>
            {articulos.map((articulo) => (
              <option key={articulo.codArticulo} value={articulo.codArticulo}>
                {articulo.nombreArticulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Demora de Entrega (días)</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={demoraEntrega}
            onChange={(e) => setDemoraEntrega(e.target.value)}
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Precio Unitario</label>
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
          <label className="block text-sm font-medium mb-2">Cargo por Pedido</label>
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
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className="bg-blue-600 px-4 py-2 rounded text-white"
          onClick={handleGuardar}
        >
          Guardar
        </button>
      </div>
    </div>
  );
} 