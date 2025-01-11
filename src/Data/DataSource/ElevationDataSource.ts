import { Feature } from 'geojson';

export interface ElevationDataSource {
    getElevation():Promise<number>
}