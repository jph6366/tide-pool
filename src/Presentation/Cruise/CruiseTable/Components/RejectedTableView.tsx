import useViewModel from '../Control/CruiseTable';
import { Cruise } from '@/Domain/Model/Cruise';
import CruiseView from './CruiseView';
import { useEffect, useRef, useState } from 'react';
import { CruiseStatus, rejectedCruiseAtomWithCache } from '@/Data/DataSource/API/Entity/CruiseEntity';
import { atom, useAtom } from 'jotai';

interface TableProps {
    data: Cruise[]
    filter: any
    aggregateTotalArea: any
    setTotalArea: any
    setFilter: any
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    filterCruises: any
}


export default function RejectedTableView( {
    data,
    filter,
    aggregateTotalArea,
    setTotalArea,
    setFilter,
    isOpen, 
    setIsOpen,
    filterCruises
} : TableProps ) {

    // const {
    //     filterInPlace,
    //     aggregateTotalArea,
    //     rejectedCruises,
    //     setTotalArea,
    //     filter,
    //     setFilter,
    //     isOpen, 
    //     setIsOpen
    // } = useViewModel();
    const [caseSensitive, setCase] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(13); // Default number of items
    const containerRef = useRef<HTMLDivElement>(null); // Ref for the container


    const handleScroll = () => {
        const container = containerRef.current;
        if (container) {
            // Check if scrolled to the bottom
            if (container.scrollHeight - container.scrollTop === container.clientHeight) {
                setItemsToShow((prev) => prev + 100); // Load 5 more items
            }
            // Optional: Detect scrolling up to reduce items if necessary
        }
    };

    useEffect(() => {
        const area = data.filter(a => a.total_area !== null && !isNaN(a.total_area))
        .map(a => a.total_area).reduce((a,b) => +a + +b, 0)
        setTotalArea(area);
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const handleFilterChange = (event: React.FormEvent<HTMLFormElement>) => {
        const searchInput = event.currentTarget.elements[0] as HTMLInputElement;
        filterCruises(data, searchInput.value.trim())
        const area = data.filter(a => a.total_area !== null && !isNaN(a.total_area) && a.platform_id.includes( searchInput.value.trim()))
        .map(a => a.total_area).reduce((a,b) => +a + +b, 0)
        setTotalArea(area);
        event.preventDefault()
    };

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const toggleCase = () => {
        setCase((prev) => !prev);
    };


    return (
        <div ref={containerRef}  className="relative block">
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
            <div onClick={toggleCase} className="bg-gray-200 rounded-sm w-5 h-5 mb-5 flex flex-shrink-0 justify-center items-center relative">
                <input placeholder="checkbox" type="checkbox" className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full" />
                <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
                    <svg className="icon icon-tabler icon-tabler-check" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z"></path>
                        <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                </div>
            </div> 
            {  caseSensitive == true ?(
            <p>{'Case Sensitive'}</p>
            ) : (
                <p>{'Case Sensitive'.toLowerCase()}</p>
            )
            }
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
                                    }} 
                                    className="block px-3 py-2 hover:bg-gray-200">
                                {prop.toString()}
                                </a>
                            </li>
                            )
                    }) }
                    
                </ul>
            </div>
                 <br/>  
            <div className='bg-white py-4 md:py-7 px-4 md:px-8 xl:px-10'>
                {data ?(
                <table className="table-auto">                
                    <thead className="text-xs ">
                        <tr className=''>
                            <th scope="col"  className='table-auto'>
                                <div className="bg-gray-200 rounded-sm w-5 h-5 mb-5 flex flex-shrink-0 justify-center items-center relative">
                                    <input placeholder="checkbox" type="checkbox" className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full" />
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
                        {/* {Reflect.ownKeys(cruises[0]).map( (prop, i) => (  
                                <th key={i} scope="col" className="table-auto">
                                    {prop.toString()}
                                </th>
                        ))} */}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((cruise: Cruise, i:number) => {
                            return (
                                <CruiseView key={i} cruise={cruise} />
                            );
                        })}
                    </tbody>
                </table>) : (
                        <div className="text-2xl font-extrabold">No cruise data available (yet).</div>
                )}
            </div>
        </div>
    )
}