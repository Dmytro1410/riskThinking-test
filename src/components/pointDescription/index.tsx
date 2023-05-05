import { startCase } from "lodash";
import React from "react";
import { TPoint } from "../../models/map";
import "./styles.css";

export default function MapPointDescription({
  pointProps,
}: {
  pointProps: TPoint & { riskFactors: string; title?: string };
}) {
  const riskFactors: {
    [x: string]: number;
  } =
    typeof pointProps.riskFactors === "string"
      ? JSON.parse(pointProps.riskFactors)
      : pointProps.riskFactors;

  const parsedRiskFactors: { label: string; value: number }[] = Object.keys(
    riskFactors
  ).map((factorKey) => ({
    label: startCase(factorKey),
    value: riskFactors[factorKey],
  }));

  return (
    <div>
      {pointProps.assetName && (
        <div>
          <span className="list-title">Asset Name: </span>
          {pointProps.assetName}
        </div>
      )}
      {pointProps.businessCategory && (
        <div>
          <span className="list-title">Business Category: </span>
          {pointProps.businessCategory}
        </div>
      )}
      {pointProps.title && (
        <div>
          <span className="list-title">Business Category: </span>
          {pointProps.title}
        </div>
      )}
      <div>
        <span className="list-title">Risk Rating: </span>
        {pointProps.riskRating}
      </div>
      <ul>
        <span className="list-title">Risk Factors: </span>
        {parsedRiskFactors.map(
          (factor) =>
            factor.value > 0 && (
              <li key={factor.label} className="list-item">
                <span className="list-title">{factor.label}: </span>
                {factor.value.toFixed(2)}
              </li>
            )
        )}
      </ul>
      <div>
        <span className="list-title">Year: </span>
        {pointProps.year}
      </div>
    </div>
  );
}
