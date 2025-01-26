/* eslint-disable react/no-unescaped-entities */
/* eslint-disable camelcase */
import useViewModel from './Control/CruiseTable';
import { Cruise } from '@/Domain/Model/Cruise';
import TableView from './Components/TableView';
import { CruiseStatus } from '@/Data/DataSource/API/Entity/CruiseEntity';
import RejectedTableView from './Components/RejectedTableView';
import UnderReviewTableView from './Components/underReviewTableView';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Map, { ControlPosition, Layer, MapRef, Source, useControl } from 'react-map-gl';
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
import { Feature } from 'geojson';



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
    } = useViewModel();

    const {
        drawMode, setDrawMode,
        GMRTPolylineToolMod
    } = useDrawMode();


    const [open, setOpen] = useState(false);
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


    const [arcs, setCircleArcs] = useState<Coordinate[]>(
        []
    )
    const [features, setFeatures] = useState({});

    const onUpdate = useCallback((event:any) => {
      setFeatures(async currFeatures => {
        const newFeatures: { [key: string]: Feature } = {...currFeatures};
        for (const f of event.features) {
          newFeatures[f.id] = f;
          if(f.geometry.type == 'LineString') {
            const processedCoords: Coordinate[] = f.geometry.coordinates.map(([latitude, longitude]:any) => ({ latitude, longitude }));
            setCircleArcs(processedCoords)
            setProfile(await getElevationProfile(processedCoords))
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
        }
        return newFeatures;
      });
    }, []);

    const mapRef = React.useRef<MapRef>(null);
    const [isGridActive, setIsGridActive] = useState(false);
    const [gridControlList, setGridControlList] = useState<any[]>([]);


    // Function to add the map grid
    const addMapGrid = useCallback((map: mapboxgl.Map) => {
        console.log('Adding grid...');
        // Example: return a list of layers or controls added
        return ['gridLayer1', 'gridLayer2'];
    }, []);

    // Function to remove the map grid
    const removeMapGrid = useCallback((map: mapboxgl.Map, gridList: any[]) => {
        console.log('Removing grid...');
    }, []);

    // Function to add map labels
    const addMapLabel = useCallback((map: mapboxgl.Map) => {
        console.log('Adding labels...');
    }, []);

    // Function to remove map labels
    const removeMapLabel = useCallback((map: mapboxgl.Map) => {
        console.log('Removing labels...');
    }, []);


    // Toggle grid and labels on/off
    const handleToggleGrid = () => {
        if (isGridActive && gridControlList.length && mapRef.current) {
            const map = mapRef.current.getMap();
            removeMapGrid(map, gridControlList);
            removeMapLabel(map);
            setGridControlList([]);
            setIsGridActive(false);
        } else if (!isGridActive && mapRef.current) {
            const map = mapRef.current.getMap();
            const newGrid = addMapGrid(map);
            setGridControlList(newGrid);
            addMapLabel(map);
            setIsGridActive(true);
        }
    };

    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (map) {
            const handleLoad = () => {
                if (isGridActive) {
                    const initialGrid = addMapGrid(map);
                    setGridControlList(initialGrid);
                    addMapLabel(map);
                }
            };
            map.on('load', handleLoad);

            return () => {
                map.off('load',handleLoad);
            };
        }
    }, [addMapGrid, addMapLabel, isGridActive]);



    const entryFilter = ['==', 'entry_id', selectedCruise?.entryIdentifier || ''];


    return (
        <div className='min-h-screen bg-gray-50 py-6 flex flex-col items-center justify-center relative overflow-hidden sm:py-12'>
            <div  onClick={() => setOpen(!open)} className="p-4 bg-gray-700 w-1/2 rounded flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-900" fill="lightblue" viewBox="0 0 512 512" stroke="currentColor" strokeWidth="15">
                        {/* <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /> */}
                        <path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5l0 39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9l0 39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7l0-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1L257 256c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/>
                    </svg>
                    <h4 className="font-medium text-sm text-blue-500">GMRT</h4>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
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
                            mapStyle={mapStyle}
                            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                        >
                            <DrawControl
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
                                }} onCreate={onUpdate} onUpdate={onUpdate} onDelete={onDelete}                            />
                            
                            <div className='mapboxgl-ctrl-top' >
                                <div className='mapboxgl-ctrl-group mapboxgl-ctrl' >
                                    <button onClick={() => setDrawMode('simple_select')}
                                     style={{
                                display:'inline-block'
                            }} className='mapbox-gl-draw_ctrl-draw-btn'>
                                <svg width="24px" height="20px" viewBox="0 0 27 27" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="panIconTitle" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" color="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title id="panIconTitle">Pan</title> <path d="M20,14 L20,17 C20,19.209139 18.209139,21 16,21 L10.0216594,21 C8.75045497,21 7.55493392,20.3957659 6.80103128,19.3722467 L3.34541668,14.6808081 C2.81508416,13.9608139 2.94777982,12.950548 3.64605479,12.391928 C4.35756041,11.8227235 5.38335813,11.8798792 6.02722571,12.5246028 L8,14.5 L8,13 L8.00393081,13 L8,11 L8.0174523,6.5 C8.0174523,5.67157288 8.68902517,5 9.5174523,5 C10.3458794,5 11.0174523,5.67157288 11.0174523,6.5 L11.0174523,11 L11.0174523,4.5 C11.0174523,3.67157288 11.6890252,3 12.5174523,3 C13.3458794,3 14.0174523,3.67157288 14.0174523,4.5 L14.0174523,11 L14.0174523,5.5 C14.0174523,4.67157288 14.6890252,4 15.5174523,4 C16.3458794,4 17.0174523,4.67157288 17.0174523,5.5 L17.0174523,11 L17.0174523,7.5 C17.0174523,6.67157288 17.6890252,6 18.5174523,6 C19.3458794,6 20.0174523,6.67157288 20.0174523,7.5 L20.0058962,14 L20,14 Z"></path> </g></svg>
                            </button>
                                    <button onClick={() => setDrawMode('gmrt_maptool')}
                                    style={{
                                display:'inline-block'
                            }} className='mapbox-gl-draw_ctrl-draw-btn '>
                                <svg width="24px" height="20px" viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" strokeWidth="0.00024000000000000003" transform="matrix(-1, 0, 0, -1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.8160000000000001"></g><g id="SVGRepo_iconCarrier"><path d="M1 3v18h22V3zm21 17H2V4h20z"></path><path opacity=".25" d="M2 4h20v16H2z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>                            </button>
                                                                    
                                    <button onClick={() => setDrawMode('gmrt_polyline')}
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
                                    <button onClick={handleToggleGrid} className='mapbox-gl-draw_ctrl-draw-btn'>
                                        <svg width="23px" height="23px" viewBox="0 -7.5 186 186" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clipPath="url(#clip0)"> <path d="M185.696 74.2188C185.375 55.2226 177.659 39.0104 162.744 26.0344C150.784 15.6176 136.097 8.031 119.101 3.47659C112.524 1.71949 105.574 0.214102 98.304 0.214102C94.48 0.202117 90.6677 0.649697 86.9515 1.5472C69.8893 5.72476 57.3763 10.5515 46.3905 17.2153C29.9619 27.1811 19.5299 37.0811 12.5661 49.3214C3.15379 65.8443 -0.273628 82.8985 2.08723 101.46C3.48155 112.387 7.49047 123.169 14.7074 135.389C20.397 145.017 27.6938 151.926 37.0191 156.501C41.9213 158.915 46.7436 161.249 51.7399 163.377C64.9664 169.013 78.5337 171.294 95.7361 170.77C96.8097 170.624 98.1235 170.465 99.6178 170.286C103.607 169.808 109.07 169.159 114.385 168.197C129.24 165.519 141.406 160.977 151.58 154.313C154.977 152.128 158.079 149.521 160.811 146.555C165.872 140.901 170.191 134.631 173.664 127.896C182.094 111.788 186.029 94.2303 185.696 74.2188ZM32.3362 36.3977C45.1629 24.7542 59.0906 16.6586 74.9116 11.6525L77.6534 10.7838L75.5724 12.7596C65.8472 22.0291 59.5436 33.5797 55.1348 42.604L54.9551 42.9822L54.5279 42.9758C49.0915 42.9229 37.1392 39.939 32.4765 37.4721L31.6431 37.0282L32.3362 36.3977ZM8.65123 84.6646C10.1916 69.2088 15.9076 55.4904 26.1268 42.7332L26.4065 42.3878L51.8866 49.9138L51.6399 50.5772C47.5822 61.4626 44.7175 72.7514 43.0956 84.2471L43.0151 84.8111L8.57717 85.4073L8.65123 84.6646ZM21.0909 133.281L20.7839 132.81C12.2726 119.595 8.21035 106.155 8.37068 91.7266L8.37717 91.0704H41.6345L42.4016 124.217L21.0909 133.281ZM50.7396 155.401C41.3409 151.264 31.623 146.987 24.6449 138.321L24.1516 137.71L24.8384 137.333C31.0752 133.838 37.5118 131.803 42.9813 130.271L43.7083 130.072L43.8219 130.808C45.4161 140.714 48.1438 148.339 52.3995 154.797L53.6399 156.674L50.7396 155.401ZM85.724 163.403L85.1307 163.449C84.0272 163.542 82.936 163.589 81.8552 163.589C77.3821 163.497 72.9304 162.936 68.5748 161.917C67.7719 161.671 67.0929 161.131 66.6742 160.406L65.7135 158.848C63.182 154.73 60.6309 152.583 58.1097 146.216C55.5976 139.871 53.5809 133.816 52.9272 128.261L52.8622 127.67L53.4426 127.541C64.2581 125.066 75.2738 123.552 86.3595 123.019L87.0865 122.979L85.724 163.403ZM87.3916 116.371L52.0468 121.437L51.9535 120.781C50.4923 110.61 50.7201 100.252 51.1329 91.4601L51.1596 90.8303H88.4522L87.3916 116.371ZM88.6587 84.0335H52.093L52.158 83.3108C53.0986 73.2857 55.5133 62.9085 59.5353 51.5837L59.7086 51.0991L88.6593 53.4003L88.6587 84.0335ZM88.8722 46.617L62.2921 45.0038L62.6725 44.1352C69.6089 28.1967 78.4201 16.8101 90.4133 8.32202L91.5667 7.50645L88.8722 46.617ZM120.322 12.9468C131.187 16.1422 145.148 21.182 156.807 31.9182L157.508 32.5635L155.787 33.4384C150.277 36.2435 145.077 38.8891 138.792 39.8706L138.351 39.9436L138.118 39.5564C137.197 38.0574 136.3 36.539 135.403 35.0206C130.994 27.6076 126.438 19.9359 119.695 14.0812L117.393 12.0854L120.322 12.9468ZM97.6899 14.3193C97.7704 12.668 97.8503 11.0039 97.9236 9.33976L97.9703 8.37829L98.8577 8.75578C112.017 14.3852 121.416 24.3316 129.333 41.0076L129.7 41.7819L126.599 42.3588C116.814 44.196 107.569 45.9331 97.7126 46.2512L97.0389 46.2712L97.0259 45.6013C96.7169 35.1026 97.1901 25.0065 97.6906 14.318L97.6899 14.3193ZM96.911 53.6326L133.067 48.1818L133.267 48.6458C137.563 58.3005 139.591 69.1081 139.464 81.6841V82.3203L96.9084 83.9051L96.911 53.6326ZM96.504 90.5651L139.36 89.219L139.34 89.9288C139.046 99.4016 137.983 108.834 136.159 118.136L136.045 118.713L95.4842 115.821L96.504 90.5651ZM112.393 161.367C107.99 162.077 103.575 162.674 98.9057 163.303C97.3115 163.522 95.6906 163.741 94.0295 163.967L93.2356 164.079L95.0298 122.737L95.6439 122.717C106.917 122.292 118.536 123.162 133.31 125.528L134.117 125.658L133.83 126.414C133.53 127.209 133.23 127.999 132.937 128.788C130.34 135.717 127.172 141.844 123.905 148.195C120.314 155.177 113.594 161.174 112.391 161.366L112.393 161.367ZM161.278 133.565C154.748 146.097 143.489 151.673 132.303 155.837L130.455 156.527L131.502 154.862C136.398 147.119 139.593 138.677 142.975 129.739L143.869 127.373L161.645 132.862L161.278 133.565ZM177.159 88.5821C175.979 102.719 172.551 114.561 166.381 125.847L166.133 126.304L146.023 121.066L149.472 88.7944L177.219 87.8401L177.159 88.5821ZM177.513 80.307L177.439 80.871L149.419 81.8531L149.338 81.2556C149.098 79.4488 148.884 77.622 148.671 75.8513C148.205 71.8467 147.717 67.7156 146.884 63.7506C146.057 59.8453 144.89 56.0859 143.648 52.1071C143.122 50.3964 142.568 48.6329 142.054 46.8623L141.888 46.2925L162.585 37.7587L162.892 37.9838C172.282 44.9187 179.386 65.4952 177.512 80.3057L177.513 80.307Z" fill="#000000"></path> </g> <defs> <clipPath id="clip0"> <rect width="185" height="171" fill="white" transform="translate(0.777344)"></rect> </clipPath> </defs> </g></svg>
                                    </button>
                                    <button className='mapbox-gl-draw_ctrl-draw-btn'>
                                        <svg width="23px" height="23px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M65.44 18.39l-2.327 9.717C53.95 66.384 49.07 107.884 49.07 151.293c0 93.415 23.097 178.085 61.047 240.014 17.218 28.096 37.652 51.6 60.447 68.92 26.69 21.257 56.353 32.962 87.377 32.962.364 0 1.147-.12 1.927-.25.623.008 1.247.02 1.87.02 60.13 0 113.67-39.724 151.62-101.653 37.95-61.93 61.047-146.598 61.047-240.014 0-41.557-4.858-81.203-13.256-118.012l-2.324-10.19-9.582 4.176c-50.92 22.196-113.98 35.705-182.086 35.713-2.014-.022-4.01-.06-6.002-.103V62.8c-1.296 0-2.586-.017-3.88-.03-69.783-2.053-125.493-18.078-182.545-40.698l-9.29-3.683zm380.816 28.747c6.792 32.774 10.824 67.647 10.824 104.156 0 90.547-22.596 172.38-58.494 230.963-35.9 58.582-84.36 93.38-136.848 93.38-.195 0-.39-.006-.584-.007v-63.987c-2.64.023-5.28-.03-7.914-.163-55.358-2.77-109.316-38.91-122.03-99.742l-2.355-11.256h94.895l37.404 14.207V80.206c1.946.042 3.896.078 5.862.098h.087c66.168 0 127.672-12.383 179.152-33.168zm-279.53 98.12c35.365 0 64.036 13.248 64.036 29.59 0 16.34-28.668 29.585-64.035 29.585-35.365 0-64.036-13.246-64.036-29.586 0-16.34 28.67-29.588 64.037-29.588zm186.282 0c-35.367 0-64.035 13.248-64.035 29.59 0 16.34 28.67 29.585 64.035 29.585 35.367 0 64.035-13.246 64.035-29.586 0-16.34-28.67-29.588-64.035-29.588zM152.572 319.17c14.72 45.053 57.247 71.428 101.602 73.646 44.8 2.24 90.238-19.45 110.416-73.646h-57.447l-44.204 16.187-42.62-16.187h-67.748z"></path></g></svg>                                    
                                    </button>
                                    <button className='mapbox-gl-draw_ctrl-draw-btn'>
                                        <svg width="23px" height="23px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--gis" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M50 0C22.404 0 0 22.404 0 50s22.404 50 50 50c27.546 0 49.911-22.324 49.992-49.852A1.5 1.5 0 0 0 100 50a1.5 1.5 0 0 0-.006-.133C99.922 22.332 77.552 0 50 0zm2.578 3.072c.73.04 1.456.094 2.176.166c-.226.3-.303.687-.147 1.196c.445-.552 1.045-.848 1.717-1C79.302 6.52 97 26.17 97 50c0 21.386-14.257 39.404-33.79 45.107c-.376-1.198.474-3.381 1.546-4.38c1.627-.733-.484-2.493 1.21-1.89c2.043-.158 3.986-4.788 4.1-6.587c-3.046 2.258-3.545-4.134-2.134-4.957c2.623-.125 5.68-2.908 2.14-4.088c-5.064.735 4.979-6.522-.66-2.684c-2.246 4.08-2.244-2.314-3.053-1.617c.553 3.495-3.746 3.59-2.877.121c3.086-1.527-1.046-3.377.913-4.748c.83-1.001 1.492-2.523 2.207-.357c.51 1.51 4.512 4.05 5.314 3.57c.319-2.573 2.03-4.241.01-6.496c1.183-5.266-1.522 3.246-3.479-1.213c-1.49-2.808.445-8.9-1.953-9.295c-1.092-4.941 2.353-8.44 6.963-9.29c1.49-.673-3.492-1.27-.473-2.706c-.58-1.985-.868-5.913-2.744-2.347c-2.32 1.134-8.463-5.47-5.285-4.858c1.225 4.352 8.304 3.232 5.928.246c-3.906.625-2.243-2.82-3.799-2.23c.597-1.172-1.134-1.896-3.125-2.451c-2.831-1.372-4.952-3.338-4.182.619c-4.747 2.513-.251-3.496-1.49-5.502c3.188-2.501-2.797-2.183-2.687-4.416c-.238-2.203-4.696.172-2.479 2.547c-2.71.276-5.983-2.056-1.338-1.485c-1.46-2.317-4.023-2.777-6.205-2.804c-.727-.01-1.414.03-2.002.064c-2.651 2.816-10.39.097-10.6 3.816c3.805-.15-.26 5.786-2.246 7.225c-3.11 2.286-.194 5.615-2.507 8.34c-.808 2.059 2.843-.931 1.797-1.98c3.646-2.04 3.964 1.766 1.867 3.824c2.858 1.688-1.471 3.055-1.889 4.68c-2.07.946 2.54.805 1.469-1.147c1.093-1.582 4.98-.048 2.37-2.777c-1.905-1.522.63-6.099 2.475-3.692c2.979 1.314.616 2.917-.878 1.58c-.966.883 1.388.592.337 1.547c1.868-1.24 3.695-1.086 3.338 1.02c.36-2.857 6.745-.436 7.405 1.923c2.824-1.672 8.224.625 6.49 3.854c.151 2.049 1.509 3.951.95 6.01c-.04 3.468-.19 6.835-4.415 8.064c-3.006 1.877-4.39 4.542-6.3 7.559c-4.099-2.023-3.292-7.966-2.288-11.649c.36-2.493 2.868-6.619-.273-8.52c-.893-1.633.915-3.724-1.574-1.99c-2.933 3.415-3.76-3.862-4.616-.716c-3.483-1.416-4.123 7.586-2.445 2.138c3.202-4.789 5.647 1.223 5.234 4.2c-.659 2.6-.108 4.587-.146 6.931c-2.211-.087-2.565 4.364-4.274 3.176c-1.364-1.315-1.906-6.876-3.275-4.435c1.85.762 1.32 4.555 1.559 6.373c4.293-3.06.362 5.943 3.521 7.447c-.003 2.725-.796 3.97.598 6.219c-.754 3.29-7.544-2.65-2.492-3.788c-.945.409-3.856-1.382-3.163.43c-.926-1.294-3.723-4.063-1.398-1.172c-1.652 1.754.615 3.619 1.805 3.24c-.42 2.862-5.15.38-6.157-1.068c-2.164-.983-1.297 2.495-3.785.137c-2.721.09-3.513 2.764-6.46.213c-1.138.285-.355 5.002-2.297 1.851c-.057-5.124-3.435-7.465-5.815-11.574c-.18.225-.312.458-.422.693A47.04 47.04 0 0 1 3 50c0-1.228.062-2.44.154-3.645c.17-.514.361-1.026.578-1.533c.26-5.16 4.63-7.198 8.108-9.586c.676-2.022 5.998-3.926 2.398-3.341c3.05-2.456 7.768-4.166 8.711-8.452c.884-1.306-1.657-4.731.576-3.683c-.149-3.802 3.425-6.888 6.2-9.395c3.534-1.832-4.58 3.52-4.233 5.897c-2.67 5.136 3.177-.464 4.133.136c1.312 1.14-.626 4.13 1.88 1.801c2.832-.38 1.772-3.036 5.028-3.191c-2.063-2.638 3.073-4.275 4.951-6.123c-.407-2.217 3.019-4.332 4.82-4.727c-2.156 1.065 1.333 3.612-2.015 4.887c1.351 1.36 3.228-2.803 5.834-1.025c2.388.829 8.11-2.04 2.861-1.922c-.772-1.57.04-2.613-.406-3.026zm6.92 28.914c.285.005.749.288 1.457.989c.298.844.577 3.238-1.016 2.591c-.55-1.114-1.297-3.593-.441-3.58zm-.441 6.684c.27-.021.58.062.93.283c2.348-.409-1.525 1.442 1.654 1.635c.311 1.548-1.66.79-.424 2.637l-.393-.018c-3.534.903-3.66-4.387-1.767-4.537zm30.859 3.902c-.273 1.91.821 5.621 3.088 3.24c.388.285.718 2.406 1.209.952c1.853-5.002-4.622-.15-4.297-4.192zm-57.353 6.254c-.09-.018-.318.184-.858.836c-2.925-.376-2.114 5.137-5.066 2.893c2.893-.617-1.533-1.528 1.187-2.797c-3.57-1.721-8.082.213-6.103 4.734c1.21 2.024-.124 4.74 1.068 5.895l.111-.295v.004c.636-1.412 3.905.283 3.135-3.057c2.246-.882 3.14-5.902 6.078-4.164c3.277-.572-1.367-2.41.934-3.16c-.754.26-.289-.849-.486-.889zM90.73 52.1c-2.298 1.213-1.382 4.35-3.851 4.87c.056.583.49 4.831 1.615 2.944c-.121-2.434 3.748-6.742 2.236-7.814zm-15.296 1.86a.986.986 0 0 0-.368.017c-1.126 2.296 2.03 5.581.182 6.513c-.595 1.32.112-.065.512.137c2.85-1.254 1.488-6.412-.326-6.666zm-18.346 4.058c2.678-.234.45 5.405-2.861 3.709c-.835-1.07-1.844-3.615 1.4-3.211c.594-.312 1.078-.465 1.46-.498zm35.174.74c.693 2.715-2.368 2.775-2.297 6.512c-1.438 4.67-5.504.2-7.694 2.375c-5.026.647.96.809 2.49-.186c-.242 1.793-.394 7.314-2.607 4.707c4.606-3.869-5.443-1.74-1.742.98c-2.681 3.178-1.044-4.214-2.24-2.275c-2.551 2.692-3.19 5.895-4.367 9.207c.094.23-3.134 2.29-1.694 1.762c3.556-2.048 6.847-7.12 10.032-7.99c.873 3.098 5.955-1.685 5.841-3.961c2.2-2.824 7.323-8.466 4.278-11.131zM9.627 73.865c.112 0 .632.435 1.82 1.537c1.03 1.873 2.033 3.085 1.69.56c2.34 1.464 3.757 8.098 1.185 2.513c-1.772-.013 3.004 4.039 3.907 5.49c.353.313 1.318 1.555 1.199 1.73a47.197 47.197 0 0 1-7.362-7.941c-.925-1.738-2.689-3.888-2.439-3.889zm13.51 14.326c.163.023.547.374 1.175 1.17c-.414-.27-.823-.548-1.228-.832c-.068-.223-.057-.353.053-.338z" fill="#000000"></path></g></svg>                                    
                                    </button>
                                    <button className='mapbox-gl-draw_ctrl-draw-btn'>
                                        <svg width="23px" height="23px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--gis" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M50 0C22.404 0 0 22.404 0 50s22.404 50 50 50c27.546 0 49.911-22.324 49.992-49.852A1.5 1.5 0 0 0 100 50a1.5 1.5 0 0 0-.006-.133C99.922 22.332 77.552 0 50 0zm-5.492 3.328c-1.833.901-3.595 1.954-5.363 2.713c-.996 2.1-4.684 2.981-4.926 6.07c-1.948 1.117 1.792 1.513-.4 3.588c-.233 3.345 6.36.31 2.306 3.211c-3.105 2.288-8.25-.148-8.346-3.912c-1.016-1.889-.584-4.209-.629-6.076a46.693 46.693 0 0 1 17.358-5.594zm-2.1 18.6c.178.032-.036.418-1.084 1.402c-.264.838 4.275-2.51 2.28.559c-2.873 1.037-.586 2.744-.297 5.23c1.346 2.85 1.275 5.491 4.722 6.285c4.51 3.426 6.312-3.533 10.38-2.927c3.763-.537 7.1 1.027 9.128 4.433c2.468 2.102 2.452 5.868 4.895 8.063c-.574 2.9 3.198 4.893 3.07 7.746c-.914 3.451-4.483 6.516-5.594 8.98c1.802 3.831-3.053 5.833-3.037 8.406c-1.78 2.548-4.562.734-6.371 3.446c-3.521-.178-6.242 1.592-9.37 2.015c.122.422-1.292-.473-1.157-.107c-3.805-1.176-7.438-2.96-9.717-6.383c-3.885-2.828 1.364-3.54 2.072-5.082c2.87-1.74-3.714-3.803-3.369-6.889c-3.599-1.165-5.888-4.957-6.906-8.455c-1.05-2.14 2.368-5.4 3.232-7.123c-4.179.938-1.47-4.873 1.662-5.025c1.553-.094 1.9-2.605 2.496-2.912c-2.433-.2-1.157-4.358.797-3.936c-2.742-1.686 1.1-4.094.045-6.11c.44-.748 1.827-1.67 2.123-1.616zM90.4 25.97a46.722 46.722 0 0 1 4.778 11.066c-2.45-3.225-5.302-6.909-4.785-10.867c.008-.068.001-.132.007-.2zM21.504 83.1c.365-.02.922.072 1.726.304c2.06 1.201 6.294-.586 6.96 1.666c-.143 2.898-7.281-1.773-6.364.389c-1.782-.188 1.11 3.147-.941 1.59c-.953-1.714-2.962-3.867-1.381-3.95zm20.736 8.105a1.45 1.45 0 0 1 .254.008c1.523.175 3.591 2.544.072 1.537c-.382.266-.86.726-1.234.107c-.095-1.181.335-1.615.908-1.652zm25.133 1.057c.214.476.468.837.748 1.117A46.899 46.899 0 0 1 50 97c-4.514 0-8.873-.648-13.004-1.834c.746-1.562 5.875-2.168 7.46-1.443c2.178-.502 6.067 2.213 9.052 2.398c4.947.22 9.278-2.744 13.865-3.86z" fill="#000000"></path></g></svg>                                
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
                    <p className=' text-xs'>Select a line on the map to draw a profile. Click to start a line and double-click to end.</p>
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
                                <a onClick={() => setStatus(CruiseStatus.merged)} className="rounded-full focus:outline-none focus:ring-2  focus:bg-indigo-50 focus:ring-indigo-800" href=" javascript:void(0)">
                                    <div className="py-2 px-8 bg-indigo-100 text-gray-600 hover:text-indigo-700 hover:bg-teal-400 rounded-full">
                                        <p>Merged</p>
                                    </div>
                                </a>
                                <a onClick={() => setStatus(CruiseStatus.merged)} className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8" href="javascript:void(0)">
                                    <div className="py-2 px-8 bg-indigo-100 text-gray-600 hover:text-indigo-700 hover:bg-yellow-400 rounded-full ">
                                        <p>Under Review</p>
                                    </div>
                                </a>
                                <a onClick={() => setStatus(CruiseStatus.merged)} className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8" href="javascript:void(0)">
                                    <div className="py-2 px-8 bg-indigo-100 text-gray-600 hover:text-indigo-700 hover:bg-red-400 rounded-full ">
                                        <p>Rejected</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {cruiseStatus == CruiseStatus.merged  ?(
                        <TableView 
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