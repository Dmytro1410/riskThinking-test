"use client";

import { groupBy, keys } from "lodash";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getCalculatedDataset } from "../../utils";
import apiData from "../api/data.json";
import { useFilterContext } from "../store/context";
import "./styles.css";

const RiskChartComponent = dynamic(
  () => import("../../components/risk-chart"),
  {
    loading: () => <p>Loading...</p>,
  }
);

export default function RiskChartPage() {
  const list = apiData;
  const labelFieldName = "year";

  const { filter } = useFilterContext();

  const labels: string[] = useMemo(
    () => keys(groupBy(list, labelFieldName)).sort((a, b) => +a - +b),
    [list]
  );
  const [datasets, setDatasets] = useState<any[]>([]);

  useEffect(() => {
    const { assetName, businessCategory } = filter;
    const filteredDatasets = getCalculatedDataset({
      list,
      labels,
      labelFieldName,
      datasets,
      filter: { assetName, businessCategory },
    });
    setDatasets(filteredDatasets);
  }, [filter, labels, list]);

  return (
    <div className="chart-container">
      <div className="chart-content">
        <RiskChartComponent labels={labels} datasets={datasets} />
      </div>
    </div>
  );
}
