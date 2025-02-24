import { Cruise } from '@/Domain/Model/Cruise'

export interface CruiseDataSource {
    getCruises(status: string): Promise<Cruise[]>
}