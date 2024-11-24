
import { ElevationPoint } from '@/Domain/Model/Elevation';
import { ElevationDataSource } from '../../ElevationDataSource';
import { Coordinate } from '../Parameter/CoordinateParameter';

interface PointDataSource extends Omit<ElevationDataSource, 'getElevation'> {
    getElevation(latitude: number, longitude: number): Promise<ElevationPoint>;
}

export default class ElevationDataSourceImpl implements PointDataSource {


    async getElevation(latitude: number, longitude: number): Promise<ElevationPoint> {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const coord: Coordinate = { latitude: latitude, longitude: longitude};

        const baseUrl = 'https://www.gmrt.org/services/PointServer';
        const pointUrl = `${baseUrl}?latitude=${latitude}&longitude=${longitude}&format=geojson`;

        try {
            const res: Response = await fetch(pointUrl);

            if(!res.ok) {
                throw new Error(`Error fetching data: ${res.statusText}`)
            }

            return await res.json() as ElevationPoint;
            
        } catch(error) {
            console.error('Error fetching GMRT PointServer: ', error);
            throw error;
        }

    }




}