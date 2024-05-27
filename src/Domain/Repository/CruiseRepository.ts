import { Cruise } from '../Model/Cruise';

export interface CruiseRepository {
    getCruises(): Promise<Cruise[]>
    sortCruises(sort: string): Promise<Cruise[]>
    setCruises(): Promise<void>
    getAggregateTotalArea(cruises: Cruise[]): Promise<number>
}