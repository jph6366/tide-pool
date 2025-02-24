import { CruiseRepository } from '@/Domain/Repository/CruiseRepository';
import { CruiseDataSource } from '../DataSource/CruiseDataSource';
import { Cruise } from '@/Domain/Model/Cruise';

export class CruiseRepositoryImpl implements CruiseRepository {
    datasource: CruiseDataSource;

    constructor(_datasource: CruiseDataSource) {
        this.datasource = _datasource;
    }


    async getCruises(status: string): Promise<Cruise[]> {
        return this.datasource.getCruises(status);
    }

}