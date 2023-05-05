import ClearIcon from "@mui/icons-material/Clear";
import { Checkbox, IconButton, ListItemText } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { size } from "lodash";
import React from "react";
import "./styles.css";

export default function SelectComponent({
  source,
  title,
  onSelect,
  multiple,
  defaultValue,
  value,
}: IProps) {
  const handleChange = (event: SelectChangeEvent | null) => {
    onSelect && onSelect(event?.target.value || defaultValue);
  };

  return (
    <div className="select-container">
      <FormControl sx={{ m: 1, minWidth: 200, maxWidth: 200 }} size="small">
        <InputLabel id="select-component-label">{title}</InputLabel>
        <Select
          labelId="select-component-label"
          id="select-component"
          value={value}
          multiple={multiple}
          label="Decade"
          renderValue={(selected) =>
            multiple ? selected.join(", ") : selected
          }
          onChange={handleChange}
        >
          {size(source) &&
            source.map((item) => (
              <MenuItem key={item.label} value={item.value}>
                {multiple && (
                  <Checkbox checked={value?.indexOf(item.value) > -1} />
                )}
                <ListItemText primary={item.label} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {multiple && (
        <IconButton size="small" onClick={() => handleChange(null)}>
          <ClearIcon />
        </IconButton>
      )}
    </div>
  );
}

interface IProps {
  readonly value: string | number | string[];
  readonly defaultValue: string | number | string[];
  readonly multiple?: boolean;
  readonly source: { label: string; value: string | number }[];
  readonly title: string;
  readonly onSelect: (value: string | number | string[]) => void;
}
