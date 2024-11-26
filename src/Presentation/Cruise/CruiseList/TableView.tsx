import { useEffect, useRef, useState } from 'react';
import useViewModel from './Control/CruiseTable';
import { Cruise } from '@/Domain/Model/Cruise';
import * as countries from 'i18n-iso-countries';
import CruiseView from './CruiseView';
import * as en from  '../../../../node_modules/i18n-iso-countries/langs/en.json';


export default function TableView() {

    const {
        getCountryCode,
        cruises
    } = useViewModel();


    return (
        <div>      
            {cruises ?(
            <table className="table-auto">                
                <thead className="text-xs ">
                    <tr className=''>
                    {Reflect.ownKeys(cruises[0]).map( (prop, i) => (  
                            <th key={i} scope="col" className="table-auto">
                                {prop.toString()}
                            </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {cruises.map((cruise: Cruise, i:number) => {
                        return (
                            <CruiseView key={i} cruise={cruise} />
                        );
                    })}
                </tbody>
            </table>) : (
                    <div className="text-2xl font-extrabold">No cruise data available (yet).</div>
            )}
        </div>
    )
}