import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/es";
import momentTz from "moment-timezone";
import "../vista_cliente/styles/calendario.css";
import ModalNuevaCita from './ModalNuevaCita';
import { fetchEmployeesData, fetchEmployeeTurns } from '../../api/apiService';

moment.locale("es");
const localizer = momentLocalizer(moment);

function getEventProps(event, start, end, isSelected) {
  if (event.title === 'No disponible') {
    return {
      style: {
        backgroundColor: 'red', // Cambia el color de fondo a rojo
        color: 'white', // Cambia el color del texto a blanco (opcional)
      },
    };
  }
  return {};
}

function Calendario({ eventos, handleSelectEvent }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({
    start: null,
    end: null,
    date: null, // Agregamos una propiedad para la fecha
  });
  const [selectedPeluquero, setSelectedPeluquero] = useState(''); // Cambiado a cadena (ID del empleado)
  const [empleados, setEmpleados] = useState([]);
  const [employeeTurns, setEmployeeTurns] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const jsonData = await fetchEmployeesData();
        setEmpleados(jsonData);
      } catch (error) {
        console.error('Error al obtener los datos de los empleados:', error);
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
          console.error('Error al obtener los turnos del empleado:', error);
        }
      }
    }
    fetchTurnsData();
  }, [selectedPeluquero]);

  function convertirTurnosAEventosBloqueados(turnos) {
    const eventosBloqueados = [];
    turnos.forEach(turno => {
      const zonaHoraria = 'America/Santiago';
      let fecha = momentTz.tz(turno.Fecha, zonaHoraria).startOf('day');

      // Sumar un día a la fecha
      fecha = fecha.add(1, 'day');

      const inicioTurno = fecha.clone().set({
        hour: turno.HoraEntrada.split(':')[0],
        minute: turno.HoraEntrada.split(':')[1]
      });
      const finTurno = fecha.clone().set({
        hour: turno.HoraSalida.split(':')[0],
        minute: turno.HoraSalida.split(':')[1]
      });

      // Evento de bloqueo antes del turno
      if (inicioTurno > fecha.startOf('day')) {
        eventosBloqueados.push({
          title: 'No disponible',
          start: fecha.startOf('day').toDate(),
          end: inicioTurno.toDate(),
        });
      }

      // Evento de bloqueo después del turno
      if (finTurno < fecha.endOf('day')) {
        eventosBloqueados.push({
          title: 'No disponible',
          start: finTurno.toDate(),
          end: fecha.endOf('day').toDate(),
        });
      }
    });

    return eventosBloqueados;
  }

  const employeeBlockingEvents = convertirTurnosAEventosBloqueados(employeeTurns);

  const handleSelectSlot = ({ start, end }) => {
    const now = new Date();
    if (start < now) {
      window.alert("No se puede seleccionar una fecha y hora pasadas.");
      return; 
    }
    
    if (currentView === 'month') {
      setCurrentDate(start);
      setCurrentView('day');
    } else {
      setSelectedSlot({
        start,
        end,
        date: start, // Establecer la fecha en el objeto selectedSlot
      });

      console.log(selectedSlot); // Imprimir los datos de selectedSlot

      setModalVisible(true);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handlePeluqueroChange = (event) => {
    setSelectedPeluquero(event.target.value);
  };

  return (
    <div>
      <div className="selector-peluquero">
        <label htmlFor="peluquero-select">Elige un peluquero/barbero:</label>
        <select
          id="peluquero-select"
          value={selectedPeluquero}
          onChange={handlePeluqueroChange}
        >
          <option value="">Seleccione un peluquero/barbero</option>
          {empleados.map(empleado => (
            <option key={empleado.EmpleadoID} value={empleado.EmpleadoID}>
              {empleado.Nombre} - {empleado.Apellido} - {empleado.Especialidad}
            </option>
          ))}
        </select>
      </div>
      <div className="calendario-cliente-container">
        <Calendar
          localizer={localizer}
          events={[...eventos, ...employeeBlockingEvents]}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          selectable={true}
          views={{ month: true, week: true, day: true }}
          step={15}
          messages={{ month: "Mes", week: "Semana", day: "Día", today: "Hoy", next: "Siguiente", previous: "Anterior", showMore: total => `+ Mostrar más (${total})` }}
          min={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 0, 0)}
          max={new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 19, 0, 0)}
          date={currentDate}
          view={currentView}
          eventPropGetter={getEventProps} // Agrega esta línea
        />
        {modalVisible && (
          <ModalNuevaCita
            slotInfo={selectedSlot}
            onClose={handleCloseModal}
            selectedPeluquero={selectedPeluquero}
          />
        )}
      </div>
    </div>
  );
}

export default Calendario;
