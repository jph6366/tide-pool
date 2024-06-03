import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  MapCameraProps
} from '@vis.gl/react-google-maps';
import {ControlPanelView} from './ControlPanelViewVisGL';
import { env } from 'process';


const animationDuration = 90000;

const cameraStart: MapCameraProps = {
  center: {lat: 53.543579, lng: 9.980896},
  zoom: 17,
  heading: 331,
  tilt: 67.5
};

const cameraEnd: MapCameraProps = {
  center: {lat: 53.545981, lng: 9.9736948},
  zoom: 17,
  heading: 280,
  tilt: 67.5
};

const markerData = [
  {
    scale: 3,
    position: {
      lat: 53.541474920067095,
      lng: 9.983737859638481,
      altitude: 100
    },
    colors: [null, '#b31412']
  },
  {
    scale: 2,
    position: {
      lat: 53.54578654749748,
      lng: 9.98605118632637
    },
    colors: ['#F4B400', '#DBA200']
  },
  {
    scale: 2,
    position: {
      lat: 53.54936883967302,
      lng: 9.978252494325707
    },
    colors: ['#4285F4', '#3B78DB']
  },
  {
    scale: 2,
    position: {
      lat: 53.54615528208356,
      lng: 9.971257026513767
    },
    colors: ['#0F9D58', '#0D854A']
  }
] as const;

export default function VisGLReactGoogleMaps() {

  const [cameraProps, setCameraProps] = useState<MapCameraProps>(cameraStart);

  useEffect(() => {
    const t0 = performance.now();
    let rafId = requestAnimationFrame(function loop(t) {
      rafId = requestAnimationFrame(loop);

      const elapsedTimeRelative = (t - t0) / animationDuration;
      const progress =
        Math.cos(Math.PI + 2 * Math.PI * elapsedTimeRelative) / 2 + 0.5;

      setCameraProps(interpolateCamera(cameraStart, cameraEnd, progress));
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  const markerJsxElements = useMemo(
    () =>
      markerData.map((marker, index) => {
        const {position, scale, colors} = marker;
        const [bgColor, fgColor] = colors;

        return (
          <AdvancedMarker position={position} key={index}>
            <Pin
              scale={scale}
              background={bgColor}
              glyphColor={fgColor}
              borderColor={fgColor}
            />
          </AdvancedMarker>
        );
      }),
    []
  );


  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}>
    <Map
      mapId={'5e13191437f4efb4'}
      style={{position: 'absolute', top: 0, left: 0, zIndex: -1}}
      disableDefaultUI
      reuseMaps
      {...cameraProps}>
      {markerJsxElements}
    </Map>
    {/* <ControlPanelView /> */}
  </APIProvider>
  );
  
}

function lerp(x: number, y: number, t: number): number {
  return (1 - t) * x + t * y;
}

function interpolateCamera(a: MapCameraProps, b: MapCameraProps, t: number) {
  return {
    center: {
      lat: lerp(a.center.lat, b.center.lat, t),
      lng: lerp(a.center.lng, b.center.lng, t)
    },
    zoom: lerp(a.zoom, b.zoom, t),
    heading: lerp(a.heading ?? 0, b.heading ?? 0, t),
    tilt: lerp(a.tilt ?? 0, b.tilt ?? 0, t)
  };
}