import { ElevationProfile } from '../Model/Elevation';
import { Coordinate } from '@/Data/DataSource/API/Parameter/CoordinateParameter';

export interface ElevationRepository {
    getPointElevation(latitude: number, longitude: number):Promise<number>
    getProfileElevation(coordinates: Coordinate[]):Promise<ElevationProfile>
}
