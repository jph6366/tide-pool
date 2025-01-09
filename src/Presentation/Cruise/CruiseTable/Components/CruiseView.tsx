import { Cruise } from '@/Domain/Model/Cruise';
import useViewModel from '../Control/CruiseTable';
import { useCallback, useEffect, useState } from 'react';
import mapStateAtom from '@/Presentation/JotaiStore/Store';
import { useAtom } from 'jotai';

interface CruiseViewProps {
    cruise: Cruise;
    selectedCruises: any;
    setSelected: any;
    selectCruise: any;
    selectAll: any;
}


export default function CruiseView({cruise: cruise, selectedCruises: cruises, setSelected: selected, selectCruise: select, selectAll: allChecked}:CruiseViewProps) {


                const {
                    getCountryCode,
                } = useViewModel();
                const [state, dispatch] = useAtom(mapStateAtom);
                const viewState = state.viewState;
                const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.target.checked) {
                        
                        const newSelection = {
                            longitude: cruise.center_x,
                            latitude: cruise.center_y,
                            entryIdentifier: cruise.entry_id,
                        };
                
                        const updatedCruises = { ...cruises, [cruise.entry_id]: newSelection };
                
                        dispatch({
                            type: 'setViewState',
                            payload: {...viewState, longitude: cruise.center_x, latitude: cruise.center_y}                            
                        })

                        select(updatedCruises);
                        selected(newSelection)
                    } else {
                        const { [cruise.entry_id]: _, ...remainingCruises } = cruises;
                        select(remainingCruises)
                    }
                };


                        return (
                            <tr tabIndex={0} className="focus:outline-none h-16 border border-gray-100 rounded">
                                <td>
                                    <div className="ml-5">
                                        <div className="bg-gray-200 rounded-sm w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                                            <input checked={!!cruises[cruise.entry_id]} onChange={handleCheckboxChange} placeholder="checkbox" type="checkbox" className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full" />
                                            <div
                                                    className={`check-icon ${
                                                        cruises[cruise.entry_id] || allChecked ? 'flex' : 'hidden'
                                                    } bg-indigo-700 text-white rounded-sm`}
                                                >                                                
                                                <svg className="icon icon-tabler icon-tabler-check" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z"></path>
                                                    <path d="M5 12l5 5l10 -10"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center pl-5">
                                        <p className="text-base font-medium leading-none text-gray-700 mr-2">{cruise.survey_id}</p>
                                        <a href={cruise.url}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M6.66669 9.33342C6.88394 9.55515 7.14325 9.73131 7.42944 9.85156C7.71562 9.97182 8.02293 10.0338 8.33335 10.0338C8.64378 10.0338 8.95108 9.97182 9.23727 9.85156C9.52345 9.73131 9.78277 9.55515 10 9.33342L12.6667 6.66676C13.1087 6.22473 13.357 5.62521 13.357 5.00009C13.357 4.37497 13.1087 3.77545 12.6667 3.33342C12.2247 2.89139 11.6251 2.64307 11 2.64307C10.3749 2.64307 9.77538 2.89139 9.33335 3.33342L9.00002 3.66676" stroke="#3B82F6" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M9.33336 6.66665C9.11611 6.44492 8.8568 6.26876 8.57061 6.14851C8.28442 6.02825 7.97712 5.96631 7.66669 5.96631C7.35627 5.96631 7.04897 6.02825 6.76278 6.14851C6.47659 6.26876 6.21728 6.44492 6.00003 6.66665L3.33336 9.33332C2.89133 9.77534 2.64301 10.3749 2.64301 11C2.64301 11.6251 2.89133 12.2246 3.33336 12.6666C3.77539 13.1087 4.37491 13.357 5.00003 13.357C5.62515 13.357 6.22467 13.1087 6.66669 12.6666L7.00003 12.3333" stroke="#3B82F6" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center pl-5">
                                            <span className={'fi fi-' +  getCountryCode(cruise.flag_alt) }></span>
                                            <p className="text-sm leading-none text-gray-600 ml-2">{cruise.chief}{' (' + cruise.year + ')'}</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center pl-5">
                                            
                                            <p className="text-sm leading-none text-gray-600 ml-2">{cruise.platform_id}{' (' + cruise.device_make +' '+ cruise.device_model + ')'}</p>
                                            <br/>
                                            GMRTv{cruise.gmrt_version_number}
                                    </div>
                                </td>     
                                <td>
                                    <div className="flex items-center pl-5">
                                            
                                    processed by <p className="text-sm leading-none text-gray-600 ml-2"> {cruise.data_processor_organization + ' '} </p>
                                    <br/>
                                    Total Area Mapped: {cruise.total_area} km&sup2; | {cruise.file_count} Files
                                    </div>
                                </td>                    
                            </tr>
                        )
}