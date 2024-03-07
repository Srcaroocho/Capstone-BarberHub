import React, { useState } from "react";
import { updateEmployeeData } from "../../api/apiService";
import "./styles/modal_editar_empleado.css";
import { toast } from "sonner";


function EmployeeEditModal({ employee, isOpen, onClose, onUpdate }) {
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
      Especialidad: specialty
    };
  
    try {
      await updateEmployeeData(updatedEmployee);
      toast.success('Empleado editado exitosamente')
      onClose(); // Cerrar el modal
      onUpdate(); // Llamar a la función onUpdate para actualizar los datos de los empleados
    } catch (error) {
      console.error("Error al actualizar los datos del empleado:", error);
    }
  };
  

  return (
    isOpen && (
      <div className="overlay">
        <div className="modal-edit-empleado">
          <div className="edit-container">
            <h2 className="titulo-modal-add">Editar empleado</h2>

            <span className="close" onClick={onClose}>
              &times;
            </span>
            <form onSubmit={handleSubmit}>
              <div className="edit-input-container">
                <input
                  className="edit-input"
                  placeholder="Nombre"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="edit-input"
                  placeholder="Apellido"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="edit-input-container-2">
                <input
                  className="edit-input"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="edit-input-container-2">
                <select
                  className="edit-input"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                >
                  <option value="">Seleccionar especialidad</option>
                  <option value="Peluquero/a">Peluquero/a</option>
                  <option value="Barbero/a">Barbero/a</option>
                </select>
              </div>
              <div className="edit-input-container-2">
                <button className="edit-button" type="submit">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

export default EmployeeEditModal;
