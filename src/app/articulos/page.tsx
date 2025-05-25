'use client'
import { useEffect, useState } from 'react'
import Modal from '../componentes/Modal'
import CrearEditarArticulo from './CrearEditarArticulos'

export default function ArticulosPage() {
  const [mostrarModal, setMostrarModal] = useState(false)
  const [articulos, setArticulos] = useState([])

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/articulos') // ajustá la URL si tu back está en otro puerto o ruta
        const data = await res.json()
        setArticulos(data)
      } catch (error) {
        console.error('Error al cargar artículos:', error)
      }
    }

    fetchArticulos()
  }, [])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
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
          {articulos.map((articulo) => (
            <tr key={articulo._id || articulo.codigo}>
              <td className="border p-2">{articulo.descripcion}</td>
              <td className="border p-2">{articulo.stock}</td>
              <td className="border p-2">{articulo.costoAlmacenamiento}</td>
              <td className="border p-2">{articulo.costoPedido}</td>
              <td className="border p-2">{articulo.demanda}</td>
            </tr>
          ))}
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
