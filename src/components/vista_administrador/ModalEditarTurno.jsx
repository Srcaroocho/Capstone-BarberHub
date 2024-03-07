// Componente ScheduleModifyModal.js
import React, { useState } from "react";
import { modifyScheduleData } from "../../api/apiService";
import "./styles/modal_modificar_turno.css";

function ScheduleModifyModal({ turno, isOpen, onClose, onModify }) {
  const [modifiedTurno, setModifiedTurno] = useState({
    HoraEntrada: turno ? turno.HoraEntrada : "",
    HoraSalida: turno ? turno.HoraSalida : "",
    Nombre: turno ? turno.Nombre : "mañana",
  });

  const handleModify = async () => {
    try {
      if (turno) {
        const { EmpleadoID, Fecha, empleado_turnoid } = turno;

        // Define los datos a enviar para modificar el turno
        const newData = {
          EmpleadoID,
          Fecha,
          HoraEntrada: modifiedTurno.HoraEntrada + ":00", // Agregar ":00" para segundos
          HoraSalida: modifiedTurno.HoraSalida + ":00", // Agregar ":00" para segundos
          Nombre: modifiedTurno.Nombre,
          empleado_turnoid,
        };

        // Llama a la función modifyScheduleData con los datos
        const updatedTurno = await modifyScheduleData(newData);

        // Llama a la función onModify con los datos actualizados
        onModify(updatedTurno);
        onClose();
      } else {
        console.error("No se proporcionó información del turno");
      }
    } catch (error) {
      console.error("Error al modificar el turno:", error);
    }
  };

  return (
    isOpen && (
      <div className="overlay">
        <div className="modal-modify-schedule">
          <div class="container-info-schedule">
            <span className="close" onClick={onClose}>
              &times;
            </span>
            {turno ? (
              <>
                <p className="schedule-modify-message">
                  Modificar el turno con la siguiente información:
                </p>
                <div className="schedule-modify-info">
                  <p>
                    <strong>Empleado ID:</strong> {turno.EmpleadoID}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {turno.Fecha}
                  </p>
                  <div class="input-container">
                    <label htmlFor="hora-entrada-input">Hora entrada</label>
                    <input
                      type="time"
                      id="hora-entrada-input"
                      value={modifiedTurno.HoraEntrada}
                      onChange={(e) =>
                        setModifiedTurno({
                          ...modifiedTurno,
                          HoraEntrada: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="hora-salida-input">Hora salida</label>
                    <input
                      type="time"
                      id="hora-salida-input"
                      value={modifiedTurno.HoraSalida}
                      onChange={(e) =>
                        setModifiedTurno({
                          ...modifiedTurno,
                          HoraSalida: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="schedule-modify-buttons">
                  <button
                    className="modal-modify-button"
                    onClick={handleModify}
                  >
                    Modificar
                  </button>
                </div>
              </>
            ) : (
              <p className="no-schedule-selected">
                No se ha seleccionado ningún turno para modificar.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default ScheduleModifyModal;
