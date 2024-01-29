import React from 'react';
import '../vista_empleado/styles/modalnuevacita.css'; // Asegúrate de importar los estilos

function ModalNuevaCita({ slotInfo, onClose }) {
  // Puedes agregar aquí más lógica para manejar la creación de la cita

  if (!slotInfo) return null; // No renderiza nada si no hay información de la cita

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="modal">
        <h2>Crear Nueva Cita</h2>
        <p>Horario seleccionado: {slotInfo.start.toLocaleTimeString()} - {slotInfo.end.toLocaleTimeString()}</p>
        {/* Aquí puedes agregar un formulario o más información */}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </>
  );
}

export default ModalNuevaCita;
