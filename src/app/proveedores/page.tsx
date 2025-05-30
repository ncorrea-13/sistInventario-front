'use client'
import { useEffect, useState } from 'react'
import Modal from '../componentes/Modal'
import CrearProveedor from './CrearProveedor'

// src/app/articulos/page.tsx
import React from "react";
import Link from 'next/link';

const ProveedoresPage = () => {
  const [mostrarModal, setMostrarModal] = useState(false)
  const [proveedores, setProveedores] = useState<{ nombre: string }[]>([])

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor`)
        if (!res.ok) {
          console.error('Estado de respuesta:', res.status, res.statusText)
          throw new Error('Error al obtener los proveedores')
        }
        const data = await res.json()

        // Mapea los datos del backend a los nombres esperados en el frontend
        const proveedoresMapeados = data.map((proveedor: { nombreProv: string }) => ({
          nombre: proveedor.nombreProv,
        }))

        setProveedores(proveedoresMapeados)
      } catch (error) {
        console.error('Error al cargar proveedores:', error)
      }
    }

    fetchProveedores()
  }, [])

  return (
    <div className="flex h-screen font-sans bg-[#fdfbee]">
      {/* Sidebar */}
<aside className="w-64 bg-black/80 shadow-xl border-r border-gray-200 p-6 min-h-screen rounded-r-3xl">
  <h2 className="text-xl font-semibold text-white mb-8 tracking-wide">Navegación</h2>
  <nav className="flex flex-col gap-4 text-gray-700 font-medium">
    <Link
      href="/articulos"
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition"
    >
      📦 <span className="text-white hover:scale-110">Artículos</span>
    </Link>
    <Link
      href="/proveedores"
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition"
    >
      🧾 <span className="text-white hover:scale-110">Proveedores</span>
    </Link>
    <Link
      href="/orden-compra"
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition"
    >
      🛒 <span className="text-white hover:scale-110">Orden de Compra</span>
    </Link>
    <Link
      href="/ventas"
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition"
    >
      💰 <span className="text-white hover:scale-110">Ventas</span>
    </Link>
  </nav>
</aside>


      {/* Main content */}
      <main className="flex-1 p-10 bg-white rounded-l-3xl shadow-2xl overflow-y-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8">Stocker</h1>

        {/* Subtítulo y botón */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Proveedores</h2>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-110">
            <span className="text-lg hover:scale-110">+</span> Crear
          </button>
        </div>

        {/* Tabla */}
        <table className="w-full text-sm rounded-xl overflow-hidden shadow-md bg-white">
          <thead className="bg-gray-300 rounded-3x1 overflow-hidden">
            <tr>
              <th className="py-3 px-4 w-1/3">Codigo</th>
              <th className="py-3 px-4 w-1/3">Nombre</th>
              <th className="py-3 px-4 w-1/3">Fecha Baja</th>
            </tr>
          </thead>
          <tbody>
            {/* Aquí irán los datos dinámicos */}
          </tbody>
        </table>

        {mostrarModal && (
        <Modal onClose={() => setMostrarModal(false)}>
          <CrearProveedor onGuardar={() => {
            setMostrarModal(false);

          }}
            onClose={() => setMostrarModal(false)}
          />
        </Modal>
        )}

      </main>
    </div>
  );
};

export default ProveedoresPage;
