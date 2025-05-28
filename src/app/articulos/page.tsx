// ✅ archivo: /app/articulos/page.tsx
'use client';
import { useCallback, useEffect, useState } from 'react';
import Modal from '../componentes/Modal';
import CrearEditarArticulo from './CrearEditarArticulos';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ArticuloMapped {
  codArticulo: number;
  nombre: string;
  descripcion: string;
  stock: number;
  costoAlmacenamiento: number;
  costoPedido: number;
  demanda: number;
  costoCompra: number;
  desviacionDemandaL: number;
  desviacionDemandaT: number;
}

const ArticulosPage = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [articulos, setArticulos] = useState<ArticuloMapped[]>([]);
  const router = useRouter();

  const fetchArticulos = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`);
      const data = await res.json();
      const articulosMapeados = data.map((articulo: any) => ({
        codArticulo: articulo.codArticulo,
        nombre: articulo.nombreArticulo,
        descripcion: articulo.descripcionArticulo,
        stock: articulo.stockActual,
        costoAlmacenamiento: articulo.costoAlmacenamiento,
        costoPedido: articulo.costoPedido,
        demanda: articulo.demandaAnual,
        costoCompra: articulo.costoCompra,
        desviacionDemandaL: articulo.desviacionDemandaL,
        desviacionDemandaT: articulo.desviacionDemandaT,
      }));
      setArticulos(articulosMapeados);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
    }
  }, []);

  useEffect(() => {
    fetchArticulos();
  }, [fetchArticulos]);

  return (
    <div className="flex h-screen font-sans bg-[#fdfbee]">
      <aside className="w-60 bg-gray-300 p-4">
        <h2 className="text-lg font-bold mb-6">Navegación</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/articulos" className="hover:underline">Artículos</Link>
          <Link href="/proveedores" className="hover:underline">Proveedores</Link>
          <Link href="/orden-compra" className="hover:underline">Orden de Compra</Link>
          <Link href="/ventas" className="hover:underline">Ventas</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-center mb-8">Stocker</h1>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Productos</h2>
          <button
            onClick={() => setMostrarModal(true)}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded shadow"
          >
            <span className="text-lg">+</span> Crear
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-300 text-center text-black font-bold">
            <tr>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Descripción</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Costo Almacenamiento</th>
              <th className="py-3 px-4">Costo Pedido</th>
              <th className="py-3 px-4">Demanda</th>
              <th className="py-3 px-4">Costo Compra</th>
              <th className="py-3 px-4">Desv. Demanda L</th>
              <th className="py-3 px-4">Desv. Demanda T</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((articulo) => (
              <tr
                key={articulo.codArticulo}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => router.push(`/articulos/${articulo.codArticulo}`)}
              >
                <td className="border p-2">{articulo.nombre}</td>
                <td className="border p-2">{articulo.descripcion}</td>
                <td className="border p-2">{articulo.stock}</td>
                <td className="border p-2">{articulo.costoAlmacenamiento}</td>
                <td className="border p-2">{articulo.costoPedido}</td>
                <td className="border p-2">{articulo.demanda}</td>
                <td className="border p-2">{articulo.costoCompra}</td>
                <td className="border p-2">{articulo.desviacionDemandaL}</td>
                <td className="border p-2">{articulo.desviacionDemandaT}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarModal && (
          <Modal onClose={() => setMostrarModal(false)}>
            <CrearEditarArticulo
              onGuardar={() => {
                fetchArticulos();
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