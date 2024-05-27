import { createSelector, createSlice, Slice } from '@reduxjs/toolkit';
import { Cruise } from './Domain/Model/Cruise';
import CruiseDataSourceImpl from './Data/DataSource/API/GMRT/CruiseDataSourceImpl';
import { CruiseRepositoryImpl } from './Data/Repository/CruiseRepositoryImpl';
import { GetCruises } from './Domain/UseCase/getCruises';
import moment from 'moment';


export type MainSliceState = {
  cruises: Cruise[]
  filterInput: string
};

const cruisesDataSourceImpl = new CruiseDataSourceImpl();
const cruisesRepositoryImpl = new CruiseRepositoryImpl(cruisesDataSourceImpl);
const getCruisesUseCase = new GetCruises(cruisesRepositoryImpl);
const initialCruises = await getCruisesUseCase.invoke()

const initialState: MainSliceState = {
  cruises: initialCruises,
  filterInput: ''
};

export const mainSlice: Slice<MainSliceState> = createSlice({
  name: 'main',
  initialState,
  reducers: {
    sortByAscending: (state) => {
      state.cruises.sort((a:Cruise, b:Cruise) => {
        const dateA = moment(a.created, 'YYYY-MM-DD')
        const dateB = moment(b.created, 'YYYY-MM-DD')
        return moment.utc(dateB).diff(dateA);
    })
    },
    sortByDescending: (state) => {
      state.cruises.sort((a:Cruise, b:Cruise) => {
        const dateA = moment(a.created, 'YYYY-MM-DD')
        const dateB = moment(b.created, 'YYYY-MM-DD')
        return moment.utc(dateA).diff(dateB);
    })
    }
  },
});

export const {sortByAscending, sortByDescending} = mainSlice.actions

const filterByEntryId = createSelector(
  (state: any) => state.cruises,
  (state: any) => state.filterInput,
  (cruises: any, filterInput: string) => {
    return cruises.filter(function (str:string) { return str.includes(filterInput) })
  }
);

export { filterByEntryId }

export default mainSlice.reducer