import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController, // Importa BarController para gráficos de barras
  DoughnutController, // Usa DoughnutController para gráficos de rosquilla
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registro de componentes necesarios de Chart.js, incluyendo BarController y DoughnutController
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController, // Registra el BarController aquí
  DoughnutController, // Registra el DoughnutController para gráficos de rosquilla
  ArcElement,
  Tooltip,
  Legend
);

function GeneralDashboard() {
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);

  // Datos para el gráfico de barras (Citas por día)
  const appointmentsByDayData = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    datasets: [{
      label: 'Citas por día',
      data: [12, 19, 3, 5, 2], // Asegúrate de que la longitud de 'data' coincida con 'labels'
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };

  // Datos para el gráfico de rosquilla (Citas por hora)
  const appointmentsByHourData = {
    labels: ['9am', '10am', '11am', '12pm', '1pm'],
    datasets: [{
      label: 'Citas por hora',
      data: [5, 10, 4, 2, 7],
      backgroundColor: [
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgba(255, 205, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 1
    }]
  };

  useEffect(() => {
    // Creación del gráfico de barras
    const chart1 = new ChartJS(chart1Ref.current, {
      type: 'bar',
      data: appointmentsByDayData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Creación del gráfico de rosquilla
    const chart2 = new ChartJS(chart2Ref.current, {
      type: 'doughnut',
      data: appointmentsByHourData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    // Limpieza para destruir las instancias del gráfico y evitar el error "Canvas is already in use"
    return () => {
      chart1.destroy();
      chart2.destroy();
    };
  }, []); // Los corchetes vacíos indican que este efecto no depende de ninguna prop o estado, por lo que solo se ejecuta una vez

  return (
    <div className="dashboard">
      <div style={{ width: '400px', height: '400px' }}>
        <canvas ref={chart1Ref} />
      </div>
      <div style={{ width: '400px', height: '400px' }}>
        <canvas ref={chart2Ref} />
      </div>
    </div>
  );
}

export default GeneralDashboard;
