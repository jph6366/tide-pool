/* eslint-disable react/no-unescaped-entities */
/* eslint-disable camelcase */
import useViewModel from './Control/CruiseTable';
import { Cruise, CruiseSelection } from '@/Domain/Model/Cruise';
import TableView from './Components/TableView';
import { CruiseAtomWithCache, CruiseStatus, rejectedCruiseAtomWithCache, underReviewCruiseAtomWithCache } from '@/Data/DataSource/API/Entity/CruiseEntity';
import RejectedTableView from './Components/RejectedTableView';
import UnderReviewTableView from './Components/underReviewTableView';
import { useCallback, useState } from 'react';
import Map, { Layer, Marker, Popup, Source } from 'react-map-gl';
import { useAtom } from 'jotai';
import JotaiControls from '@/Presentation/WebR/JotaiControls';
import mapStateAtom from '@/Presentation/JotaiStore/Store';

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
        setCase
    } = useViewModel();

    const [open, setOpen] = useState(false);
    const [state, dispatch] = useAtom(mapStateAtom);
    const { mapStyle, viewState } = state;
    const onMove = useCallback((evt:any) => {
        dispatch({type: 'setViewState', payload: evt.viewState});
      }, []);
    
    // Convert to GeoJSON FeatureCollection


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
                    <JotaiControls/>
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
                                        'circle-color': '#007cbf',
                                        }}
                                    />

                            </Source>

                        </Map>
                    <div className='sm:flex items-center justify-between'>
                        <div className="sm:flex items-center justify-between">
                            <div className="flex items-center">
                                <a onClick={() => setStatus(CruiseStatus.merged)} className="rounded-full focus:outline-none focus:ring-2  focus:bg-indigo-50 focus:ring-indigo-800" href=" javascript:void(0)">
                                    <div className="py-2 px-8 bg-indigo-100 text-gray-600 hover:text-indigo-700 hover:bg-teal-400 rounded-full">
                                        <p>Merged</p>
                                    </div>
                                </a>
                                <a onClick={() => setStatus(CruiseStatus.underReview)} className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8" href="javascript:void(0)">
                                    <div className="py-2 px-8 bg-indigo-100 text-gray-600 hover:text-indigo-700 hover:bg-yellow-400 rounded-full ">
                                        <p>Under Review</p>
                                    </div>
                                </a>
                                <a onClick={() => setStatus(CruiseStatus.isRejected)} className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8" href="javascript:void(0)">
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
                        filter={filter} filterCruises={filterCruises}  setFilter={setFilter}
                        aggregateTotalArea={aggregateTotalArea} setTotalArea={setTotalArea}
                        data={data}  
                        isOpen={isOpen} setIsOpen={setIsOpen} />
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