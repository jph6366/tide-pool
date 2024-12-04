import type { Meta, StoryObj } from '@storybook/react';

import CruiseTable from './CruiseTable';

const meta = {
  component: CruiseTable,
} satisfies Meta<typeof CruiseTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};