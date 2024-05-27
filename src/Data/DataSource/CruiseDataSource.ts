import { Cruise } from '@/Domain/Model/Cruise'

export interface CruiseDataSource {
    getCruises(): Promise<Cruise[]>
    sortCruises(sort: string): Promise<Cruise[]>
    setCruises(): Promise<void>
    getAggregateTotalArea(cruises: Cruise[]): Promise<number>
}