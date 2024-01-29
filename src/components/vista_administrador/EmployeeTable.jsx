import React, { useState, useEffect } from "react";
import "./styles/employeetable.css";
import EmployeeEditModal from "./ModalEditarEmpleado";
import DeleteEmployee from "./ModalEliminarEmpleado";
import EmployeeAddModal from "./ModalAgregarEmpleado";
import { fetchEmployeesData, addEmployeeData } from "../../api/apiService";

const EmployeeTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const itemsPerPage = 9;

  useEffect(() => {
    async function fetchData() {
      try {
        const jsonData = await fetchEmployeesData();
        setEmployeesData(jsonData);
      } catch (error) {
        console.error("Error al obtener los datos de los empleados:", error);
      }
    }
    fetchData();
  }, []);

  const filteredEmployees = Array.isArray(employeesData)
    ? employeesData.filter(
        (empleados) =>
          empleados.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empleados.Apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empleados.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empleados.Especialidad.toLowerCase().includes(
            searchTerm.toLowerCase()
          )
      )
    : [];

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    clearSelections();
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    clearSelections();
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    clearSelections();
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        return prevSelectedItems.filter((item) => item !== id);
      } else {
        return [...prevSelectedItems, id];
      }
    });
  };

  const clearSelections = () => {
    setSelectedItems([]);
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
        const jsonData = await fetchEmployeesData();
        setEmployeesData(jsonData);
      } else {
        console.error("Error al agregar el empleado:", response);
      }
    } catch (error) {
      console.error("Error al agregar el empleado:", error);
    }
  };

  return (
    <div className="employee-table-container">
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
            <th className="employee-table-heading">Editar</th>
          </tr>
        </thead>
        <tbody className="employee-table-body">
          {currentItems.map((empleados) => (
            <tr key={empleados.EmpleadoID} className="employee-table-row">
              <td className="employee-table-cell">{empleados.Nombre}</td>
              <td className="employee-table-cell">{empleados.Apellido}</td>
              <td className="employee-table-cell">{empleados.email}</td>
              <td className="employee-table-cell">{empleados.Especialidad}</td>
              <td className="employee-table-cell">
                <div className="edit-field">
                  <button
                    className="table-edit-button"
                    onClick={() => {
                      setSelectedEmployee(empleados);
                      setEditModalOpen(true);
                    }}
                  >
                    <img
                      src="/images/edit_icon.png"
                      alt="icon"
                      className="edit-icon"
                    />
                  </button>
                  <button
                    className="table-edit-button"
                    onClick={() => {
                      setSelectedEmployee(empleados);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <img
                      src="/images/delete_icon.png"
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
      />
      <DeleteEmployee
        employee={selectedEmployee}
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
      <EmployeeAddModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onEmployeeAdded={fetchEmployeesData}
      />
    </div>
  );
};

export default EmployeeTable;
