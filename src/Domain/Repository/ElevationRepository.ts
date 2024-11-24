import { Feature } from 'geojson';
import { ElevationProfile, ElevationPoint } from '../Model/Elevation';

interface ElevationRepository {
    getElevation(...args: number[]):Promise<Feature>
}

export interface PointRepository extends Omit<ElevationRepository, 'getElevation'> {
    getElevation(latitude: number, longitude: number): Promise<ElevationPoint>;
}

export interface ProfileRepository extends Omit<ElevationRepository, 'getElevation'> {
    getElevation(startLatitude: number, startLongitude: number, endLatitude: number, endLongitude: number): Promise<ElevationProfile>;
}
