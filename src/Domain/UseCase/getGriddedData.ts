import GeoTIFF from 'geotiff';
import { GridRepository } from '../Repository/GridRepository';

export interface GetGriddedDataUseCase {
    invoke: (minlongitude: number, maxlongitude: number, minlatitude:number, maxlatitude: number) => Promise<GeoTIFF>
}

export class GetGriddedData implements GetGriddedDataUseCase {
    private gridRepo: GridRepository
    constructor(_gridRepo: GridRepository) {
        this.gridRepo = _gridRepo
    }

    async invoke(minlongitude: number, maxlongitude: number, minlatitude:number, maxlatitude: number) {
        return this.gridRepo.getGriddedData(minlongitude, maxlongitude, minlatitude, maxlatitude);
    }
}