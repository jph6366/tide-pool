import { CruiseAtom, CruiseEntity } from '@/Data/DataSource/API/Entity/CruiseEntity';
import { atom, useAtom } from 'jotai';
import { Cruise } from '@/Domain/Model/Cruise';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as countries from 'i18n-iso-countries';
import * as en from  '../../../../../node_modules/i18n-iso-countries/langs/en.json';


export default function ViewModel() {

    const [{data, isPending},     ] = useAtom(CruiseAtom);
    const [cruises, setTable ] = useAtom(atom(data))
    const [aggregateTotalArea, setTotalArea] = useState(0);


    useEffect(() => {
        setTotalArea(getAggregateTotalArea());
    }, [cruises]);


    function sortCruises(sort: string,): Cruise[] | CruiseEntity[] | undefined {
        if (cruises){
            if (sort === 'ascending') {
                setTable(cruises.sort((a:Cruise, b:Cruise) => {
                    const dateA = moment(a.created, 'YYYY-MM-DD')
                    const dateB = moment(b.created, 'YYYY-MM-DD')
                    return moment.utc(dateA).diff(dateB);
                }))
            } else if (sort === 'descending') {
                setTable(cruises.sort((a:Cruise, b:Cruise) => {
                    const dateA = moment(a.created, 'YYYY-MM-DD')
                    const dateB = moment(b.created, 'YYYY-MM-DD')
                    return moment.utc(dateB).diff(dateA);
                }))
            }
        }
        setTotalArea(getAggregateTotalArea());
        return cruises;
    }


    function getAggregateTotalArea(): number {
        if (cruises){
        return cruises.filter(a => a.total_area !== null && !isNaN(a.total_area))
        .map(a => a.total_area).reduce((a,b) => +a + +b, 0)
        }
        return aggregateTotalArea
    }

    async function filterCruises(search: string) {
        if(data && cruises) {
                setTable(data)
                filterInPlace(cruises, (cruise) => cruise.platform_id.includes(search))
                // setTable(cruises.filter((cruise) => cruise.platform_id.includes(search)))
                setTotalArea(getAggregateTotalArea());
            }
        
    }

    function filterInPlace<T>(array: Array<T>, condition: (value: T) => boolean)
    {
        let nextPlace = 0;
    
        for (const value of array)
        {
            if (condition(value))
                array[nextPlace++] = value;
        }
    
        array.splice(nextPlace);
    }

    function getCountryCode(name: string) {
        countries.registerLocale(en) 
        const cc = countries.getAlpha2Code(name, 'en')?.toLowerCase() as string;
        return cc
    }
      

    return {
        filterCruises,
        sortCruises,
        aggregateTotalArea,
        getAggregateTotalArea,
        getCountryCode,
        cruises,
    };
    


}


