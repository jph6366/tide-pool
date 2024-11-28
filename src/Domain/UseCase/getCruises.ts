import { Cruise } from '../Model/Cruise';
import { CruiseRepository } from '../Repository/CruiseRepository';

export interface GetCruisesUseCase {
    invoke: (status: string) => Promise<Cruise[]>
}

export class GetCruises implements GetCruisesUseCase {
    private cruiseRepo: CruiseRepository
    constructor(_cruiseRepo: CruiseRepository) {
        this.cruiseRepo = _cruiseRepo
    }

    async invoke(status: string) {
        return this.cruiseRepo.getCruises(status);
    }
}