import { useEffect, useMemo, useState } from 'react';
import CruiseDataSourceImpl from '@/Data/DataSource/API/GMRT/CruiseDataSourceImpl';
import { Cruise } from '@/Domain/Model/Cruise';
import { GetCruises } from '@/Domain/UseCase/getCruises';
import { SortCruises } from '@/Domain/UseCase/sortCruises';
import { GetAggregateTotalArea } from '@/Domain/UseCase/getAggregateTotalArea';
import { CruiseRepositoryImpl } from '@/Data/Repository/CruiseRepositoryImpl';
import Pin from '@/Presentation/Map/Pin';
import { Marker } from 'mapbox-gl';

export default function CruiseListViewModel() {
    const [cruises, setCruises] = useState<Cruise[]>([]);
    const [totalArea, setTotalArea] = useState(0);
    const [toggle, setToggle] = useState(0);
    const [pins, setPins] = useState<number[][]>([]);



    const cruisesDataSourceImpl = new CruiseDataSourceImpl();
    const cruisesRepositoryImpl = new CruiseRepositoryImpl(cruisesDataSourceImpl);

    const getCruisesUseCase = new GetCruises(cruisesRepositoryImpl);
    const sortCruisesUseCase = new SortCruises(cruisesRepositoryImpl);
    const getAggregateTotalAreaUseCase = new GetAggregateTotalArea(cruisesRepositoryImpl);


    async function getCruises() {
        var updated = await getCruisesUseCase.invoke();
        setCruises(updated);
        setTotalArea(await getAggregateTotalAreaUseCase.invoke(updated));
        var tmp_pins = updated.map((cruise: Cruise, index: number) => (
               [cruise.center_x, cruise.center_y]
            ));
        setPins(tmp_pins);

    }

     async function sortCruises(sort: string) {
        setCruises(await sortCruisesUseCase.invoke(sort));
    }

    async function toggleFilter(filterToggle: number) {
        setToggle(filterToggle);
    }

    async function filterCruises(search: string, toggle: number) {
        if (toggle) {
            var updated = await cruises.filter((cruise) => cruise.entry_id.includes(search));
            setCruises(updated)
            setTotalArea(await getAggregateTotalAreaUseCase.invoke(updated));
        } else {
            var updated = await cruises.filter((cruise) => cruise.platform_id.includes(search));
            setCruises(updated)
            setTotalArea(await getAggregateTotalAreaUseCase.invoke(updated));
        }
    }


    return {
        filterCruises,
        sortCruises,
        getCruises,
        toggleFilter,
        cruises,
        totalArea,
        toggle,
        pins
    };

}