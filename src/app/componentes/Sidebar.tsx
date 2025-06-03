import Link from "next/link";
import React from "react";
import { ShoppingCart, BadgeDollarSign, Truck, Package} from "lucide-react";

const Sidebar: React.FC = () => {
    return <aside className="w-64 bg-black/80 shadow-xl border-r border-gray-200 p-6 min-h-screen rounded-r-3xl">
        <h2 className="text-xl font-semibold text-white mb-8 tracking-wide">Navegación</h2>
        <nav className="flex flex-col gap-4 text-gray-700 font-medium">
            <Link href="/articulos" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition">
                <Package size={20} className="text-white" />
                <span className="text-white hover:scale-110">Artículos</span>
            </Link>
            <Link href="/proveedores" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition">
                <Truck size={20} className="text-white" />
                <span className="text-white hover:scale-110">Proveedores</span>
            </Link>
            <Link href="/ordenCompra" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition">
                <ShoppingCart size={20} className="text-white" />
                <span className="text-white hover:scale-110">Orden de Compra</span>
            </Link>
            <Link href="/ventas" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition">
                <BadgeDollarSign size={20} className="text-white" />
                <span className="text-white hover:scale-110">Ventas</span>
            </Link>
        </nav>
    </aside>;
}

export default Sidebar;