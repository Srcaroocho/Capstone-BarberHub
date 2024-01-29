// DetalleCita.js
import React from 'react';
import '../vista_empleado/styles/detallecita.css';

const DetalleCita = ({ eventoSeleccionado, onClose }) => {
  return (
    <div className="detalle-cita-modal">
      <div className="modal-header">
        <h2>{eventoSeleccionado ? eventoSeleccionado.title : 'Sin título'}</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>
        {eventoSeleccionado ? (
          <p>Fecha: {eventoSeleccionado.start.toLocaleString()}</p>
          // Agregar más información del evento aquí
        ) : (
          <p>Detalles del evento no disponibles</p>
        )}
    </div>
  );
};

export default DetalleCita;
