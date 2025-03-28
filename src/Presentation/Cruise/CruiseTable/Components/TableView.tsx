import useViewModel from '../Control/CruiseTable';
import { Cruise, CruiseSelection } from '@/Domain/Model/Cruise';
import CruiseView from './CruiseView';
import { useEffect, useRef, useState } from 'react';

interface TableProps {
    getCountryCode: any
    filter: any
    filterCruises: any
    aggregateTotalArea: any
    sortCruises: any
    data: Cruise[]
    setTotalArea: any
    setFilter: any
    selectedCruises: any
    setSelectedCruise: any
    selectCruise: any
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TableView( {
    getCountryCode,
    filter,
    filterCruises,
    aggregateTotalArea,
    sortCruises,
    data,
    setTotalArea,
    setFilter,
    selectedCruises,
    setSelectedCruise,
    selectCruise,
    isOpen, 
    setIsOpen
} : TableProps ) {

    useEffect(() => {
        const area = data
        .filter(a => a.total_area !== null && !isNaN(a.total_area))
        .map(a => a.total_area).reduce((a,b) => +a + +b, 0)
        setTotalArea(area);
    }, [data]);

    const [dummy, setDummy] = useState(0);

    const handleFilterChange = (event: React.FormEvent<HTMLFormElement>) => {
        const searchInput = event.currentTarget.elements[0] as HTMLInputElement;
        filterCruises(data, searchInput.value.trim())
        event.preventDefault()
    };

    const handleAscSortClick = () => {
        sortCruises(data, CruiseSelection.ascendingOrder)
        setDummy(prev => prev + 1)
    };

    const handleDescSortClick = () => {
        sortCruises(data, CruiseSelection.descendingOrder)
        setDummy(prev => prev + 1)
    };


    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            selectAll(event.target.checked);
    };

    const [checkAll, selectAll] = useState(false);


    return (
        <div>
            <div className='sm:flex items-center justify-between'>
                <div className="sm:flex items-center justify-between">
                    <div className="flex items-center">
                        <a onClick={handleAscSortClick} className="rounded-full focus:outline-none focus:ring-2  focus:bg-indigo-50 focus:ring-indigo-800" >
                            <div className="py-2 px-8 bg-teal-400 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full">
                                <p>Newest</p>
                            </div>
                        </a>
                        <a onClick={handleDescSortClick} className="rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8" >
                            <div className="py-2 px-8 bg-yellow-400 text-gray-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-full ">
                                <p>Oldest</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div  className="relative block   overflow-y-auto">
                <form id='filter' onSubmit={handleFilterChange} >   
                    <label  className="mb-2 text-sm font-medium sr-only ">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input  type="text" id="message" className="block overflow-visible p-4 pl-10 text-sm  border rounded-lg" placeholder="Filter" required/>
                    </div>
                </form>
                <div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={toggleMenu}
                >
                    <span className="text-lg">Sort By {filter}</span>
                    <svg
                    className={`h-4 w-4 transform transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}                
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                    </svg>
                </div>
                <div
                    className={`absolute mt-1  min-w-max shadow rounded bg-gray-300 border border-gray-400 transition-opacity duration-10 ease-in-out z-10 cursor-pointer ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                >
                    <ul className="block text-right text-gray-900">
                        { Reflect.ownKeys(data[0]).map( (prop, i) => {
                            return (
                                <li key={i}>
                                    <a  onClick={() => {
                                        setIsOpen((prev) => !prev)
                                        setFilter(prop.toString())
                                        }} className="block px-3 py-2 hover:bg-gray-200">
                                    {prop.toString()}
                                    </a>
                                </li>
                                )
                        }) }
                        
                    </ul>
                </div>
                    <br/>
                <div className='bg-white py-4 md:py-7 px-4 md:px-8 xl:px-10'>
                    {data  ?(
                    <table className="table-auto">                
                        <thead className="text-xs ">
                            <tr className=''>
                                <th scope="col"  className='table-auto'>
                                    <div className="bg-gray-200 rounded-sm w-5 h-5 mb-5 flex flex-shrink-0 justify-center items-center relative">
                                        <input onChange={handleCheckboxChange} placeholder="checkbox" type="checkbox" className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full" />
                                        <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
                                            <svg className="icon icon-tabler icon-tabler-check" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z"></path>
                                                <path d="M5 12l5 5l10 -10"></path>
                                            </svg>
                                        </div>
                                    </div>                            
                                </th>
                                <th scope="col"  className='table-auto'>
                                    <p>Survey/Entry Id</p>
                                </th>
                                <th  scope="col" className='table-auto'>
                                    <p>Chief Scientist</p>
                                </th>
                                <th  scope="col" className='table-auto'>
                                    <p>Platform Id ( Device Make & Model )</p>
                                </th>
                                <th scope="col"  className='table-auto'>
                                    <p>Total Aggregate Area: {aggregateTotalArea} </p>  
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {selectedCruises && Object.keys(selectedCruises).length > 0 ? (
                            <tr>
                                Selected: 
                                {Object.values(selectedCruises).map((entry: any, i: number) => (
                                    <td key={i}>
                                        Entry ID: {entry.entryIdentifier}
                                    </td>
                                ))}
                            </tr>
                        ) : (
                            <tr>
                                <td>Awaiting Selection</td>
                            </tr>
                        )}

                            {data.map((cruise: Cruise, i:number) => {
                                if(i < 113) {
                                    return (
                                        <CruiseView key={i} cruise={cruise} getCountryCode={getCountryCode}
                                        selectedCruises={selectedCruises} setSelected={setSelectedCruise} 
                                        selectCruise={selectCruise} selectAll={checkAll} />
                                    );
                                }
                                
                            })}
                        </tbody>
                    </table>) : (
                            <div className="text-2xl font-extrabold">No cruise data available (yet).</div>
                    )}
                </div>
            </div>
        </div>
    )
}