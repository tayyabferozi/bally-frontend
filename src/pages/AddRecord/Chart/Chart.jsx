import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = [""];

export default function Chart({ actualProd, idealProd }) {
  const options = {
    scales: {
      xAxes: [
        {
          barPercentage: 0.4,
        },
      ],
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Production difference",
      },
    },
  };

  return (
    <Bar
      options={options}
      data={{
        labels,
        datasets: [
          {
            label: "Actual Production",
            data: [actualProd],
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Ideal Production",
            data: [idealProd],
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          {
            label: "Loss",
            data: [idealProd - actualProd],
            backgroundColor: "rgb(255, 99, 132)",
          },
        ],
      }}
    />
  );
}
