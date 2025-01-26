import { ElevationRepository } from '../Repository/ElevationRepository';

export interface GetElevationPointUseCase {
    invoke: (latitude: number, longitude: number) => Promise<number>
}

export class GetElevationPoint implements GetElevationPointUseCase {
    private elevationRepo: ElevationRepository
    constructor(_elevationRepo: ElevationRepository) {
        this.elevationRepo = _elevationRepo
    }

    async invoke(latitude: number, longitude: number) {
        return this.elevationRepo.getPointElevation(latitude, longitude);
    }
}