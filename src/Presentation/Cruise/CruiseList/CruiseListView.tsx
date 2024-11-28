import useViewModel from './Control/CruiseTable';
import { CruiseSelection } from '@/Domain/Model/Cruise';
import TableView from './TableView';
import { CruiseStatus } from '@/Data/DataSource/API/Entity/CruiseEntity';
import RejectedTableView from './RejectedTableView';


export default function CruiseListView() {

    const {
        sortCruises,
        cruiseStatus,
    } = useViewModel();


    const handleAscSortClick = () => {
        sortCruises(CruiseSelection.ascendingOrder)
    };

    const handleDescSortClick = () => {
        sortCruises(CruiseSelection.descendingOrder)
    };




    console.log('Current cruiseStatus:', cruiseStatus);



    return (
        <div>
            <div className="relative w-full overflow-x-clip ">
                {cruiseStatus == CruiseStatus.merged  ?(
                    <TableView/>
                ): (
                    <RejectedTableView/>
                )}
                
            </div>
        </div>
    )
}