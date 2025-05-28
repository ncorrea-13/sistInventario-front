import React, { useState } from "react";

export default function CrearEditarArticulo({
  onClose,
  onGuardar,
}: {
  onClose: () => void;
  onGuardar: () => void;
}) {
  const [nombreArticulo, setNombreArticulo] = useState("");
  const [descripcionArticulo, setDescripcionArticulo] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [costoAlmacenamiento, setCostoAlmacenamiento] = useState("");
  const [costoCompra, setCostoCompra] = useState("");
  const [costoPedido, setCostoPedido] = useState("");
  const [costoMantenimiento, setCostoMantenimiento] = useState("");
  const [demandaAnual, setDemandaAnual] = useState("");
  const [desviacionDemandaL, setDesviacionDemandaL] = useState("");
  const [desviacionDemandaT, setDesviacionDemandaT] = useState("");
  const [nivelServicioDeseado, setNivelServicioDeseado] = useState("");

  const soloNumeros = (val: string) => /^(\d*\.?\d*)?$/.test(val);

  const handleGuardar = async () => {
    const articulo = {
      nombreArticulo,
      descripcionArticulo,
      stockActual: Number(stockActual),
      costoAlmacenamiento: Number(costoAlmacenamiento),
      costoCompra: Number(costoCompra),
      costoPedido: Number(costoPedido),
      costoMantenimiento: Number(costoMantenimiento),
      demandaAnual: Number(demandaAnual),
      desviacionDemandaL: Number(desviacionDemandaL),
      desviacionDemandaT: Number(desviacionDemandaT),
      nivelServicioDeseado: Number(nivelServicioDeseado),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articulo),
      });

      if (!response.ok) throw new Error("Error al crear el artículo");

      onGuardar();
      onClose();
    } catch (error) {
      alert("Hubo un error al guardar el artículo");
      console.error(error);
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
          {/* Información General */}
          <h3 className="text-lg font-medium">Información General</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del artículo</label>
              <input
                className="p-2 border border-gray-300 rounded w-full"
                placeholder="Ej: Tornillo M8"
                value={nombreArticulo}
                onChange={(e) => setNombreArticulo(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <input
                className="p-2 border border-gray-300 rounded w-full"
                placeholder="Descripción breve"
                value={descripcionArticulo}
                onChange={(e) => setDescripcionArticulo(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock actual</label>
              <input
                type="text"
                className="p-2 border border-gray-300 rounded w-full"
                placeholder="Ej: 150"
                value={stockActual}
                onChange={(e) => {
                  const val = e.target.value;
                  if (soloNumeros(val)) setStockActual(val);
                }}
              />
            </div>
          </div>

          {/* Costos */}
          <h3 className="text-lg font-medium">Costos</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Costo de almacenamiento", value: costoAlmacenamiento, setter: setCostoAlmacenamiento },
              { label: "Costo de compra", value: costoCompra, setter: setCostoCompra },
              { label: "Costo de pedido", value: costoPedido, setter: setCostoPedido },
              { label: "Costo de mantenimiento", value: costoMantenimiento, setter: setCostoMantenimiento },
            ].map(({ label, value, setter }) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500">$</span>
                  <input
                    type="text"
                    className="pl-6 pr-2 py-2 border border-gray-300 rounded w-full"
                    placeholder="Ej: 12.50"
                    value={value}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (soloNumeros(val)) setter(val);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Demanda y Variabilidad */}
          <h3 className="text-lg font-medium">Demanda y Variabilidad</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Demanda anual", value: demandaAnual, setter: setDemandaAnual, placeholder: "Ej: 1200" },
              { label: "Desviación demanda (L)", value: desviacionDemandaL, setter: setDesviacionDemandaL, placeholder: "Ej: 50" },
              { label: "Desviación demanda (T)", value: desviacionDemandaT, setter: setDesviacionDemandaT, placeholder: "Ej: 30" },
              { label: "Nivel de servicio deseado (%)", value: nivelServicioDeseado, setter: setNivelServicioDeseado, placeholder: "Ej: 95" },
            ].map(({ label, value, setter, placeholder }) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded w-full"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (soloNumeros(val)) setter(val);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
