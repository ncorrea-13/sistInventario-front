
import React, { useState } from "react";

export default function CrearEditarArticulo({ onClose }: { onClose: () => void }) {
   const [nombreArticulo, setNombreArticulo] = useState("");
  const [descripcionArticulo, setDescripcionArticulo] = useState("");
  const [stockActual, setStockActual] = useState(0);
  const [costoAlmacenamiento, setCostoAlmacenamiento] = useState(0);
  const [costoCompra, setCostoCompra] = useState(0);
  const [costoPedido, setCostoPedido] = useState(0);
  const [costoMantenimiento, setCostoMantenimiento] = useState(0);
  const [demandaAnual, setDemandaAnual] = useState(0);
  const [desviacionDemandaL, setDesviacionDemandaL] = useState(0);
  const [desviacionDemandaT, setDesviacionDemandaT] = useState(0);
  const [nivelServicioDeseado, setNivelServicioDeseado] = useState(0);

  

  const onGuardar = async () => {
    
    const articulo = {
      nombreArticulo,
      descripcionArticulo, 
      stockActual,
      costoAlmacenamiento, // Ajusta o agrega campos según corresponda
      costoCompra,
      costoPedido,
      costoMantenimiento,
      demandaAnual,
      desviacionDemandaL,
      desviacionDemandaT,
      nivelServicioDeseado,
      // Agrega los campos que sean requeridos por tu modelo
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articulo),
      });
      if (!response.ok) throw new Error("Error al crear el artículo");
      onClose(); // Cierra el modal o vuelve atrás
    } catch (error) {
      alert("Hubo un error al guardar el artículo");
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Editar Artículo</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGuardar();
        }}
        className="space-y-4"
      >
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Producto"
          value={nombreArticulo}
          onChange={(e) => setNombreArticulo(e.target.value)}
        />
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Descripción"
          value={descripcionArticulo}
          onChange={(e) => setDescripcionArticulo(e.target.value)}/>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Cantidad"
          type="number"
          value={stockActual}
          onChange={(e) => setStockActual(Number(e.target.value))}
        />
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="CostoAlmacenamiento"
          type="number"
          value={costoAlmacenamiento}
          onChange={(e) => setCostoAlmacenamiento(Number(e.target.value))} />
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="CostoCompra"
          type="number"
          value={costoCompra}
          onChange={(e) => setCostoCompra(Number(e.target.value))}
        />
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="CostoPedido"
          type="number"
          value={costoPedido}
          onChange={(e) => setCostoPedido(Number(e.target.value))}/>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="CostoMantenimiento"
          type="number"
          value={costoMantenimiento}
          onChange={(e) => setCostoMantenimiento(Number(e.target.value))} />
          <input 
           className="w-full p-2 border border-gray-300 rounded"
          placeholder="DemandaAnual"
          type="number"
          value={demandaAnual}
          onChange={(e) => setDemandaAnual(Number(e.target.value))}
          />
         <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="desviacionDemandaL"
          type="number"
          value={desviacionDemandaL}
          onChange={(e) => setDesviacionDemandaL(Number(e.target.value))}
        /> 
         <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="desviacionDemandaT"
          type="number"
          value={desviacionDemandaT}
          onChange={(e) => setDesviacionDemandaT(Number(e.target.value))}
        />
         <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="nivelServicioDeseado"
          type="number"
          value={nivelServicioDeseado}
          onChange={(e) => setNivelServicioDeseado(Number(e.target.value))}
        />
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
