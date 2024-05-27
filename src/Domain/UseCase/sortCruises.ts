import { Cruise } from '../Model/Cruise';
import { CruiseRepository } from '../Repository/CruiseRepository';
import moment from 'moment';


export interface SortCruisesUseCase {
    invoke: (sort: string) => Promise<Cruise[]>
}

export class SortCruises implements SortCruisesUseCase {
    private cruiseRepo: CruiseRepository
    constructor(_cruiseRepo: CruiseRepository) {
        this.cruiseRepo = _cruiseRepo
    }

    async invoke(sort: string) {
        return this.cruiseRepo.sortCruises(sort);
    }
}