import React, { useState } from 'react';
import { addEmployeeData } from '../../api/apiService';
import './styles/modal_agregar_empleado.css';

function EmployeeAddModal({ isOpen, onClose, onEmployeeAdded }) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('Peluquero/a');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEmployee = {
      p_nombre: name,
      p_apellido: lastName,
      p_email: email,
      p_especialidad: specialty,
      p_contrasena: password,
      p_rol_id: 2,
    };

    // Imprime los datos antes de enviarlos
    console.log('Datos que se enviarán al servidor:', newEmployee);

    try {
      // Llamar a la función para agregar el nuevo empleado en la API
      const response = await addEmployeeData(newEmployee);

      // Comprobar si se agregó el empleado exitosamente en la API
      if (response && response.empleado_id_agregado) {
        console.log('Empleado agregado exitosamente:', response);
        onEmployeeAdded(); // Invocar una función de callback para actualizar la lista de empleados
        onClose();
      } else {
        console.error('Error al agregar el empleado:', response);
      }
    } catch (error) {
      console.error('Error al agregar el empleado:', error);
    }
  };

  return (
    isOpen && (
      <div className="overlay">
        <div className="modal-add-employee">
          <h2 className='titulo-modal-add'>Agregar empleado</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <form onSubmit={handleSubmit}>
            <label className="add-label">
              Nombre:
              <input
                className="add-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <br />
            <label className="add-label">
              Apellido:
              <input
                className="add-input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
            <br />
            <label className="add-label">
              Email:
              <input
                className="add-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <br />
            <label className="add-label">
              Especialidad:
              <select
                className="add-input"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
              >
                <option value="Peluquero/a">Peluquero/a</option>
                <option value="Barbero/a">Barbero/a</option>
              </select>
            </label>
            <br />
            <label className="add-label">
              Contraseña:
              <input
                className="add-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <br />
            <button className="add-button" type="submit">
              Agregar Empleado
            </button>
          </form>
        </div>
      </div>
    )
  );
}

export default EmployeeAddModal;
