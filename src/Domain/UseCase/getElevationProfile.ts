import { ElevationProfile } from '../Model/Elevation';
import { ProfileRepository } from '../Repository/ElevationRepository';

export interface GetElevationProfileUseCase {
    invoke: (startLatitude: number, startLongitude: number, endLatitude: number, endLongitude: number) => Promise<ElevationProfile>
}

export class GetElevationProfile implements GetElevationProfileUseCase {
    private elevationRepo: ProfileRepository
    constructor(_elevationRepo: ProfileRepository) {
        this.elevationRepo = _elevationRepo
    }

    async invoke(startLatitude: number, startLongitude: number, endLatitude: number, endLongitude: number) {
        return this.elevationRepo.getElevation(startLatitude, startLongitude, endLatitude, endLongitude);
    }
}