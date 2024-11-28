import useViewModel from './Control/CruiseTable';
import { Cruise } from '@/Domain/Model/Cruise';
import CruiseView from './CruiseView';
import { useEffect } from 'react';
import { CruiseStatus } from '@/Data/DataSource/API/Entity/CruiseEntity';
import { atom, useAtom } from 'jotai';


export default function UnderReviewTableView() {

    const {
        filterCruises,
        aggregateTotalArea,
        underReviewCruises,
        setTotalArea,
        setStatus
    } = useViewModel();

    const [data] = useAtom(atom(underReviewCruises));


    useEffect( () => {
        const area = data.filter(a => a.total_area !== null && !isNaN(a.total_area))
        .map(a => a.total_area).reduce((a,b) => +a + +b, 0)
        setTotalArea(area);
    }, [data])

    const handleFilterChange = (event: React.FormEvent<HTMLFormElement>) => {
        const searchInput = event.currentTarget.elements[0] as HTMLInputElement;
        filterCruises(searchInput.value.trim())
        event.preventDefault()
    };


    return (
        <div>
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
            <div className='bg-white py-4 md:py-7 px-4 md:px-8 xl:px-10'>
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
                <br/>
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