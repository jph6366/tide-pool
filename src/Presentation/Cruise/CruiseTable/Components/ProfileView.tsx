import { Feature, LineString } from 'geojson';
import { useEffect, useRef, useState } from 'react';
import BillboardJS, {IChart} from '@billboard.js/react';
import bb, { line, areaStep } from 'billboard.js';

interface ProfileViewProps {
    profile:any
}

export default function ProfileView({ profile }: ProfileViewProps) {

    const chartComponent = useRef<IChart>(null);
    const options = {
        data: {
            x: 'x',
            columns: [
                ['x', ...profile.map((distance: any) => `${distance[3]}`)],
                ['ProfileServer', ...profile.map((distance: any) => `${distance[2]}`)]
            ],
            type: line()
        }
        
    };

    useEffect(() => {
        // get the instance from ref
		const chart = chartComponent.current?.instance;

    }, []);



    return (
        <div className="">
            <div>
                <BillboardJS
                    bb={bb}
                    options={options}
                    ref={chartComponent}
                    className='bb w-max h-40'
                />
            </div>
        </div>
    );
}
