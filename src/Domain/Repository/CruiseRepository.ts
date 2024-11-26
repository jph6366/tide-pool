import { Cruise } from '../Model/Cruise';

export interface CruiseRepository {
    getCruises(): Promise<Cruise[]>
}