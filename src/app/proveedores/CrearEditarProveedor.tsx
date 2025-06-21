'use client';
import React, { useEffect, useState } from 'react';

interface ProveedorArticulo {
  id: number;
  precioUnitaria: number;
  demoraEntrega: number;
  cargoPedido: number;
  predeterminado: boolean;
  proveedor: {
    nombreProv: string;
  };
}

interface ArticuloDetalle {
  codArticulo: number;
  nombreArticulo: string;
  descripcionArticulo: string;
  stockActual: number;
  costoAlmacenamiento: number;
  costoCompra: number;
  costoPedido: number;
  costoMantenimiento: number;
  demandaAnual: number;
  desviacionDemandaL: number;
  desviacionDemandaT: number;
  nivelServicioDeseado: number;
  proveedorArticulos: ProveedorArticulo[];
}

interface Props {
  onClose: () => void;
  onGuardar: () => void;
  proveedorId?: number;
  proveedorNombre?: string;
}

export default function CrearEditarProveedor({ onClose, onGuardar, proveedorId, proveedorNombre }: Props) {
  const [nombre, setNombre] = useState(proveedorNombre || '');

  // NUEVO: Estados para artículos y asociaciones
  const [articulos, setArticulos] = useState<any[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<number | null>(null);
  const [precioUnitaria, setPrecioUnitaria] = useState('');
  const [demoraEntrega, setDemoraEntrega] = useState('');
  const [cargoPedido, setCargoPedido] = useState('');
  const [articulosAsociados, setArticulosAsociados] = useState<any[]>([]);

  // Traer artículos al montar
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo`)
      .then(res => res.json())
      .then(data => setArticulos(Array.isArray(data) ? data : data.articulos || []))
      .catch(() => setArticulos([]));
  }, []);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }
    if (articulosAsociados.length === 0) {
      alert('Debes asociar al menos un artículo');
      return;
    }
    try {
      const url = proveedorId
        ? `${process.env.NEXT_PUBLIC_API_URL}/proveedor/${proveedorId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/proveedor`;

      const body = {
        nombreProv: nombre.trim(),
        articulos: {
          create: articulosAsociados.map(a => ({
            articulo: { connect: { codArticulo: a.articuloId } },
            precioUnitaria: a.precioUnitaria,
            demoraEntrega: a.demoraEntrega,
            cargoPedido: a.cargoPedido,
            predeterminado: false
          }))
        }
      };

      const res = await fetch(url, {
        method: proveedorId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();
      onGuardar();
      onClose();
    } catch (err) {
      alert('Error al guardar proveedor');
      console.error(err);
    }
  };

  const [proveedor, setProveedor] = useState<ProveedorArticulo | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Partial<ArticuloDetalle>>({});

  useEffect(() => {
    if (!proveedorId) return;
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${proveedorId}`);
        const data = await res.json();
        setProveedor(data);
        setFormData(data);
      } catch (err) {
        console.error('Error al cargar detalle:', err);
      }
    };
    fetchDetalle();
  }, [proveedorId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("stock") || name.includes("costo") || name.includes("demanda") || name.includes("desviacion") || name.includes("nivel")
        ? Number(value)
        : value,
    }));
  };
  
  const handleGuardarCambios = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${proveedorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const actualizado = await res.json();
        setProveedor(actualizado);
        setEditando(false);
        onRefrescar();
      } else {
        alert('Error al guardar los cambios');
      }
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  function setMostrarModal(arg0: boolean) {
    throw new Error('Function not implemented.');
  }

  function setProveedorSeleccionado(prov: any) {
    throw new Error('Function not implemented.');
  }

  // NUEVO: función para agregar artículo a la lista de asociados
  const handleAgregarArticulo = () => {
    if (
      articuloSeleccionado === null ||
      articuloSeleccionado === 0 ||
      !precioUnitaria ||
      !demoraEntrega ||
      !cargoPedido
    ) {
      alert('Completa todos los campos del artículo');
      return;
    }
    if (articulosAsociados.some(a => a.articuloId === articuloSeleccionado)) {
      alert('Ya agregaste este artículo');
      return;
    }
    setArticulosAsociados([
      ...articulosAsociados,
      {
        articuloId: articuloSeleccionado,
        precioUnitaria: Number(precioUnitaria),
        demoraEntrega: Number(demoraEntrega),
        cargoPedido: Number(cargoPedido),
      }
    ]);
    setArticuloSeleccionado(null);
    setPrecioUnitaria('');
    setDemoraEntrega('');
    setCargoPedido('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {proveedorId ? 'Editar Proveedor' : 'Crear Proveedor'}
        </h2>
        <label className="block text-sm font-medium mb-2">Nombre</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        {/* NUEVO: Formulario para asociar artículos */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Asociar artículo</label>
          <select
            className="w-full border px-2 py-1 rounded mb-2"
            value={articuloSeleccionado !== null ? articuloSeleccionado : ''}
            onChange={e => {
              const value = e.target.value;
              setArticuloSeleccionado(value ? Number(value) : null);
            }}
          >
            <option value="">Selecciona un artículo</option>
            {articulos.map(a => (
              <option key={a.codArticulo} value={a.codArticulo}>
                {a.nombreArticulo}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Precio unitario"
            className="w-full border px-2 py-1 rounded mb-2"
            value={precioUnitaria}
            onChange={e => setPrecioUnitaria(e.target.value)}
          />
          <input
            type="number"
            placeholder="Demora entrega (días)"
            className="w-full border px-2 py-1 rounded mb-2"
            value={demoraEntrega}
            onChange={e => setDemoraEntrega(e.target.value)}
          />
          <input
            type="number"
            placeholder="Cargo pedido"
            className="w-full border px-2 py-1 rounded mb-2"
            value={cargoPedido}
            onChange={e => setCargoPedido(e.target.value)}
          />
          <button
            type="button"
            className="bg-green-600 px-3 py-1 rounded text-white"
            onClick={handleAgregarArticulo}
          >
            Agregar artículo
          </button>
          <ul className="mt-2">
            {articulosAsociados.map((a, idx) => (
              <li key={idx} className="text-sm">
                {articulos.find(art => art.codArticulo === a.articuloId)?.nombreArticulo} - Precio: {a.precioUnitaria} - Demora: {a.demoraEntrega} - Cargo: {a.cargoPedido}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end gap-2">
          <button className="bg-gray-400 px-4 py-2 rounded text-white" onClick={onClose}>
            Cancelar
          </button>
          <button className="bg-blue-600 px-4 py-2 rounded text-white" onClick={handleGuardar}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
function setProveedor(data: any) {
  throw new Error('Function not implemented.');
}

function onRefrescar() {
  throw new Error('Function not implemented.');
}

