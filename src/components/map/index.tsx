import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";
import ReactDomServer from "react-dom/server";
import { TPoint } from "../../models/map";
import MapPointDescription from "../pointDescription";

import {
  clusterCount,
  clusters,
  defaultCenter,
  defaultZoom,
  getSourceOptions,
  unclusteredPoint,
} from "./settings";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGltb24xNDEwIiwiYSI6ImNrOWgxaHd6YTA0NmIzbnFmZXgwbDk3dHEifQ.72D_C3ok4U1fZRtlgDy1JA";

function MapComponent({ points }: { points: TPoint[] }) {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: defaultCenter,
      zoom: defaultZoom,
    });
    map.current!.on("load", () => {
      map.current!.addSource("places", getSourceOptions(points));
      map.current!.addLayer(clusters);
      map.current!.addLayer(clusterCount);
      map.current!.addLayer(unclusteredPoint);
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: "300px",
    });

    map.current!.on("click", "clusters", (e) => {
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties?.cluster_id;
      map
        .current!.getSource("places")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.current!.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    map.current!.on("mouseenter", "clusters", () => {
      map.current!.getCanvas().style.cursor = "pointer";
    });
    map.current!.on("mouseleave", "clusters", () => {
      map.current!.getCanvas().style.cursor = "";
    });

    map.current!.on("mouseenter", "unclustered-point", (e) => {
      // Change the cursor style as a UI indicator.
      map.current!.getCanvas().style.cursor = "pointer";

      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const pointProps: TPoint & { riskFactors: string } =
        e.features[0].properties;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup
        .setLngLat(coordinates)
        .setHTML(
          ReactDomServer.renderToString(
            <MapPointDescription pointProps={pointProps} />
          )
        )
        .addTo(map.current!);
    });
    map.current!.on("mouseleave", "unclustered-point", () => {
      map.current!.getCanvas().style.cursor = "";
      popup.remove();
    });
  });

  useEffect(() => {
    if (map.current!.getSource("places")) {
      const { data } = getSourceOptions(points);
      map.current!.getSource("places").setData(data);
    }
  }, [points]);

  return <div ref={mapContainer} style={{ height: "100%" }} />;
}

export default MapComponent;
