import React, { useState, useEffect } from "react";
import "../vista_cliente/styles/detallecita.css";
import { updateAppointmentData } from "../../api/apiService";
import { Toaster, toast } from "sonner";


function DetalleCita({ eventoSeleccionado }) {
  const [imagenDecodificada, setImagenDecodificada] = useState("");
  const [editando, setEditando] = useState(false);
  const [fechaEditada, setFechaEditada] = useState("");
  const [horaInicioEditada, setHoraInicioEditada] = useState("");
  const [horaFinEditada, setHoraFinEditada] = useState("");
  const [estadoEditado, setEstadoEditado] = useState("");
  const [editandoInicial, setEditandoInicial] = useState(false);

  useEffect(() => {
    if (eventoSeleccionado) {
      setFechaEditada(eventoSeleccionado.Fecha);
      setHoraInicioEditada(eventoSeleccionado.HoraInicio);
      setHoraFinEditada(eventoSeleccionado.HoraFin);
      setEstadoEditado(eventoSeleccionado.Estado);

      if (eventoSeleccionado.ImagenCorte) {
        const imagenBinaria = eventoSeleccionado.ImagenCorte.data;
        const imagenDecodificada = `data:image/png;base64,${arrayBufferToBase64(
          imagenBinaria
        )}`;
        setImagenDecodificada(imagenDecodificada);
      }
    }
  }, [eventoSeleccionado]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const handleEdit = () => {
    setEditando(true);
    setEditandoInicial(true);
  };

  const handleSave = async () => {
    try {
      if (!eventoSeleccionado) {
        console.error("No se ha seleccionado ningún evento");
        return;
      }

      // Verificar si los datos requeridos están definidos
      if (
        !fechaEditada ||
        !horaInicioEditada ||
        !horaFinEditada ||
        !estadoEditado
      ) {
        console.error("Por favor, complete todos los campos");
        return;
      }

      // Verificar si el ID de la cita está definido
      if (!eventoSeleccionado.CitaID) {
        console.error(
          "No se puede actualizar la cita sin un ID de cita válido"
        );
        return;
      }

      const updatedAppointment = {
        ...eventoSeleccionado,
        Fecha: fechaEditada,
        p_HoraInicio: horaInicioEditada,
        p_HoraFin: horaFinEditada,
        p_Estado: estadoEditado,
      };

      await updateAppointmentData(updatedAppointment);
      toast('Cita actualizada, para ver los cambios recarga la página', {
        action: {
          label: 'Recargar',
          onClick: () => window.location.reload()
        },
      });
      
      setEditando(false);
      setEditandoInicial(false);
      
    } catch (error) {
      console.error("Error al actualizar los datos de la cita:", error);
    }
  };

  const handleCancel = () => {
    setEditando(false);
    setEditandoInicial(false);
    // Restaurar valores originales
    setFechaEditada(eventoSeleccionado.Fecha);
    setHoraInicioEditada(eventoSeleccionado.HoraInicio);
    setHoraFinEditada(eventoSeleccionado.HoraFin);
    setEstadoEditado(eventoSeleccionado.Estado);
  };

  return (
    <div className="detalle-cita">
      <Toaster/>
      <h2>Detalles de la cita</h2>
      {eventoSeleccionado ? (
        <div>
          <p>
            Fecha:{" "}
            {editando ? (
              <input
                type="date"
                value={fechaEditada}
                onChange={(e) => setFechaEditada(e.target.value)}
              />
            ) : (
              new Date(fechaEditada)
                .toLocaleDateString("es-ES")
                .split("/")
                .map((part, index) =>
                  index === 0
                    ? part.padStart(2, "0")
                    : index === 1
                    ? part.padStart(2, "0")
                    : part
                )
                .join("-") // Separar por guion
            )}
          </p>

          <p>
            Hora de inicio:{" "}
            {editando ? (
              <input
                type="time"
                value={horaInicioEditada}
                onChange={(e) => setHoraInicioEditada(e.target.value + ":00")}
                // Agregamos ":00" al final para darle el formato esperado
              />
            ) : (
              eventoSeleccionado.HoraInicio
            )}
          </p>
          <p>
            Hora de termino:{" "}
            {editando ? (
              <input
                type="time"
                value={horaFinEditada}
                onChange={(e) => setHoraFinEditada(e.target.value + ":00")}
                // Agregamos ":00" al final para darle el formato esperado
              />
            ) : (
              eventoSeleccionado.HoraFin
            )}
          </p>

          <p>
            Estado:{" "}
            {editando ? (
              <select
                value={estadoEditado}
                onChange={(e) => setEstadoEditado(e.target.value)}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="">Suspendida</option>
              </select>
            ) : (
              eventoSeleccionado.Estado
            )}
          </p>
          {!editando && (
            <>
              <p>Corte deseado:</p>
              <div className="container-imagen-corte">
                <img
                  className="imagen-corte"
                  src={imagenDecodificada}
                  alt="Imagen de corte"
                />
              </div>
            </>
          )}
          <div>
            {editando ? (
              <div className="btn-edit-container">
                <button
                  className="btn-modal-detalle-cita"
                  onClick={handleCancel}
                >
                  Volver
                </button>

                <button className="btn-modal-detalle-cita" onClick={handleSave}>
                  Guardar
                </button>
              </div>
            ) : (
              <button className="btn-edit-detalle-cita" onClick={handleEdit}>
                Editar
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>Selecciona una cita para ver los detalles.</p>
      )}
    </div>
  );
}

export default DetalleCita;
