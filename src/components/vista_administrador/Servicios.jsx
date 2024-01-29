import React, { useState, useEffect } from "react";
import { assignServiceToEmployee as assignService, fetchEmployeesData } from "../../api/apiService";
import "./styles/servicios.css";

const ServiceAssignment = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [employeesData, setEmployeesData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");

  // Mapeo de nombres de servicios a valores internos
  const serviceValueMapping = {
    "Corte para hombre": 1,
    "Corte para mujer": 2,
    // Agrega otros servicios y sus valores aquí
  };

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const jsonData = await fetchEmployeesData();
        setEmployeesData(jsonData);
      } catch (error) {
        console.error("Error al obtener los datos de empleados:", error);
      }
    }

    // Simulación de datos de servicios
    const simulatedServicesData = [
      { name: "Corte para hombre" },
      { name: "Corte para mujer" },
      // Agrega otros servicios aquí
    ];
    setServicesData(simulatedServicesData);

    fetchEmployees();
  }, []);

  const handleAssignServiceToEmployee = async () => {
    if (selectedEmployee && selectedService) {
      // Obtén el valor interno del servicio seleccionado
      const serviceValue = serviceValueMapping[selectedService];

      try {
        // Envía el valor interno del servicio a la API
        const response = await assignService(selectedEmployee, serviceValue);

        if (response) {
          console.log("Servicio asignado con éxito:", response);
          // Puedes realizar acciones adicionales después de asignar el servicio si es necesario
        }
      } catch (error) {
        console.error("Error al asignar el servicio al empleado:", error);
      }
    } else {
      console.error("Debe seleccionar un empleado y un servicio.");
    }
  };

  useEffect(() => {
    const selectedEmployeeData = employeesData.find((employee) => employee.id === selectedEmployee);
    if (selectedEmployeeData) {
      setEmployeeName(`${selectedEmployeeData.Nombre} ${selectedEmployeeData.Apellido}`);
    } else {
      setEmployeeName("");
    }
  }, [selectedEmployee, employeesData]);

  return (
    <div>
      <h1>Asignación de Servicios a Empleados</h1>
      <div className="employee-selector">
        <label htmlFor="employee-select">Seleccionar empleado:</label>
        <select
          id="employee-select"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Seleccione un empleado</option>
          {/* Mapea correctamente los empleados para mostrar el nombre y la especialidad */}
          {employeesData.map((employee) => (
            <option key={employee.EmpleadoID} value={employee.EmpleadoID}>
              {`${employee.Nombre} ${employee.Apellido}`}
            </option>
          ))}
        </select>
      </div>

      {/* Muestra el nombre del empleado seleccionado */}
      {employeeName && <h2>Empleado seleccionado: {employeeName}</h2>}

      <div className="service-selector">
        <label htmlFor="service-select">Seleccionar servicio:</label>
        <select
          id="service-select"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">Seleccione un servicio</option>
          {/* Mapea correctamente los servicios con la prop "key" */}
          {servicesData.map((service, index) => (
            <option key={`${service.name}-${index}`} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAssignServiceToEmployee}>Asignar Servicio</button>
    </div>
  );
};

export default ServiceAssignment;
