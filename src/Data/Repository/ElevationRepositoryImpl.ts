import { PointRepository } from '@/Domain/Repository/ElevationRepository';
import { PointDataSource } from '../DataSource/API/GMRT/ElevationDataSourceImpl';

export class ElevationRepositoryImpl implements PointRepository {
    datasource: PointDataSource;

    constructor(_datasource: PointDataSource) {
        this.datasource = _datasource;
    }

    async getPointElevation(latitude: number, longitude: number): Promise<number> {
        return this.datasource.getElevation(latitude, longitude);
    }

}