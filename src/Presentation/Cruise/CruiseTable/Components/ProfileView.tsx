import { Feature, LineString } from 'geojson';
import { useEffect, useRef, useState } from 'react';
import BillboardJS, {IChart} from '@billboard.js/react';
import bb, { line, areaStep } from 'billboard.js';

interface ProfileViewProps {
    profile:any
}

export default function ProfileView({ profile }: ProfileViewProps) {

    const [chartOptions, setChartOptions] = useState({
        data: {
            x: 'x',
            columns: [
                ['x', ...profile.map((distance: any) => `${distance[3]}`)],
                ['ProfileServer', ...profile.map((distance: any) => `${distance[2]}`)]
            ],
            type: line(),
        },
    });

    const chartComponent = useRef<IChart>(null);

    useEffect(() => {
        // Update chart options whenever profile changes
        setChartOptions({
            data: {
                x: 'x',
                columns: [
                    ['x', ...profile.map((distance: any) => `${distance[3]}`)],
                    ['ProfileServer', ...profile.map((distance: any) => `${distance[2]}`)],
                ],
                type: line(),
            },
        });
    }, [profile]); // Re-run effect when profile changes

    useEffect(() => {
        const chart = chartComponent.current?.instance;
    }, []);

    return (
        <div>
            <BillboardJS
                bb={bb}
                options={chartOptions}
                ref={chartComponent}
                className='bb w-max h-40'
            />
        </div>
    );
}
