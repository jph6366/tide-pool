import { CruiseRepository } from '@/Domain/Repository/CruiseRepository';
import { CruiseDataSource } from '../DataSource/CruiseDataSource';
import { Cruise } from '@/Domain/Model/Cruise';

export class CruiseRepositoryImpl implements CruiseRepository {
    datasource: CruiseDataSource;

    constructor(_datasource: CruiseDataSource) {
        this.datasource = _datasource;
    }


    async getCruises(): Promise<Cruise[]> {
        return this.datasource.getCruises();
    }

    async sortCruises(sort: string): Promise<Cruise[]> {
        return this.datasource.sortCruises(sort);
    }

    async setCruises(): Promise<void> {
        return this.datasource.setCruises();
    }

    getAggregateTotalArea(cruises: Cruise[]): Promise<number> {
        return this.datasource.getAggregateTotalArea(cruises);
    }
}