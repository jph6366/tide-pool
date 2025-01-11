import { Feature } from 'geojson';
import { ElevationProfile, ElevationPoint } from '../Model/Elevation';

interface ElevationRepository {
    getElevation(...args: number[]):Promise<Feature>
}

export interface PointRepository extends Omit<ElevationRepository, 'getElevation'> {
    getPointElevation(latitude: number, longitude: number): Promise<number>;
}

export interface ProfileRepository extends Omit<ElevationRepository, 'getElevation'> {
    getProfileElevation(startLatitude: number, startLongitude: number, endLatitude: number, endLongitude: number): Promise<ElevationProfile>;
}
