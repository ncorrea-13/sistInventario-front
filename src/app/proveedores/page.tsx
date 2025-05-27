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
      <aside className="w-60 bg-gray-300 p-4">
        <h2 className="text-lg font-bold mb-6">Navegación</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/articulos" className="hover:underline">Artículos</Link>
          <Link href="/proveedores" className="hover:underline">Proveedores</Link>
          <Link href="/orden-compra" className="hover:underline">Orden de Compra</Link>
          <Link href="/ventas" className="hover:underline">Ventas</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8">Stocker</h1>

        {/* Subtítulo y botón */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Proveedores</h2>
          <button className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded shadow">
            <span className="text-lg">+</span> Crear
          </button>
        </div>

        {/* Tabla */}
        <table className="w-full text-sm">
          <thead className="bg-gray-300">
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
