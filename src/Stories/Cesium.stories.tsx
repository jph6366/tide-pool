import CesiumViewer from '@/Presentation/Cesium/CesiumViewer/CesiumViewer';
import { Meta, StoryObj } from '@storybook/react';

import '../index.css'

const meta: Meta<typeof CesiumViewer> = {
    title: 'tide-pool/Bathy-Data',
    component: CesiumViewer
}

export default meta;

type Story = StoryObj<typeof CesiumViewer>;


export const Globe: Story = () => {
    return (
        <CesiumViewer></CesiumViewer>
    )
}
Globe.args = {};