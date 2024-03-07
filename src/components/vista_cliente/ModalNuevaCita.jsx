import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import animationData from "../../animations/load_animation.json";
import "../vista_cliente/styles/modalnuevacita.css";
import CatalogoCortesHombre from "./CatalogoCortesHombre";
import CatalogoCortesMujer from "./CatalogoCortesMujer";
import {
  fetchEmployeesService,
  fetchServiceData,
  addAppointmentData,
} from "../../api/apiService";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from "sonner";
import noneImage from "./catalogo/none/none.png"; // Importa la imagen "none.png"

const ModalNuevaCita = ({ slotInfo, onClose, selectedPeluquero, refreshAppointments  }) => {
  const [employeeServices, setEmployeeServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedHaircut, setSelectedHaircut] = useState(null);
  const [showCatalogHombre, setShowCatalogHombre] = useState(false);
  const [showCatalogMujer, setShowCatalogMujer] = useState(false);
  const [hasIdea, setHasIdea] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);
  const [p_Email, setPEmail] = useState(null);
  const [clienteID, setClienteID] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedPeluquero) {
        try {
          const services = await fetchEmployeesService(selectedPeluquero);
          const serviceDataArray = await Promise.all(
            services.map(async (service) => fetchServiceData(service.ServicioID))
          );
          setEmployeeServices(serviceDataArray);
          setLoading(false);
        } catch (error) {
          console.error("Error al obtener los servicios del empleado:", error);
        }
      }

      const accessToken = localStorage.getItem("accesToken");
      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          if (decodedToken) {
            const { Email, ClienteID } = decodedToken;
            if (Email) setPEmail(Email);
            if (ClienteID) setClienteID(ClienteID);
          }
        } catch (error) {
          console.error("Error al decodificar el token:", error);
        }
      } else {
        console.error("accessToken no encontrado en el localStorage.");
      }
    };

    fetchData();
  }, [selectedPeluquero]);

  const handleServiceSelection = (service) => setSelectedService(service);
  const handleHasIdea = (hasIdea) => setHasIdea(hasIdea);
  const handleUploadImage = (shouldUpload) => setUploadImage(shouldUpload);
  const handleImageSelect = (haircut) => setSelectedHaircut(haircut);
  const handleImageChange = (e) => setUploadedImage(e.target.files[0]);

  const getImageToUse = () => {
    if (uploadImage) {
      return uploadedImage;
    } else {
      return selectedHaircut;
    }
  };

  const handleSchedule = async () => {
    try {
      let imageToUse = getImageToUse();

      if (!hasIdea && !uploadImage) {
        const response = await fetch(noneImage); // Utiliza la imagen "none.png"
        const blob = await response.blob();
        imageToUse = new File([blob], "none.png", {
          type: "image/png",
        });
      } else if (typeof imageToUse === "string") {
        const response = await fetch(imageToUse);
        const blob = await response.blob();
        imageToUse = new File([blob], "haircut_image.png", {
          type: "image/png",
        });
      }

      const newAppointmentData = {
        p_Fecha: slotInfo.date || "",
        p_HoraEntrada: slotInfo.start.toLocaleTimeString(),
        p_HoraSalida: slotInfo.end.toLocaleTimeString(),
        p_Estado: 'Pendiente',
        p_ImagenCorte: imageToUse,
        p_clienteID: clienteID,
        p_empleadoID: selectedPeluquero,
        p_servicioID: selectedService.ServicioID,
        p_email: p_Email || "",
      };

      console.log("Datos de la cita:", newAppointmentData);

      await addAppointmentData(newAppointmentData);
      
      toast.success("Cita creada con éxito");

      refreshAppointments();


      onClose();
    } catch (error) {
      console.error("Error al crear la cita:", error);
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
        <div className="modal-close">
          <button className="btn-cerrar" onClick={onClose}>
            x
          </button>
        </div>
        <h2 className="titulo-modal-nueva-cita-cliente">Agendar nueva cita</h2>
        <p className="detalle-horario-seleccionado">
          Horario seleccionado: {slotInfo.start.toLocaleTimeString()} -{" "}
          {slotInfo.end.toLocaleTimeString()}
        </p>
        {loading ? (
          <div className="loading-animation">
            <Lottie options={{ animationData }} width="300px" height="300px" />
          </div>
        ) : (
          <>
            {employeeServices.length > 0 && (
              <div>
                <h3>Seleccione un servicio ofrecido por el empleado:</h3>
                <div className="servicios-empleado">
                  {employeeServices.map((service, index) => (
                    <button
                      key={index}
                      onClick={() => handleServiceSelection(service)}
                      className={`btn-servicio-empleado ${
                        selectedService === service ? "selected" : ""
                      }`}
                    >
                      {service.Nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {!loading && (
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
        )}
        {!loading && hasIdea && (
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
        {!loading && hasIdea && uploadImage && (
          <div>
            <label htmlFor="imageUpload">Subir una imagen:</label>
            <input
              type="file"
              accept="image/*"
              id="imageUpload"
              onChange={handleImageChange}
            />
          </div>
        )}
        {!loading && hasIdea && !uploadImage && (
          <>
            <div className="btn-catalogo-container">
              <button
                className="btn-ver-catalogo"
                onClick={toggleCatalogHombre}
              >
                Ver catálogo de cortes para hombre
              </button>
              <button className="btn-ver-catalogo" onClick={toggleCatalogMujer}>
                Ver catálogo de cortes para mujer
              </button>
            </div>
          </>
        )}
        {!loading && (
          <div className="catalogo-container">
            {showCatalogHombre && (
              <CatalogoCortesHombre onImageSelect={handleImageSelect} />
            )}
            {showCatalogMujer && (
              <CatalogoCortesMujer onImageSelect={handleImageSelect} />
            )}
          </div>
        )}
        {!loading && (
          <div className="buttons-container">
            <button className="btn-agendar" onClick={handleSchedule}>
              Agendar
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ModalNuevaCita;
