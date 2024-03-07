// apiService.js
import axios from "axios";
import { url } from "../enviroment";

// Función para autenticación CHECK

async function authenticateUser(username, password) {
  try {
    console.log(username, password);

    const response = await axios.post(`${url}/api/v1/auth/signin`, {
      correo: username,
      contrasena: password,
    });
    if (response.status === 200 && response.data) {
      localStorage.setItem("accesToken", response.data.accesToken);
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    // Manejar errores de la solicitud (por ejemplo, problemas de red)
    console.error("Error de autenticación:", error);
    return null;
  }
}

export { authenticateUser };

// Función para reestablecer contraseña CHECK

async function resetPassword(email) {
  try {
    // Expresión regular para validar el formato del email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificar si el email coincide con el formato esperado
    if (!emailPattern.test(email)) {
      console.error("El email proporcionado no es válido.");
      return false;
    }

    console.log(email);

    const response = await axios.post(`${url}/api/v1/auth/resetpassword`, {
      correo: email,
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    return false;
  }
}

export { resetPassword };

// Función para registrar usuario CHECK

async function registerUser(userData) {
  try {
    const response = await axios.post(
      `${url}/api/v1/cliente/registerCliente`,
      userData
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    // Manejar errores de la solicitud (por ejemplo, problemas de red)
    console.error("Error de registro:", error);
    return null;
  }
}
export { registerUser };

// Función para obtener los datos de los empleados CHECK

async function fetchEmployeesData() {
  try {
    const response = await axios.get(`${url}/api/v1/empleado`);

    if (!response.data) {
      throw new Error("Error al obtener los datos");
    }

    const jsonData = response.data;
    console.log("Datos recibidos de la API:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error al obtener los datos de los empleados:", error);
    throw error;
  }
}

export { fetchEmployeesData };

// Función para obtener los datos de los clientes CHECK

async function fetchClientsData() {
  try {
    const response = await axios.get(`${url}/api/v1/cliente`);

    if (!response.data) {
      throw new Error("Error al obtener los datos");
    }

    const jsonData = response.data;
    console.log("Datos recibidos de la API de clientes:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error al obtener los datos de los clientes:", error);
    throw error;
  }
}

export { fetchClientsData };

// Función para actualizar los datos de un empleado CHECK

async function updateEmployeeData(updatedEmployee) {
  const dataToSend = {
    p_nombre: updatedEmployee.Nombre,
    p_apellido: updatedEmployee.Apellido,
    p_especialidad: updatedEmployee.Especialidad,
    p_rol_id: 2,
    p_email: updatedEmployee.email,
    p_estado: updatedEmployee.estado,
  };

  const response = await axios.patch(
    `${url}/api/v1/empleado/${updatedEmployee.EmpleadoID}`,
    dataToSend
  );

  const empleadoActualizado = response.data?.["se actualizo el empleado"];
  if (!empleadoActualizado) {
    throw new Error("Error al actualizar los datos del empleado");
  }

  console.log("Datos enviados para modificar al empleado:", dataToSend);
  return empleadoActualizado;
}

export { updateEmployeeData };

// Función para borrar un empleado de la API

async function deleteEmployee(employee) {
  console.log("Recibiendo solicitud para borrar al empleado:", employee); // Verificación por consola

  try {
    const response = await axios.delete(`${url}/api/v1/empleado`, {
      data: employee, // Enviar todos los parámetros del empleado
    });

    if (!response.data) {
      throw new Error("Error al borrar al empleado");
    }

    console.log("Empleado borrado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al borrar al empleado:", error);
    throw error;
  }
}

export { deleteEmployee };

// Función para agregar un nuevo empleado CHECK

async function addEmployeeData(newEmployee) {
  try {
    const response = await axios.post(`${url}/api/v1/empleado`, newEmployee);

    // Verificar si la respuesta es exitosa
    if (response.status === 200 || response.status === 201) {
      const jsonData = response.data;
      console.log("Empleado agregado con éxito:", jsonData);
      return jsonData;
    } else {
      throw new Error(
        `Error en la respuesta del servidor: Código de estado ${response.status}`
      );
    }
  } catch (error) {
    // Mejora del manejo de errores
    if (error.response) {
      console.error("Error en la respuesta del servidor:", error.response);
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor:", error.request);
    } else {
      console.error("Error al realizar la petición:", error.message);
    }
    throw error;
  }
}

export { addEmployeeData };

// Funcion para crear turno CHECK

async function addScheduleData(newSchedule) {
  try {
    console.log("Datos que se envían al servidor:", newSchedule);

    const formattedData = {
      EmpleadoID: newSchedule.EmpleadoID,
      Fecha: newSchedule.Fecha,
      HoraEntrada: newSchedule.HoraEntrada,
      HoraSalida: newSchedule.HoraSalida,
      Nombre: newSchedule.Nombre, // Cambiado a "Nombre" para coincidir con la propiedad
    };

    const response = await axios.post(
      `${url}/api/v1/empleado_turno`,
      formattedData
    );

    if (response.status === 200 || response.status === 201) {
      const jsonData = response.data;
      console.log("Turno agregado con éxito:", jsonData);
      return jsonData;
    } else {
      console.error("Error en la respuesta del servidor:", response.data);
      throw new Error(
        `Error en la respuesta del servidor: Código de estado ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error al crear el turno:", error);
    // No es necesario lanzar el error nuevamente aquí
    throw error;
  }
}

export { addScheduleData };

// Función para obtener los turnos de los empleados CHECK

async function fetchEmployeeTurns(employeeID) {
  try {
    const response = await axios.get(
      `${url}/api/v1/empleado_turno/${employeeID}`
    );

    if (!response.data) {
      throw new Error("Error al obtener los datos de los turnos de empleados");
    }

    const jsonData = response.data;
    console.log(
      "Datos de los turnos de empleados recibidos de la API:",
      jsonData
    );
    return jsonData;
  } catch (error) {
    console.error(
      "Error al obtener los datos de los turnos de empleados:",
      error
    );
    throw error;
  }
}

export { fetchEmployeeTurns };

// Función para borrar turnos de los empleados CHECK

async function deleteScheduleData(turnoId) {
  try {
    console.log("Enviando solicitud DELETE para el turno con ID:", turnoId);

    const response = await axios.delete(
      `${url}/api/v1/empleado_turno/${turnoId}`
    );

    if (!response.data) {
      throw new Error("Error al eliminar los datos del turno");
    }

    // Aquí puedes manejar la respuesta o realizar cualquier otra acción que necesites
    console.log("Datos del turno eliminados con éxito:", response.data);
  } catch (error) {
    // Manejar errores en caso de que la solicitud de eliminación falle
    console.error("Error al eliminar los datos del turno:", error);
    throw error;
  }
}

export { deleteScheduleData };

// Función para modificar turnos de los empleados

async function modifyScheduleData(turnoId, newData) {
  try {
    console.log("Enviando solicitud PATCH para el turno con ID:", turnoId);

    const response = await axios.patch(
      `${url}/api/v1/empleado_turno/${turnoId}`,
      newData
    );

    if (!response.data || response.status !== 200) {
      throw new Error("Error al modificar los datos del turno");
    }

    // Los datos actualizados del turno deben estar en response.data
    const turnoActualizado = response.data;

    // Aquí puedes manejar la respuesta o realizar cualquier otra acción que necesites
    console.log("Datos del turno modificados con éxito:", turnoActualizado);
    return turnoActualizado; // Devuelve los datos actualizados del turno
  } catch (error) {
    // Manejar errores en caso de que la solicitud de modificación falle
    console.error("Error al modificar los datos del turno:", error);
    throw error;
  }
}

export { modifyScheduleData };

// Funcion para asignar un servicio a un empleado FUNCIONANDO ¿?

async function assignServiceToEmployee(employeeID, serviceID) {
  try {
    console.log(
      "Datos que se envían al servidor para asignar servicio a empleado:",
      { p_empleadoID: employeeID, p_servicioID: serviceID }
    );

    const formattedData = {
      p_empleadoID: employeeID,
      p_servicioID: serviceID,
    };

    const response = await axios.post(
      `${url}/api/v1/empleado_servicio`,
      formattedData
    );

    if (response.status === 200 || response.status === 201) {
      const jsonData = response.data;
      console.log("Servicio asignado con éxito:", jsonData);
      return jsonData;
    } else {
      console.error("Error en la respuesta del servidor:", response.data);
      throw new Error(
        `Error en la respuesta del servidor: Código de estado ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error al asignar el servicio al empleado:", error);
    throw error;
  }
}

export { assignServiceToEmployee };

// Función para obtener los servicios que ofrece un empleado FUNCIONANDO ¿?

async function fetchEmployeesService(employeeID) {
  try {
    const response = await axios.get(
      `${url}/api/v1/empleado_servicio/${employeeID}`
    );

    if (!response.data) {
      throw new Error("Error al obtener los datos");
    }

    const jsonData = response.data;
    console.log("Datos recibidos de la API:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error al obtener los datos de los empleados:", error);
    throw error;
  }
}

export { fetchEmployeesService };

// Funcion par abtener los datos de un servicio CHECK

async function fetchServiceData(serviceID) {
  try {
    const response = await axios.get(`${url}/api/v1/servicio/${serviceID}`);

    if (!response.data) {
      throw new Error("Error al obtener los datos");
    }

    const jsonData = response.data;
    console.log("Datos recibidos de la API:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error al obtener los datos de los servicios:", error);
    throw error;
  }
}

export { fetchServiceData };

// Funcion para obtener todos los servicios

async function fetchAllService() {
  try {
    const response = await axios.get(`${url}/api/v1/servicio`);

    if (!response.data) {
      throw new Error("Error al obtener los datos");
    }

    const jsonData = response.data;
    console.log("Datos recibidos de la API:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error al obtener los datos de los servicios:", error);
    throw error;
  }
}

export { fetchAllService };

// Función para crear una cita CHECK

async function addAppointmentData(newAppointmentData) {
  const response = await axios.post(`${url}/api/v1/cita`, newAppointmentData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Verificar si la respuesta es exitosa
  if (response.status === 200 || response.status === 201) {
    const jsonData = response.data;
    console.log("Cita creada con éxito:", jsonData);
    return jsonData;
  } else {
    throw new Error(
      `Error en la respuesta del servidor: Código de estado ${response.status}`
    );
  }
}

export { addAppointmentData };

// Función para obtener datos de las citas segun empleado ID

async function fetchEmployeeAppointmentData(employeeID) {
  try {
    const response = await axios.get(`${url}/api/v1/cita/${employeeID}`);

    if (!response.data) {
      throw new Error("Error al obtener los datos");
    }

    const jsonData = response.data;
    console.log("Datos recibidos de la API:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error al obtener los datos de las citas:", error);
    throw error;
  }
}

export { fetchEmployeeAppointmentData };

// Funcion para obtener los datos de todas las citas

async function fetchAppointmentData() {
  try {
    const response = await axios.get(`${url}/api/v1/cita`);

    if (!response.data) {
      throw new Error("Error al obtener los datos");
    }

    const jsonData = response.data;
    return jsonData;
  } catch (error) {
    console.error("Error al obtener los datos de las citas:", error);
    throw error;
  }
}

export { fetchAppointmentData };

// Funcion para actualizar datos de una cita

async function updateAppointmentData(updatedAppointment) {
  const { CitaID, Fecha, p_HoraInicio, p_HoraFin, p_Estado } =
    updatedAppointment;

  const dataToSend = {
    Fecha,
    p_HoraInicio,
    p_HoraFin,
    p_Estado,
  };

  try {
    const response = await axios.patch(
      `${url}/api/v1/cita/${CitaID}`,
      dataToSend
    );

    console.log("Datos enviados para modificar la cita:", dataToSend);
    return response.data; // Devuelve los datos actualizados de la cita
  } catch (error) {
    console.error("Error al actualizar los datos de la cita:", error);
    throw new Error("Error al actualizar los datos de la cita");
  }
}

export { updateAppointmentData };
