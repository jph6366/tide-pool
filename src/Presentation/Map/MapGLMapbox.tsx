import { useMemo, useState } from 'react';
import Map, {Marker} from 'react-map-gl';
import ControlPanel from './ControlPanelViewMapGL';
import { Cruise } from '@/Domain/Model/Cruise';
import Pin from './Pin';





export default function MapBox(data: any) {
    const [mapStyle, setMapStyle]: any = useState(null);
    if (data.length ) {
      console.log(data)  
    }
   

    const pins = useMemo(() => {
      if (!data || data.length === 0) {
          throw new Error("Data array is empty");
      }
  
      return data.map((cruise: Cruise, index: number) => (
          <Marker
              key={`marker-${index}`}
              longitude={cruise.center_x}
              latitude={cruise.center_y}
              anchor="bottom"
              onClick={(e: { originalEvent: { stopPropagation: () => void; }; }) => {
                  e.originalEvent.stopPropagation();
              }}
          >
              <Pin />
          </Marker>
      ));
  }, [data]);

  return (
        <Map
        initialViewState={{
            latitude: 37.805,
            longitude: -122.447,
            zoom: 15.5,
        }}

        style={{width: 800, height: 600}}
        // mapStyle={mapStyle && mapStyle.toJS()}
        // styleDiffing
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      >
         {pins}

        <ControlPanel onChange={setMapStyle} />

      </Map>
  );
}

