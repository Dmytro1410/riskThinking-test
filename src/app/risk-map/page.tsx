"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import RiskGradient from "../../components/riskGradient";
import { getFilteredList } from "../../utils";
import dataSet from "../api/data.json";
import { useFilterContext } from "../store/context";
import "./styles.css";

const MapComponent = dynamic(() => import("../../components/map"), {
  loading: () => <p>Loading...</p>,
});

export default function RiskMap() {
  const list = dataSet;

  const { filter } = useFilterContext();

  const filteredList = useMemo(
    () => getFilteredList({ list, value: filter.year, fieldName: "year" }),
    [filter, list]
  );

  return (
    <div className="map-container">
      <div className="map-content">
        <MapComponent points={filteredList} />
      </div>
      <div className="risk-gradient-container">
        <RiskGradient />
      </div>
    </div>
  );
}
