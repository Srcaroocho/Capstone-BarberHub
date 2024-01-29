import React from "react";
import { deleteScheduleData } from "../../api/apiService";
import "./styles/modal_eliminar_turno.css";

function ScheduleDeleteModal({ turno, isOpen, onClose, onDelete }) {
  const handleDelete = async () => {
    try {
      if (turno) {
        const { EmpleadoID, Fecha, HoraEntrada, HoraSalida, Nombre, empleado_turnoid } = turno;

        await deleteScheduleData(empleado_turnoid); // Utiliza el ID del turno adecuado

        onDelete();
        onClose();
      } else {
        console.error("No se proporcionó información del turno");
      }
    } catch (error) {
      console.error("Error al eliminar el turno:", error);
    }
  };

  return (
    isOpen && (
      <div className="overlay">
        <div className="modal-delete-schedule">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          {turno ? (
            <>
              <p className="schedule-delete-message">
                ¿Estás seguro de que deseas eliminar el turno con la siguiente información?
              </p>
              <div className="schedule-delete-info">
                <p><strong>Empleado ID:</strong> {turno.EmpleadoID}</p>
                <p><strong>Fecha:</strong> {turno.Fecha}</p>
                <p><strong>Hora de Entrada:</strong> {turno.HoraEntrada}</p>
                <p><strong>Hora de Salida:</strong> {turno.HoraSalida}</p>
                {/* Agrega otros detalles relevantes aquí */}
              </div>
              <div className="schedule-delete-buttons">
                <button className="modal-delete-button" onClick={handleDelete}>
                  Sí, eliminar
                </button>
                <button className="modal-cancel-button" onClick={onClose}>
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <p className="no-schedule-selected">
              No se ha seleccionado ningún turno para eliminar.
            </p>
          )}
        </div>
      </div>
    )
  );
}

export default ScheduleDeleteModal;
