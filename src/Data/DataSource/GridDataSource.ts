import GeoTIFF from 'geotiff';

export interface GridDataSource {
    getGriddedData(minlongitude: number, maxlongitude: number, minlatitude:number, maxlatitude: number): Promise<GeoTIFF>
}