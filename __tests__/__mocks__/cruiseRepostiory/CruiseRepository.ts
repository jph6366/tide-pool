import { vi } from 'vitest';
import {Cruise} from '../../../src/Domain/Model/Cruise'

// Create a mock implementation of the CruiseRepository
const createCruiseRepositoryMock = () => {
    const getCruises = vi.fn<(status: string) => Promise<Cruise[]>>();

  return {
    getCruises,
  };
};

export { createCruiseRepositoryMock };
