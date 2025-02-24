import { CruiseDataSource } from '../../CruiseDataSource';
import { CruiseEntity } from '../Entity/CruiseEntity';

export default class CruiseDataSourceImpl implements CruiseDataSource {


    async getCruises(status: string): Promise<CruiseEntity[]> {

        const cruisesUrl = 'https://www.gmrt.org/services/GmrtCruises.php' + status;
        
        try {
            const res: Response = await fetch(cruisesUrl);

            if(!res.ok) {
                throw new Error(`Error fetching data: ${res.statusText}`)
            }

            return await res.json() as CruiseEntity[];
            
        } catch(error) {
            console.error('Error fetching GMRT ProfileServer: ', error);
            throw error;
        }
    }
    

}