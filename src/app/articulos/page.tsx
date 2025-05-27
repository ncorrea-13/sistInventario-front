'use client'
import { useEffect, useState } from 'react'
import Modal from '../componentes/Modal'
import CrearEditarArticulo from './CrearEditarArticulos'
import React from "react";
import Link from 'next/link';

const ArticulosPage = () => {
  const [mostrarModal, setMostrarModal] = useState(false)
  const [articulos, setArticulos] = useState([])

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`)
        if (!res.ok) {
          console.error('Estado de respuesta:', res.status, res.statusText)
          throw new Error('Error al obtener los artículos')
        }
        const data = await res.json()

        // Mapea los datos del backend a los nombres esperados en el frontend
        const articulosMapeados = data.map((articulo: {
          codArticulo: number, nombreArticulo: String, descripcionArticulo: String, stockActual: number, costoAlmacenamiento: number, costoCompra: number, costoPedido: number, costoMantenimiento: number, demandaAnual: number, desviacionDemandaL: number, desviacionDemandaT: number, nivelServicioDeseado: number;
        }) => ({
          descripcion: articulo.descripcionArticulo,
          stock: articulo.stockActual,
          costoAlmacenamiento: articulo.costoAlmacenamiento,
          costoPedido: articulo.costoPedido,
          demanda: articulo.demandaAnual,
        }))

        setArticulos(articulosMapeados)
      } catch (error) {
        console.error('Error al cargar artículos:', error)
      }
    }

    fetchArticulos()
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
          <h2 className="text-xl font-bold">Productos</h2>
          <button className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded shadow">
            <span className="text-lg">+</span> Crear
          </button>
        </div>

        {/* Tabla */}
        <table className="w-full text-sm">
          <thead className="bg-gray-300 text-center text-black font-bold">
            <tr>
              <th className="py-3 px-4 w-1/5">Descripción</th>
              <th className="py-3 px-4 w-1/5">Stock</th>
              <th className="py-3 px-4 w-1/5">Costo de almacenamiento</th>
              <th className="py-3 px-4 w-1/5">Costo de pedido</th>
              <th className="py-3 px-4 w-1/5">Demanda</th>
            </tr>
          </thead>
          <tbody>
            {}
          </tbody>
        </table>
        {mostrarModal && (
        <Modal onClose={() => setMostrarModal(false)}>
          <CrearEditarArticulo
            onGuardar={() => {
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

export default ArticulosPage;

