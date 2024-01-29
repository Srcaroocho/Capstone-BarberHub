import React from "react";
import "../vista_cliente/styles/detallecita.css";

function DetalleCita({ eventoSeleccionado }) {
  return (
    <div className="detalle-cita">
      <h2>Detalles de la Cita</h2>
      {eventoSeleccionado ? (
        <div>
          <p>Título: {eventoSeleccionado.titulo}</p>
          <p>Inicio: {eventoSeleccionado.inicio.toString()}</p>
          <p>Fin: {eventoSeleccionado.fin.toString()}</p>
          {/* Agrega más detalles del evento si es necesario */}
        </div>
      ) : (
        <p>Selecciona una cita para ver los detalles.</p>
      )}
    </div>
  );
}

export default DetalleCita;
