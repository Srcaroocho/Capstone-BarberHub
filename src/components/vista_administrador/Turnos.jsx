import React, { useState, useEffect } from "react";
import ScheduleDeleteModal from "./ModalEliminarTurno";
import ScheduleModifyModal from "./ModalEditarTurno"; // Importa el nuevo modal de modificación
import {fetchEmployeesData,addScheduleData,fetchEmployeeTurns,} from "../../api/apiService";
import "./styles/turnos.css";

const EmployeeSchedule = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeesData, setEmployeesData] = useState([]);
  const [employeeScheduleData, setEmployeeScheduleData] = useState({});
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    EmpleadoID: "",
    Fecha: "",
    HoraEntrada: "",
    HoraSalida: "",
    Nombre: "mañana",
    empleado_turnoid: "",
  });

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);

  const [isModifyModalVisible, setIsModifyModalVisible] = useState(false); // Nuevo estado para el modal de modificación
  const [selectedTurnoToModify, setSelectedTurnoToModify] = useState(null); // Estado para almacenar el turno a modificar

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const jsonData = await fetchEmployeesData();
        setEmployeesData(jsonData);
      } catch (error) {
        console.error("Error al obtener los datos de empleados:", error);
      }
    }
    fetchEmployees();
  }, []);

  const loadEmployeeTurns = async () => {
    if (selectedEmployee) {
      try {
        const turnsData = await fetchEmployeeTurns(selectedEmployee);
        setEmployeeScheduleData({ ...employeeScheduleData, [selectedEmployee]: turnsData });
      } catch (error) {
        console.error("Error al obtener los turnos de empleados:", error);
        setEmployeeScheduleData({ ...employeeScheduleData, [selectedEmployee]: [] });
      }
    }
  };

  useEffect(() => {
    loadEmployeeTurns();
  }, [selectedEmployee]);

  const handleCreateFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addScheduleData({
        EmpleadoID: selectedEmployee,
        Fecha: newSchedule.Fecha,
        HoraEntrada: `${newSchedule.HoraEntrada}:00`,
        HoraSalida: `${newSchedule.HoraSalida}:00`,
        Nombre: newSchedule.Nombre,
        empleado_turnoid: newSchedule.empleado_turnoid,
      });

      if (response) {
        setCreateFormVisible(false);
        loadEmployeeTurns();
      }
    } catch (error) {
      console.error("Error al crear el turno:", error);
    }
  };

  const handleGoBack = () => {
    setCreateFormVisible(false);
    setNewSchedule({
      EmpleadoID: "",
      Fecha: "",
      HoraEntrada: "",
      HoraSalida: "",
      Nombre: "mañana",
      empleado_turnoid: "",
    });
  };

  const handleModifyTurn = (turno) => {
    setSelectedTurnoToModify(turno); // Al hacer clic en "Modificar", guarda el turno seleccionado
    setIsModifyModalVisible(true); // Abre el modal de modificación
  };

  const handleDeleteTurn = (turno) => {
    setSelectedTurno(turno);
    setIsDeleteModalVisible(true);
  };

  return (
    <div className="employee-schedule-container">
      <div className="employee-selector">
        <label htmlFor="employee-select">Seleccionar empleado:</label>
        <select
          id="employee-select"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Seleccione un empleado</option>
          {employeesData.map((employee) => (
            <option key={employee.EmpleadoID} value={employee.EmpleadoID}>
              {employee.Nombre} - {employee.Especialidad}
            </option>
          ))}
        </select>
      </div>

      {selectedEmployee && (
        <div>
          <h2>
            Turnos de{" "}
            {employeesData.find((emp) => emp.EmpleadoID === selectedEmployee)?.NombreCompleto}
          </h2>
          {employeeScheduleData[selectedEmployee] &&
          employeeScheduleData[selectedEmployee].length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora de Entrada</th>
                  <th>Hora de Salida</th>
                  <th>Jornada</th>
                  <th>Modificar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {employeeScheduleData[selectedEmployee].map((turno, index) => (
                  <tr key={index}>
                    <td>{turno.Fecha}</td>
                    <td>{turno.HoraEntrada}</td>
                    <td>{turno.HoraSalida}</td>
                    <td>{turno.Nombre}</td>
                    <td>
                      <button onClick={() => handleModifyTurn(turno)}>Modificar</button>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteTurn(turno)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay turnos disponibles para este empleado.</p>
          )}

          {isCreateFormVisible ? (
            <form onSubmit={handleCreateFormSubmit} className="schedule-form">
              <label htmlFor="fecha-input">Fecha:</label>
              <input
                type="date"
                id="fecha-input"
                value={newSchedule.Fecha}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, Fecha: e.target.value })
                }
                required
              />
              <label htmlFor="hora-entrada-input">Hora de Entrada:</label>
              <input
                type="time"
                id="hora-entrada-input"
                value={newSchedule.HoraEntrada}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, HoraEntrada: e.target.value })
                }
                required
              />
              <label htmlFor="hora-salida-input">Hora de Salida:</label>
              <input
                type="time"
                id="hora-salida-input"
                value={newSchedule.HoraSalida}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, HoraSalida: e.target.value })
                }
                required
              />
              <label htmlFor="nombre-select">Nombre:</label>
              <select
                id="nombre-select"
                value={newSchedule.Nombre}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, Nombre: e.target.value })
                }
              >
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
              </select>
              <button type="submit">Crear Turno</button>
              <button type="button" onClick={handleGoBack}>
                Volver Atrás
              </button>
            </form>
          ) : (
            <div>
              <p>¿Desea crear un nuevo turno?</p>
              <button onClick={() => setCreateFormVisible(true)}>Crear Turno</button>
            </div>
          )}
        </div>
      )}

      <ScheduleDeleteModal
        turno={selectedTurno}
        isOpen={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
      />

      {/* Nuevo: Modal de modificación */}
      <ScheduleModifyModal
        turno={selectedTurnoToModify}
        isOpen={isModifyModalVisible}
        onClose={() => setIsModifyModalVisible(false)}
        onModify={(updatedTurno) => {
          // Aquí puedes manejar la actualización del turno en tu estado
          console.log("Turno modificado:", updatedTurno);
          // Puedes realizar cualquier acción adicional necesaria
          loadEmployeeTurns(); // Actualiza la lista de turnos después de modificar
        }}
      />
    </div>
  );
};

export default EmployeeSchedule;
