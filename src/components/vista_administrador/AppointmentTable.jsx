import React, { useState, useEffect } from "react";
import "./styles/appointmenttable.css";
import {
  fetchAppointmentData,
  fetchClientsData,
  fetchEmployeesData,
  fetchAllService,
} from "../../api/apiService"; // Importar las funciones para obtener datos
import moment from "moment";
import { Toaster, toast } from "sonner";

const AppointmentTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentData, setAppointmentData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const promise = async () => {
          try {
            const [appointments, clients, employees, services] =
              await Promise.all([
                fetchAppointmentData(),
                fetchClientsData(),
                fetchEmployeesData(),
                fetchAllService(),
              ]);
            setAppointmentData(appointments);
            setClientsData(clients);
            setEmployeesData(employees);
            setServiceData(services);
          } catch (error) {
            console.error("Error al obtener los datos:", error);
          }
        };
  
        toast.promise(promise(), {
          loading: "Cargando datos de las citas...",
          error: "Error al obtener los datos de las citas",
        });
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }
  
    fetchData();
  }, []);
  

  const filteredAppointments = Array.isArray(appointmentData)
    ? appointmentData.filter(
        (cita) =>
          moment(cita.Fecha)
            .format("YYYY-MM-DD")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          getClientName(cita.ClienteID)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          getEmployeeName(cita.EmpleadoID)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          getServiceName(cita.ServicioID)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  function getClientName(clientID) {
    const client = clientsData.find((client) => client.ClienteID === clientID);
    if (client) {
      return `${client.Nombre} ${client.Apellido}`;
    } else {
      console.log("Cliente no encontrado para el ID:", clientID);
      return "";
    }
  }

  function getEmployeeName(employeeID) {
    const employee = employeesData.find((emp) => emp.EmpleadoID === employeeID);
    return employee ? `${employee.Nombre} ${employee.Apellido}` : "";
  }

  function getServiceName(serviceID) {
    const service = serviceData.find(
      (service) => service.ServicioID === serviceID
    );
    return service ? service.Nombre : "";
  }

  return (
    <div className="appointment-table-container">
      <Toaster />

      <div className="action-button-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table className="appointment-table">
        <thead className="appointment-table-header">
          <tr className="appointment-table-row">
            <th className="appointment-table-heading">ID de Cita</th>
            <th className="appointment-table-heading">Cliente</th>
            <th className="appointment-table-heading">Empleado</th>
            <th className="appointment-table-heading">Servicio</th>
            <th className="appointment-table-heading">Fecha</th>
            <th className="appointment-table-heading">Hora de inicio</th>
            <th className="appointment-table-heading">Hora de fin</th>
          </tr>
        </thead>
        <tbody className="appointment-table-body">
          {currentItems.map((cita) => (
            <tr key={cita.CitaID} className="appointment-table-row">
              <td className="appointment-table-cell">{cita.CitaID}</td>
              <td className="appointment-table-cell">
                {getClientName(cita.ClienteID)}
              </td>
              <td className="appointment-table-cell">
                {getEmployeeName(cita.EmpleadoID)}
              </td>
              <td className="appointment-table-cell">
                {getServiceName(cita.ServicioID)}
              </td>
              <td className="appointment-table-cell">
                {moment(cita.Fecha).format("YYYY-MM-DD")}
              </td>
              <td className="appointment-table-cell">{cita.HoraInicio}</td>
              <td className="appointment-table-cell">{cita.HoraFin}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="appointment-pagination">
        <button
          className="pagination-button"
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
        >
          |«
        </button>
        <button
          className="pagination-button"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          «
        </button>
        <span className="pagination-page-info">Página {currentPage}</span>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          »
        </button>
        <button
          className="pagination-button"
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
        >
          »|
        </button>
      </div>
    </div>
  );
};

export default AppointmentTable;
