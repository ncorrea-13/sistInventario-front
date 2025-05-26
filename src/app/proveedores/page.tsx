'use client'
import { useEffect, useState } from 'react'
import Modal from '../componentes/Modal'
import CrearProveedor from './CrearProveedor'

export default function ProveedoresPage() {
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Proveedores</h1>
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
            <th className="border p-2">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor, index) => (
            <tr key={index}>
              <td className="border p-2">{proveedor.nombre}</td>
            </tr>
          ))}
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
    </div>
  )
}

