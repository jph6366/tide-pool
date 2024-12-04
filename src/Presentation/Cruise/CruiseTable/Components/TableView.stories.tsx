import type { Meta, StoryObj } from '@storybook/react';

import TableView from './TableView';

const meta = {
  component: TableView,
} satisfies Meta<typeof TableView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};