import { CruiseDataSource } from '../../CruiseDataSource';
import { CruiseEntity } from '../Entity/CruiseEntity';
import moment from 'moment';

export default class CruiseDataSourceImpl implements CruiseDataSource {


    async getCruises(): Promise<CruiseEntity[]> {
        const res = await fetch('https://www.gmrt.org/services/GmrtCruises.php')
        return await res.json();
    }

    async setCruises(): Promise<void> {
        // not implemented not neccessary?
        return;
    }

    async sortCruises(sort: string): Promise<CruiseEntity[]> {
        let cruises = await this.getCruises();
        if (sort === 'ascending') {
            cruises = cruises.sort((a:CruiseEntity, b:CruiseEntity) => {
                const dateA = moment(a.created, 'YYYY-MM-DD')
                const dateB = moment(b.created, 'YYYY-MM-DD')
                return moment.utc(dateA).diff(dateB);
            })
        } else if (sort === 'descending') {
            cruises = cruises.sort((a:CruiseEntity, b:CruiseEntity) => {
                const dateA = moment(a.created, 'YYYY-MM-DD')
                const dateB = moment(b.created, 'YYYY-MM-DD')
                return moment.utc(dateB).diff(dateA);
            })
        }
        return cruises;
    }

    async getAggregateTotalArea(cruises: CruiseEntity[]): Promise<number> {
        return cruises.filter(a => a.total_area !== null && !isNaN(a.total_area))
        .map(a => a.total_area).reduce((a,b) => +a + +b, 0)
    }


}