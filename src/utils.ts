import { Feature } from "geojson";
import { map, size, sortBy, uniqBy } from "lodash";
import { TPoint } from "./models/map";

export function getFilteredList({
  list,
  fieldName,
  value,
}: {
  list: any[];
  fieldName: string;
  value: string | number;
}): TPoint[] {
  return size(list) ? list.filter((item) => item[fieldName] == value) : [];
}

export function getFilterSourceByFieldName({ list, filterFieldName }): {
  value: string | number;
  label: string;
}[] {
  return sortBy(
    map(uniqBy(list, filterFieldName), (item) => ({
      value: item[filterFieldName],
      label: item[filterFieldName.toString()],
    })),
    "value"
  );
}

export const getSourceFeatures = (points: TPoint[]): Feature[] =>
  points.map((point) => ({
    type: "Feature",
    properties: { ...point },
    geometry: { type: "Point", coordinates: [point.lng, point.lat] },
  }));

export const getChartDataset = ({
  list,
  selectedData,
  targetFieldName,
  labels,
  labelFieldName,
}: {
  list: TPoint[];
  selectedData: string[];
  targetFieldName: string;
  labels: string[];
  labelFieldName: string;
}) =>
  selectedData?.map((selectedItem) => {
    let data;
    const filteredByTarget = list.filter(
      (listItem) => listItem[targetFieldName] === selectedItem
    );

    if (filteredByTarget.length > labels.length) {
      data = getAverageValue({
        labels,
        labelFieldName,
        filteredByTarget,
        targetFieldName,
      });
    } else
      data = filteredByTarget.sort(
        (a, b) => +a[labelFieldName] - +b[labelFieldName]
      );
    const color = getRandomColor();
    return {
      label: selectedItem,
      data,
      borderColor: color,
      backgroundColor: color,
      parsing: {
        xAxisKey: labelFieldName,
        yAxisKey: "riskRating",
      },
    };
  }) || [];

const getAverageValue = ({
  labels,
  filteredByTarget,
  labelFieldName,
  targetFieldName,
}) =>
  labels.reduce((acc, label) => {
    const groupedByLabel = filteredByTarget.filter(
      (filteredByTargetItem) => filteredByTargetItem[labelFieldName] === label
    );
    const riskFactors = groupedByLabel.map((item) => {
      return item.riskFactors;
    });
    const avgRiskFactors = calculateAverage(riskFactors);
    const avgRiskRating = Object.values(avgRiskFactors)
      .reduce((acc, val) => acc + val, 0)
      .toFixed(2);
    const res = {
      title: groupedByLabel[0][targetFieldName],
      riskRating: avgRiskRating,
      riskFactors: avgRiskFactors,
      [labelFieldName]: label,
    };

    return [...acc, res];
  }, []);

const calculateAverage = (arr) => {
  const allKeys = arr.reduce((acc, obj) => [...acc, ...Object.keys(obj)], []);
  const result = {};

  for (let i = 0; i < allKeys.length; i++) {
    const key = allKeys[i];
    const values = arr
      .filter((item) => item.hasOwnProperty(key))
      .map((item) => item[key]);
    const sum = values.reduce((acc, val) => acc + val, 0);
    result[key] = Math.round((sum / arr.length) * 100) / 100;
  }
  return result;
};

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

export const getCalculatedDataset = ({
  labelFieldName,
  labels,
  list,
  datasets,
  filter,
}) => {
  let res = [];
  const newItem = Object.keys(filter).reduce((acc, filterKey) => {
    const newItemList = filter[filterKey].filter(
      (item) =>
        datasets.findIndex((datasetItem) => datasetItem.label === item) < 0
    );
    if (newItemList.length) return { fieldName: filterKey, value: newItemList };
    else return acc;
  }, {});

  if (newItem?.value) {
    res = [
      ...datasets,
      ...getChartDataset({
        list,
        labelFieldName,
        targetFieldName: newItem.fieldName,
        labels,
        selectedData: newItem.value,
      }),
    ];
  } else {
    const allFilterList = Object.values(filter).flat();
    res = datasets.filter((item) => allFilterList.includes(item.label));
  }

  return res;
};
