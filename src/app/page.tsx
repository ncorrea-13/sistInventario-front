"use client";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

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

<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 to-purple-700 text-white">
      <h1 className="text-5xl font-extrabold mb-12">FUIMONOS BARTOLO</h1>
      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => router.push('/proveedores')}
          className="bg-pink-400 hover:bg-pink-500 transition rounded-xl py-6 px-8 text-lg shadow-md"
        >
          🤝 Proveedores
        </button>
        <button
          onClick={() => router.push('/articulos')}
          className="bg-purple-400 hover:bg-purple-500 transition rounded-xl py-6 px-8 text-lg shadow-md"
        >
          📦 Artículos
        </button>
        <button
          onClick={() => router.push('/ordenes-compra')}
          className="bg-pink-400 hover:bg-pink-500 transition rounded-xl py-6 px-8 text-lg shadow-md"
        >
          📜 Órdenes de compra
        </button>
        <button
          onClick={() => router.push('/ventas')}
          className="bg-purple-400 hover:bg-purple-500 transition rounded-xl py-6 px-8 text-lg shadow-md"
        >
          💰 Ventas
        </button>
        <button
          disabled
          className="col-span-2 opacity-60 cursor-not-allowed bg-white text-gray-400 rounded-xl py-6 px-8 text-lg"
        >
          📊 Dashboard (en desarrollo)
        </button>
      </div>
    </div>

  );
}
