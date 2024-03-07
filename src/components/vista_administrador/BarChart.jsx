import React, { useEffect, useRef } from 'react';
import ChartJS from 'chart.js/auto';

function BarChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new ChartJS(chartRef.current, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={chartRef}/>;
}

export default BarChart;
