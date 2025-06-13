
import React, { useState } from "react";

export default function CrearEditarArticulo({
  onClose,
  onGuardar,
}: {
  onClose: () => void;
  onGuardar: () => void;
}) {
  const [formData, setFormData] = useState({
    nombreArticulo: "",
    descripcionArticulo: "",
    stockActual: "0",
    costoAlmacenamiento: "0",
    costoCompra: "0",
    costoPedido: "0",
    costoMantenimiento: "0",
    demandaAnual: "0",
    desviacionDemandaL: "0",
    desviacionDemandaT: "0",
    nivelServicioDeseado: "0",
    modeloInventario: "loteFijo",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    const articulo = {
      ...formData,
      stockActual: Number(formData.stockActual),
      costoAlmacenamiento: Number(formData.costoAlmacenamiento),
      costoCompra: Number(formData.costoCompra),
      costoPedido: Number(formData.costoPedido),
      costoMantenimiento: Number(formData.costoMantenimiento),
      demandaAnual: Number(formData.demandaAnual),
      desviacionDemandaL: Number(formData.desviacionDemandaL),
      desviacionDemandaT: Number(formData.desviacionDemandaT),
      nivelServicioDeseado: Number(formData.nivelServicioDeseado),
    };

    console.log("📦 Enviando artículo al backend:", articulo);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articulo),
      });

      if (!res.ok) throw new Error("Error al crear el artículo");

      onGuardar();
      onClose();
    } catch (err) {
      alert("Hubo un error al guardar el artículo");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Crear Nuevo Artículo</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGuardar();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del artículo</label>
              <input name="nombreArticulo" className="p-2 border rounded w-full" value={formData.nombreArticulo} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <input name="descripcionArticulo" className="p-2 border rounded w-full" value={formData.descripcionArticulo} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Modelo de inventario</label>
              <select name="modeloInventario" className="p-2 border rounded w-full" value={formData.modeloInventario} onChange={handleChange}>
                <option value="loteFijo">Lote Fijo</option>
                <option value="intervaloFijo">Intervalo Fijo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock actual</label>
              <input name="stockActual" type="number" className="p-2 border rounded w-full" value={formData.stockActual} onChange={handleChange} />
            </div>
          </div>

          <h3 className="text-lg font-medium">Costos</h3>
          <div className="grid grid-cols-2 gap-4">
            {["costoAlmacenamiento", "costoCompra", "costoPedido", "costoMantenimiento"].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">{field.replace("costo", "Costo ")}</label>
                <input name={field} type="number" className="p-2 border rounded w-full" value={(formData as any)[field]} onChange={handleChange} />
              </div>
            ))}
          </div>

          <h3 className="text-lg font-medium">Demanda y Variabilidad</h3>
          <div className="grid grid-cols-2 gap-4">
            {["demandaAnual", "desviacionDemandaL", "desviacionDemandaT", "nivelServicioDeseado"].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">{field}</label>
                <input name={field} type="number" className="p-2 border rounded w-full" value={(formData as any)[field]} onChange={handleChange} />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-5 py-2 rounded">Cancelar</button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
