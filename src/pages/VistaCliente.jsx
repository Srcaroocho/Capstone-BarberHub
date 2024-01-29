import React, { Component } from "react";
import "../styles/vista_cliente.css";
import Calendario from "../components/vista_cliente/Calendario";
import DetalleCita from "../components/vista_cliente/DetalleCita";
import Navbar from "../components/vista_cliente/Navbar"; // Importa el componente Navbar

class ClientPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventos: [],
      eventoSeleccionado: null,
      mostrarFormularioCita: false,
    };
  }

  // Función para manejar la creación de un nuevo evento (cita) y cliente
  handleCrearEvento = (nuevoEvento) => {
    // Agrega lógica para guardar el evento en el estado de eventos
    this.setState((prevState) => ({
      eventos: [...prevState.eventos, nuevoEvento],
      mostrarFormularioCita: false, // Después de crear la cita, ocultamos el formulario
    }));
  };

  // Función para manejar la selección de un evento en el calendario
  handleSelectEvent = (evento) => {
    this.setState({ eventoSeleccionado: evento });
  };

  // Función para mostrar u ocultar el formulario de creación de cita
  toggleFormularioCita = () => {
    this.setState((prevState) => ({
      mostrarFormularioCita: !prevState.mostrarFormularioCita,
    }));
  };

  render() {
    const { eventoSeleccionado } = this.state;

    return (
      <div className="component-container">
        <div className="navbar-container">
          <Navbar />
        </div>
        <div className="agenda-container">
          <div className="column-1">
            <Calendario
              eventos={this.state.eventos}
              handleSelectEvent={this.handleSelectEvent}
            />
          </div>
          <div className="column-2">
            <div className="detalle-cita-container">
              <DetalleCita eventoSeleccionado={eventoSeleccionado} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ClientPage;
