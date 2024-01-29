import React from "react";
import { useNavigate } from 'react-router-dom';
import "../vista_cliente/styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleSalir = () => {
    // Borrar el token de autenticación del localStorage
    localStorage.removeItem("accesToken");

    // Redirigir al usuario a la página de inicio de sesión
    navigate('/login');
  };

  const handleNotificaciones = () => {
    // Lógica para manejar notificaciones
    console.log("Notificaciones");
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <button className="btn-salir" onClick={handleSalir}>
            <img className="icon-salir" src="/images/log_out_icon.png" alt="Icono Salir" /> Salir
          </button>
        </li>
        <li>
          <img className="logo-barber-hub" src="/images/logo_barberhub.svg" alt="Logo BarberHub" />
        </li>
        <li>
          <button className="btn-notificaciones" onClick={handleNotificaciones}>
            <img className="icon-notificaciones" src="/images/notifications_icon.png" alt="Icono Notificaciones" /> Notificaciones
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
