import { useEffect, useRef, useState } from 'react';
import useViewModel from './CruiseListViewModel';
import { Cruise, CruiseSelection } from '@/Domain/Model/Cruise';



export default function AggregateTotalAreaView(updated: Cruise[]) {

    const [totalArea, setTotalArea] = useState(BigInt(0));


    const updateTotalArea =  () => {
        setTotalArea(updated.filter(a => a.total_area !== null && !isNaN(a.total_area))
        .map(a => BigInt(a.total_area)).reduce((a,b) => a + b, BigInt(0)))
    }


    useEffect(() => {
        updateTotalArea();  
        console.log('Updated updated' + updated.length);       
    }, [totalArea]);



    return (
        <div className='text-4xl font-extrabold w-7/12 break-words'>AGGREGATE TOTAL AREA: {totalArea.toString()}</div>
    )
}