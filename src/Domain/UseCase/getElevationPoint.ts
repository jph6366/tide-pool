import { ElevationPoint } from '../Model/Elevation';
import { PointRepository } from '../Repository/ElevationRepository';

export interface GetElevationPointUseCase {
    invoke: (latitude: number, longitude: number) => Promise<number>
}

export class GetElevationPoint implements GetElevationPointUseCase {
    private elevationRepo: PointRepository
    constructor(_elevationRepo: PointRepository) {
        this.elevationRepo = _elevationRepo
    }

    async invoke(latitude: number, longitude: number) {
        return this.elevationRepo.getPointElevation(latitude, longitude);
    }
}