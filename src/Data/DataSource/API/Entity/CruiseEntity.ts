import { GetCruises } from '@/Domain/UseCase/getCruises'
import { atomWithQuery } from 'jotai-tanstack-query'
import { CruiseRepositoryImpl } from '@/Data/Repository/CruiseRepositoryImpl';
import CruiseDataSourceImpl from '../GMRT/CruiseDataSourceImpl';

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


const cruisesDataSourceImpl = new CruiseDataSourceImpl();
const cruisesRepositoryImpl = new CruiseRepositoryImpl(cruisesDataSourceImpl);
const getCruisesUseCase = new GetCruises(cruisesRepositoryImpl);

export const CruiseAtom = atomWithQuery(() => ({
    queryKey: ['cruises'],
    queryFn: async (): Promise<CruiseEntity[]> => {
        return getCruisesUseCase.invoke()
    },
}))