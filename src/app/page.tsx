"use client";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { ShoppingCart, BadgeDollarSign, Truck, Package, LayoutDashboard} from "lucide-react";

export default function Home() {
const router = useRouter()

  const [message, setMessage] = useState('');

  useEffect(() => {
    // Hacer una solicitud al backend
    fetch('http://localhost:3000/api/hello')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error al comunicarse con el backend:', error));
  }, []);

  return (
    // <><div>
    //   <h1>¡Hola, mundo!</h1>
    //   <p>Mensaje del backend: {message}</p>
    // </div>
    //   <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //     <h1 className="text-4xl font-bold text-blue-500">¡Hola, Tailwind CSS!</h1>
    //   </div>
    // </>

    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-t from-gray-900 to-white">
    
      <div className="bg-gray-800 p-8 mt-20 rounded-t-2xl shadow-inner h-full min-h-screen">
        
      <h1 className="text-5xl font-extrabold mb-12 mt-10 text-center hover:text-green-500 hover:scale-105">Stocker</h1>
      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => router.push('/proveedores')}
          className="bg-transparent border-2 border-green-600 hover:bg-green-600 mt-10 hover:text-white transition text-green-600 rounded-xl py-4 px-8 text-lg shadow-md"
        >
          <div className="flex items-center justify-center gap-2">
            <Truck size={20} className="text-white" />
            <span className="text-white">Proveedores</span>
          </div>
        </button>
        <button
          onClick={() => router.push('/articulos')}
          className="bg-transparent border-2 border-green-600 hover:bg-green-600 mt-10 hover:text-white transition text-green-600 rounded-xl py-4 px-8 text-lg shadow-md"
        >
          <div className="flex items-center justify-center gap-2">
            <Package size={20} className="text-white" />
            <span className="text-white">Articulos</span>
          </div>
        </button>
        <button
          onClick={() => router.push('/ordenCompra')}
          className="bg-transparent border-2 border-green-600 hover:bg-green-600 hover:text-white transition text-green-600 rounded-xl py-4 px-8 text-lg shadow-md"
        >
          <div className="flex items-center justify-center gap-2">
            <ShoppingCart size={20} className="text-white" />
            <span className="text-white">Ordenes de compra</span>
          </div>
        </button>
        <button
          onClick={() => router.push('/ventas')}
          className="bg-transparent border-2 border-green-600 hover:bg-green-600 hover:text-white transition text-green-600 rounded-xl py-4 px-8 text-lg shadow-md"
        >
          <div className="flex items-center justify-center gap-2">
            <BadgeDollarSign size={20} className="text-white" />
            <span className="text-white">Ventas</span>
          </div>
        </button>
        <button
          disabled
          className="col-span-2 opacity-60 cursor-not-allowed bg-white text-gray-400 rounded-xl py-6 px-8 text-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <LayoutDashboard size={20} className="text-white" />
            <span className="text-white">Dashboard</span>
          </div>
        </button>
      </div>
      
      </div>    
      
    </div>

  );
}
