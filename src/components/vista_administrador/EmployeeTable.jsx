import React, { useState, useEffect } from "react";
import "./styles/employeetable.css";
import EmployeeEditModal from "./ModalEditarEmpleado";
import EmployeeAddModal from "./ModalAgregarEmpleado";
import {
  fetchEmployeesData,
  addEmployeeData,
  updateEmployeeData,
} from "../../api/apiService";
import { Toaster, toast } from "sonner";

const EmployeeTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const promise = async () => {
        const jsonData = await fetchEmployeesData();
        setEmployeesData(jsonData);
      };

      toast.promise(promise(), {
        loading: "Cargando datos de los empleados...",
        success: () => "Datos recibidos",
        error: "Error al obtener los datos de los empleados",
      });
    } catch (error) {
      console.error("Error al obtener los datos de los empleados:", error);
    }
  };

  const filteredEmployees = employeesData.filter(
    (employee) =>
      employee.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.Apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.Especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
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

  const openAddEmployeeModal = () => {
    setAddModalOpen(true);
  };

  const handleAddEmployee = async (newEmployee) => {
    try {
      const response = await addEmployeeData(newEmployee);

      if (response && response.empleado_id_agregado) {
        console.log("Empleado agregado exitosamente:", response);
        setAddModalOpen(false);
        fetchData(); // Actualizar datos de empleados después de agregar
      } else {
        console.error("Error al agregar el empleado:", response);
      }
    } catch (error) {
      console.error("Error al agregar el empleado:", error);
    }
  };

  const handleCheckboxChange = async (employeeId, currentState) => {
    try {
      const updatedState = !currentState;
      const updatedEmployee = {
        EmpleadoID: employeeId,
        estado: updatedState,
      };

      await updateEmployeeData(updatedEmployee);
      fetchData(); // Actualizar datos de empleados después de cambiar el estado
    } catch (error) {
      console.error("Error al actualizar el estado del empleado:", error);
    }
  };

  return (
    <div className="employee-table-container">
      <Toaster />

      <div className="action-button-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="add-employee-button" onClick={openAddEmployeeModal}>
          Agregar Empleado
        </button>
      </div>
      <table className="employee-table">
        <thead className="employee-table-header">
          <tr className="employee-table-row">
            <th className="employee-table-heading">Nombre</th>
            <th className="employee-table-heading">Apellido</th>
            <th className="employee-table-heading">Email</th>
            <th className="employee-table-heading">Especialidad</th>
            <th className="employee-table-heading">Estado</th>
            <th className="employee-table-heading">Editar</th>
          </tr>
        </thead>
        <tbody className="employee-table-body">
          {currentItems.map((employee) => (
            <tr key={employee.EmpleadoID} className="employee-table-row">
              <td className="employee-table-cell">{employee.Nombre}</td>
              <td className="employee-table-cell">{employee.Apellido}</td>
              <td className="employee-table-cell">{employee.email}</td>
              <td className="employee-table-cell">{employee.Especialidad}</td>
              <td className="employee-table-cell">
                <input
                  className="theme-checkbox"
                  type="checkbox"
                  onChange={() =>
                    handleCheckboxChange(employee.EmpleadoID, employee.Estado)
                  }
                  checked={employee.Estado} // Esto establecerá el estado del checkbox basado en el estado del empleado
                />
              </td>
              <td className="employee-table-cell">
                <div className="edit-field">
                  <button
                    className="table-edit-button"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setEditModalOpen(true);
                    }}
                  >
                    <img
                      src="/images/edit_icon.png"
                      alt="icon"
                      className="edit-icon"
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="employee-pagination">
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

      <EmployeeEditModal
        employee={selectedEmployee}
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={fetchData} // Pasar la función onUpdate que actualiza los datos de los empleados
      />

      <EmployeeAddModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onEmployeeAdded={handleAddEmployee}
        onUpdate={fetchData} // Pasar la función onUpdate que actualiza los datos de los empleados        // Pasar la función para manejar la adición de empleados
      />
    </div>
  );
};

export default EmployeeTable;
