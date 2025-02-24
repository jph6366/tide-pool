import { ElevationProfile } from '@/Domain/Model/Elevation';
import { Coordinate } from './API/Parameter/CoordinateParameter';

export interface ElevationDataSource {
    getElevation(latitude: number, longitude: number):Promise<number>
    getProfile(coordinates: Coordinate[]):Promise<ElevationProfile>
}