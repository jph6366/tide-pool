import { Cruise } from '../Model/Cruise';
import { CruiseRepository } from '../Repository/CruiseRepository';

export interface GetCruisesUseCase {
    invoke: () => Promise<Cruise[]>
}

export class GetCruises implements GetCruisesUseCase {
    private cruiseRepo: CruiseRepository
    constructor(_cruiseRepo: CruiseRepository) {
        this.cruiseRepo = _cruiseRepo
    }

    async invoke() {
        return this.cruiseRepo.getCruises();
    }
}