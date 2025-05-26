import React, { useState } from "react";

export default function CrearProveedor({ onClose, onGuardar, }: { onClose: () => void; onGuardar: () => void }) {
  const [nombreProv, setNombreProv] = useState("");
  const [fechaBajaProveedor, setFechaBajaProveedor] = useState<Date | null>(null);

  const handleGuardar = async () => {
    const proveedor = {
      nombreProv,
      fechaBajaProveedor,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proveedor),
      });
      if (!response.ok) throw new Error("Error al crear el proveedor");
      onClose();
    } catch (error) {
      alert("Hubo un error al guardar el proveedor");
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Crear Proveedor</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGuardar();
        }}
        className="space-y-4"
      >
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Nombre del Proveedor"
          value={nombreProv}
          onChange={(e) => setNombreProv(e.target.value)}
        />
        <input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Fecha de Baja (opcional)"
          type="date"
          value={fechaBajaProveedor ? fechaBajaProveedor.toISOString().split('T')[0] : ""}
          onChange={(e) => setFechaBajaProveedor(e.target.value ? new Date(e.target.value) : null)}
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
