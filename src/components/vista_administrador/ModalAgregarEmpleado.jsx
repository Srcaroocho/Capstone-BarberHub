import React, { useState } from "react";
import { addEmployeeData } from "../../api/apiService";
import "./styles/modal_agregar_empleado.css";
import { toast } from "sonner";


function EmployeeAddModal({ isOpen, onClose, onEmployeeAdded, onUpdate }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("Peluquero/a");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newEmployee = {
      p_nombre: name,
      p_apellido: lastName,
      p_email: email,
      p_especialidad: specialty,
      p_contrasena: password,
      p_rol_id: 2,
      p_estado: true,
    };
  
    console.log("Datos que se enviarán al servidor:", newEmployee);
  
    try {
      const response = await addEmployeeData(newEmployee);
  
      if (response) {
        toast.success('Empleado agregado exitosamente')
        onEmployeeAdded(newEmployee); // Pasar el nuevo empleado agregado
        onClose();
        onUpdate(); // Llamar a la función onUpdate para actualizar los datos de los empleados
      }
    } catch (error) {
      console.error("Error al agregar el empleado:", error);
    }
  };
  

  return (
    isOpen && (
      <div class="overlay">
        <div class="modal-add-employee">
          <div class="container-info-employee">
            <h2 class="titulo-modal-add">Agregar empleado</h2>
            <span class="close" onClick={onClose}>
              &times;
            </span>
            <form onSubmit={handleSubmit}>
              <div class="add-input-container">
                <input
                  class="add-input"
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  class="add-input"
                  type="text"
                  placeholder="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div class="input-container-2">
                <input
                  class="add-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div class="input-container-2">
                <select
                  class="add-input"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                >
                  <option value="Peluquero/a">Peluquero/a</option>
                  <option value="Barbero/a">Barbero/a</option>
                </select>
              </div>
              <div class="input-container-2">
                <input
                  class="add-input"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div class="input-container-2">
                <button class="add-button" type="submit">
                  Agregar empleado
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

export default EmployeeAddModal;
