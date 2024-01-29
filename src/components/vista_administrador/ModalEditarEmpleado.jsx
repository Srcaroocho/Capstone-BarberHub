import React, { useState } from "react";
import { updateEmployeeData } from "../../api/apiService";
import "./styles/modal_editar_empleado.css";

function EmployeeEditModal({ employee, isOpen, onClose }) {
  const [name, setName] = useState(employee ? employee.Nombre : "");
  const [lastName, setLastName] = useState(employee ? employee.Apellido : "");
  const [email, setEmail] = useState(employee ? employee.email : "");
  const [specialty, setSpecialty] = useState(
    employee ? employee.Especialidad : ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEmployee = {
      ...employee,
      Nombre: name,
      Apellido: lastName,
      email: email,
      Especialidad: specialty,
    };

    try {
      await updateEmployeeData(updatedEmployee);

      onClose();
    } catch (error) {
      console.error("Error al actualizar los datos del empleado:", error);
    }
  };

  return (
    isOpen && (
      <div className="overlay">
        <div className="modal-edit-empleado">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <form onSubmit={handleSubmit}>
            <label className="edit-label">
              Nombre:
              <input
                className="edit-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <br />
            <label className="edit-label">
              Apellido:
              <input
                className="edit-input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <br />
            <label className="edit-label">
              Email:
              <input
                className="edit-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <br />
            <label className="edit-label">
              Especialidad:
              <select
                className="edit-input"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="Peluquero/a">Peluquero/a</option>
                <option value="Barbero/a">Barbero/a</option>
              </select>
            </label>
            <br />
            <button className="edit-button" type="submit">
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    )
  );
}

export default EmployeeEditModal;
