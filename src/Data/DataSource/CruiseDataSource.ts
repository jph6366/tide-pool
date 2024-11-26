import { Cruise } from '@/Domain/Model/Cruise'

export interface CruiseDataSource {
    getCruises(): Promise<Cruise[]>
}