import React from "react";
import { deleteEmployee } from "../../api/apiService";
import "./styles/modal_eliminar_empleado.css";

function EmployeeDeleteModal({ employee, isOpen, onClose, onDelete }) {
  const handleDelete = async () => {
    try {
      if (employee && employee.email) {
        // Asegurarse de que el correo electrónico del empleado está disponible
        await deleteEmployee(employee.email);
        onDelete();
        onClose();
      } else {
        console.error("No se proporcionó el correo del empleado");
      }
    } catch (error) {
      console.error("Error al borrar al empleado:", error);
    }
  };

  return (
    isOpen && (
      <div className="overlay">
        <div className="modal-delete-employee">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          {employee ? (
            <>
              <p className="employee-delete-message">
                ¿Estás seguro de que deseas borrar al empleado {employee.Nombre}{" "}
                {employee.Apellido}?
              </p>
              <div className="employee-delete-buttons">
                <button className="modal-delete-button" onClick={handleDelete}>
                  Sí, borrar
                </button>
                <button className="modal-cancel-button" onClick={onClose}>
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <p className="no-employee-selected">
              No se ha seleccionado ningún empleado para borrar.
            </p>
          )}
        </div>
      </div>
    )
  );
}

export default EmployeeDeleteModal;
