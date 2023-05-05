import { AnyLayer, AnySourceData } from "mapbox-gl";
import { TPoint } from "../../models/map";
import { getSourceFeatures } from "../../utils";

export const defaultCenter = { lng: -79.347015, lat: 43.65107 }; // Toronto by default

export const defaultZoom = 5;

export const unclusteredPoint: AnyLayer = {
  id: "unclustered-point",
  type: "circle",
  source: "places",
  filter: ["!", ["has", "point_count"]],

  paint: {
    "circle-color": [
      "step",
      ["get", "riskRating"],
      "#00ff00",
      0.1,
      "#6fed00",
      0.2,
      "#98db00",
      0.3,
      "#b6c700",
      0.4,
      "#cdb200",
      0.5,
      "#df9b00",
      0.6,
      "#ee8200",
      0.7,
      "#f86600",
      0.8,
      "#fe4400",
      0.9,
      "#ff0000",
    ],
    "circle-radius": 10,
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};

export const clusterCount: AnyLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "places",
  filter: ["has", "point_count"],
  layout: {
    "text-field": ["get", "point_count_abbreviated"],
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
};

export const clusters: AnyLayer = {
  id: "clusters",
  type: "circle",
  source: "places",
  filter: ["has", "point_count"],
  paint: {
    // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 100
    //   * Yellow, 30px circles when point count is between 100 and 750
    //   * Pink, 40px circles when point count is greater than or equal to 750
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      100,
      "#f1f075",
      75 / 0,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  },
};

export const getSourceOptions = (points: TPoint[]): AnySourceData => ({
  type: "geojson",
  data: {
    type: "FeatureCollection",
    features: getSourceFeatures(points),
  },
  cluster: true,
  clusterMaxZoom: 14, // Max zoom to cluster points on
  clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
});
