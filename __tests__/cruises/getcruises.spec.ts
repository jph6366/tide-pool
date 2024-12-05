/* eslint-disable camelcase */
import { describe, it, expect, beforeEach } from 'vitest';
import { createCruiseRepositoryMock } from '../__mocks__/cruiseRepostiory/CruiseRepository';
import { Cruise } from '../../src/Domain/Model/Cruise';
import { GetCruises } from '../../src/Domain/UseCase/getCruises';

describe('GetCruises Use Case', () => {
  let cruiseRepositoryMock: ReturnType<typeof createCruiseRepositoryMock>;
  let getCruisesUseCase: GetCruises;

  beforeEach(() => {
    cruiseRepositoryMock = createCruiseRepositoryMock();
    getCruisesUseCase = new GetCruises(cruiseRepositoryMock);
  });

  it('should call getCruises with the correct status', async () => {
    const mockCruises: Cruise[] = [
        {
            entry_id: '64PE395',
            'survey_id': '64PE395',
            'url': 'https://www.marine-geo.org/tools/entry/64PE395',
            'entry_type': '',
            'platform_id': 'Pelagia',
            'center_x': -37.089,
            'center_y': 12.541,
            'west': -49.106535,
            'east': -22.737688,
            'south': 11.920066,
            'north': 14.067080,
            'chief': 'Dr. Jan-Berend Stuut',
            'gmrt_entry_id': '64PE395',
            'gmrt_version_number': 4.2,
            'year': 2015,
            'r2r_fileset_id': '',
            'mac_url': '',
            'mac_platform_url': '',
            'public_notes': 'Ping edited throughout',
            'flag_file': 'Netherlands.gif',
            'flag_alt': 'Netherlands',
            'proc_data_set_uid': 31391,
            'data_processor_organization': 'Seabed 2030',
            'is_rejected': 'f',
            'created': '2023-05-12',
            'device_make': 'Kongsberg',
            'device_model': 'EM302',
            'total_area': 3135,
            'track_length': 732,
            'file_count': 170
          },
    ];

    // Mock the return value for getCruises
    cruiseRepositoryMock.getCruises.mockResolvedValue(mockCruises);

    const status = '';
    const result = await getCruisesUseCase.invoke(status);

    // Verify the method was called correctly
    expect(cruiseRepositoryMock.getCruises).toHaveBeenCalledWith(status);
    expect(result).toEqual(mockCruises);
  });

});
