import {useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {Map, Source, Layer} from 'react-map-gl';

// import ControlPanel from './control-panel';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from './ClusterLayers';

import type {MapRef} from 'react-map-gl';
import type {GeoJSONSource} from 'mapbox-gl';

const MAPBOX_TOKEN = ''; // Set your mapbox token here

export default function MapGLCluster() {
  const mapRef: any = useRef<MapRef>(null);

  const onClick = (event: any) => {
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;

    const mapboxSource = mapRef.current.getSource('earthquakes') as GeoJSONSource;

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      mapRef.current.easeTo({
        center: feature.geometry.coordinates,
        zoom,
        duration: 500
      });
    });
  };

  return (
    <>
      <Map
        initialViewState={{
          latitude: 40.67,
          longitude: -103.59,
          zoom: 3
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id]}
        onClick={onClick}
        ref={mapRef}
      >
        <Source
          id="earthquakes"
          type="geojson"
          data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          {/* <Layer {...clusterCountLayer} /> */}
          <Layer {...unclusteredPointLayer} />
        </Source>
      </Map>
    </>
  );
}