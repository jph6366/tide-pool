import CruiseTableView from '@/Presentation/Cruise/CruiseTable/CruiseTableView';
import { Meta, StoryObj } from '@storybook/react';

import '../index.css'


const meta: Meta<typeof CruiseTableView> = {
    title: 'tide-pool/Bathy-Data',
    component: CruiseTableView
}

export default meta;

type Story = StoryObj<typeof CruiseTableView>;


export const WebMap: Story = () => {
    return (
        <CruiseTableView></CruiseTableView>
    )
}
WebMap.args = {};