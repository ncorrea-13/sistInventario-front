
'use client';
import { useEffect, useState } from 'react';
import CrearVenta from './CrearVenta';


interface Venta {
  nroVenta: number;
  montoTotalVenta: number;
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Ventas</h1>
      <button
        onClick={() => setMostrarModal(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Nueva Venta
      </button>

      <table className="w-full border table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID Venta</th>
            <th className="border px-4 py-2">Monto Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr
              key={venta.nroVenta}
              onDoubleClick={() => cargarDetalleVenta(venta.nroVenta)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className="border px-4 py-2">{venta.nroVenta}</td>
              <td className="border px-4 py-2">${venta.montoTotalVenta}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {ventaSeleccionada !== null && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-2">Detalles de Venta #{ventaSeleccionada}</h2>
          <ul className="list-disc ml-6">
            {detalles.map((d, index) => (
              <li key={index}>
                {d.articulo?.nombreArticulo || 'Artículo desconocido'} (ID: {d.ArticuloId}) - Cantidad: {d.cantidadArticulo}
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
    </div>
  );
}
