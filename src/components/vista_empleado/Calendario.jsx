import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/es";
import "../vista_empleado/styles/calendario.css";
import ModalNuevaCita from './ModalNuevaCita';

moment.locale("es");
const localizer = momentLocalizer(moment);

function Calendario({ eventos, handleSelectEvent }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const eventoPrueba = {
    title: "Evento de Prueba",
    start: new Date(2024, 0, 19, 10, 1),
    end: new Date(2024, 0, 19, 10, 2),
  };

  const eventoPrueba2 = {
    title: "Evento de Prueba 2",
    start: new Date(2024, 0, 19, 10, 2),
    end: new Date(2024, 0, 19, 10, 3),
  };

  const minTime = new Date();
  minTime.setHours(9, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(19, 0, 0);

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
      setSelectedSlot({ start, end });
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

  return (
    <div>
      <div className="calendario-container">
        <Calendar
          localizer={localizer}
          events={[...eventos, eventoPrueba, eventoPrueba2]}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          selectable={true}
          views={{
            month: true,
            week: true,
            day: true
          }}
          step={15}
          messages={{
            month: "Mes",
            week: "Semana",
            day: "Día",
            today: "Hoy",
            next: "Siguiente",
            previous: "Anterior",
            showMore: total => `+ Mostrar más (${total})`
          }}
          min={minTime}
          max={maxTime}
          date={currentDate}
          view={currentView}
        />
        {modalVisible && (
          <ModalNuevaCita
            slotInfo={selectedSlot}
            onClose={handleCloseModal}
            // No se pasa peluquero seleccionado ya que es para uso individual del peluquero
          />
        )}
      </div>
    </div>
  );
}

export default Calendario;
