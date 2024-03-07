import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import "../vista_cliente/styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState(""); // Estado para almacenar el nombre de usuario

  useEffect(() => {
    const accessToken = localStorage.getItem("accesToken");
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        if (decodedToken) {
          const { Nombre } = decodedToken;
          if (Nombre) setNombreUsuario(Nombre); // Establece el nombre de usuario en el estado
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    } else {
      console.error("accessToken no encontrado en el localStorage.");
    }
  }, []); // El efecto se ejecuta solo una vez al montar el componente

  const handleSalir = () => {
    // Borrar el token de autenticación del localStorage
    localStorage.removeItem("accesToken");

    // Redirigir al usuario a la página de inicio de sesión
    navigate('/login');
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
        <li className="bienvenida">
          Hola, {nombreUsuario} {/* Muestra el nombre de usuario */}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
