'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ArticuloDetalle {
  codArticulo: number;
  nombreArticulo: string;
  descripcionArticulo: string;
  stockActual: number;
  costoAlmacenamiento: number;
  costoCompra: number;
  costoPedido: number;
  costoMantenimiento: number;
  demandaAnual: number;
  desviacionDemandaL: number;
  desviacionDemandaT: number;
  nivelServicioDeseado: number;
}

export default function DetalleArticulo() {
  const { id } = useParams();
  const router = useRouter();
  const [articulo, setArticulo] = useState<ArticuloDetalle | null>(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`);
        const data = await res.json();
        const encontrado = data.find((a: any) => a.codArticulo === Number(id));
        setArticulo(encontrado);
      } catch (err) {
        console.error('Error al obtener detalle del artículo', err);
      }
    };
    if (id) fetchDetalle();
  }, [id]);

  const eliminarArticulo = async () => {
    if (!confirm('¿Estás seguro que querés eliminar este artículo?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Artículo eliminado');
        router.push('/articulos');
      }
    } catch (err) {
      console.error('Error al eliminar artículo', err);
    }
  };

  if (!articulo) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Detalle del Artículo</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div><strong>Nombre:</strong> {articulo.nombreArticulo}</div>
        <div><strong>Descripción:</strong> {articulo.descripcionArticulo}</div>
        <div><strong>Stock:</strong> {articulo.stockActual}</div>
        <div><strong>Costo Almacenamiento:</strong> ${articulo.costoAlmacenamiento}</div>
        <div><strong>Costo Compra:</strong> ${articulo.costoCompra}</div>
        <div><strong>Costo Pedido:</strong> ${articulo.costoPedido}</div>
        <div><strong>Costo Mantenimiento:</strong> ${articulo.costoMantenimiento}</div>
        <div><strong>Demanda Anual:</strong> {articulo.demandaAnual}</div>
        <div><strong>Desv. Demanda L:</strong> {articulo.desviacionDemandaL}</div>
        <div><strong>Desv. Demanda T:</strong> {articulo.desviacionDemandaT}</div>
        <div><strong>Nivel de Servicio:</strong> {articulo.nivelServicioDeseado}%</div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => router.push(`/articulos/editar/${articulo.codArticulo}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Editar
        </button>
        <button
          onClick={eliminarArticulo}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}