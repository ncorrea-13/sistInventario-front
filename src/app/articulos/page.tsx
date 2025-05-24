'use client'
import { useState } from 'react'
import Modal from '../componentes/Modal'
import CrearEditarArticulo from './CrearEditarArticulos'

export default function ArticulosPage() {
  const [mostrarModal, setMostrarModal] = useState(false)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button onClick={() => setMostrarModal(true)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          + Crear
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Costo Almacenamiento</th>
            <th className="border p-2">Costo Pedido</th>
            <th className="border p-2">Demanda</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Ejemplo 1</td>
            <td className="border p-2">50</td>
            <td className="border p-2">12</td>
            <td className="border p-2">$22.50</td>
            <td className="border p-2">$40.00</td>
          </tr>
        </tbody>
      </table>

      {mostrarModal && (
        <Modal onClose={() => setMostrarModal(false)}>
          <CrearEditarArticulo onGuardar={() => setMostrarModal(false)} />
        </Modal>
      )}
    </div>
  )
}
