"use client";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { ShoppingCart, BadgeDollarSign, Truck, Package, LayoutDashboard} from "lucide-react";

export default function Home() {
  const router = useRouter()
  const [articulos, setArticulos] = useState([]);

  useEffect(() => {
    // Hacer una solicitud al backend para obtener artículos
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`)
      .then((response) => response.json())
      .then((data) => setArticulos(data))
      .catch((error) => console.error('Error al comunicarse con el backend:', error));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-t from-gray-900 to-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Stocker</h1>
        <p className="text-xl">Sistema de Gestión de Inventario</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <button 
          onClick={() => router.push('/articulos')}
          className="flex flex-col items-center p-6 bg-white/10 rounded-lg hover:bg-white/20 transition"
        >
          <Package className="w-12 h-12 mb-2" />
          <span>Artículos</span>
        </button>

        <button 
          onClick={() => router.push('/proveedores')}
          className="flex flex-col items-center p-6 bg-white/10 rounded-lg hover:bg-white/20 transition"
        >
          <Truck className="w-12 h-12 mb-2" />
          <span>Proveedores</span>
        </button>

        <button 
          onClick={() => router.push('/ordenCompra')}
          className="flex flex-col items-center p-6 bg-white/10 rounded-lg hover:bg-white/20 transition"
        >
          <ShoppingCart className="w-12 h-12 mb-2" />
          <span>Órdenes de Compra</span>
        </button>

        <button 
          onClick={() => router.push('/ventas')}
          className="flex flex-col items-center p-6 bg-white/10 rounded-lg hover:bg-white/20 transition"
        >
          <BadgeDollarSign className="w-12 h-12 mb-2" />
          <span>Ventas</span>
        </button>
      </div>
    </div>
  );
}
