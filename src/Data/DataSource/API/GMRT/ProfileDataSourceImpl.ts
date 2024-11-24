import { ElevationProfile } from '@/Domain/Model/Elevation';
import { Coordinate } from '../Parameter/CoordinateParameter';
import { ElevationDataSource } from '../../ElevationDataSource';

interface ProfileDataSource extends Omit<ElevationDataSource, 'getElevation'> {
    getElevation(startLatitude: number, startLongitude: number, endLatitude: number, endLongitude: number): Promise<ElevationProfile>;
}


export default class ProfileDataSourceImpl implements ProfileDataSource {


    async getElevation(startLatitude: number, startLongitude: number, endLatitude: number, endLongitude: number): Promise<ElevationProfile> {

        let coord: Coordinate = { latitude: startLatitude, longitude: startLongitude};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        coord = { latitude: endLatitude, longitude: endLongitude};


        const baseUrl = 'https://www.gmrt.org/services/ProfileServer';
        const profileUrl = `${baseUrl}?start_latitude=${startLatitude}&start_longitude=${startLongitude}&end_latitude=${endLatitude}&end_longitude=${endLongitude}&format=geojson`;

        try {
            const res: Response = await fetch(profileUrl);

            if(!res.ok) {
                throw new Error(`Error fetching data: ${res.statusText}`)
            }

            return await res.json() as ElevationProfile;
            
        } catch(error) {
            console.error('Error fetching GMRT ProfileServer: ', error);
            throw error;
        }

    }




}