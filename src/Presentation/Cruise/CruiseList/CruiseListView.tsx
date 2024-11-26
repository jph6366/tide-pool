import { useEffect, useRef, useState } from 'react';
import useViewModel from './Control/CruiseTable';
import { CruiseSelection } from '@/Domain/Model/Cruise';
import TableView from './TableView';

export default function CruiseListView() {

    const {
        filterCruises,
        sortCruises,
        aggregateTotalArea,
        getAggregateTotalArea,
        cruises
    } = useViewModel();




    const handleResetClick = async () => {
       return;
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
        filterCruises(filterStr.trim())
        }
    };





    return (
        <div>
            <div className="relative w-full overflow-x-clip ">
            <button onClick={handleResetClick} type="button" className="bg-teal-700 text-white lg:text-5xl md:text-4xl font-bold border rounded-full w-3/12 h-56 text-center mr-8 mb-2 ">
                Fetch GMRT</button>
            <button onClick={handleAscSortClick} type="button" className="bg-teal-700 text-white lg:text-5xl md:text-4xl font-bold rounded-b-full w-1/6 h-56  border text-center mr-2 ">
                Descending</button>
            <button onClick={handleDescSortClick} type="button" className="bg-teal-700 text-white lg:text-5xl md:text-4xl font-bold rounded-b-full w-1/6 h-56 border text-center mr-2">
                Ascending</button>
                <div className='text-2xl font-extrabold w-7/12 break-words'>The Global Multi-Resolution Topography <a className='text-blue underline-offset-auto' href='https://www.gmrt.org/about/index.php'>(GMRT)</a> Synthesis is a multi-resolution 
                Digital Elevation Model (DEM) maintained in three projections and managed with a scalable global architecture that offers infrastructure 
                for accessing the DEM as grids, images, points and profiles.</div>
                <br/>
                <div className='text-4xl font-extrabold w-full break-words'>GMRT Cruise Info provides access to cruise metadata from the GMRT Synthesis.</div>
                <br/>

            <div className='text-4xl font-extrabold w-7/12 break-words'>AGGREGATE TOTAL AREA: {aggregateTotalArea}</div>
            
            <form >   
                <label  className="mb-2 text-sm font-medium sr-only ">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="text" id="message" onChange={handleFilterChange} className="block overflow-visible p-4 pl-10 text-sm  border rounded-lg" placeholder="Filter" required/>
                </div>
            </form>            
            <TableView/>
        </div>
        </div>
    )
}