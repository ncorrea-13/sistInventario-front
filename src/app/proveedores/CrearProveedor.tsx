import React from "react";
import CrearEditarProveedor from "./CrearEditarProveedor";

export default function CrearProveedor({ 
  onClose, 
  onGuardar 
}: { 
  onClose: () => void; 
  onGuardar: () => void 
}) {
  return <CrearEditarProveedor onClose={onClose} onGuardar={onGuardar} />;
}
