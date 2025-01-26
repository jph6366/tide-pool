
import { ElevationProfile } from '@/Domain/Model/Elevation';
import { ElevationDataSource } from '../../ElevationDataSource';
import { Coordinate } from '../Parameter/CoordinateParameter';

export default class ElevationDataSourceImpl implements ElevationDataSource {
    getProfile(): Promise<ElevationProfile> {
        throw new Error('Method not implemented.');
    }


    async getElevation(latitude: number, longitude: number): Promise<number> {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const coord: Coordinate = { latitude: latitude, longitude: longitude};

        const baseUrl = 'https://www.gmrt.org/services/PointServer';
        const pointUrl = `${baseUrl}?latitude=${latitude}&longitude=${longitude}&format=text/plain`;

        try {
            const res: Response = await fetch(pointUrl);

            if(!res.ok) {
                throw new Error(`Error fetching data: ${res.statusText}`)
            }

            return await res.json();
            
        } catch(error) {
            console.error('Error fetching GMRT PointServer: ', error);
            throw error;
        }

    }




}