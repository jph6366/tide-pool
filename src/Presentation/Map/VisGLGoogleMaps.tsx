import { useState } from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import {ControlPanelView} from './ControlPanelViewVisGL';
import { env } from 'process';

export default function VisGLReactGoogleMaps() {

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}>
    <Map
      defaultZoom={3}
      defaultCenter={{lat: 22.54992, lng: 0}}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    />
    <ControlPanelView />
  </APIProvider>
  );
  
}