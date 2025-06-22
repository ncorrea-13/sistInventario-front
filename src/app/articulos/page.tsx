'use client';
import { useCallback, useEffect, useState } from 'react';
import Modal from '../componentes/Modal';
import CrearEditarArticulo from './CrearEditarArticulos';
import DetalleArticulo from './DetalleArticulo';
import VerDatosCalculados from './VerDatosCalculados';
import { PackageOpen, Pencil, Eye, Trash2 } from 'lucide-react';

interface ArticuloMapped {
  codArticulo: number;
  nombre: string;
  descripcion: string;
  stock: number;
  stockSeguridad: number;
  costoAlmacenamiento: number;
  costoPedido: number;
  demanda: number;
  costoCompra: number;
  desviacionDemandaL: number;
  desviacionDemandaT: number;
  modeloInventario: string;
  proveedores: any[];
  proveedorPredeterminado: number | null;
}

type Filtro = 'todos' | 'reponer' | 'faltantes';

const ArticulosPage = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [articuloAEditar, setArticuloAEditar] = useState<ArticuloMapped | null>(null);
  const [verDatosId, setVerDatosId] = useState<number | null>(null);
  const [articuloABorrar, setArticuloABorrar] = useState<ArticuloMapped | null>(null);
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [articulos, setArticulos] = useState<ArticuloMapped[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [editandoStockId, setEditandoStockId] = useState<number | null>(null);
  const [nuevoStock, setNuevoStock] = useState<string>("");

  const fetchArticulos = useCallback(async (filtroActual: Filtro) => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/articulo`;
    if (filtroActual === 'reponer') {
      url = `${process.env.NEXT_PUBLIC_API_URL}/articulo/reponer`;
    } else if (filtroActual === 'faltantes') {
      url = `${process.env.NEXT_PUBLIC_API_URL}/articulo/stockSeguridad`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      const lista = Array.isArray(data) ? data : data.articulos || [];
      const articulosMapeados = lista.map((articulo: any) => ({
        codArticulo: articulo.codArticulo,
        nombre: articulo.nombreArticulo,
        descripcion: articulo.descripcionArticulo,
        stock: articulo.stockActual,
        stockSeguridad:
          articulo.modeloFijoLote?.stockSeguridadLot ||
          articulo.modeloFijoInventario?.stockSeguridadInt ||
          0,
        costoAlmacenamiento: articulo.costoAlmacenamiento,
        costoPedido: articulo.costoPedido,
        demanda: articulo.demandaAnual,
        costoCompra: articulo.costoCompra,
        desviacionDemandaL: articulo.desviacionDemandaL,
        desviacionDemandaT: articulo.desviacionDemandaT,
        modeloInventario: articulo.modeloInventario,
        puntoPedido: articulo.modeloFijoLote?.puntoPedido || 0,
        ordenesPendientes: articulo.ordenDetalle?.some(
          (od: any) =>
            od.ordenCompra?.ordenEstado?.nombreEstadoOrden === 'Pendiente' ||
            od.ordenCompra?.ordenEstado?.nombreEstadoOrden === 'Enviada'
        ),
        proveedores: articulo.proveedorArticulos,
        proveedorPredeterminado:
          articulo.proveedorArticulos.find((pa: any) => pa.predeterminado)
            ?.proveedorId || null,
      }));
      setArticulos(articulosMapeados);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
    }
  }, []);

  const handleBorrarArticulo = async (codArticulo: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}/baja`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al dar de baja el artículo');
      }
      setArticuloABorrar(null);
      fetchArticulos(filtro);
    } catch (error: any) {
      alert(error.message);
      console.error(error);
      setArticuloABorrar(null);
    }
  };

  const handleSetProveedorPredeterminado = async (
    codArticulo: number,
    proveedorId: number
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}/proveedor`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ proveedorId }),
        }
      );
      if (!res.ok) {
        throw new Error('Error al establecer el proveedor predeterminado');
      }
      fetchArticulos(filtro);
    } catch (error: any) {
      alert(error.message);
      console.error(error);
    }
  };

  const handleEditarStock = (articulo: ArticuloMapped) => {
    setEditandoStockId(articulo.codArticulo);
    setNuevoStock(articulo.stock.toString());
  };

  const handleGuardarStock = async (articulo: ArticuloMapped) => {
    const valor = parseInt(nuevoStock, 10);
    if (isNaN(valor) || valor < 0) {
      alert("El stock debe ser un número válido y no negativo.");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${articulo.codArticulo}/inventario`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoStock: valor }),
      });
      if (!res.ok) throw new Error("Error al actualizar el stock");
      
      // Refrescar la lista completa para asegurar que los filtros se actualicen correctamente
      fetchArticulos(filtro);
      setEditandoStockId(null);
    } catch (err) {
      alert("Error al actualizar el stock");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArticulos(filtro);
  }, [filtro, fetchArticulos]);

  return (
    <div className="flex h-screen font-sans bg-[#fdfbee]">
      <main className="flex-1 p-10 bg-white rounded-l-3xl shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <PackageOpen size={32} className="text-black" />
          <h1 className="text-4xl font-bold">Stocker</h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Productos</h2>
          <button
            onClick={() => {
              setArticuloAEditar(null);
              setMostrarModal(true);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-110"
          >
            <span className="text-lg">+</span> Crear
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-full border ${
              filtro === 'todos' ? 'bg-black text-white' : 'bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('reponer')}
            className={`px-4 py-2 rounded-full border ${
              filtro === 'reponer' ? 'bg-orange-500 text-white' : 'bg-gray-200'
            }`}
          >
            A Reponer
          </button>
          <button
            onClick={() => setFiltro('faltantes')}
            className={`px-4 py-2 rounded-full border ${
              filtro === 'faltantes' ? 'bg-red-600 text-white' : 'bg-gray-200'
            }`}
          >
            Faltantes
          </button>
        </div>

        {filtro !== 'todos' && (
          <h3 className="text-lg mb-4 font-semibold">
            Mostrando productos: {filtro === 'reponer' ? 'a reponer' : 'faltantes'}
          </h3>
        )}

        <table className="w-full text-sm rounded-xl overflow-hidden shadow-md bg-white">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Descripción</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Modelo</th>
              <th className="py-3 px-4">Almacenamiento</th>
              <th className="py-3 px-4">Pedido</th>
              <th className="py-3 px-4">Compra</th>
              <th className="py-3 px-4">Demanda</th>
              <th className="py-3 px-4">Desv. L</th>
              <th className="py-3 px-4">Desv. T</th>
              <th className="py-3 px-4">Proveedor Predet.</th>
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((articulo) => (
              <tr
                key={articulo.codArticulo}
                className="cursor-pointer hover:bg-gray-100"
                onDoubleClick={() => setDetalleId(articulo.codArticulo)}
              >
                <td className="border p-2">{articulo.nombre}</td>
                <td className="border p-2">{articulo.descripcion}</td>
                <td className="border p-2">
                  {editandoStockId === articulo.codArticulo ? (
                    <input
                      type="number"
                      value={nuevoStock}
                      autoFocus
                      min={0}
                      onChange={e => setNuevoStock(e.target.value)}
                      onBlur={() => handleGuardarStock(articulo)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleGuardarStock(articulo);
                        if (e.key === 'Escape') setEditandoStockId(null);
                      }}
                      className="w-20 p-1 border rounded"
                    />
                  ) : (
                    <button
                      onClick={() => handleEditarStock(articulo)}
                      className="flex items-center gap-1 px-2 py-1 border border-blue-400 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer shadow-sm"
                      style={{ minWidth: '60px' }}
                    >
                      <span>{articulo.stock}</span>
                      <Pencil size={14} className="ml-1" />
                    </button>
                  )}
                </td>
                <td className="border p-2 capitalize">{articulo.modeloInventario || '-'}</td>
                <td className="border p-2">{articulo.costoAlmacenamiento}</td>
                <td className="border p-2">{articulo.costoPedido}</td>
                <td className="border p-2">{articulo.costoCompra}</td>
                <td className="border p-2">{articulo.demanda}</td>
                <td className="border p-2">{articulo.desviacionDemandaL}</td>
                <td className="border p-2">{articulo.desviacionDemandaT}</td>
                <td className="border p-2">
                  {articulo.proveedores.length > 0 ? (
                    <select
                      value={articulo.proveedorPredeterminado || ''}
                      onChange={(e) =>
                        handleSetProveedorPredeterminado(
                          articulo.codArticulo,
                          Number(e.target.value)
                        )
                      }
                      className="p-1 border rounded w-full"
                    >
                      <option value="" disabled>
                        Seleccionar
                      </option>
                      {articulo.proveedores.map((pa: any) => (
                        <option key={pa.proveedorId} value={pa.proveedorId}>
                          {pa.proveedor.nombreProv}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-gray-500">Sin proveedores</span>
                  )}
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => {
                      setArticuloAEditar(articulo);
                      setMostrarModal(true);
                    }}
                    className="p-2 rounded-full flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setVerDatosId(articulo.codArticulo)}
                    className="p-2 rounded-full flex items-center gap-1 bg-green-500 hover:bg-green-700 text-white"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => setArticuloABorrar(articulo)}
                    className="p-2 rounded-full flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarModal && (
          <Modal onClose={() => setMostrarModal(false)}>
            <CrearEditarArticulo
              articuloInicial={articuloAEditar ? {
                codArticulo: articuloAEditar.codArticulo,
                nombreArticulo: articuloAEditar.nombre,
                descripcionArticulo: articuloAEditar.descripcion,
                stockActual: articuloAEditar.stock,
                costoAlmacenamiento: articuloAEditar.costoAlmacenamiento,
                costoPedido: articuloAEditar.costoPedido,
                demandaAnual: articuloAEditar.demanda,
                costoCompra: articuloAEditar.costoCompra,
                desviacionDemandaL: articuloAEditar.desviacionDemandaL,
                desviacionDemandaT: articuloAEditar.desviacionDemandaT,
                modeloInventario: articuloAEditar.modeloInventario,
              } : undefined}
              onGuardar={() => {
                fetchArticulos(filtro);
                setMostrarModal(false);
                setArticuloAEditar(null);
              }}
              onClose={() => {
                setMostrarModal(false);
                setArticuloAEditar(null);
              }}
            />
          </Modal>
        )}

        {detalleId !== null && (
          <Modal onClose={() => setDetalleId(null)}>
            <DetalleArticulo
              codArticulo={detalleId}
              onClose={() => setDetalleId(null)}
              onRefrescar={() => fetchArticulos(filtro)}
            />
          </Modal>
        )}

        {verDatosId !== null && (
          <Modal onClose={() => setVerDatosId(null)}>
            <VerDatosCalculados
              codArticulo={verDatosId}
              onClose={() => setVerDatosId(null)}
            />
          </Modal>
        )}

        {articuloABorrar && (
          <Modal onClose={() => setArticuloABorrar(null)}>
            <div className="p-4 text-center">
              <h2 className="text-lg font-bold mb-4">Confirmar Eliminación</h2>
              <p>
                ¿Estás seguro de que deseas dar de baja el artículo "{' '}
                <strong>{articuloABorrar.nombre}</strong>"?
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setArticuloABorrar(null)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleBorrarArticulo(articuloABorrar.codArticulo)}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default ArticulosPage;
