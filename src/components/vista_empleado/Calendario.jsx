import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/es";
import { jwtDecode } from "jwt-decode";
import {
  fetchEmployeeTurns,
  fetchEmployeeAppointmentData,
  updateAppointmentData,
  fetchClientsData
} from "../../api/apiService";
import momentTz from "moment-timezone";
import Modal from "react-modal";
import "./styles/calendario.css";
import { Toaster, toast } from "sonner";

moment.locale("es");
const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [employeeTurns, setEmployeeTurns] = useState([]);
  const [employeeAppointments, setEmployeeAppointments] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imagenDecodificada, setImagenDecodificada] = useState(null);
  const [editando, setEditando] = useState(false);
  const [fechaEditada, setFechaEditada] = useState("");
  const [horaInicioEditada, setHoraInicioEditada] = useState("");
  const [horaFinEditada, setHoraFinEditada] = useState("");
  const [estadoEditado, setEstadoEditado] = useState("");
  const [clientsData, setClientsData] = useState([]); // Estado para almacenar los datos de los clientes


  useEffect(() => {
    const fetchEmployeeData = async () => {
      const accessToken = localStorage.getItem("accesToken");
      if (!accessToken) {
        console.error("accessToken no encontrado en el localStorage.");
        return;
      }
      try {
        const decodedToken = jwtDecode(accessToken);
        const { EmpleadoID } = decodedToken;
        if (!EmpleadoID) {
          console.error("EmpleadoID no encontrado en el token.");
          return;
        }
        toast.promise(
          Promise.all([
            fetchEmployeeTurns(EmpleadoID),
            fetchEmployeeAppointmentData(EmpleadoID)
          ]),
          {
            loading: "Cargando agenda...",
            success: () => "Datos recibidos",
            error: "Error al obtener los datos de las citas del empleado",
          }
        );
        const turnsData = await fetchEmployeeTurns(EmpleadoID);
        setEmployeeTurns(turnsData);
        const appointmentsData = await fetchEmployeeAppointmentData(EmpleadoID);
        setEmployeeAppointments(appointmentsData);
      } catch (error) {
        console.error(
          "Error al decodificar el token o al obtener datos:",
          error
        );
      }
    };
    fetchEmployeeData();

    const fetchClients = async () => {
      try {
        const clients = await fetchClientsData();
        setClientsData(clients);
      } catch (error) {
        console.error("Error al obtener datos de clientes:", error);
      }
    };
    fetchClients();
  }, []);

  

  useEffect(() => {
    if (selectedEvent && selectedEvent.cita.ImagenCorte) {
      const imagenBinaria = selectedEvent.cita.ImagenCorte.data;
      const imagenDecodificada = `data:image/png;base64,${arrayBufferToBase64(
        imagenBinaria
      )}`;
      setImagenDecodificada(imagenDecodificada);
    } else {
      setImagenDecodificada(null);
    }
  }, [selectedEvent]);

  const convertirTurnosAEventosBloqueados = (turnos) => {
    const eventosBloqueados = [];
    const zonaHoraria = "America/Santiago";
    turnos.forEach((turno) => {
      let fecha = momentTz
        .tz(turno.Fecha, zonaHoraria)
        .startOf("day")
        .add(1, "day");
      const inicioTurno = fecha.clone().set({
        hour: turno.HoraEntrada.split(":")[0],
        minute: turno.HoraEntrada.split(":")[1],
      });
      const finTurno = fecha.clone().set({
        hour: turno.HoraSalida.split(":")[0],
        minute: turno.HoraSalida.split(":")[1],
      });
      if (inicioTurno > fecha.startOf("day")) {
        eventosBloqueados.push({
          title: "No disponible",
          start: fecha.startOf("day").toDate(),
          end: inicioTurno.toDate(),
        });
      }
      if (finTurno < fecha.endOf("day")) {
        eventosBloqueados.push({
          title: "No disponible",
          start: finTurno.toDate(),
          end: fecha.endOf("day").toDate(),
        });
      }
    });
    return eventosBloqueados;
  };

  const eventsFromAppointments = employeeAppointments.map((cita) => {
    const fecha = moment(cita.Fecha).add(1, "day");
    const horaInicio = moment(cita.HoraInicio, "HH:mm");
    const horaFin = moment(cita.HoraFin, "HH:mm");
    const inicio = fecha.clone().set({
      hour: horaInicio.hour(),
      minute: horaInicio.minute(),
    });
    const fin = fecha.clone().set({
      hour: horaFin.hour(),
      minute: horaFin.minute(),
    });

    return {
      id: cita.CitaID,
      title: `Cita ${cita.CitaID}`,
      start: inicio.toDate(),
      end: fin.toDate(),
      cita: cita,
    };
  });

  const blockedEvents = convertirTurnosAEventosBloqueados(employeeTurns);

  const handleSelectSlot = ({ start, end }) => {
    const now = new Date();
    if (start < now) {
      window.alert("No se puede seleccionar una fecha y hora pasadas.");
      return;
    }

    if (currentView === "month") {
      setCurrentDate(start);
      setCurrentView("day");
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  const handleCancelEditMode = () => {
    setEditando(false);
  };

  const handleEdit = () => {
    setEditando(true);
    setFechaEditada(moment(selectedEvent.start).format("YYYY-MM-DD"));
    setHoraInicioEditada(moment(selectedEvent.start).format("HH:mm"));
    setHoraFinEditada(moment(selectedEvent.end).format("HH:mm"));
    setEstadoEditado(selectedEvent.cita.Estado);
  };

  const handleSave = async () => {
    try {
      if (!selectedEvent) {
        console.error("No se ha seleccionado ningún evento");
        return;
      }

      if (!selectedEvent.cita.CitaID) {
        console.error(
          "No se puede actualizar la cita sin un ID de cita válido"
        );
        return;
      }

      // Actualizar los estados con los valores editados
      setEditando(false);
      const updatedInicio = moment(
        `${fechaEditada} ${horaInicioEditada}`
      ).format("YYYY-MM-DD HH:mm");
      const updatedFin = moment(`${fechaEditada} ${horaFinEditada}`).format(
        "YYYY-MM-DD HH:mm"
      );
      setHoraInicioEditada(updatedInicio);
      setHoraFinEditada(updatedFin);

      const updatedAppointment = {
        ...selectedEvent.cita,
        Fecha: fechaEditada,
        p_HoraInicio: updatedInicio,
        p_HoraFin: updatedFin,
        p_Estado: estadoEditado,
      };

      // Imprimir los datos que se enviarán
      console.log("Datos de la cita a enviar:", updatedAppointment);

      await updateAppointmentData(updatedAppointment);
      console.log("¡Datos de la cita actualizados exitosamente!");
      toast.success("Datos de la cita actualizados exitosamente");

      setModalIsOpen(false);
    } catch (error) {
      console.error("Error al actualizar los datos de la cita:", error);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  return (
    <div>
      <Toaster />
      <div className="calendario-container">
        <Calendar
          localizer={localizer}
          events={[...eventsFromAppointments, ...blockedEvents]}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelectSlot}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          selectable={true}
          views={{
            month: true,
            week: true,
            day: true,
          }}
          min={new Date().setHours(9, 0)}
          max={new Date().setHours(19, 0)}
          step={15}
          timeslots={1}
          messages={{
            month: "Mes",
            week: "Semana",
            day: "Día",
            today: "Hoy",
            next: "Siguiente",
            previous: "Anterior",
            showMore: (total) => `+ Mostrar más (${total})`,
          }}
          date={currentDate}
          view={currentView}
          eventPropGetter={(event) => {
            if (event.title === "No disponible") {
              return {
                style: {
                  backgroundColor: "red",
                },
              };
            }
            return {};
          }}
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Detalles del Evento"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-content">
          <div className="modal-header">
            <button
              className="modal-close-button"
              onClick={() => setModalIsOpen(false)}
            >
              Cerrar
            </button>
          </div>
          <h2>Detalles del Evento</h2>

          {selectedEvent && (
            <div className="modal-info-container">
              <div>
                <p>
                  <strong>Título:</strong> {selectedEvent.title}
                </p>
                <p>
                <strong>Nombre cliente:</strong> {selectedEvent.cita.ClienteID && clientsData.find(client => client.ClienteID === selectedEvent.cita.ClienteID) ? clientsData.find(client => client.ClienteID === selectedEvent.cita.ClienteID).Nombre : 'Desconocido'} {selectedEvent.cita.ClienteID && clientsData.find(client => client.ClienteID === selectedEvent.cita.ClienteID) ? clientsData.find(client => client.ClienteID === selectedEvent.cita.ClienteID).Apellido : ''}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {moment(selectedEvent.start).format("LL")}
                </p>
                <p>
                  <strong>Hora de inicio:</strong>{" "}
                  {moment(selectedEvent.start).format("LT")}
                </p>
                <p>
                  <strong>Hora de fin:</strong>{" "}
                  {moment(selectedEvent.end).format("LT")}
                </p>
                <p>
                  <strong>Estado:</strong> {selectedEvent.cita.Estado}
                </p>
              </div>
              {imagenDecodificada && (
                <div className="modal-image-container">
                  <img src={imagenDecodificada} alt="Corte deseado" />
                </div>
              )}
            </div>
          )}

          {editando ? (
            <div>
              <p>
                <strong>Fecha:</strong>{" "}
                <input
                  type="date"
                  value={fechaEditada}
                  onChange={(e) => setFechaEditada(e.target.value)}
                />
              </p>
              <p>
                <strong>Hora de inicio:</strong>{" "}
                <input
                  type="time"
                  value={horaInicioEditada}
                  onChange={(e) => setHoraInicioEditada(e.target.value + ":00")}
                />
              </p>
              <p>
                <strong>Hora de fin:</strong>{" "}
                <input
                  type="time"
                  value={horaFinEditada}
                  onChange={(e) => setHoraFinEditada(e.target.value)}
                />
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <select
                  value={estadoEditado}
                  onChange={(e) => setEstadoEditado(e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Suspendida">Suspendida</option>
                  <option value="Completada">Completada</option>
                  <option value="En espera">En espera</option>
                </select>
              </p>
              <button className="modal-save-button" onClick={handleSave}>
                Guardar
              </button>
              <button
                className="modal-cancel-button"
                onClick={handleCancelEditMode}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button className="modal-edit-button" onClick={handleEdit}>
              Editar
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Calendario;
