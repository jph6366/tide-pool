import { CruiseAtomWithCache, rejectedCruiseAtomWithCache, cruiseStatusAtom, underReviewCruiseAtomWithCache } from '@/Data/DataSource/API/Entity/CruiseEntity';
import { atom, useAtom } from 'jotai';
import { Cruise } from '@/Domain/Model/Cruise';
import moment from 'moment';
import { useState } from 'react';
import * as countries from 'i18n-iso-countries';
import * as en from  'i18n-iso-countries/langs/en.json';


export default function ViewModel() {

    const [cruiseStatus, setStatus] =  useAtom(cruiseStatusAtom);
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('platform_id');
    const [data] = useAtom(CruiseAtomWithCache);
    const [rdata] = useAtom(rejectedCruiseAtomWithCache);
    const [udata] = useAtom(underReviewCruiseAtomWithCache);

    const [aggregateTotalArea, setTotalArea] = useState(0);

    function sortCruises(cruises: Cruise[], sort: string) {
        if (sort === 'descending') {
            cruises.sort((a:Cruise, b:Cruise) => {
                const dateA = moment(a.created, 'YYYY-MM-DD')
                const dateB = moment(b.created, 'YYYY-MM-DD')
                return moment.utc(dateA).diff(dateB);
            })
        } else if (sort === 'ascending') {
            cruises.sort((a:Cruise, b:Cruise) => {
                const dateA = moment(a.created, 'YYYY-MM-DD')
                const dateB = moment(b.created, 'YYYY-MM-DD')
                return moment.utc(dateB).diff(dateA);
            })
        }
        const area = cruises.filter(a => a.total_area !== null && !isNaN(a.total_area))
        .map(a => a.total_area).reduce((a,b) => +a + +b, 0)
        setTotalArea(area);
    }

    async function filterCruises(cruises: Cruise[], search: string) {
        if(cruises) {

            filterInPlace(cruises, (cruise: any) => cruise[filter] !== null && cruise[filter].includes(search))
            const area = cruises.filter((a:any) => a.total_area !== null && !isNaN(a.total_area) && a[filter].includes(search))
            .map(a => a.total_area).reduce((a,b) => +a + +b, 0)
            setTotalArea(area);
            }
        
    }

    function filterInPlace<T>(array: Array<T>, condition: (value: T) => boolean): void {
        let writeIndex = 0;  // Tracks where to place the next matching element
    
        for (let readIndex = 0; readIndex < array.length; readIndex++) {
            if (condition(array[readIndex])) {
                // Swap to move the matching element to the front
                [array[writeIndex], array[readIndex]] = [array[readIndex], array[writeIndex]];
                writeIndex++;  // Move the write pointer to the next position
            }
        }
    }

    function getCountryCode(name: string) {
        countries.registerLocale(en) 
        const cc = countries.getAlpha2Code(name, 'en')?.toLowerCase() as string;
        return cc
    }
      

    return {
        data,
        rdata,
        udata,
        filterCruises,
        filterInPlace,
        sortCruises,
        aggregateTotalArea,
        getCountryCode,
        setTotalArea,
        cruiseStatus, 
        setStatus,
        isOpen,
        setIsOpen,
        filter,
        setFilter
    };
    


}


