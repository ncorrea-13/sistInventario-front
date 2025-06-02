'use client';
import { useEffect, useState } from 'react';
import Modal from '../componentes/Modal';
import CrearEditarProveedor from './CrearEditarProveedor';
import Link from 'next/link';

interface Proveedor {
  codProveedor: number;
  nombreProv: string;
  fechaBaja: string | null;
}

export default function ProveedoresPage() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);

  const fetchProveedores = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor`);
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que querés dar de baja este proveedor?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${id}/baja`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error();
      fetchProveedores();
    } catch (err) {
      alert('Error al eliminar proveedor');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  return (
    <div className="flex h-screen font-sans bg-[#fdfbee]">
      {/* Sidebar */}
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

      {/* Main */}
      <main className="flex-1 p-10 bg-white rounded-l-3xl shadow-2xl overflow-y-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Stocker</h1>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Proveedores</h2>
          <button
            onClick={() => {
              setProveedorSeleccionado(null);
              setMostrarModal(true);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-110"
          >
            <span className="text-lg">+</span> Crear
          </button>
        </div>

        <table className="w-full text-sm rounded-xl overflow-hidden shadow-md bg-white">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4">Código</th>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Fecha Baja</th>
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((prov) => (
              <tr key={prov.codProveedor} className="text-center border-b hover:bg-gray-100">
                <td className="py-2 px-4">{prov.codProveedor}</td>
                <td className="py-2 px-4">{prov.nombreProv}</td>
                <td className="py-2 px-4">{prov.fechaBaja || '—'}</td>
                <td className="py-2 px-4 flex justify-center gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setProveedorSeleccionado(prov);
                      setMostrarModal(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleEliminar(prov.codProveedor)}
                  >
                    Baja
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarModal && (
          <Modal onClose={() => setMostrarModal(false)}>
            <CrearEditarProveedor
              onClose={() => setMostrarModal(false)}
              onGuardar={fetchProveedores}
              proveedorId={proveedorSeleccionado?.codProveedor}
              proveedorNombre={proveedorSeleccionado?.nombreProv}
            />
          </Modal>
        )}
      </main>
    </div>
  );
}
