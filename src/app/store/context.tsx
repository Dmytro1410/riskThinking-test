"use client";

import list from "../api/data.json";
import { createContext, useContext, useState } from "react";
import { getFilterSourceByFieldName } from "../../utils";

const initialState = {
  assetName: [],
  businessCategory: [],
  year: getFilterSourceByFieldName({ list, filterFieldName: "year" })[0].value,
};

const FilterStateContext = createContext({});

export const FilterProvider = ({ children }) => {
  const [filter, setFilter] = useState(initialState);

  return (
    <FilterStateContext.Provider value={{ filter, setFilter }}>
      {children}
    </FilterStateContext.Provider>
  );
};

export const useFilterContext = () => useContext(FilterStateContext);
