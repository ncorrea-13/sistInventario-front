import React, { useState, useEffect } from 'react';

interface Articulo {
  id: number;
  nombre: string;
  precioUnitaria?: number;
  demoraEntrega?: number;
  cargoPedido?: number;
  predeterminado?: boolean;
}

interface ArticuloProveedor {
  articuloId: number;
  nombreArticulo: string;
  precioUnitaria: number;
  demoraEntrega: number;
  cargoPedido: number;
  predeterminado: boolean;
}

export default function AsignarProvArt({
  onClose,
  onAsignar,
  proveedorId,
}: {
  onClose: () => void;
  onAsignar: () => void;
  proveedorId: number;
}) {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articulosAsociados, setArticulosAsociados] = useState<ArticuloProveedor[]>([]);
  const [articuloId, setArticuloId] = useState<number | ''>('');
  const [precioUnitaria, setPrecioUnitaria] = useState('');
  const [demoraEntrega, setDemoraEntrega] = useState('');
  const [cargoPedido, setCargoPedido] = useState('');
  const [editando, setEditando] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Traer artículos disponibles
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar artículos');
        return res.json();
      })
      .then(data => {
        const articulosAdaptados = data.map((a: any) => ({
          id: a.codArticulo,
          nombre: a.nombreArticulo,
        }));
        setArticulos(articulosAdaptados);
      })
      .catch((error) => {
        console.error('Error al cargar artículos:', error);
        setArticulos([]);
      });
  }, []);

  // Traer artículos asociados al proveedor
  useEffect(() => {
    if (proveedorId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}`)
        .then(res => {
          if (!res.ok) throw new Error('Error al cargar artículos asociados');
          return res.json();
        })
        .then(data => {
          setArticulosAsociados(data);
        })
        .catch(error => {
          console.error('Error al cargar artículos asociados:', error);
          setArticulosAsociados([]);
        });
    }
  }, [proveedorId]);

  const resetForm = () => {
    setArticuloId('');
    setPrecioUnitaria('');
    setDemoraEntrega('');
    setCargoPedido('');
    setEditando(null);
    setMostrarFormulario(false);
  };

  const handleAsignar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proveedorId || !articuloId) return alert('Seleccione un artículo');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articuloId: Number(articuloId),
          precioUnitaria: parseFloat(precioUnitaria),
          demoraEntrega: parseInt(demoraEntrega),
          cargoPedido: parseFloat(cargoPedido),
          predeterminado: false,
        }),
      });

      if (!res.ok) throw new Error('Error al asignar artículo');

      const nuevaAsociacion = await res.json();
      setArticulosAsociados(prev => [...prev, nuevaAsociacion]);
      resetForm();
      onAsignar();
    } catch (error) {
      console.error('Error al asignar:', error);
      alert('No se pudo asignar el artículo al proveedor');
    }
  };

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editando) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}/articulos/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          precioUnitaria: parseFloat(precioUnitaria),
          demoraEntrega: parseInt(demoraEntrega),
          cargoPedido: parseFloat(cargoPedido),
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar artículo');

      const articuloActualizado = await res.json();
      setArticulosAsociados(prev =>
        prev.map(art => (art.articuloId === editando ? articuloActualizado : art))
      );
      resetForm();
    } catch (error) {
      console.error('Error al editar:', error);
      alert('No se pudo actualizar el artículo');
    }
  };

  const handleEliminar = async (articuloId: number) => {
    if (!confirm('¿Está seguro de eliminar esta asociación?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}/articulos/${articuloId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar asociación');

      setArticulosAsociados(prev => prev.filter(art => art.articuloId !== articuloId));
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar la asociación');
    }
  };

  const iniciarEdicion = (articulo: ArticuloProveedor) => {
    setEditando(articulo.articuloId);
    setArticuloId(articulo.articuloId);
    setPrecioUnitaria(articulo.precioUnitaria.toString());
    setDemoraEntrega(articulo.demoraEntrega.toString());
    setCargoPedido(articulo.cargoPedido.toString());
    setMostrarFormulario(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gestionar Artículos del Proveedor</h2>
          {!mostrarFormulario && (
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            >
              Asignar Nuevo Artículo
            </button>
          )}
        </div>

        {/* Lista de artículos asociados */}
        {!mostrarFormulario && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Artículos Asociados</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left">Artículo</th>
                    <th className="py-2 px-3 text-left">Precio Unitario</th>
                    <th className="py-2 px-3 text-left">Demora de Entrega</th>
                    <th className="py-2 px-3 text-left">Cargo por Pedido</th>
                    <th className="py-2 px-4 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {articulosAsociados.map((art) => (
                    <tr key={art.articuloId} className="hover:bg-gray-50">
                      <td className="py-2 px-3">{art.nombreArticulo}</td>
                      <td className="py-2 px-3">${art.precioUnitaria.toFixed(2)}</td>
                      <td className="py-2 px-3">{art.demoraEntrega} días</td>
                      <td className="py-2 px-3">${art.cargoPedido.toFixed(2)}</td>
                      <td className="py-2 px-4 border">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => iniciarEdicion(art)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(art.articuloId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {articulosAsociados.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-500">
                        No hay artículos asociados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Formulario de asignación/edición */}
        {mostrarFormulario && (
          <form onSubmit={editando ? handleEditar : handleAsignar} className="space-y-4">
            <h3 className="text-lg font-medium mb-4">
              {editando ? 'Editar Asociación' : 'Nueva Asociación'}
            </h3>
            
            {!editando && (
              <div>
                <label className="block text-sm font-medium mb-2">Artículo</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={articuloId}
                  onChange={e => setArticuloId(Number(e.target.value))}
                  required
                >
                  <option value="">Seleccione un artículo</option>
                  {articulos
                    .filter(a => !articulosAsociados.some(aa => aa.articuloId === a.id))
                    .map(a => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))
                  }
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Precio Unitario</label>
              <input
                type="number"
                step="0.01"
                className="w-full border px-3 py-2 rounded"
                value={precioUnitaria}
                onChange={e => setPrecioUnitaria(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Demora de Entrega (días)</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                value={demoraEntrega}
                onChange={e => setDemoraEntrega(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cargo por Pedido</label>
              <input
                type="number"
                step="0.01"
                className="w-full border px-3 py-2 rounded"
                value={cargoPedido}
                onChange={e => setCargoPedido(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="bg-gray-400 px-4 py-2 rounded text-white"
                onClick={() => {
                  resetForm();
                  if (!editando) onClose();
                }}
              >
                {editando ? 'Cancelar' : 'Cerrar'}
              </button>
              <button type="submit" className="bg-blue-600 px-4 py-2 rounded text-white">
                {editando ? 'Guardar Cambios' : 'Asignar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
