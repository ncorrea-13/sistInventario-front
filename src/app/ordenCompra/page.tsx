'use client';
import { useEffect, useState } from 'react';
import Modal from '../componentes/Modal';
import CrearEditarOrdenCompra from './CrearEditarOrdenCompra';
import { PackageOpen, Trash2, Pencil, Ban, Send, Check } from "lucide-react";

interface OrdenCompra {
  ordenCompraId: number;
  numOrdenCompra: string;
  tamanoLote: number;
  montoOrden: number;
  proveedorId: number;
  ordenEstadoId: number;
  detalles:{
    articuloId: number;
    articulo: {
      nombreArticulo: string;
      codArticulo: number;
    }
  }[]
  
}

const ESTADOS_ORDEN = [
  { codEstadoOrden: 1, nombreEstadoOrden: 'PENDIENTE' },
  { codEstadoOrden: 2, nombreEstadoOrden: 'ENVIADA' },
  { codEstadoOrden: 3, nombreEstadoOrden: 'FINALIZADA' },
  { codEstadoOrden: 4, nombreEstadoOrden: 'CANCELADA' },
];

export default function OrdenesCompraPage() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenCompra | null>(null);
  const [articulos, setArticulos] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [filtroCanceladas, setFiltroCanceladas] = useState(false);
  const [filtroFinalizadas, setFiltroFinalizadas] = useState(false);

  const fetchOrdenesCompra = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenCompra`);
      const data = await res.json();
      setOrdenesCompra(data);
    } catch (error) {
      console.error('Error al cargar las órdenes de compra:', error);
    }
  };

  const fetchArticulos = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`);
      const data = await res.json();
      setArticulos(Array.isArray(data) ? data : data.articulos || []);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor`);
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  useEffect(() => {
    fetchOrdenesCompra();
    fetchArticulos();
    fetchProveedores();
  }, []);

  const handleCerrarModal = (debeRefrescar: boolean) => {
    setMostrarModal(false);
    setOrdenSeleccionada(null);
    if (debeRefrescar) fetchOrdenesCompra();
  };

  return (
    <div className="flex h-screen font-sans bg-[#fdfbee]">

      <main className="flex-1 p-10 bg-white rounded-l-3xl shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <PackageOpen size={32} className="text-black" />
          <h1 className="text-4xl font-bold">Stocker</h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ordenes de Compra</h2>
          <button
            onClick={() => {
              setOrdenSeleccionada(null);
              setMostrarModal(true);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-110"
          >
            <span className="text-lg">+</span> Crear
          </button>
        </div>

        {/* Botones de filtro debajo del título */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full border font-semibold transition ${!filtroCanceladas && !filtroFinalizadas ? 'bg-black text-white' : 'bg-gray-200'}`}
            onClick={() => { setFiltroCanceladas(false); setFiltroFinalizadas(false); }}
          >
            Todas
          </button>
          <button
            className={`px-4 py-2 rounded-full border font-semibold transition ${filtroCanceladas ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
            onClick={() => { setFiltroCanceladas(true); setFiltroFinalizadas(false); }}
          >
            Canceladas
          </button>
          <button
            className={`px-4 py-2 rounded-full border font-semibold transition ${filtroFinalizadas ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => { setFiltroFinalizadas(true); setFiltroCanceladas(false); }}
          >
            Finalizadas
          </button>
        </div>

        <table className="w-full text-sm rounded-xl overflow-hidden shadow-md bg-white">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4">Número</th>
              <th className="py-3 px-4">Artículo</th>
              <th className="py-3 px-4">Proveedor</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Tamaño de Lote</th>
              <th className="py-3 px-4">Monto</th>
              {!(filtroCanceladas || filtroFinalizadas) && <th className="py-3 px-4">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {ordenesCompra
              .filter(orden => {
                const estado = ESTADOS_ORDEN.find(e => e.codEstadoOrden === orden.ordenEstadoId);
                if (filtroCanceladas) {
                  return estado && estado.nombreEstadoOrden === 'CANCELADA';
                } else if (filtroFinalizadas) {
                  return estado && estado.nombreEstadoOrden === 'FINALIZADA';
                } else {
                  return estado && estado.nombreEstadoOrden !== 'CANCELADA' && estado.nombreEstadoOrden !== 'FINALIZADA';
                }
              })
              .map((orden) => {
                const articuloNombre = orden.detalles && orden.detalles.length > 0 && orden.detalles[0].articulo
                  ? orden.detalles[0].articulo.nombreArticulo
                  : '-';
                const proveedor = proveedores.find(p => p.codProveedor === orden.proveedorId);
                const estado = ESTADOS_ORDEN.find(e => e.codEstadoOrden === orden.ordenEstadoId);
                return (
                  <tr
                    key={orden.ordenCompraId}
                    className="border-b text-center cursor-pointer hover:bg-gray-100"
                    onDoubleClick={() => {
                      setOrdenSeleccionada(orden);
                      setMostrarModal(true);
                    }}
                  >
                    <td className="py-2 px-4">{orden.numOrdenCompra}</td>
                    <td className="py-2 px-4">{articuloNombre}</td>
                    <td className="py-2 px-4">{proveedor ? proveedor.nombreProv : '-'}</td>
                    <td className="py-2 px-4">{estado ? estado.nombreEstadoOrden : '-'}</td>
                    <td className="py-2 px-4">{orden.tamanoLote}</td>
                    <td className="py-2 px-4">${orden.montoOrden}</td>
                    {!(filtroCanceladas || filtroFinalizadas) && (
                      <td className="py-2 px-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            className={`p-2 rounded-full ${estado && estado.nombreEstadoOrden === 'PENDIENTE' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
                            disabled={!estado || estado.nombreEstadoOrden !== 'PENDIENTE'}
                            title="Eliminar"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!estado || estado.nombreEstadoOrden !== 'PENDIENTE') return;
                              if (!window.confirm('¿Seguro que deseas cancelar esta orden de compra?')) return;
                              try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenCompra/${orden.numOrdenCompra}/estado`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ nuevoEstado: 'Cancelada' }),
                                });
                                if (!res.ok) throw new Error('No se pudo cancelar la orden');
                                fetchOrdenesCompra();
                              } catch (err) {
                                alert('Error al cancelar la orden de compra');
                              }
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            className={`p-2 rounded-full ${(filtroCanceladas || (estado && (estado.nombreEstadoOrden === 'CANCELADA' || estado.nombreEstadoOrden === 'ENVIADA'))) ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 text-white'}`}
                            title="Editar"
                            onClick={(e) => {
                              if (filtroCanceladas || (estado && (estado.nombreEstadoOrden === 'CANCELADA' || estado.nombreEstadoOrden === 'ENVIADA'))) return;
                              e.stopPropagation();
                              setOrdenSeleccionada(orden);
                              setMostrarModal(true);
                            }}
                            disabled={filtroCanceladas || (estado && (estado.nombreEstadoOrden === 'CANCELADA' || estado.nombreEstadoOrden === 'ENVIADA'))}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className={`p-2 rounded-full ${estado && estado.nombreEstadoOrden !== 'CANCELADA' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
                            title="Enviar"
                            disabled={estado && estado.nombreEstadoOrden === 'CANCELADA'}
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (estado && estado.nombreEstadoOrden === 'CANCELADA') return;
                              if (!window.confirm('¿Seguro que deseas enviar esta orden de compra?')) return;
                              try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenCompra/${orden.numOrdenCompra}/estado`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ nuevoEstado: 'Enviada' }),
                                });
                                if (!res.ok) throw new Error('No se pudo enviar la orden');
                                fetchOrdenesCompra();
                              } catch (err) {
                                alert('Error al enviar la orden de compra');
                              }
                            }}
                          >
                            <Send size={18} />
                          </button>
                          <button
                            className={`p-2 rounded-full ${estado && estado.nombreEstadoOrden === 'ENVIADA' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
                            title="Finalizar"
                            disabled={!estado || estado.nombreEstadoOrden !== 'ENVIADA'}
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!estado || estado.nombreEstadoOrden !== 'ENVIADA') return;
                              if (!window.confirm('¿Seguro que deseas finalizar esta orden de compra?')) return;
                              try {
                                // 1. Cambiar estado a FINALIZADA
                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordenCompra/${orden.numOrdenCompra}/estado`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ nuevoEstado: 'Finalizada' }),
                                });
                                if (!res.ok) throw new Error('No se pudo finalizar la orden');
                                // 2. Sumar el tamaño de lote al stock del artículo
                                const articuloId = orden.detalles && orden.detalles.length > 0 ? orden.detalles[0].articuloId : null;
                                let nuevoStock = null;
                                if (articuloId) {
                                  // Obtener el stock actual del artículo
                                  const resArticulo = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${articuloId}`);
                                  const dataArticulo = await resArticulo.json();
                                  const stockActual = dataArticulo.stockActual || 0;
                                  nuevoStock = stockActual + orden.tamanoLote;
                                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${articuloId}/inventario`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ nuevoStock }),
                                  });

                                  // 3. Verificar si el stock actualizado está por debajo del punto de pedido
                                  const puntoPedido = dataArticulo.modeloFijoLote?.puntoPedido;
                                  if (puntoPedido !== null && puntoPedido !== undefined && nuevoStock < puntoPedido) {
                                    alert('Aviso: Stock actual por debajo del punto de pedido');
                                  }
                                }
                                fetchOrdenesCompra();
                              } catch (err) {
                                alert('Error al finalizar la orden de compra');
                              }
                            }}
                          >
                            <Check size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>

        {mostrarModal && (
          <Modal onClose={() => handleCerrarModal(false)}>
            <CrearEditarOrdenCompra
              orden={ordenSeleccionada}
              onClose={(refrescar) => handleCerrarModal(refrescar)}
            />
          </Modal>
        )}
      </main>
    </div>
  );
}
