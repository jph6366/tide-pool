import { ElevationRepositoryImpl } from '@/Data/Repository/ElevationRepositoryImpl';
import ElevationDataSourceImpl from '../GMRT/ElevationDataSourceImpl';
import { GetElevationPoint } from '@/Domain/UseCase/getElevationPoint';
import { atom } from 'jotai';

const elevationDataSourceImpl = new ElevationDataSourceImpl();
const elevationRepositoryImpl = new  ElevationRepositoryImpl(elevationDataSourceImpl);
export const getElevationPointUseCase = new GetElevationPoint(elevationRepositoryImpl)

