import { Cruise } from '../Model/Cruise';
import { CruiseRepository } from '../Repository/CruiseRepository';

export interface SetCruisesUseCase {
    invoke: () => Promise<void>
}

export class SetCruises implements SetCruisesUseCase {
    private cruiseRepo: CruiseRepository
    constructor(_cruiseRepo: CruiseRepository) {
        this.cruiseRepo = _cruiseRepo
    }

    async invoke() {
        this.cruiseRepo.setCruises();
    }
}