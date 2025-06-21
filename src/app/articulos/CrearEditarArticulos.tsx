import React, { useState } from "react";

export default function CrearEditarArticulo({
  onClose,
  onGuardar,
  articuloInicial,
}: {
  onClose: () => void;
  onGuardar: () => void;
  articuloInicial?: any;
}) {
  const [formData, setFormData] = useState({
    nombreArticulo: articuloInicial?.nombreArticulo || "",
    descripcionArticulo: articuloInicial?.descripcionArticulo || "",
    stockActual: articuloInicial?.stockActual?.toString() || "0",
    costoAlmacenamiento: articuloInicial?.costoAlmacenamiento?.toString() || "0",
    costoCompra: articuloInicial?.costoCompra?.toString() || "0",
    costoPedido: articuloInicial?.costoPedido?.toString() || "0",
    costoMantenimiento: articuloInicial?.costoMantenimiento?.toString() || "0",
    demandaAnual: articuloInicial?.demandaAnual?.toString() || "0",
    desviacionDemandaL: articuloInicial?.desviacionDemandaL?.toString() || "0",
    desviacionDemandaT: articuloInicial?.desviacionDemandaT?.toString() || "0",
    nivelServicioDeseado: articuloInicial?.nivelServicioDeseado?.toString() || "0",
    modeloInventario: articuloInicial?.modeloInventario || "loteFijo",
    precioUnitario: articuloInicial?.precioUnitario?.toString() || "0",
    intervaloTiempo: articuloInicial?.intervaloTiempo?.toString() || "7",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    const articulo = {
      ...formData,
      stockActual: parseInt(formData.stockActual, 10),
      costoAlmacenamiento: parseFloat(formData.costoAlmacenamiento),
      costoCompra: parseFloat(formData.costoCompra),
      costoPedido: parseFloat(formData.costoPedido),
      costoMantenimiento: parseFloat(formData.costoMantenimiento),
      demandaAnual: parseFloat(formData.demandaAnual),
      desviacionDemandaL: parseFloat(formData.desviacionDemandaL),
      desviacionDemandaT: parseFloat(formData.desviacionDemandaT),
      nivelServicioDeseado: parseFloat(formData.nivelServicioDeseado),
      precioUnitario: parseFloat(formData.precioUnitario),
      ...(formData.modeloInventario === "intervaloFijo" ? { intervaloTiempo: parseInt(formData.intervaloTiempo, 10) } : {}),
    };

    if (formData.modeloInventario !== "intervaloFijo") {
      delete articulo.intervaloTiempo;
    }

    console.log("📦 Enviando artículo al backend:", articulo);

    try {
      let res;
      if (articuloInicial && articuloInicial.codArticulo) {
        // Edición
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${articuloInicial.codArticulo}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articulo),
        });
      } else {
        // Creación
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articulo),
        });
      }

      if (!res.ok) throw new Error("Error al guardar el artículo");

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
        <h2 className="text-2xl font-semibold text-center mb-6">
          {articuloInicial ? "Editar Artículo" : "Crear Nuevo Artículo"}
        </h2>
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
              <select 
                name="modeloInventario" 
                className="p-2 border rounded w-full" 
                value={formData.modeloInventario} 
                onChange={handleChange}
                disabled={!!articuloInicial}
              >
                <option value="loteFijo">Lote Fijo</option>
                <option value="intervaloFijo">Intervalo Fijo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock actual</label>
              <input name="stockActual" type="number" className="p-2 border rounded w-full" value={formData.stockActual} onChange={handleChange} />
            </div>
            {/* Mostrar solo si es intervaloFijo */}
            {formData.modeloInventario === "intervaloFijo" && (
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Intervalo de tiempo (días)</label>
                <input
                  name="intervaloTiempo"
                  type="number"
                  min="1"
                  className="p-2 border rounded w-full"
                  value={formData.intervaloTiempo}
                  onChange={handleChange}
                  required={formData.modeloInventario === "intervaloFijo"}
                />
              </div>
            )}
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
