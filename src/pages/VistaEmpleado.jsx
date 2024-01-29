// EmployeePage.js
import React, { Component } from "react";
import "../styles/vista_empleado.css";
import "../components/vista_empleado/styles/detallecita.css";
import Calendario from "../components/vista_empleado/Calendario";
import DetalleCita from "../components/vista_empleado/DetalleCita";
import Navbar from "../components/vista_empleado/Navbar";

class EmployeePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventos: [],
      eventoSeleccionado: null,
      isDetalleCitaVisible: false,
    };
  }

  handleCrearEvento = (nuevoEvento) => {
    this.setState((prevState) => ({
      eventos: [...prevState.eventos, nuevoEvento],
    }));
  };

  handleSelectEvent = (evento) => {
    console.log("Evento seleccionado:", evento);
    this.setState({
      eventoSeleccionado: evento,
      isDetalleCitaVisible: true,
    });
  };

  closeDetalleCita = () => {
    console.log("Cerrando el modal");
    this.setState({
      isDetalleCitaVisible: false,
    });
  };

  render() {
    const { eventoSeleccionado, isDetalleCitaVisible } = this.state;

    return (
      <div className="component-container">
        <Navbar />
        <Calendario
          eventos={this.state.eventos}
          handleSelectEvent={this.handleSelectEvent}
        />
        {isDetalleCitaVisible && (
          <div className="modal-detalle-cita">
            <DetalleCita
              eventoSeleccionado={eventoSeleccionado}
              onClose={this.closeDetalleCita}
            />
          </div>
        )}
      </div>
    );
  }
}

export default EmployeePage;
