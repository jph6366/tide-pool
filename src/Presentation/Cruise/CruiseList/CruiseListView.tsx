import { useEffect, useRef, useState } from 'react';
import useViewModel from './CruiseListViewModel';
import { Cruise, CruiseSelection } from '@/Domain/Model/Cruise';
import Map, { Marker, Popup } from 'react-map-gl';
import Pin from '@/Presentation/Map/Pin';
import ControlPanel from '@/Presentation/Map/ControlPanelViewMapGL';
import WebRView from '@/Presentation/WebR/WebRView';

export default function CruiseListView() {
    const inputRef = useRef(null);

    const {
        filterCruises,
        sortCruises,
        getCruises,
        toggleFilter,
        cruises,
        totalArea,
        toggle,
        pins
    } = useViewModel();

    const [mapStyle, setMapStyle]: any = useState(null);
    const [popupInfo, setPopupInfo] = useState<Cruise>();





    useEffect(() => {
        // getCruises();
    }, [cruises, pins]);




    const handleResetClick = async () => {
        await getCruises();
    };


    const handleAscSortClick = () => {
        sortCruises(CruiseSelection.ascendingOrder)
    };

    const handleDescSortClick = () => {
        sortCruises(CruiseSelection.descendingOrder)
    };

    const handleFilterChange = (event:any) => {
        if(event.target.value === ''){
            handleResetClick()
        } else{
        const filterStr:string = event.target.value
        filterCruises(filterStr.trim(), toggle)
        }
    };

    const handleRadioChange = async (event:any) => {
        await toggleFilter(event.target.value)
    }




    return (
        <div>
            <div className="relative w-full overflow-x-clip ">
            <button onClick={handleResetClick} type="button" className="bg-teal-700 text-white lg:text-5xl md:text-4xl font-bold border rounded-full w-3/12 h-56 text-center mr-8 mb-2 ">
                Fetch GMRT</button>
            <button onClick={handleAscSortClick} type="button" className="bg-teal-700 text-white lg:text-5xl md:text-4xl font-bold rounded-b-full w-1/6 h-56  border text-center mr-2 ">
                Descending</button>
            <button onClick={handleDescSortClick} type="button" className="bg-teal-700 text-white lg:text-5xl md:text-4xl font-bold rounded-b-full w-1/6 h-56 border text-center mr-2">
                Ascending</button>
                <WebRView />
                <Map
            initialViewState={{
                latitude: 37.805,
                longitude: -122.447,
                zoom: 15.5,
            }}

            style={{display:'inline-flex' , width: '90%', height: '600px', marginLeft: '5%'}}
            mapStyle={mapStyle && mapStyle.toJS()}
            styleDiffing
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            >
            {
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
            }
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
                <ControlPanel onChange={setMapStyle} />

            </Map>  

            <div className='text-4xl font-extrabold w-7/12 break-words'>AGGREGATE TOTAL AREA: {totalArea}</div>
            
            <form>   
                <label  className="mb-2 text-sm font-medium sr-only ">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input ref={inputRef} type="text" id="message" onChange={handleFilterChange} className="block overflow-visible p-4 pl-10 text-sm  border rounded-lg" placeholder="Filter" required/>
                </div>
            </form>            
            <table className="w-full text-sm text-left ">
                <thead className="text-xs ">
                    <tr className=''>
                        <th scope="col" className=" px-6 py-3">
                        <input type="radio" id="option0" value={0} name="tabs" className=" absolute" onChange={(e) => handleRadioChange(e)} />
                        <label htmlFor="option0" className=" absolute cursor-pointer flex items-center justify-center truncate uppercase select-none font-semibold text-lg rounded-full py-2">SHIP NAME</label>
                        </th>
                        <th scope="col" className=" px-6 py-3">
                        <input type="radio" id="option1" value={1} name="tabs" className="absolute" onChange={(e) => handleRadioChange(e)} />
                        <label htmlFor="option1" className="absolute cursor-pointer  flex items-center justify-center truncate uppercase select-none font-semibold text-lg rounded-full py-2">SURVEY/ENTRY ID</label>                            
                        </th>
                        <th scope="col" className="font-semibold text-lg px-6 py-3">
                            CREATED
                        </th>
                        <th scope="col" className="font-semibold text-lg px-6 py-3">
                            TOTAL AREA
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {cruises.map((cruise, i) => {
                        return (
                        <tr key={i} className=" border-b ">
                            <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                {cruise.platform_id}
                            </th>
                            <td className="px-6 py-4">
                                {cruise.survey_id}
                            </td>
                            <td className="px-6 py-4">
                                {cruise.created}
                            </td>
                            <td className="px-6 py-4">
                                {cruise.total_area}
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        </div>
    )
}