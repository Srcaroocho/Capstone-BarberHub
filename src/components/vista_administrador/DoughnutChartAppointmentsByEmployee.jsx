import React, { useEffect, useRef } from 'react';
import ChartJS from 'chart.js/auto';

function DoughnutChartAppointmentsByEmployee({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new ChartJS(chartRef.current, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={chartRef}/>;
}

export default DoughnutChartAppointmentsByEmployee;
