import { ElevationRepository } from '@/Domain/Repository/ElevationRepository';
import { ElevationProfile } from '@/Domain/Model/Elevation';
import { Coordinate } from '../DataSource/API/Parameter/CoordinateParameter';
import { ElevationDataSource } from '../DataSource/ElevationDataSource';

export class ElevationRepositoryImpl implements ElevationRepository {
    datasource: ElevationDataSource;

    constructor(_datasource: ElevationDataSource) {
        this.datasource = _datasource;
    }
    
     async getPointElevation(latitude: number, longitude: number): Promise<number> {
        return this.datasource.getElevation(latitude, longitude);
    }

     async getProfileElevation(coordinates: Coordinate[]): Promise<ElevationProfile> {
        return this.datasource.getProfile(coordinates);
    }


}