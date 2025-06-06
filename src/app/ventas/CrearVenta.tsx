
import React, { useEffect, useState } from 'react';

interface Articulo {
  codArticulo: number;
  nombreArticulo: string;
  stockActual: number;
}

interface ArticuloSeleccionado {
  articuloId: number;
  cantidad: number;
}

export default function CrearVenta({
  onCerrar,
  onVentaGuardada,
}: {
  onCerrar: () => void;
  onVentaGuardada: () => void;
}) {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<ArticuloSeleccionado[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`)
      .then((res) => res.json())
      .then((data) => {
  if (Array.isArray(data)) {
    setArticulos(data);
  } else if (Array.isArray(data.articulos)) {
    setArticulos(data.articulos);
  } else {
    console.error("❌ Respuesta inesperada del backend al obtener artículos:", data);
    setArticulos([]);
  }
})
      .catch((err) => console.error('Error al obtener artículos:', err));
  }, []);

  const agregarArticulo = (id: number) => {
    if (!articulosSeleccionados.find((a) => a.articuloId === id)) {
      setArticulosSeleccionados([...articulosSeleccionados, { articuloId: id, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id: number, cantidad: number) => {
    setArticulosSeleccionados(articulosSeleccionados.map(a => a.articuloId === id ? { ...a, cantidad } : a));
  };

  const eliminarArticulo = (id: number) => {
    setArticulosSeleccionados(articulosSeleccionados.filter(a => a.articuloId !== id));
  };

  const calcularTotal = () => {
    return articulosSeleccionados.reduce((total, sel) => {
      const art = articulos.find(a => a.codArticulo === sel.articuloId);
      return total + (art ? art.stockActual * sel.cantidad : 0); // Esto debería ser precio si lo tenés
    }, 0);
  };

  const guardarVenta = async () => {
    const venta = {
      montoTotalVenta: calcularTotal(),
      articulos: articulosSeleccionados,
    };

    console.log('🟢 Enviando venta al backend:', venta);

    if (articulosSeleccionados.length === 0) {
      alert("⚠️ No seleccionaste ningún artículo");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/venta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venta),
    });

    const data = await response.json();
    console.log('🟢 Respuesta del backend:', data);

    onVentaGuardada();
    onCerrar();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Registrar Venta</h2>

        <select className="w-full mb-4" onChange={(e) => agregarArticulo(Number(e.target.value))}>
          <option value="">Seleccionar artículo</option>
          {articulos.map((a) => (
            <option key={a.codArticulo} value={a.codArticulo}>
              {a.nombreArticulo}
            </option>
          ))}
        </select>

        {articulosSeleccionados.map((a) => (
          <div key={a.articuloId} className="flex justify-between items-center mb-2">
            <span>{articulos.find(art => art.codArticulo === a.articuloId)?.nombreArticulo}</span>
            <input
              type="number"
              min={1}
              value={a.cantidad}
              onChange={(e) => actualizarCantidad(a.articuloId, Number(e.target.value))}
              className="w-20 border text-center"
            />
            <button onClick={() => eliminarArticulo(a.articuloId)} className="text-red-500">Eliminar</button>
          </div>
        ))}

        <div className="flex justify-end mt-4">
          <button onClick={onCerrar} className="mr-4 text-gray-600">Cancelar</button>
          <button onClick={guardarVenta} className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}
