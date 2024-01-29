import React, { useState, useEffect } from "react";
import "../vista_cliente/styles/modalnuevacita.css";
import CatalogoCortesHombre from "./CatalogoCortesHombre";
import CatalogoCortesMujer from "./CatalogoCortesMujer";
import { fetchEmployeesService, fetchServiceData, addAppointmentData } from "../../api/apiService";
import {jwtDecode} from "jwt-decode";

function ModalNuevaCita({ slotInfo, onClose, onSchedule, selectedPeluquero }) {
  const [employeeServices, setEmployeeServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCatalogHombre, setShowCatalogHombre] = useState(false);
  const [showCatalogMujer, setShowCatalogMujer] = useState(false);
  const [hasIdea, setHasIdea] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);

  // Estados para los datos necesarios de la cita
  const [p_Fecha, setPFecha] = useState(null);
  const [p_HoraEntrada, setPHoraEntrada] = useState(null);
  const [p_HoraSalida, setPHoraSalida] = useState(null);
  const [p_ImagenCorte, setPImagenCorte] = useState(null);
  const [p_EmpleadoID, setPEmpleadoID] = useState(null);
  const [p_ServicioID, setPServicioID] = useState(null);
  const [p_Email, setPEmail] = useState(null);

  useEffect(() => {
    if (selectedPeluquero) {
      fetchEmployeeServices(selectedPeluquero);

      // Extrae el correo electrónico del cliente del token en el localStorage
      const accesToken = localStorage.getItem("accesToken");

      if (accesToken) {
        const decodedToken = jwtDecode(accesToken);

        // Verifica si el token contiene el campo 'Email'
        if (decodedToken && decodedToken.Email) {
          setPEmail(decodedToken.Email); // Establece el correo electrónico en el estado
        } else {
          console.error("El accessToken no contiene el campo 'Email'.");
        }
      } else {
        console.error("accessToken no encontrado en el localStorage.");
      }
    }
  }, [selectedPeluquero]);

  const fetchEmployeeServices = async (employeeID) => {
    try {
      const services = await fetchEmployeesService(employeeID);
      setEmployeeServices(services);

      if (services && services.length > 0) {
        const serviceDataArray = await Promise.all(
          services.map(async (service) => {
            return await fetchServiceData(service.ServicioID);
          })
        );
        console.log("Detalles de los servicios:", serviceDataArray);
        setEmployeeServices(serviceDataArray);
      }
    } catch (error) {
      console.error("Error al obtener los servicios del empleado:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/png") {
      setSelectedImage(file);
      setPImagenCorte(file); // Guarda la imagen seleccionada
    } else {
      console.error("Por favor, seleccione una imagen PNG.");
    }
  };

  const handleServiceSelection = (service) => {
    setSelectedService(service);
    setPServicioID(service.ServicioID); // Guarda el ServicioID
  };

  const handleHasIdea = (hasIdea) => {
    setHasIdea(hasIdea);
  };

  const handleUploadImage = (shouldUpload) => {
    setUploadImage(shouldUpload);
  };

  const handleImageSelect = (imagen) => {
    setSelectedImage(imagen);
  };

  const handleSchedule = async () => {
    if (selectedService) {
      if (hasIdea && uploadImage && !selectedImage) {
        console.error("Por favor, seleccione una imagen PNG.");
      } else {
        // Asignar los valores necesarios
        setPFecha(slotInfo.date);
        setPHoraEntrada(slotInfo.start.toLocaleTimeString());
        setPHoraSalida(slotInfo.end.toLocaleTimeString());
        setPEmpleadoID(selectedPeluquero);

        // Crear un objeto que contenga los datos de la cita
        const newAppointment = {
          Fecha: p_Fecha,
          HoraEntrada: p_HoraEntrada,
          HoraSalida: p_HoraSalida,
          ImagenCorte: uploadImage,
          EmpleadoID: p_EmpleadoID,
          ServicioID: p_ServicioID,
          Email: p_Email, // El correo electrónico se obtiene del estado
        };

        try {
          const jsonData = await addAppointmentData(newAppointment);
          console.log("Cita creada con éxito:", jsonData);
          onClose();
        } catch (error) {
          console.error("Error al crear la cita:", error);
        }
      }
    } else {
      console.error("Por favor, seleccione un servicio.");
    }
  };

  const toggleCatalogHombre = () => {
    setShowCatalogHombre(!showCatalogHombre);
    setShowCatalogMujer(false);
  };

  const toggleCatalogMujer = () => {
    setShowCatalogMujer(!showCatalogMujer);
    setShowCatalogHombre(false);
  };

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-nueva-cita-cliente">
        {/* Encabezado */}
        <h2>Agendar nueva cita</h2>
        <p className="detalle-horario-seleccionado">
          Horario seleccionado: {slotInfo.start.toLocaleTimeString()} -{" "}
          {slotInfo.end.toLocaleTimeString()}
        </p>

        {/* Servicios */}
        {employeeServices.length > 0 && (
          <div>
            <h3>Servicios ofrecidos por el empleado:</h3>
            <div>
              {employeeServices.map((service, index) => (
                <button
                  key={index}
                  onClick={() => handleServiceSelection(service)}
                  className={selectedService === service ? "selected" : ""}
                >
                  {service.Nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ideas en mente */}
        <div className="idea-options">
          <p>¿Tiene alguna idea en mente?</p>
          <label>
            Sí
            <input
              type="radio"
              value="true"
              checked={hasIdea === true}
              onChange={() => handleHasIdea(true)}
            />
          </label>
          <label>
            No
            <input
              type="radio"
              value="false"
              checked={hasIdea === false}
              onChange={() => handleHasIdea(false)}
            />
          </label>
        </div>

        {/* Subir imagen o elegir corte del catálogo */}
        {hasIdea && (
          <div className="idea-options">
            <p>¿Prefiere subir una imagen o elegir un corte del catálogo?</p>
            <label>
              Subir una imagen
              <input
                type="radio"
                value="true"
                checked={uploadImage === true}
                onChange={() => handleUploadImage(true)}
              />
            </label>
            <label>
              Elegir un corte del catálogo
              <input
                type="radio"
                value="false"
                checked={uploadImage === false}
                onChange={() => handleUploadImage(false)}
              />
            </label>
          </div>
        )}

        {/* Subir imagen */}
        {hasIdea && uploadImage && (
          <div>
            <label htmlFor="imageUpload">Subir una imagen PNG:</label>
            <input
              type="file"
              accept=".png"
              id="imageUpload"
              onChange={handleImageChange}
            />
          </div>
        )}

        {/* Botones para ver catálogo */}
        {hasIdea && (
          <>
            <button className="btn-ver-catalogo" onClick={toggleCatalogHombre}>
              Ver Catálogo de Cortes Hombre
            </button>
            <button className="btn-ver-catalogo" onClick={toggleCatalogMujer}>
              Ver Catálogo de Cortes Mujer
            </button>
          </>
        )}
        <div className="catalogo-container">
          {showCatalogHombre && (
            <CatalogoCortesHombre onImageSelect={handleImageSelect} />
          )}
          {showCatalogMujer && <CatalogoCortesMujer />}
        </div>
        {/* Botones de Cerrar y Agendar */}
        <div className="buttons-container">
          <div>
            <button className="btn-cerrar" onClick={onClose}>
              Cerrar
            </button>
          </div>
          <div>
            <button className="btn-agendar" onClick={handleSchedule}>
              Agendar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalNuevaCita;
