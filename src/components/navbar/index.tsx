"use client";

import MapIcon from "@mui/icons-material/Map";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import { Button, Stack } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dataSet from "../../app/api/data.json";
import { useFilterContext } from "../../app/store/context";
import { getFilterSourceByFieldName } from "../../utils";
import SelectComponent from "../select";
import "./styles.css";

export default function Navbar() {
  const pathname = usePathname();
  const list = dataSet;
  const decadeFieldName = "year";
  const assetFieldName = "assetName";
  const businessCategoryFieldName = "businessCategory";

  const getFilterSource = (filterFieldName) =>
    getFilterSourceByFieldName({
      list,
      filterFieldName,
    });

  const { filter, setFilter } = useFilterContext();

  const handleChangeFilter = ({ value, filterName }) => {
    setFilter({ ...filter, [filterName]: value });
  };
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      className="navbar-container"
    >
      <Stack direction="row" spacing={2}>
        <Link href="/risk-map">
          <Button variant="contained" startIcon={<MapIcon />} size="large">
            Risk Map
          </Button>
        </Link>
        <Link href="/risk-data-table">
          <Button
            variant="contained"
            startIcon={<TableChartIcon />}
            size="large"
          >
            Risk Data Table
          </Button>
        </Link>
        <Link href="/risk-chart">
          <Button
            variant="contained"
            startIcon={<SsidChartIcon />}
            size="large"
          >
            Risk Charts
          </Button>
        </Link>
      </Stack>

      <Stack direction="row" spacing={2}>
        {pathname === "/risk-map" && (
          <SelectComponent
            value={filter[decadeFieldName]}
            title={"Decade"}
            source={getFilterSource(decadeFieldName)}
            onSelect={(value) =>
              handleChangeFilter({ value, filterName: decadeFieldName })
            }
            defaultValue={getFilterSource(decadeFieldName)[0].value}
          />
        )}
        {pathname === "/risk-chart" && (
          <>
            <SelectComponent
              multiple
              value={filter[assetFieldName]}
              defaultValue={[]}
              source={getFilterSource(assetFieldName)}
              title={"Asset Name"}
              onSelect={(value) =>
                handleChangeFilter({ value, filterName: assetFieldName })
              }
            />
            <SelectComponent
              multiple
              value={filter[businessCategoryFieldName]}
              defaultValue={[]}
              source={getFilterSource(businessCategoryFieldName)}
              title={"Business Category"}
              onSelect={(value) =>
                handleChangeFilter({
                  value,
                  filterName: businessCategoryFieldName,
                })
              }
            />
          </>
        )}
      </Stack>
    </Stack>
  );
}
