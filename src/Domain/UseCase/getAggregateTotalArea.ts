import { Cruise } from '../Model/Cruise';
import { CruiseRepository } from '../Repository/CruiseRepository';

export interface GetAggregateTotalAreaUseCase {
    invoke: (cruises: Cruise[]) => Promise<number>
}

export class GetAggregateTotalArea implements GetAggregateTotalAreaUseCase {
    private cruiseRepo: CruiseRepository
    constructor(_cruiseRepo: CruiseRepository) {
        this.cruiseRepo = _cruiseRepo
    }

    async invoke(cruises: Cruise[]) {
        return this.cruiseRepo.getAggregateTotalArea(cruises);
    }
}