import { GetCruises } from '@/Domain/UseCase/getCruises';
import { CruiseRepositoryImpl } from '@/Data/Repository/CruiseRepositoryImpl';
import CruiseDataSourceImpl from '../GMRT/CruiseDataSourceImpl';
import { atomWithCache } from 'jotai-cache';
import { atom } from 'jotai';

export interface CruiseEntity {
    entry_id: string
    survey_id: string
    url: string
    entry_type: string
    platform_id: string
    center_x: number
    center_y: number
    west: number
    east: number
    south: number
    north: number
    chief: string
    gmrt_entry_id: string
    gmrt_version_number: number
    year: number
    r2r_fileset_id: string
    mac_url: string
    mac_platform_url: string
    public_notes: string
    flag_file: string
    flag_alt: string
    proc_data_set_uid: number
    data_processor_organization: string
    is_rejected: string
    created: string
    device_make: string
    device_model: number
    total_area: number
    track_length: number
    file_count: number
}

export enum CruiseStatus{
    merged = '',
    isRejected = '?is_rejected=true',
    underReview = '?under_review=true'
}

export const cruiseStatusAtom = atom<CruiseStatus>(CruiseStatus.merged);


const cruisesDataSourceImpl = new CruiseDataSourceImpl();
const cruisesRepositoryImpl = new CruiseRepositoryImpl(cruisesDataSourceImpl);
const getCruisesUseCase = new GetCruises(cruisesRepositoryImpl);

// // // // // // // // // // // // // // // // // // // // // // // // 
//      jotai-tanstack-query IMPLEMENTATION for future features if needed
// 
// export const CruiseAtom = atomWithQuery(() => ({
//     queryKey: ['cruises'],
//     queryFn: async (): Promise<CruiseEntity[]> => {
//         return getCruisesUseCase.invoke()
//     },
// }))

//      jotai-cache
export const CruiseAtomWithCache = atomWithCache(
    async (get) => {
        return getCruisesUseCase.invoke(CruiseStatus.merged)
    }
);

export const rejectedCruiseAtomWithCache = atomWithCache(
    async (get) => {
        return getCruisesUseCase.invoke(CruiseStatus.isRejected)
    }
);

export const underReviewCruiseAtomWithCache = atomWithCache(
    async (get) => {
        return getCruisesUseCase.invoke(CruiseStatus.underReview)
    }
);