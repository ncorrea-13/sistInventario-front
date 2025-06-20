'use client';
import { useEffect, useState } from 'react';
import Modal from '../componentes/Modal';
import CrearEditarProveedor from './CrearEditarProveedor';
import AsociarArticulo from './AsociarArticulo';
import VerArticulosAsociados from './VerArticulosAsociados';
import { PackageOpen } from 'lucide-react';
import DetalleProveedor from './DetalleProveedor';

interface Proveedor {
  codProveedor: number;
  nombreProv: string;
  fechaBaja: string | null;
  predeterminado: boolean;
}

export default function ProveedoresPage() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalAsociar, setMostrarModalAsociar] = useState(false);
  const [mostrarModalVerArticulos, setMostrarModalVerArticulos] = useState(false);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);

  const fetchProveedores = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor`);
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      // Verificamos si el proveedor tiene artículos asociados
      const resArticulos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${id}`);
      const articulos = await resArticulos.json();
      
      if (articulos.length > 0) {
        alert('No se puede dar de baja el proveedor: posee artículos asociados');
        return;
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${id}`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error();
      fetchProveedores();
    } catch (err) {
      alert('Error al dar de baja el proveedor');
      console.error(err);
    }
  };

  const handlePredeterminado = async (id: number) => {
    try {
      // Si el proveedor ya es predeterminado, no hacemos nada
      const proveedor = proveedores.find(p => p.codProveedor === id);
      if (proveedor?.predeterminado) return;

      // Verificamos si ya hay un proveedor predeterminado
      const proveedorPredeterminado = proveedores.find(p => p.predeterminado);
      if (proveedorPredeterminado) {
        if (!confirm('Ya existe un proveedor predeterminado. ¿Desea cambiarlo?')) return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proveedor/${id}/predeterminado`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error();
      fetchProveedores();
    } catch (err) {
      alert('Error al actualizar proveedor predeterminado');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  return (
    <div className="flex h-screen font-sans bg-[#fdfbee]">

      {/* Main */}
      <main className="flex-1 p-10 bg-white rounded-l-3xl shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <PackageOpen size={32} className="text-black" />
          <h1 className="text-4xl font-bold">Stocker</h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Proveedores</h2>
          <button
            onClick={() => {
              setProveedorSeleccionado(null);
              setMostrarModal(true);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-110"
          >
            <span className="text-lg">+</span> Crear
          </button>
        </div>

        <table className="w-full text-sm rounded-xl overflow-hidden shadow-md bg-white">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4">Código</th>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Fecha Baja</th>
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores
              .sort((a, b) => {
                // Si uno tiene fecha de baja y el otro no, el que tiene fecha de baja va al final
                if (a.fechaBaja && !b.fechaBaja) return 1;
                if (!a.fechaBaja && b.fechaBaja) return -1;
                // Si ambos tienen o no tienen fecha de baja, ordenar por código
                return a.codProveedor - b.codProveedor;
              })
              .map((prov) => (
              <tr 
                key={prov.codProveedor} 
                className="text-center border-b hover:bg-gray-100"
                onDoubleClick={() => setDetalleId(prov.codProveedor)}
                >
                <td className="py-2 px-4">{prov.codProveedor}</td>
                <td className="py-2 px-4">{prov.nombreProv}</td>
                <td className="py-2 px-4">{prov.fechaBaja || '—'}</td>
                <td className="py-2 px-4 flex justify-center gap-2">
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => {
                      setProveedorSeleccionado(prov);
                      setMostrarModalAsociar(true);
                    }}
                  >
                    Asociar Artículo
                  </button>
                  <button
                    className="text-purple-600 hover:underline"
                    onClick={() => {
                      setProveedorSeleccionado(prov);
                      setMostrarModalVerArticulos(true);
                    }}
                  >
                    Ver Artículos
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleEliminar(prov.codProveedor)}
                  >
                    Baja
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarModal && (
          <Modal onClose={() => setMostrarModal(false)}>
            <CrearEditarProveedor
              onClose={() => setMostrarModal(false)}
              onGuardar={fetchProveedores}
              proveedorId={proveedorSeleccionado?.codProveedor}
              proveedorNombre={proveedorSeleccionado?.nombreProv}
            />
          </Modal>
        )}

        {detalleId && (
          <Modal onClose={() => setDetalleId(null)}>
            <DetalleProveedor
              codProveedor={detalleId}
              onClose={() => setDetalleId(null)}
              onRefrescar={fetchProveedores}
            />
          </Modal>
        )}

        {mostrarModalAsociar && proveedorSeleccionado && (
          <Modal onClose={() => setMostrarModalAsociar(false)}>
            <AsociarArticulo
              proveedorId={proveedorSeleccionado.codProveedor}
              onClose={() => setMostrarModalAsociar(false)}
              onGuardar={fetchProveedores}
            />
          </Modal>
        )}

        {mostrarModalVerArticulos && proveedorSeleccionado && (
          <Modal onClose={() => setMostrarModalVerArticulos(false)}>
            <VerArticulosAsociados
              proveedorId={proveedorSeleccionado.codProveedor}
              onClose={() => setMostrarModalVerArticulos(false)}
            />
          </Modal>
        )}
      </main>
    </div>
  );
}
