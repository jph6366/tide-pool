import GeoTIFF from 'geotiff';

export interface GridRepository {
    getGriddedData(minlongitude: number, maxlongitude: number, minlatitude:number, maxlatitude: number): Promise<GeoTIFF>
}