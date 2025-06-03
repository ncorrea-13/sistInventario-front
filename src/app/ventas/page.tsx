'use client';
import React, { useEffect, useState } from "react";
import { PackageOpen } from "lucide-react";

const VentasPage = () => {
  const [mostrarModal, setMostrarModal] = useState(false)
  const [proveedores, setProveedores] = useState<{ nombre: string }[]>([])
  const [ventas, setVentas] = useState<{ nro: number }[]>([])

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venta`)
        if (!res.ok) {
          console.error('Estado de respuesta:', res.status, res.statusText)
          throw new Error('Error al obtener las ventas')
        }
        const data = await res.json()

        const ventasMapeadas = data.map((venta: { nroVenta: number }) => ({
          nro: venta.nroVenta,
        }))

        setVentas(ventasMapeadas)
      } catch (error) {
        console.error('Error al cargar las ventas:', error)
      }
    }

    fetchVentas()
  }, [])


  return (
    <div className="flex h-screen font-sans bg-[#fdfbee]">

      {/* Main content */}
      <main className="flex-1 p-10 bg-white rounded-l-3xl shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <PackageOpen size={32} className="text-black" />
          <h1 className="text-4xl font-bold">Stocker</h1>
        </div>

        {/* Subtítulo y botón */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ventas</h2>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-110">
            <span className="text-lg hover:scale-110">+</span> Crear
          </button>
        </div>

        {/* Tabla */}
        <table className="w-full text-sm rounded-xl overflow-hidden shadow-md bg-white">
          <thead className="bg-gray-300 rounded-3x1 overflow-hidden">
            <tr>
              <th className="py-3 px-4 w-1/3">Número</th>
              <th className="py-3 px-4 w-1/3">Fecha</th>
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

export default VentasPage;
