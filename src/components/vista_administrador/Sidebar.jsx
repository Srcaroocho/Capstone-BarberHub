import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/sidebar.css";

const Sidebar = ({ onCambioComponente }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accesToken");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img
          src="/images/logo_barberhub.svg"
          alt="Logo"
          className="sidebar-logo"
        />
        <span className="sidebar-text">BarberHub</span>
      </div>
      <div className="button-container">
        <button onClick={() => onCambioComponente("GeneralDashboard")}>
          <img
            src="/images/overview_icon.png"
            alt="icon"
            className="sidebar-icon"
          />
          <span className="button-label">General</span>
        </button>
        <button onClick={() => onCambioComponente("EmployeeTable")}>
          <img
            src="/images/employee_icon.png"
            alt="icon"
            className="sidebar-icon"
          />
          <span className="button-label">Empleados</span>
        </button>
        <button onClick={() => onCambioComponente("EmployeeSchedule")}>
          <img
            src="/images/shifts_icon.png"
            alt="icon"
            className="sidebar-icon"
          />
          <span className="button-label">Turnos</span>
        </button>
        <button onClick={() => onCambioComponente("ServiceAssignment")}>
          <img
            src="/images/scissors_icon.png"
            alt="icon"
            className="sidebar-icon"
          />
          <span className="button-label">Servicios</span>
        </button>
        <button onClick={() => onCambioComponente("ClientTable")}>
          <img
            src="/images/clients_icon.png"
            alt="icon"
            className="sidebar-icon"
          />
          <span className="button-label">Clientes</span>
        </button>
        <button onClick={() => onCambioComponente("AppointmentTable")}>
          <img
            src="/images/appointment_icon.png"
            alt="icon"
            className="sidebar-icon"
          />
          <span className="button-label">Citas</span>
        </button>
      </div>
      <div>
        <button onClick={handleLogout}>
          <img
            src="/images/log_out_icon.png"
            alt="icon"
            className="sidebar-icon"
          />
          <span className="button-label">Salir</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
