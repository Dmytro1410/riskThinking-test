"use client";

import dynamic from "next/dynamic";
import dataSet from "../api/data.json";
import "./styles.css";

const DataTableComponent = dynamic(() => import("../../components/dataTable"), {
  loading: () => <p>Loading...</p>,
});

export default function RiskDataTable() {
  const list = dataSet;

  return (
    <div className="table-container">
      <DataTableComponent list={list} />
    </div>
  );
}
