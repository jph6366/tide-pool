import { CruiseAtomWithCache, rejectedCruiseAtomWithCache, CruiseStatus, cruiseStatusAtom, underReviewCruiseAtomWithCache } from '@/Data/DataSource/API/Entity/CruiseEntity';
import { atom, useAtom } from 'jotai';
import { Cruise } from '@/Domain/Model/Cruise';
import moment from 'moment';
import { useState } from 'react';
import * as countries from 'i18n-iso-countries';
import * as en from  '../../../../../node_modules/i18n-iso-countries/langs/en.json';


export default function ViewModel() {

    const [cruiseStatus, setStatus] =  useAtom(cruiseStatusAtom)

    const [cache] = useAtom(CruiseAtomWithCache);
    const [rejectedCruises] = useAtom(rejectedCruiseAtomWithCache);
    const [underReviewCruises] = useAtom(underReviewCruiseAtomWithCache)

    const [data] = useAtom(atom(cache))
    
    const [aggregateTotalArea, setTotalArea] = useState(0);

    function sortCruises(sort: string) {
        if (sort === 'ascending') {
            data.sort((a:Cruise, b:Cruise) => {
                const dateA = moment(a.created, 'YYYY-MM-DD')
                const dateB = moment(b.created, 'YYYY-MM-DD')
                return moment.utc(dateA).diff(dateB);
            })
        } else if (sort === 'descending') {
            data.sort((a:Cruise, b:Cruise) => {
                const dateA = moment(a.created, 'YYYY-MM-DD')
                const dateB = moment(b.created, 'YYYY-MM-DD')
                return moment.utc(dateB).diff(dateA);
            })
        }
    }

    async function filterCruises(search: string) {
        if(data) {
                filterInPlace(data, (cruise) => cruise.platform_id.includes(search))
                const area = data.filter(a => a.total_area !== null && !isNaN(a.total_area) && a.platform_id.includes(search))
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
        filterCruises,
        sortCruises,
        aggregateTotalArea,
        getCountryCode,
        data,
        rejectedCruises,
        underReviewCruises,
        setTotalArea,
        cruiseStatus, 
        setStatus
    };
    


}


