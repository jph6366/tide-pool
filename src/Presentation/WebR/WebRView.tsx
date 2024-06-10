import React, { useEffect, useState, useCallback } from 'react'
import Map, { Layer, Marker, Popup, Source } from 'react-map-gl';
import { clusterCountLayer, clusterLayer, unclusteredPointLayer } from '../Map/ClusterLayers';
import { ChannelType, WebR } from 'webr';
import { Cruise } from '@/Domain/Model/Cruise';
import {useSelector, useDispatch, Provider} from 'react-redux';
// import ReduxControls from './ReduxControls';
import JotaiControls from './JotaiControls';
import mapStateAtom from '../JotaiStore/Store';
import { useAtom } from 'jotai';

const webR = new WebR({ interactive: false,
  channelType: ChannelType.PostMessage,
 });


function WebRView(pins: any) {

  // const mapStyle = useSelector((s: any) => s.mapStyle);
  // const viewState = useSelector((s: any) => s.viewState);
  const [state, dispatch] = useAtom(mapStateAtom);
  const { mapStyle, viewState } = state;
  // const dispatch = useDispatch();

  const onMove = useCallback((evt:any) => {
    dispatch({type: 'setViewState', payload: evt.viewState});
  }, []);

  const [popupInfo, setPopupInfo] = useState<Cruise>();
  // const [mapStyle, setMapStyle]: any = useState(null);
  const [res, setResult]: any = useState(undefined);



  const coordsToGeoJson = async (coords: any) => {
    await webR.init();
    await webR.installPackages(['jsonlite']);
    await webR.evalR(`
      library(jsonlite)

      coords_to_geojson <- function(coords) {
        if (!is.matrix(coords)) {
          stop("Input must be a matrix.")
        }
        
        if (ncol(coords) != 2) {
          stop("Input matrix must have exactly two columns: longitude and latitude.")
        }

        geojson <- list(
          type = "FeatureCollection",
          features = lapply(1:nrow(coords), function(i) {
            list(
              type = "Feature",
              geometry = list(
                type = "Point",
                coordinates = as.numeric(coords[i, ])
              ),
              properties = list()
            )
          })
        )
        
        geojson_str <- toJSON(geojson, auto_unbox = TRUE, pretty = TRUE)
        
        return(geojson_str)
      }
    `);

      const coordsString: any = coords.pins.flat().join(",");

      const result = await webR.evalR(`
      coords <- matrix(c(${coordsString}), ncol = 2, byrow = TRUE)
      geojson_output <- coords_to_geojson(coords)
      geojson_output
    `);

    const geojson: any = await result.toJs();
    pins = geojson;
  };

    useEffect(() => {
      (async ()=>{
        await coordsToGeoJson(pins);
        const result = JSON.parse(pins.values[0]);
        var out = document.getElementById('out');
        // replace out children with length of result
        out?.replaceChildren(`WebR returned ${result.features.length} points.`);
        setResult(result);
      })();
    }, []);

    return (
      <div className='w-full'>
        <pre><code id="out">Loading webR, please wait...</code></pre>
        {/* <ReduxControls /> */}
        <JotaiControls />
        { res != undefined &&  <Map
            {...viewState}
            onMove={onMove}
            style={{display:'inline-flex' , width: '90%', height: '600px', marginLeft: '5%'}}
            mapStyle={mapStyle}
            interactiveLayerIds={[clusterLayer.id]}
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            >
        <Source
          id="cruises"
          type="geojson"
          data={res}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
            {/* {
                cruises.map((pin:Cruise, index:number) => { 
                    return(

                    <Marker
                        key={`marker-${index}`}
                        longitude={pin.center_x}
                        latitude={pin.center_y}
                        anchor="bottom"
                        onClick={(e: { originalEvent: { stopPropagation: () => void; }; }) => {
                            e.originalEvent.stopPropagation();
                            setPopupInfo(pin);
                        }}
                    >
                        <Pin />
                    </Marker>

                )}
            )
            } */}
                    {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.center_x}
            latitude={popupInfo.center_y}
            onClose={() => setPopupInfo(undefined)}
          >
            <div>
              {popupInfo.platform_id}, {popupInfo.created} |{' '}
              <a
                target="_new"
                href={popupInfo.url}
              >
                Marine-Geo.org
              </a>
            </div>
            <h3>Country: {popupInfo.flag_alt}</h3>
          </Popup>
        )}

            </Map>  }
      </div>
    );
}

export default React.memo(WebRView);