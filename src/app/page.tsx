"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Hacer una solicitud al backend
    fetch('http://localhost:3000/api/hello')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error al comunicarse con el backend:', error));
  }, []);

  return (
    <><div>
      <h1>¡Hola, mundo!</h1>
      <p>Mensaje del backend: {message}</p>
    </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-500">¡Hola, Tailwind CSS!</h1>
      </div>
    </>
  );
}
