'use client';
import React, { useState, useEffect } from "react";
import Modal from "../componentes/Modal";
import Link from "next/link";

const OrdenesCompraPage = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ordenesCompra, setOrdenesCompra] = useState<{ num: string }[]>([]);

  useEffect(() => {
    const fetchOrdenesCompra = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orden-compra`)
        if (!res.ok) {
          console.error('Estado de respuesta:', res.status, res.statusText)
          throw new Error('Error al obtener las ordenes de compra')
        }
        const data = await res.json()

        // Mapea los datos del backend a los nombres esperados en el frontend
        const ordenesMapeadas = data.map((ordenCompra: { numOrdenCompra: string }) => ({
          num: ordenCompra.numOrdenCompra,
        }))

        setOrdenesCompra(ordenesMapeadas)
      } catch (error) {
        console.error('Error al cargar las ordenes de compra:', error)
      }
    }

    fetchOrdenesCompra()
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
          <h2 className="text-xl font-bold">Ordenes de compra</h2>
          <button className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded shadow">
            <span className="text-lg">+</span> Crear
          </button>
        </div>

        {/* Tabla */}
        <table className="w-full text-sm">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4 w-1/3">Número</th>
              <th className="py-3 px-4 w-1/3">Lote</th>
              <th className="py-3 px-4 w-1/3">Monto</th>
            </tr>
          </thead>
          <tbody>
            {/* Aquí irán los datos dinámicos */}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default OrdenesCompraPage;
