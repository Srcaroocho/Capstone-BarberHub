import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/es";
import momentTz from "moment-timezone";
import "../vista_cliente/styles/calendario.css";
import ModalNuevaCita from "./ModalNuevaCita";
import {
  fetchEmployeesData,
  fetchEmployeeTurns,
  fetchEmployeeAppointmentData,
} from "../../api/apiService";
import { Toaster, toast } from "sonner";
import { jwtDecode } from "jwt-decode";

moment.locale("es");
const localizer = momentLocalizer(moment);

function getEventProps(event, start, end, isSelected) {
  if (event.title === "No disponible") {
    return {
      style: {
        backgroundColor: "red",
        color: "white",
        cursor: "default", // Establecer el cursor a 'default' para eventos no clicables
      },
    };
  }
  return {};
}

function Calendario({ eventos, handleSelectEvent }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({
    start: null,
    end: null,
    date: null,
  });
  const [selectedPeluquero, setSelectedPeluquero] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [employeeTurns, setEmployeeTurns] = useState([]);
  const [employeeAppointments, setEmployeeAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshAppointmentsTrigger, setRefreshAppointmentsTrigger] =
    useState(false);
  // Nuevo estado para controlar la carga

  useEffect(() => {
    async function fetchData() {
      try {
        const jsonData = await fetchEmployeesData();
        setEmpleados(jsonData);
      } catch (error) {
        console.error("Error al obtener los datos de los empleados:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchTurnsData() {
      if (selectedPeluquero) {
        try {
          const jsonData = await fetchEmployeeTurns(selectedPeluquero);
          setEmployeeTurns(jsonData);
        } catch (error) {
          console.error("Error al obtener los turnos del empleado:", error);
        }
      }
    }
    fetchTurnsData();
  }, [selectedPeluquero]);

  useEffect(() => {
    async function fetchEmployeeAppointments() {
      if (selectedPeluquero) {
        try {
          const promise = async () => {
            setIsLoading(true);
            const jsonData = await fetchEmployeeAppointmentData(
              selectedPeluquero
            );
            const accessToken = localStorage.getItem("accesToken");
            let clienteID;
            if (accessToken) {
              try {
                const decodedToken = jwtDecode(accessToken);
                clienteID = decodedToken?.ClienteID;
              } catch (error) {
                console.error("Error al decodificar el token:", error);
              }
            }
            const citas = jsonData.map((cita) => {
              const fecha = moment(cita.Fecha); // Sumar un día a la fecha de la cita
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
              const title =
                clienteID !== cita.ClienteID
                  ? "No disponible"
                  : `Cita ${cita.CitaID}`;
              return {
                id: cita.CitaID,
                title: title,
                start: inicio.toDate(),
                end: fin.toDate(),
                CitaID: cita.CitaID,
                ClienteID: cita.ClienteID,
                EmpleadoID: cita.EmpleadoID,
                Estado: cita.Estado,
                Fecha: cita.Fecha,
                HoraInicio: cita.HoraInicio,
                HoraFin: cita.HoraFin,
                ImagenCorte: cita.ImagenCorte,
                ServicioID: cita.ServicioID,
              };
            });
            setEmployeeAppointments(citas);
          };

          toast.promise(promise(), {
            loading: "Cargando agenda...",
            success: () => "Datos recibidos",
            error: "Error al obtener los datos de las citas del empleado",
          });

          setIsLoading(false);
        } catch (error) {
          console.error(
            "Error al obtener los datos de las citas del empleado:",
            error
          );
          setIsLoading(false);
        }
      }
    }
    fetchEmployeeAppointments();
  }, [selectedPeluquero, refreshAppointmentsTrigger]);

  const refreshAppointments = () => {
    // Invierte el estado para que useEffect se active nuevamente
    setRefreshAppointmentsTrigger((prevState) => !prevState);
  };

  function convertirTurnosAEventosBloqueados(turnos) {
    const eventosBloqueados = [];
    turnos.forEach((turno) => {
      const zonaHoraria = "America/Santiago";
      let fecha = momentTz.tz(turno.Fecha, zonaHoraria).startOf("day");
      fecha = fecha.add(1, "day");
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
  }

  const employeeBlockingEvents =
    convertirTurnosAEventosBloqueados(employeeTurns);

  const handleSelectSlot = ({ start, end }) => {
    const now = new Date();
    if (start < now) {
      toast.error("No se puede seleccionar una fecha y hora pasadas");
      return;
    }
    if (!selectedPeluquero) {
      toast.error(
        "Por favor, seleccione un peluquero o barbero antes de crear una cita"
      );
      return;
    }
    if (currentView === "month") {
      setCurrentDate(start);
      setCurrentView("day");
    } else {
      setSelectedSlot({
        start,
        end,
        date: start,
      });
      setIsModalOpen(true);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
  };

  const handlePeluqueroChange = (event) => {
    setSelectedPeluquero(event.target.value);
  };

  const handleEventClick = (event) => {
    if (event.title !== "No disponible") {
      handleSelectEvent(event);
    } else {
      toast.info(`Usted no tiene acceso a los detalles`);
    }
  };

  return (
    <div>
      <Toaster />
      <div className="selector-peluquero">
        <label className="selector-label" htmlFor="peluquero-select">
          Elige un peluquero/barbero:
        </label>
        <select
          id="peluquero-select"
          value={selectedPeluquero}
          onChange={handlePeluqueroChange}
        >
          <option value="">Seleccione un peluquero/barbero</option>
          {empleados
            .filter((empleado) => empleado.Estado !== false) // Filtrar empleados cuyo estado no sea false
            .map((empleado) => (
              <option key={empleado.EmpleadoID} value={empleado.EmpleadoID}>
                {empleado.Nombre} {empleado.Apellido} - {empleado.Especialidad}
              </option>
            ))}
        </select>
      </div>
      {isLoading && (
        <div className="calendario-overlay-container">
          <div className="calendario-overlay">
            <div className="spinner">{/* Lottie component removed */}</div>
          </div>
        </div>
      )}
      <div className="calendario-cliente-container">
        <Calendar
          localizer={localizer}
          events={[
            ...eventos,
            ...employeeBlockingEvents,
            ...employeeAppointments,
          ]}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleEventClick}
          onSelectSlot={handleSelectSlot}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          selectable={true}
          views={{ month: true, week: true, day: true }}
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
          min={
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              9,
              0,
              0
            )
          }
          max={
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              19,
              0,
              0
            )
          }
          date={currentDate}
          view={currentView}
          eventPropGetter={getEventProps}
        />
        {isModalOpen && (
          <ModalNuevaCita
            slotInfo={selectedSlot}
            onClose={handleCloseModal}
            selectedPeluquero={selectedPeluquero}
            refreshAppointments={refreshAppointments} // Pasamos la función refreshAppointments al modal
          />
        )}
      </div>
    </div>
  );
}

export default Calendario;
