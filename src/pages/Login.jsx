import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  authenticateUser,
  resetPassword,
  registerUser,
} from "../api/apiService";
import { jwtDecode } from "jwt-decode";
import Lottie from "react-lottie";
import { Toaster, toast } from "sonner";
import animationData from "../animations/load_animation.json";
import "../styles/login.css";

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignIn, setisSignIn] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const navigate = useNavigate();

  const handleRegisterClick = async (event) => {
    event.preventDefault();
    setisSignIn(true);
    const userData = {
      contrasena: registerPassword,
      p_nombre: nombre,
      p_apellido: apellido,
      p_telefono: telefono,
      p_email: registerEmail,
      p_rol_id: 1,
    };

    const registrationResult = await registerUser(userData);

    setisSignIn(false);

    if (registrationResult) {
      console.log("Usuario registrado con éxito.", registrationResult);
      toast.success("Usuario registrado con éxito");
      // Puedes redirigir al usuario a otra página o mostrar un mensaje de éxito
    } else {
      console.error("Fallo en el registro.");
      toast.error("Hubo un error al registrar el usuario");
      // Muestra una alerta al usuario indicando que hubo un error en el registro
    }
  };

  const handleRegisterButtonClick = (event) => {
    event.preventDefault();
    setIsActive(true);
    // Aquí puedes agregar el código para desplazar a la sección de registro
  };

  const handleLoginClick = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true);

    const response = await authenticateUser(loginEmail, loginPassword);
    if (response) {
      console.log("Usuario autenticado con éxito. Token:", response);
    } else {
      console.error("Fallo de autenticación");
      toast.error(
        "Error al iniciar sesión. Verifica tu correo electrónico y contraseña."
      );
    }
    const token = localStorage.getItem("accesToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      if (decodedToken && decodedToken.RolID === 1) {
        navigate("/cliente");
      } else if (decodedToken && decodedToken.RolID === 2) {
        navigate("/empleado");
      } else if (decodedToken && decodedToken.RolID === 3) {
        navigate("/admin");
      } else {
        // Otra lógica si el RolID no coincide con ninguno de los casos anteriores
      }
    } else {
      console.error("Token no encontrado en localStorage");
    }

    setShowNewForm(false);
    setIsActive(false);
    setIsLoggingIn(false);
  };

  const handleBackToLoginClick = (event) => {
    event.preventDefault();
    setIsActive(false);
    setShowNewForm(false);
  };

  const handleForgotPasswordClick = () => {
    setShowNewForm(true);
  };

  const handleResetPasswordClick = async (event) => {
    event.preventDefault();

    const resetSuccess = await resetPassword(loginEmail);

    if (resetSuccess) {
      console.log(
        "Contraseña restablecida con éxito. Se ha enviado un correo de confirmación."
      );
      toast.success("Se ha enviado un correo para restablecer la contraseña");
    } else {
      console.error("Fallo al restablecer la contraseña.");
      toast.error("El email ingresado no es valido");
    }
  };

  return (
    <div className="main-login">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        <Toaster />
        <div className="form-container sign-up">
          <form>
            <h1>Crea tu cuenta</h1>
            <div className="name-fields">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
            <input
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <input type="password" placeholder="Confirmar contraseña" />
            {isSignIn && (
              <div className="lottie-container-register">
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  height={150}
                  width={150}
                />
              </div>
            )}
            <button onClick={handleRegisterClick}>Registrarse</button>
          </form>
        </div>

        <div className="form-container sign-in">
          {!showNewForm && (
            <form>
              <img src="/images/logo_barberhub.svg" alt="Logo BarberHub" />
              <h1 className="sign-in-tittle">BarberHub</h1>
              <span>Por favor, introduce tus datos</span>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              {isLoggingIn && (
                <div className="lottie-container">
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: animationData,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice",
                      },
                    }}
                    height={150}
                    width={150}
                  />
                </div>
              )}
              <a onClick={handleForgotPasswordClick}>
                ¿Olvidaste tu contraseña?
              </a>
              <button type="submit" onClick={handleLoginClick}>
                Iniciar sesión
              </button>
            </form>
          )}

          {showNewForm && (
            <div className="form-container recovery-password">
              <form>
                <a href="#" onClick={handleBackToLoginClick}>
                  Volver
                </a>
                <h1>Recuperar contraseña</h1>
                <span>
                  Por favor, introduce el email con el que estás registrado
                </span>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <button onClick={handleResetPasswordClick}>Enviar</button>
              </form>
            </div>
          )}
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 className="toggle-panel-left-tittle">¿Ya tienes cuenta?</h1>
              <p>
                Para regresar, haz clic en el botón que se encuentra más abajo
              </p>
              <button
                className="hidden"
                id="login"
                onClick={handleBackToLoginClick}
              >
                Ir a inicio de sesión
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="toggle-panel-tittle">Hola!</h1>
              <p>
                ¿Aún no tienes cuenta? Regístrate haciendo clic en el botón que
                se encuentra más abajo
              </p>
              <button
                className="hidden"
                id="register"
                onClick={handleRegisterButtonClick}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
