"use client";

import { DataGrid, GridColumnGroupingModel } from "@mui/x-data-grid";
import { flatten, uniq } from "lodash";
import * as React from "react";
import { useMemo } from "react";
import { columnGroupingModel, dataTableColumns } from "./settings";
import "./styles.css";

export default function DataTableComponent({ list }) {
  const listWithIds = useMemo(
    () => list.map((item, index) => ({ id: index, ...item })),
    [list]
  );

  const riskFactors = useMemo(
    () => uniq(flatten(list.map((item) => Object.keys(item.riskFactors)))),
    [list]
  );

  return (
    <div className="data-table-container">
      <DataGrid
        columns={dataTableColumns(riskFactors)}
        disableColumnSelector
        disableRowSelectionOnClick
        rows={listWithIds}
        rowSelection={false}
        showCellVerticalBorder
        columnGroupingModel={
          columnGroupingModel(riskFactors) as GridColumnGroupingModel
        }
        experimentalFeatures={{ columnGrouping: true }}
      />
    </div>
  );
}
