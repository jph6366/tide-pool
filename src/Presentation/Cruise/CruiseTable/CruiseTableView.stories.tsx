import type { Meta, StoryObj } from '@storybook/react';

import CruiseTableView from './CruiseTableView';

const meta = {
  component: CruiseTableView,
} satisfies Meta<typeof CruiseTableView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};