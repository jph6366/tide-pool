import { Feature, LineString } from 'geojson';
import { ElevationProfile } from '../Model/Elevation';
import { ElevationRepository } from '../Repository/ElevationRepository';
import { Coordinate } from '@/Data/DataSource/API/Parameter/CoordinateParameter';

export interface GetElevationProfileUseCase {
    invoke: (coordinates:Coordinate[]) => Promise<ElevationProfile>
}

export class GetElevationProfile implements GetElevationProfileUseCase {
    private elevationRepo: ElevationRepository
    constructor(_elevationRepo: ElevationRepository) {
        this.elevationRepo = _elevationRepo
    }

    async invoke(coordinates:any) {
        return this.elevationRepo.getProfileElevation(coordinates);
    }
}