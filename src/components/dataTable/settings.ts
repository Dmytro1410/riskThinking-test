import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { startCase } from "lodash";

const mainDataColumns = [
  { field: "assetName", headerName: "Asset Name", flex: 1.5 },
  { field: "lat", headerName: "Lat", flex: 1.25 },
  { field: "lng", headerName: "Lng", flex: 1.25 },
  { field: "businessCategory", headerName: "Business Category", flex: 1 },
  { field: "riskRating", headerName: "Risk Rating", flex: 0.75 },
  { field: "year", headerName: "Year", flex: 0.75 },
];

export const dataTableColumns = (riskFactors): GridColDef[] =>
  mainDataColumns.concat(
    riskFactors.map((factor) => ({
      field: factor,
      headerName: startCase(factor),
      flex: 0.75,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.riskFactors[factor] > 0
          ? params.row.riskFactors[factor]?.toFixed(2)
          : null,
    }))
  );

export const columnGroupingModel = (riskFactors) => [
  {
    groupId: "mainData",
    headerName: "Main Data",
    headerClassName: "primary-header",
    children: mainDataColumns.map(({ field }) => ({
      field,
    })),
  },
  {
    groupId: "riskFactors",
    headerName: "Risk Factors",
    headerClassName: "primary-header",
    children: riskFactors.map((factor) => ({
      field: factor,
    })),
  },
];
