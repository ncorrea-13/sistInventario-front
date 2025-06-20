import React, { useEffect, useState } from 'react';

interface DatosCalculados {
    loteOptimo?: number;
    puntoPedido?: number;
    stockSeguridadLot?: number;
    stockSeguridadInt?: number;
    cgi?: number;
}

interface VerDatosCalculadosProps {
    codArticulo: number;
    onClose: () => void;
}

const VerDatosCalculados: React.FC<VerDatosCalculadosProps> = ({ codArticulo, onClose }) => {
    const [datos, setDatos] = useState<DatosCalculados | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}`);
                if (!res.ok) {
                    throw new Error('Error al obtener los datos del artículo');
                }
                const data = await res.json();
                
                let cgiData = null;
                if (data.modeloInventario === 'loteFijo') {
                    const resCgi = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articulo/${codArticulo}/cgi`);
                    if(resCgi.ok) {
                        cgiData = await resCgi.json();
                    }
                }

                setDatos({
                    loteOptimo: data.modeloFijoLote?.loteOptimo,
                    puntoPedido: data.modeloFijoLote?.puntoPedido,
                    stockSeguridadLot: data.modeloFijoLote?.stockSeguridadLot,
                    stockSeguridadInt: data.modeloFijoInventario?.stockSeguridadInt,
                    cgi: cgiData?.CGI
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDatos();
    }, [codArticulo]);

    return (
        <div className="p-4 bg-white rounded-lg">
            <h2 className="text-xl font-bold mb-4">Datos Calculados del Artículo {codArticulo}</h2>
            {loading && <p>Cargando...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {datos && (
                <div className="space-y-2">
                    {datos.loteOptimo !== undefined && <p><strong>Lote Óptimo:</strong> {datos.loteOptimo.toFixed(2)}</p>}
                    {datos.puntoPedido !== undefined && <p><strong>Punto de Pedido:</strong> {datos.puntoPedido.toFixed(2)}</p>}
                    {datos.stockSeguridadLot !== undefined && <p><strong>Stock de Seguridad (Lote Fijo):</strong> {datos.stockSeguridadLot.toFixed(2)}</p>}
                    {datos.stockSeguridadInt !== undefined && <p><strong>Stock de Seguridad (Intervalo Fijo):</strong> {datos.stockSeguridadInt.toFixed(2)}</p>}
                    {datos.cgi !== undefined && <p><strong>CGI:</strong> ${datos.cgi.toFixed(2)}</p>}
                </div>
            )}
            <button onClick={onClose} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Cerrar
            </button>
        </div>
    );
};

export default VerDatosCalculados; 