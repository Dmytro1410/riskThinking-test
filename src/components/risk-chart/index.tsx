"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import MapPointDescription from "../pointDescription";
import "./styles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function RiskChartComponent({ datasets, labels }: IProps) {
  const tooltipEl = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);

  const externalTooltipHandler = (context) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.current.style.opacity = 0;
      return;
    }
    setTooltipData(tooltip.dataPoints[0].raw);

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.current.style.opacity = 1;
    tooltipEl.current.style.left = positionX + tooltip.caretX + "px";
    tooltipEl.current.style.top = positionY + tooltip.caretY + "px";
    tooltipEl.current.style.font = tooltip.options.bodyFont.string;
    tooltipEl.current.style.padding =
      tooltip.options.padding + "px " + tooltip.options.padding + "px";
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    layout: { padding: 100 },
    maintainAspectRatio: false,
    scales: {
      y: {
        max: 1,
        min: 0,
        ticks: {
          stepSize: 0.1,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Risk Rating",
      },
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
      },
    },
  };

  const chartData = useMemo(
    () => ({
      labels,
      datasets,
    }),
    [labels, datasets]
  );

  return (
    <>
      {datasets.length ? (
        <Line options={chartOptions} data={chartData} />
      ) : (
        <div className="empty-state">
          <h1>Select something to display chart...</h1>
        </div>
      )}
      <div className="tooltip-container" ref={tooltipEl}>
        {tooltipData && <MapPointDescription pointProps={tooltipData} />}
      </div>
    </>
  );
}

interface IProps {
  readonly labels: string[];
  readonly datasets: any[];
}
