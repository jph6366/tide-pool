import { ElevationPoint } from '@/Domain/Model/Elevation';
import { Feature } from 'geojson';

export interface ElevationDataSource {
    getElevation():Promise<Feature>
}