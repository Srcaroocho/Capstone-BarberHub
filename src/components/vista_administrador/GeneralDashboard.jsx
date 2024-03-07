import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import BarChartAppointmentsByService from "./BarChartAppointmentsByService";
import DoughnutChartAppointmentsByEmployee from "./DoughnutChartAppointmentsByEmployee";
import "./styles/general_dashboard.css";
import {
  fetchEmployeesData,
  fetchAppointmentData,
  fetchAllService,
} from "../../api/apiService";
import moment from "moment";
import Lottie from "react-lottie";
import animationData from "../../animations/load_animation.json";

const GeneralDashboard = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [employees, appointments, services] = await Promise.all([
          fetchEmployeesData(),
          fetchAppointmentData(),
          fetchAllService(),
        ]);
        setEmployeesData(employees);
        setAppointmentData(appointments);
        setServiceData(services);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading && !animationComplete) {
        setAnimationComplete(true);
      }
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [loading, animationComplete]);

  if (loading || !animationComplete) {
    return (
      <div className="loading-animation">
        <Lottie
          options={{
            animationData,
            loop: true,
            autoplay: true,
          }}
          width="300px"
          height="300px"
        />
      </div>
    );
  }

  const appointmentCountByEmployee = {};
  appointmentData.forEach((appointment) => {
    const { EmpleadoID } = appointment;
    appointmentCountByEmployee[EmpleadoID] = (appointmentCountByEmployee[EmpleadoID] || 0) + 1;
  });

  const appointmentsByEmployeeData = {
    labels: employeesData.map(
      (employee) => `${employee.Nombre} ${employee.Apellido}`
    ),
    datasets: [
      {
        label: "Citas por empleado",
        data: employeesData.map(
          (employee) => appointmentCountByEmployee[employee.EmpleadoID] || 0
        ),
        backgroundColor: generateUniqueColors(employeesData.length),
        borderWidth: 0,
      },
    ],
  };

  const appointmentCountByService = {};
  appointmentData.forEach((appointment) => {
    const { ServicioID } = appointment;
    appointmentCountByService[ServicioID] = (appointmentCountByService[ServicioID] || 0) + 1;
  });

  const appointmentsByServiceData = {
    labels: serviceData.map((service) => service.Nombre),
    datasets: [
      {
        label: "Citas por servicio",
        data: serviceData.map(
          (service) => appointmentCountByService[service.ServicioID] || 0
        ),
        backgroundColor: generateUniqueColors(serviceData.length),
        borderWidth: 0,
      },
    ],
  };

  const appointmentsByWeekDay = {
    lunes: 0,
    martes: 0,
    miércoles: 0,
    jueves: 0,
    viernes: 0,
    sábado: 0,
    domingo: 0,
  };

  appointmentData.forEach((appointment) => {
    const dayOfWeek = moment(appointment.Fecha).format("dddd").toLowerCase();
    appointmentsByWeekDay[dayOfWeek]++;
  });

  const dayColors = {
    lunes: "rgba(255, 99, 132, 0.2)",
    martes: "rgba(75, 192, 192, 0.2)",
    miércoles: "rgba(54, 162, 235, 0.2)",
    jueves: "rgba(153, 102, 255, 0.2)",
    viernes: "rgba(201, 203, 207, 0.2)",
    sábado: "rgba(255, 205, 86, 0.2)",
    domingo: "rgba(255, 159, 64, 0.2)",
  };

  const appointmentsByDayData = {
    labels: [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
    datasets: [
      {
        label: "Citas por día",
        data: Object.values(appointmentsByWeekDay),
        backgroundColor: Object.keys(appointmentsByWeekDay).map(
          (day) => dayColors[day]
        ),
        borderWidth: 0,
      },
    ],
  };

  const hourColors = {
    "9am": "rgba(255, 99, 132, 0.2)",
    "10am": "rgba(75, 192, 192, 0.2)",
    "11am": "rgba(54, 162, 235, 0.2)",
    "12pm": "rgba(153, 102, 255, 0.2)",
    "1pm": "rgba(201, 203, 207, 0.2)",
    "2pm": "rgba(255, 205, 86, 0.2)",
    "3pm": "rgba(255, 159, 64, 0.2)",
    "4pm": "rgba(0, 255, 0, 0.2)",
    "5pm": "rgba(0, 0, 255, 0.2)",
    "6pm": "rgba(255, 0, 255, 0.2)",
    "7pm": "rgba(128, 0, 128, 0.2)",
  };

  const appointmentsByHour = {
    "9am": 0,
    "10am": 0,
    "11am": 0,
    "12pm": 0,
    "1pm": 0,
    "2pm": 0,
    "3pm": 0,
    "4pm": 0,
    "5pm": 0,
    "6pm": 0,
    "7pm": 0,
  };

  appointmentData.forEach((appointment) => {
    const hour = moment(appointment.HoraInicio, "HH:mm").format("ha");
    appointmentsByHour[hour]++;
  });

  const appointmentsByHourData = {
    labels: Object.keys(appointmentsByHour),
    datasets: [
      {
        label: "Citas por hora",
        data: Object.values(appointmentsByHour),
        backgroundColor: Object.keys(appointmentsByHour).map(
          (hour) => hourColors[hour]
        ),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="chart">
        <h2 className="chart-tittle">Citas por día de la semana</h2>
        <BarChart data={appointmentsByDayData} />
      </div>
      <div className="chart">
        <h2 className="chart-tittle">Citas por hora del día</h2>
        <DoughnutChart data={appointmentsByHourData} />
      </div>
      <div className="chart">
        <h2 className="chart-tittle">Citas por servicio</h2>
        <BarChartAppointmentsByService data={appointmentsByServiceData} />
      </div>
      <div className="chart">
        <h2 className="chart-tittle">Citas por empleado</h2>
        <DoughnutChartAppointmentsByEmployee
          data={appointmentsByEmployeeData}
        />
      </div>
    </div>
  );
};

export default GeneralDashboard;

function generateUniqueColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(
      `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.2)`
    );
  }
  return colors;
}
