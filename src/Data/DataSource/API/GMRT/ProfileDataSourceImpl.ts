import { ElevationProfile } from '@/Domain/Model/Elevation';
import { Coordinate } from '../Parameter/CoordinateParameter';
import { ElevationDataSource } from '../../ElevationDataSource';

export default class ProfileDataSourceImpl implements ElevationDataSource {
    getElevation(latitude: number, longitude: number): Promise<number> {
        throw new Error('Method not implemented.');
    }


    async getProfile(coordinates:Coordinate[]): Promise<ElevationProfile> {
        
        if (coordinates.length < 2) {
            throw new Error('At least two coordinates are required to create a path.');
        }

        // Convert coordinates to the boundspath format
        const boundspath = encodeURIComponent(
            JSON.stringify(coordinates
                .map((coord: 
                    { 
                        longitude: { toString: () => any; }; 
                        latitude: { toString: () => any; }; 
                    }
            ) => [coord.longitude.toString(), coord.latitude.toString()]))
        );


        const baseUrl = 'https://www.gmrt.org/services/ProfileServer';
        const profileUrl = `${baseUrl}?boundspath=${boundspath}`;

        try {
            const res: Response = await fetch(profileUrl);

            if(!res.ok) {
                throw new Error(`Error fetching data: ${res.statusText}`)
            }

            return await res.json();
            
        } catch(error) {
            console.error('Error fetching GMRT ProfileServer: ', error);
            throw error;
        }

    }




}