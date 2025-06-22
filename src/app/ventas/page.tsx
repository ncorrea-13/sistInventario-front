'use client';
import { useEffect, useState } from 'react';
import CrearVenta from './CrearVenta';
import { PackageOpen } from 'lucide-react';

interface Venta {
  nroVenta: number;
  montoTotalVenta: number;
  detalles: DetalleVenta[];
}

interface DetalleVenta {
  ArticuloId: number;
  cantidadArticulo: number;
  articulo: {
    nombreArticulo: string;
  };
}

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<number | null>(null);

  const cargarVentas = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venta`);
    const data = await res.json();
    setVentas(data.ventas);
  };

  const cargarDetalleVenta = async (ventaId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venta/${ventaId}`);
    const data = await res.json();
    setDetalles(data.ventas.detalles);
    setVentaSeleccionada(ventaId);
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  return (
    <div className="flex h-screen font-sans bg-[#fdfbee]">
      <main className="flex-1 p-10 bg-white rounded-l-3xl shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <PackageOpen size={32} className="text-black" />
          <h1 className="text-4xl font-bold">Stocker</h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ventas</h2>
          <button
            onClick={() => setMostrarModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-110"
          >
            <span className="text-lg">+</span> Nueva Venta
          </button>
        </div>

        <table className="w-full text-sm rounded-xl overflow-hidden shadow-md bg-white">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4">ID Venta</th>
              <th className="py-3 px-4">Artículos</th>
              <th className="py-3 px-4">Cantidades</th>
              <th className="py-3 px-4">Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr
                key={venta.nroVenta}
                onDoubleClick={() => cargarDetalleVenta(venta.nroVenta)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="border p-2">{venta.nroVenta}</td>
                <td className="border p-2">
                  {venta.detalles?.map((d) => d.articulo.nombreArticulo).join(', ')}
                </td>
                <td className="border p-2">
                  {venta.detalles?.map((d) => d.cantidadArticulo).join(', ')}
                </td>
                <td className="border p-2">${venta.montoTotalVenta}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {ventaSeleccionada !== null && (
          <div className="mt-6 border p-4 rounded bg-gray-50">
            <h2 className="text-xl font-bold mb-2">
              Detalles de Venta #{ventaSeleccionada}
            </h2>
            <ul className="list-disc ml-6">
              {detalles.map((d, index) => (
                <li key={index}>
                  {d.articulo?.nombreArticulo || 'Artículo desconocido'} (ID:{' '}
                  {d.ArticuloId}) - Cantidad: {d.cantidadArticulo}
                </li>
              ))}
            </ul>
          </div>
        )}

        {mostrarModal && (
          <CrearVenta
            onCerrar={() => setMostrarModal(false)}
            onVentaGuardada={cargarVentas}
          />
        )}
      </main>
    </div>
  );
}
