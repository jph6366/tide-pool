import { Cruise } from '../Model/Cruise';

export interface CruiseRepository {
    getCruises(status: string): Promise<Cruise[]>
}