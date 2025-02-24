import GeoTIFF from 'geotiff';
import { GridDataSource } from '../../GridDataSource';
import { Coordinate } from '../Parameter/CoordinateParameter';

export default class GridDataSourceImpl implements GridDataSource {


    async getGriddedData(minlongitude: number, maxlongitude: number, minlatitude:number, maxlatitude: number): Promise<GeoTIFF> {

        let coord: Coordinate = { latitude: minlatitude, longitude: minlongitude};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        coord = { latitude: maxlatitude, longitude: maxlongitude};

        const baseUrl = 'https://www.gmrt.org/services/GridServer';
        const pointUrl = `${baseUrl}?minlongitude=${minlongitude}&maxlongitude=${maxlongitude}&minlatitude=${minlatitude}&maxlatitude=${maxlatitude}&format=geotiff&resolution=max&layer=topo`;

        try {
            const res: Response = await fetch(pointUrl);

            if(!res.ok) {
                throw new Error(`Error fetching data: ${res.statusText}`)
            }

            return await res.json() as GeoTIFF;
            
        } catch(error) {
            console.error('Error fetching GMRT GridServer: ', error);
            throw error;
        }

    }




}