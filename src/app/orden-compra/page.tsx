'use client';
import { useEffect, useState } from 'react';
import Modal from '../componentes/Modal';
import CrearEditarOrdenCompra from './CrearEditarOrdenCompra';
import Link from 'next/link';

interface OrdenCompra {
  ordenCompraId: number;
  numOrdenCompra: string;
  tamanoLote: number;
  montoOrden: number;
  proveedorId: number;
  ordenEstadoId: number;
}

export default function OrdenesCompraPage() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenCompra | null>(null);

  const fetchOrdenesCompra = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orden-compra`);
      const data = await res.json();
      setOrdenesCompra(data);
    } catch (error) {
      console.error('Error al cargar las órdenes de compra:', error);
    }
  };

  useEffect(() => {
    fetchOrdenesCompra();
  }, []);

  const handleCerrarModal = (debeRefrescar: boolean) => {
    setMostrarModal(false);
    setOrdenSeleccionada(null);
    if (debeRefrescar) fetchOrdenesCompra();
  };

  return (
    <div className="flex h-screen font-sans bg-[#fdfbee]">
      <aside className="w-64 bg-black/80 shadow-xl border-r border-gray-200 p-6 min-h-screen rounded-r-3xl">
        <h2 className="text-xl font-semibold text-white mb-8 tracking-wide">Navegación</h2>
        <nav className="flex flex-col gap-4 text-gray-700 font-medium">
          <Link href="/articulos" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition">
            📦 <span className="text-white hover:scale-110">Artículos</span>
          </Link>
          <Link href="/proveedores" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition">
            🧾 <span className="text-white hover:scale-110">Proveedores</span>
          </Link>
          <Link href="/orden-compra" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition">
            🛒 <span className="text-white hover:scale-110">Orden de Compra</span>
          </Link>
          <Link href="/ventas" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition">
            💰 <span className="text-white hover:scale-110">Ventas</span>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-10 bg-white rounded-l-3xl shadow-2xl overflow-y-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Stocker</h1>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Órdenes de Compra</h2>
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

        <table className="w-full text-sm rounded-xl overflow-hidden shadow-md bg-white">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4">Número</th>
              <th className="py-3 px-4">Tamaño de Lote</th>
              <th className="py-3 px-4">Monto</th>
            </tr>
          </thead>
          <tbody>
            {ordenesCompra.map((orden) => (
              <tr
                key={orden.ordenCompraId}
                className="border-b text-center cursor-pointer hover:bg-gray-100"
                onDoubleClick={() => {
                  setOrdenSeleccionada(orden);
                  setMostrarModal(true);
                }}
              >
                <td className="py-2 px-4">{orden.numOrdenCompra}</td>
                <td className="py-2 px-4">{orden.tamanoLote}</td>
                <td className="py-2 px-4">${orden.montoOrden}</td>
              </tr>
            ))}
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
