/* eslint-disable react/no-unescaped-entities */
/* eslint-disable camelcase */
import useViewModel from './Control/CruiseTable';
import { Cruise } from '@/Domain/Model/Cruise';
import TableView from './Components/TableView';
import { CruiseStatus } from '@/Data/DataSource/API/Entity/CruiseEntity';
import RejectedTableView from './Components/RejectedTableView';
import UnderReviewTableView from './Components/underReviewTableView';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Map, { ControlPosition, Layer, MapRef, Source, useControl } from 'react-map-gl/mapbox';
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import mapStateAtom from '@/Presentation/JotaiStore/Store';
import GMRTMapToolMode, { boundsAtom } from './RectanglurDrawMode';
import ImageView from './Components/ImageView';
import GMRTPolylineToolMode,{ profileAtom }  from './GeodesicDrawMode';
import ProfileView from './Components/ProfileView';
import { Coordinate } from '@/Data/DataSource/API/Parameter/CoordinateParameter';
import useDrawMode from './Control/DrawMode';
import DrawControl from './Control/DrawControl';
import { Feature, FeatureCollection, LineString } from 'geojson';


const GMRT_URLS = {
    merc: 'https://www.gmrt.org/services/mapserver/wms_merc?service=WMS&version=1.3.0&request=GetMap&layers=topo&styles=&format=image/png&transparent=true&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}',
    merc_mask: 'https://www.gmrt.org/services/mapserver/wms_merc_mask?service=WMS&version=1.3.0&request=GetMap&layers=topo&styles=&format=image/png&transparent=true&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}',
};


export default function CruiseTableView() {

    const {
        data,
        rdata,
        udata,
        sortCruises,
        cruiseStatus,
        setStatus,
        filterCruises,
        aggregateTotalArea,
        setTotalArea,
        setFilter,
        isOpen, 
        setIsOpen,
        filter,
        caseSensitive,
        setCase,
        getElevationPoint,
        getElevationProfile,
        getCountryCode
    } = useViewModel();

    const {
        drawMode, setDrawMode,
        GMRTPolylineToolMod
    } = useDrawMode();


    const [open, setOpen] = useState(true);
    const [latLong, setLatLongElevation] = useState<{
        latitude: number;
        longitude: number;
        elevation: number;
    } | null >(null);


    const [state, dispatch] = useAtom(mapStateAtom);
    const bounds = useAtomValue(boundsAtom);
    
    const setBounds = useSetAtom(boundsAtom);
    GMRTMapToolMode.onClick = function(state, e) {
        if (
            state.startPoint &&
            state.startPoint[0] !== e.lngLat.lng &&
            state.startPoint[1] !== e.lngLat.lat 
        ) {
            if(e.lngLat.lat < state.startPoint[1]) {
                if(e.lngLat.lng > state.startPoint[0]) {
                    setBounds({
                        north: state.startPoint[1],
                        west: state.startPoint[0],
                        east: e.lngLat.lng,
                        south: e.lngLat.lat 
                    });
                } else {
                    setBounds({
                        north: state.startPoint[1],
                        west: e.lngLat.lng,
                        east: state.startPoint[0],
                        south: e.lngLat.lat 
                    });
                }
            } else {
                if(e.lngLat.lng > state.startPoint[0]) {
                    setBounds({
                        north: e.lngLat.lat,
                        west: state.startPoint[0],
                        east: e.lngLat.lng,
                        south: state.startPoint[1] 
                    });
                } else {
                    setBounds({
                        north: e.lngLat.lat,
                        west: e.lngLat.lng,
                        east: state.startPoint[0],
                        south: state.startPoint[1] 
                    });
                }

            }

            this.updateUIClasses({mouse: 'pointer'});
            state.endpoint = [e.lngLat.lng, e.lngLat.lat];
            this.changeMode('simple_select', { featuresID: state.rectangle.id});
        }
    
        const startPoint = [e.lngLat.lng, e.lngLat.lat];
        state.startPoint = startPoint;        
    }


    
    const { mapStyle, viewState } = state;

    const onMove = useCallback(async (event:any) => {
        dispatch({type: 'setViewState', payload: event.viewState});
        const elevationPoint = await getElevationPoint(event.viewState.latitude,event.viewState.longitude) as number;
        setLatLongElevation({
            longitude: event.viewState.longitude,
            latitude: event.viewState.latitude,
            elevation: elevationPoint
        })
      }, []);

    const [selectedCruise, setSelectedCruise] = useState<{
        longitude: number;
        latitude: number;
        entryIdentifier: string;
      } | null>(null);

    const [selectedCruises, setSelectedCruises] = useState<{
        [key: string]: {
            longitude: string;
            latitude: string;
            entryIdentifier: string;
        };
    }>({});

    const profile =  useAtomValue(profileAtom);
    const setProfile = useSetAtom(profileAtom);


    const [features, setFeatures] = useState({});

    const onUpdate = useCallback((event:any) => {
      setFeatures(async currFeatures => {
        const newFeatures: { [key: string]: Feature } = {...currFeatures};
        for (const f of event.features) {
          newFeatures[f.id] = f;
          if(f.geometry.type == 'LineString') {
            const processedCoords: Coordinate[] = f.geometry.coordinates.map(([latitude, longitude]:any) => ({ latitude, longitude }));
                
            // Fetch and update the profile state
            const elevationProfile = await getElevationProfile(processedCoords);
            setProfile(elevationProfile);
            console.log('setProfile');
          }
        }
        return newFeatures;
      });
    }, []);

    const onCreate = useCallback((event:any) => {
        setFeatures(async currFeatures => {
          const newFeatures: { [key: string]: Feature } = {...currFeatures};
          for (const f of event.features) {
            newFeatures[f.id] = f;
            if(f.geometry.type == 'LineString') {
                const processedCoords: Coordinate[] = f.geometry.coordinates.map(([latitude, longitude]:any) => ({ latitude, longitude }));
                
              // Fetch and update the profile state
                const elevationProfile = await getElevationProfile(processedCoords);
                setProfile(elevationProfile);
                console.log('newProfile');
            }
          }
          return newFeatures;
        });
      }, []);
  
    const onDelete = useCallback((event:any) => {
      setFeatures(currFeatures => {
        const newFeatures: { [key: string]: Feature } = {...currFeatures};
        for (const f of event.features) {
          delete newFeatures[f.id];
          if(f.geometry.type == 'LineString') {
            setProfile([])
          }
        }
        return newFeatures;
      });
    }, []);

    const mapRef = React.useRef<MapRef>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const [showGraticule, setShowGraticule] = useState(true);

    const graticule: FeatureCollection<LineString> = {
        type: 'FeatureCollection',
        features: [] // now features is inferred as Feature<LineString>[]
    };
    // Create vertical lines every 10° longitude
    for (let lng = -170; lng <= 180; lng += 10) {
        graticule.features.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [[lng, -90], [lng, 90]] },
        properties: { value: lng }
        });
    }
    // Create horizontal lines every 10° latitude
    for (let lat = -80; lat <= 80; lat += 10) {
        graticule.features.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [[-180, lat], [180, lat]] },
        properties: { value: lat }
        });
    }

    // Function to update layer visibility
    const updateGraticuleVisibility = () => {
        const map = mapRef.current && mapRef.current.getMap();
        if (map && map.getLayer('graticule')) {
        map.setLayoutProperty(
            'graticule',
            'visibility',
            showGraticule ? 'visible' : 'none'
        );
        }
    };

    useEffect(() => {
        if (profile) { console.log('profile updated')}
        const map = mapRef.current && mapRef.current.getMap();
        if (!map) return;

        const onLoad = () => {
          if (!map.getSource('graticule')) {
            map.addSource('graticule', {
              type: 'geojson',
              data: graticule
            });
            map.addLayer({
              id: 'graticule',
              type: 'line',
              source: 'graticule',
              layout: {
                visibility: showGraticule ? 'visible' : 'none'
              },
              paint: {
                'line-color': '#888',
                'line-width': 1
              }
            });
          }
        };
    
        if (map.isStyleLoaded()) {
          onLoad();
        } else {
          map.on('load', onLoad);
        }
    
        // Clean up the listener when unmounting
        return () => {
          if (map && map.off) {
            map.off('load', onLoad);
          }
        };
      }, [graticule, showGraticule, profile]);

        // When the state changes, update the layer's visibility
        useEffect(() => {
            updateGraticuleVisibility();
        }, [showGraticule]);



    const entryFilter = ['==', 'entry_id', selectedCruise?.entryIdentifier || ''];

    const [gmrtUrl, setGmrtUrl] = useState(GMRT_URLS.merc);

    const handleToggleUrl = () => {
        setGmrtUrl((prevUrl) => {
            if (prevUrl === GMRT_URLS.merc) return GMRT_URLS.merc_mask;
            if (prevUrl === GMRT_URLS.merc_mask) return GMRT_URLS.merc
            return GMRT_URLS.merc; // Loop back to merc
        });
    };


    return (
        <div className='min-h-screen bg-gray-50 py-6 flex flex-col items-center justify-center relative overflow-hidden sm:py-12'>
            <div  className="p-4 bg-gray-700 w-1/2 rounded flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-900" fill="lightblue" viewBox="0 0 512 512" stroke="currentColor" strokeWidth="15">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        <path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5l0 39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9l0 39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7l0-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1L257 256c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/>
                    </svg> */}
                    <h4 className="font-medium text-sm text-blue-500">GMRT-MAP</h4>
                </div>
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg> */}
              </div>
              {open && (
                <div className="relative w-full overflow-x-clip ">
                    <p className="mt-4 text-center text-gray-500 sm:text-lg lg:text-left lg:text-lg">Acknowledgement</p>
                    <p className="mt-4 text-center text-gray-500 lg:text-left lg:text-xs w-2/3">FOIA provides that any person has a right to obtain access to federal agency records, except to the extent that such records (or portions of them) are protected from public disclosure by one of nine FOIA exemptions or by one of three special law enforcement record exclusions. This right is enforceable in court.

The Federal FOIA does not provide access to records held by U.S. state or local government agencies or by businesses or individuals. States have their own statutes governing public access to state and local records, and they should be consulted for further information.</p>
                    <br/>
                    <a href='https://www.gmrt.org/' className='text-blue-900'>Global Multi-Resolution Topography (GMRT)</a>
                    <p className="mt-4 text-center text-gray-500 lg:text-left lg:text-xs w-2/6">
                    Ryan, W. B. F., S.M. Carbotte, J. Coplan, S. O'Hara, 
                    A. Melkonian, R. Arko, R.A. Weissel, V. Ferrini, 
                    A. Goodwillie, F. Nitsche, J. Bonczkowski, and R. Zemsky (2009), 
                    Global Multi-Resolution Topography (GMRT) synthesis data set, Geochem. Geophys. Geosyst., 10, Q03014,
                    </p>
                    <br/>

{cruiseStatus == CruiseStatus.merged  ?(
                        <Map
                            ref={mapRef}
                            {...viewState}
                            onMove={onMove}
                            style={{display:'inline-flex' , width: '90%', height: '600px', marginLeft: '5%'}}
                            // mapStyle={mapStyle}
                            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                        >
                            <DrawControl
                                ref={(instance: MapboxDraw) => {
                                if (instance) drawRef.current = instance as MapboxDraw;
                                }}
                                position='top-left'
                                displayControlsDefault={false}
                                defaultMode={drawMode}
                                controls={{
                                    trash: true
                                }}
                                modes={{
                                    gmrt_maptool: GMRTMapToolMode,
                                    gmrt_polyline: GMRTPolylineToolMod,
                                    ...MapboxDraw.modes,
                                }} onCreate={onCreate} onUpdate={onUpdate} onDelete={onDelete} 
                                                           />
                            
                            <div className='mapboxgl-ctrl-top' >
                                <div className='mapboxgl-ctrl-group mapboxgl-ctrl' >
                                    <button onClick={() => {
                                        drawRef.current?.changeMode('simple_select')}}
                                     style={{
                                display:'inline-block'
                            }} className='mapbox-gl-draw_ctrl-draw-btn'>
                                <svg width="24px" height="20px" viewBox="0 0 27 27" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="panIconTitle" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" color="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title id="panIconTitle">Pan</title> <path d="M20,14 L20,17 C20,19.209139 18.209139,21 16,21 L10.0216594,21 C8.75045497,21 7.55493392,20.3957659 6.80103128,19.3722467 L3.34541668,14.6808081 C2.81508416,13.9608139 2.94777982,12.950548 3.64605479,12.391928 C4.35756041,11.8227235 5.38335813,11.8798792 6.02722571,12.5246028 L8,14.5 L8,13 L8.00393081,13 L8,11 L8.0174523,6.5 C8.0174523,5.67157288 8.68902517,5 9.5174523,5 C10.3458794,5 11.0174523,5.67157288 11.0174523,6.5 L11.0174523,11 L11.0174523,4.5 C11.0174523,3.67157288 11.6890252,3 12.5174523,3 C13.3458794,3 14.0174523,3.67157288 14.0174523,4.5 L14.0174523,11 L14.0174523,5.5 C14.0174523,4.67157288 14.6890252,4 15.5174523,4 C16.3458794,4 17.0174523,4.67157288 17.0174523,5.5 L17.0174523,11 L17.0174523,7.5 C17.0174523,6.67157288 17.6890252,6 18.5174523,6 C19.3458794,6 20.0174523,6.67157288 20.0174523,7.5 L20.0058962,14 L20,14 Z"></path> </g></svg>
                            </button>
                                    <button onClick={() => {
                                        setDrawMode('gmrt_maptool')
                                        drawRef.current?.changeMode('gmrt_maptool')}}
                                    style={{
                                display:'inline-block'
                            }} className='mapbox-gl-draw_ctrl-draw-btn '>
                                <svg width="24px" height="20px" viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" strokeWidth="0.00024000000000000003" transform="matrix(-1, 0, 0, -1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.8160000000000001"></g><g id="SVGRepo_iconCarrier"><path d="M1 3v18h22V3zm21 17H2V4h20z"></path><path opacity=".25" d="M2 4h20v16H2z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>                            </button>
                                                                    
                                    <button onClick={() => {
                                        setDrawMode('gmrt_polyline')
                                        drawRef.current?.changeMode('gmrt_polyline')}}
                                    style={{
                                display:'inline-block'
                            }} className='mapbox-gl-draw_ctrl-draw-btn '>
                                <svg width="24px" height="20px" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 16.5L9 10L13 16L21 6.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                            </button>
                                </div>
                            </div>

                            <div className='mapboxgl-ctrl-top-right'>
                                <div className="mapboxgl-ctrl-group mapboxgl-ctrl"
                                style={{
                                    display: 'inline-flex',
                                    flexWrap: 'wrap',
                                    margin: '1em',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '86px',
                                    marginRight: '1em'
                                }}>
                                    <button onClick={() => setShowGraticule((prev) => !prev)} className='mapbox-gl-draw_ctrl-draw-btn'>
                                        <svg width="23px" height="23px" viewBox="0 -7.5 186 186" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clipPath="url(#clip0)"> <path d="M185.696 74.2188C185.375 55.2226 177.659 39.0104 162.744 26.0344C150.784 15.6176 136.097 8.031 119.101 3.47659C112.524 1.71949 105.574 0.214102 98.304 0.214102C94.48 0.202117 90.6677 0.649697 86.9515 1.5472C69.8893 5.72476 57.3763 10.5515 46.3905 17.2153C29.9619 27.1811 19.5299 37.0811 12.5661 49.3214C3.15379 65.8443 -0.273628 82.8985 2.08723 101.46C3.48155 112.387 7.49047 123.169 14.7074 135.389C20.397 145.017 27.6938 151.926 37.0191 156.501C41.9213 158.915 46.7436 161.249 51.7399 163.377C64.9664 169.013 78.5337 171.294 95.7361 170.77C96.8097 170.624 98.1235 170.465 99.6178 170.286C103.607 169.808 109.07 169.159 114.385 168.197C129.24 165.519 141.406 160.977 151.58 154.313C154.977 152.128 158.079 149.521 160.811 146.555C165.872 140.901 170.191 134.631 173.664 127.896C182.094 111.788 186.029 94.2303 185.696 74.2188ZM32.3362 36.3977C45.1629 24.7542 59.0906 16.6586 74.9116 11.6525L77.6534 10.7838L75.5724 12.7596C65.8472 22.0291 59.5436 33.5797 55.1348 42.604L54.9551 42.9822L54.5279 42.9758C49.0915 42.9229 37.1392 39.939 32.4765 37.4721L31.6431 37.0282L32.3362 36.3977ZM8.65123 84.6646C10.1916 69.2088 15.9076 55.4904 26.1268 42.7332L26.4065 42.3878L51.8866 49.9138L51.6399 50.5772C47.5822 61.4626 44.7175 72.7514 43.0956 84.2471L43.0151 84.8111L8.57717 85.4073L8.65123 84.6646ZM21.0909 133.281L20.7839 132.81C12.2726 119.595 8.21035 106.155 8.37068 91.7266L8.37717 91.0704H41.6345L42.4016 124.217L21.0909 133.281ZM50.7396 155.401C41.3409 151.264 31.623 146.987 24.6449 138.321L24.1516 137.71L24.8384 137.333C31.0752 133.838 37.5118 131.803 42.9813 130.271L43.7083 130.072L43.8219 130.808C45.4161 140.714 48.1438 148.339 52.3995 154.797L53.6399 156.674L50.7396 155.401ZM85.724 163.403L85.1307 163.449C84.0272 163.542 82.936 163.589 81.8552 163.589C77.3821 163.497 72.9304 162.936 68.5748 161.917C67.7719 161.671 67.0929 161.131 66.6742 160.406L65.7135 158.848C63.182 154.73 60.6309 152.583 58.1097 146.216C55.5976 139.871 53.5809 133.816 52.9272 128.261L52.8622 127.67L53.4426 127.541C64.2581 125.066 75.2738 123.552 86.3595 123.019L87.0865 122.979L85.724 163.403ZM87.3916 116.371L52.0468 121.437L51.9535 120.781C50.4923 110.61 50.7201 100.252 51.1329 91.4601L51.1596 90.8303H88.4522L87.3916 116.371ZM88.6587 84.0335H52.093L52.158 83.3108C53.0986 73.2857 55.5133 62.9085 59.5353 51.5837L59.7086 51.0991L88.6593 53.4003L88.6587 84.0335ZM88.8722 46.617L62.2921 45.0038L62.6725 44.1352C69.6089 28.1967 78.4201 16.8101 90.4133 8.32202L91.5667 7.50645L88.8722 46.617ZM120.322 12.9468C131.187 16.1422 145.148 21.182 156.807 31.9182L157.508 32.5635L155.787 33.4384C150.277 36.2435 145.077 38.8891 138.792 39.8706L138.351 39.9436L138.118 39.5564C137.197 38.0574 136.3 36.539 135.403 35.0206C130.994 27.6076 126.438 19.9359 119.695 14.0812L117.393 12.0854L120.322 12.9468ZM97.6899 14.3193C97.7704 12.668 97.8503 11.0039 97.9236 9.33976L97.9703 8.37829L98.8577 8.75578C112.017 14.3852 121.416 24.3316 129.333 41.0076L129.7 41.7819L126.599 42.3588C116.814 44.196 107.569 45.9331 97.7126 46.2512L97.0389 46.2712L97.0259 45.6013C96.7169 35.1026 97.1901 25.0065 97.6906 14.318L97.6899 14.3193ZM96.911 53.6326L133.067 48.1818L133.267 48.6458C137.563 58.3005 139.591 69.1081 139.464 81.6841V82.3203L96.9084 83.9051L96.911 53.6326ZM96.504 90.5651L139.36 89.219L139.34 89.9288C139.046 99.4016 137.983 108.834 136.159 118.136L136.045 118.713L95.4842 115.821L96.504 90.5651ZM112.393 161.367C107.99 162.077 103.575 162.674 98.9057 163.303C97.3115 163.522 95.6906 163.741 94.0295 163.967L93.2356 164.079L95.0298 122.737L95.6439 122.717C106.917 122.292 118.536 123.162 133.31 125.528L134.117 125.658L133.83 126.414C133.53 127.209 133.23 127.999 132.937 128.788C130.34 135.717 127.172 141.844 123.905 148.195C120.314 155.177 113.594 161.174 112.391 161.366L112.393 161.367ZM161.278 133.565C154.748 146.097 143.489 151.673 132.303 155.837L130.455 156.527L131.502 154.862C136.398 147.119 139.593 138.677 142.975 129.739L143.869 127.373L161.645 132.862L161.278 133.565ZM177.159 88.5821C175.979 102.719 172.551 114.561 166.381 125.847L166.133 126.304L146.023 121.066L149.472 88.7944L177.219 87.8401L177.159 88.5821ZM177.513 80.307L177.439 80.871L149.419 81.8531L149.338 81.2556C149.098 79.4488 148.884 77.622 148.671 75.8513C148.205 71.8467 147.717 67.7156 146.884 63.7506C146.057 59.8453 144.89 56.0859 143.648 52.1071C143.122 50.3964 142.568 48.6329 142.054 46.8623L141.888 46.2925L162.585 37.7587L162.892 37.9838C172.282 44.9187 179.386 65.4952 177.512 80.3057L177.513 80.307Z" fill="#000000"></path> </g> <defs> <clipPath id="clip0"> <rect width="185" height="171" fill="white" transform="translate(0.777344)"></rect> </clipPath> </defs> </g></svg>
                                    </button>
                                    <button onClick={()=>handleToggleUrl()}className='mapbox-gl-draw_ctrl-draw-btn'>
                                        <svg width="23px" height="23px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M65.44 18.39l-2.327 9.717C53.95 66.384 49.07 107.884 49.07 151.293c0 93.415 23.097 178.085 61.047 240.014 17.218 28.096 37.652 51.6 60.447 68.92 26.69 21.257 56.353 32.962 87.377 32.962.364 0 1.147-.12 1.927-.25.623.008 1.247.02 1.87.02 60.13 0 113.67-39.724 151.62-101.653 37.95-61.93 61.047-146.598 61.047-240.014 0-41.557-4.858-81.203-13.256-118.012l-2.324-10.19-9.582 4.176c-50.92 22.196-113.98 35.705-182.086 35.713-2.014-.022-4.01-.06-6.002-.103V62.8c-1.296 0-2.586-.017-3.88-.03-69.783-2.053-125.493-18.078-182.545-40.698l-9.29-3.683zm380.816 28.747c6.792 32.774 10.824 67.647 10.824 104.156 0 90.547-22.596 172.38-58.494 230.963-35.9 58.582-84.36 93.38-136.848 93.38-.195 0-.39-.006-.584-.007v-63.987c-2.64.023-5.28-.03-7.914-.163-55.358-2.77-109.316-38.91-122.03-99.742l-2.355-11.256h94.895l37.404 14.207V80.206c1.946.042 3.896.078 5.862.098h.087c66.168 0 127.672-12.383 179.152-33.168zm-279.53 98.12c35.365 0 64.036 13.248 64.036 29.59 0 16.34-28.668 29.585-64.035 29.585-35.365 0-64.036-13.246-64.036-29.586 0-16.34 28.67-29.588 64.037-29.588zm186.282 0c-35.367 0-64.035 13.248-64.035 29.59 0 16.34 28.67 29.585 64.035 29.585 35.367 0 64.035-13.246 64.035-29.586 0-16.34-28.67-29.588-64.035-29.588zM152.572 319.17c14.72 45.053 57.247 71.428 101.602 73.646 44.8 2.24 90.238-19.45 110.416-73.646h-57.447l-44.204 16.187-42.62-16.187h-67.748z"></path></g></svg>                                    
                                    </button>
                                </div>
                                    
                            </div>


                            <div className='mapboxgl-ctrl-bottom-left'>\
                                <div className='mapboxgl-ctrl-group mapboxgl-ctrl '>
                                    <div style={{padding: 12, fontFamily: 'sans-serif'}}>
                                        <span>MAP CENTER: </span>
                                        <p>{latLong?.latitude}</p>
                                        <p>{latLong?.longitude}</p>
                                        <p>{latLong?.elevation}</p>
                                    </div>
                                </div>
                            </div>

{ drawMode != 'gmrt_polyline' ?(
                                <div className='mapboxgl-ctrl-bottom-right'>
                                    <div className="mapboxgl-ctrl-group mapboxgl-ctrl"
                                    style={{
                                        display: 'inline-flex',
                                        flexWrap: 'wrap',
                                        margin: '1em',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: '300px',
                                        minHeight: '120px',
                                        width: 'max-content',
                                        marginRight: '1em'
                                    }}>
                                        <div className='m-2 text-center justify-center'>
                                            <h1 className='text-lg'>GMRT MapTool</h1>
                                            <p className='w-max'>Select a region directly from the map or modify fields below.</p>
                                            <div className="relative inline-flex self-center">
                                                <svg className="text-white bg-blue-950 absolute -top-0 -right-0  pointer-events-none p-2 rounded" xmlns="http://www.w3.org/2000/svg"  
                                                width="23px" height="20px" viewBox="0 0 27 27" version="1.1">
                                                    <title>F09B337F-81F6-41AC-8924-EC55BA135736</title>
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <g  transform="translate(-539.000000, -199.000000)" fill="#ffffff" fillRule="nonzero">
                                                            <g transform="translate(538.000000, 183.521208)">
                                                                <polygon  transform="translate(20.000000, 18.384776) rotate(135.000000) translate(-20.000000, -18.384776) " points="33 5.38477631 33 31.3847763 29 31.3847763 28.999 9.38379168 7 9.38477631 7 5.38477631"/>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </svg>
                                                <select className="text-xs font-bold rounded border-2 border-blue-950 text-gray-600 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
                                                    <option>Select Focus/Study Site...</option>
                                                    <option>(world)</option>
                                                    <option>(Antartic)</option>
                                                    <option>(Artic)</option>
                                                </select>
                                            </div>
                                            <div className='m-1'>
                                                    <div className='left-1/2 '>
                                                        <input type='text' placeholder='North' name='north' className=' bg-gray-200 w-20  boundsvalue relative text-center justify-center'/>
                                                    </div>
                                                    <div>
                                                        <input type='text' placeholder='West' name='west' className='bg-gray-200 w-20  boundsvalue text-center'/>
                                                        <input type='text' placeholder='East' name='east' className='bg-gray-200 w-20  boundsvalue text-center'/>
                                                    </div>
                                                    <div className='left-1/2 '>
                                                        <input type='text' placeholder='South' name='south' className='bg-gray-200 w-20 boundsvalue relative text-center justify-center'/>
                                                    </div>
                                            </div>

                                            <div className=" text-center py-2 px-8 bg-indigo-100 text-gray-600 hover:text-indigo-700 hover:bg-teal-400 rounded-full">
                                                <p>Create Grid File</p>
                                            </div>

                                            <a>Switch to North Polar View</a>
                                            <br/>
                                            <a>Switch to South Polar View</a>

                                        </div>
                                        <ImageView rectangle={bounds} />
                                        
                                    </div>
                                    
                            </div>
): (
    <div className='mapboxgl-ctrl-bottom-right'>
        <div className="mapboxgl-ctrl-group mapboxgl-ctrl"
        style={{
            display: 'inline-block',
            flexWrap: 'wrap',
            margin: '1em',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '300px',
            minHeight: '90px',
            maxWidth: '500px',
            marginRight: '1em'
        }}>
            <div className='inline-flex m-2 text-center justify-center'>
                <p className='text-sm'>GMRT MapTool                
                    <span className=' text-xs'>Select a line on the map to draw a profile. Click to start a line and double-click to end.</span>
                </p>
                <div className="relative inline-flex self-center">
                    <svg className="text-white bg-blue-950 absolute -top-0 -right-0  pointer-events-none p-2 rounded" xmlns="http://www.w3.org/2000/svg"  
                    width="23px" height="20px" viewBox="0 0 27 27" version="1.1">
                        <title>F09B337F-81F6-41AC-8924-EC55BA135736</title>
                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g  transform="translate(-539.000000, -199.000000)" fill="#ffffff" fillRule="nonzero">
                                <g transform="translate(538.000000, 183.521208)">
                                    <polygon  transform="translate(20.000000, 18.384776) rotate(135.000000) translate(-20.000000, -18.384776) " points="33 5.38477631 33 31.3847763 29 31.3847763 28.999 9.38379168 7 9.38477631 7 5.38477631"/>
                                </g>
                            </g>
                        </g>
                    </svg>
                    <select className="text-xs font-bold rounded border-2 border-blue-950 text-gray-600 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
                        <option>Plain Text Format</option>
                        <option>GeoJSON Format</option>
                    </select>
            </div>  
            </div>
            {profile.length >= 2 ?(
            <ProfileView profile={profile} />
            ): (
            <div className="w-40 h-40"/>
            )}
        </div>
            
    </div>
)}

    <Source
      id="gmrt-wms"
      type="raster"
      tiles={[gmrtUrl]} 
      tileSize={256}
    >
      <Layer
        id="gmrt-wms-layer"
        type="raster"
        source="gmrt-wms"
      />
    </Source>

                            <Source
                                id="cruises"
                                type="geojson"
                                data={{
                                    type: 'FeatureCollection',
                                    features: data.map((entry: Cruise) => ({
                                        type: 'Feature',
                                        geometry: {
                                            type: 'Point',
                                            coordinates: [entry.center_x, entry.center_y],
                                        },
                                        properties: {
                                            entry_id: entry.entry_id,
                                            survey_id: entry.survey_id,
                                            url: entry.url,
                                            year: entry.year,
                                            chief: entry.chief,
                                            total_area: entry.total_area,
                                            track_length: entry.track_length,
                                        },
                                        })),
                                }}
                            >
                                  <Layer
                                        id="cruise-points"
                                        type="circle"
                                        paint={{
                                        'circle-radius': 6,
                                        'circle-color': '#007cbf',
                                        }}
                                    />
                                  <Layer
                                        id="cruise-selection"
                                        type="circle"
                                        paint={{
                                        'circle-radius': 6,
                                        'circle-color': 'green',
                                        }}
                                        filter={entryFilter}
                                    />


                            </Source>

                        </Map>
                    ): cruiseStatus == CruiseStatus.underReview ?(
                        <Map
                            {...viewState}
                            onMove={onMove}
                            style={{display:'inline-flex' , width: '90%', height: '600px', marginLeft: '5%'}}
                            mapStyle={mapStyle}
                            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                        >

                            <Source
                                id="cruises"
                                type="geojson"
                                data={{
                                    type: 'FeatureCollection',
                                    features: rdata.map((entry: Cruise) => ({
                                        type: 'Feature',
                                        geometry: {
                                            type: 'Point',
                                            coordinates: [entry.center_x, entry.center_y],
                                        },
                                        properties: {
                                            entry_id: entry.entry_id,
                                            survey_id: entry.survey_id,
                                            url: entry.url,
                                            year: entry.year,
                                            chief: entry.chief,
                                            total_area: entry.total_area,
                                            track_length: entry.track_length,
                                        },
                                        })),
                                }}
                            >
                                  <Layer
                                        id="cruise-points"
                                        type="circle"
                                        paint={{
                                        'circle-radius': 6,
                                        'circle-color': 'orange',
                                        }}
                                    />

                            </Source>

                        </Map>
                    ): (
                        <Map
                            {...viewState}
                            onMove={onMove}
                            style={{display:'inline-flex' , width: '90%', height: '600px', marginLeft: '5%'}}
                            mapStyle={mapStyle}
                            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                        >

                            <Source
                                id="cruises"
                                type="geojson"
                                data={{
                                    type: 'FeatureCollection',
                                    features: data.map((entry: Cruise) => ({
                                        type: 'Feature',
                                        geometry: {
                                            type: 'Point',
                                            coordinates: [entry.center_x, entry.center_y],
                                        },
                                        properties: {
                                            entry_id: entry.entry_id,
                                            survey_id: entry.survey_id,
                                            url: entry.url,
                                            year: entry.year,
                                            chief: entry.chief,
                                            total_area: entry.total_area,
                                            track_length: entry.track_length,
                                        },
                                        })),
                                }}
                            >
                                  <Layer
                                        id="cruise-points"
                                        type="circle"
                                        paint={{
                                        'circle-radius': 6,
                                        'circle-color': 'red',
                                        }}
                                    />

                            </Source>

                        </Map>
                    )}

                    <div className='sm:flex items-center justify-between'>
                        <div className="sm:flex items-center justify-between">
                            <div className="flex items-center">
                                <a onClick={() => setStatus(CruiseStatus.merged)} className="rounded-full focus:outline-none focus:ring-2  focus:bg-indigo-50 focus:ring-indigo-800" >
                                    <div className="py-2 px-8 bg-indigo-100 text-gray-600 hover:text-indigo-700 hover:bg-teal-400 rounded-full">
                                        <p>Merged</p>
                                    </div>
                                </a>
                                <a onClick={() => setStatus(CruiseStatus.merged)} className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8" >
                                    <div className="py-2 px-8 bg-indigo-100 text-gray-600 hover:text-indigo-700 hover:bg-yellow-400 rounded-full ">
                                        <p>Under Review</p>
                                    </div>
                                </a>
                                <a onClick={() => setStatus(CruiseStatus.merged)} className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8" >
                                    <div className="py-2 px-8 bg-indigo-100 text-gray-600 hover:text-indigo-700 hover:bg-red-400 rounded-full ">
                                        <p>Rejected</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {cruiseStatus == CruiseStatus.merged  ?(
                        <TableView 
                            getCountryCode={getCountryCode}
                            sortCruises={sortCruises}
                            filter={filter} filterCruises={filterCruises} setFilter={setFilter}
                            aggregateTotalArea={aggregateTotalArea} setTotalArea={setTotalArea}
                            data={data}
                            isOpen={isOpen} setIsOpen={setIsOpen} selectedCruises={selectedCruises} selectCruise={setSelectedCruises} setSelectedCruise={setSelectedCruise} />
                    ): cruiseStatus == CruiseStatus.underReview ?(
                        <UnderReviewTableView 
                        data={udata}
                        filter={filter} setFilter={setFilter}
                        aggregateTotalArea={aggregateTotalArea} setTotalArea={setTotalArea}
                        filterCruises={filterCruises}  
                        isOpen={isOpen} setIsOpen={setIsOpen} />
                    ): (
                        <RejectedTableView 
                                    data={rdata}
                                    filter={filter} setFilter={setFilter}
                                    aggregateTotalArea={aggregateTotalArea} setTotalArea={setTotalArea}
                                    filterCruises={filterCruises}
                                    isOpen={isOpen} setIsOpen={setIsOpen} 
                                    caseSensitive={caseSensitive} setCase={setCase}                        
                                    />
                        
                    )}
                    
                </div>
              )}

            

        </div>
    )
}