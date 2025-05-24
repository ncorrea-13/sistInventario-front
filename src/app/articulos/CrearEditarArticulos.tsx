export default function CrearEditarArticulo({ onGuardar }: { onGuardar: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Editar Artículo</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onGuardar()
        }}
        className="space-y-4"
      >
        <input className="w-full p-2 border border-gray-300 rounded" placeholder="Producto" />
        <input className="w-full p-2 border border-gray-300 rounded" placeholder="Cantidad" type="number" />
        <input className="w-full p-2 border border-gray-300 rounded" placeholder="Cantidad Mínima" type="number" />
        <input className="w-full p-2 border border-gray-300 rounded" placeholder="Precio Entrada" type="number" />
        <input className="w-full p-2 border border-gray-300 rounded" placeholder="Precio Venta" type="number" />
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onGuardar}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
