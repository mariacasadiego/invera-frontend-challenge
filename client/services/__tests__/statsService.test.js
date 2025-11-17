import axios from 'axios';
import { fetchStats } from '../statsService';

jest.mock('axios');

describe('statsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches stats successfully', async () => {
    const mockStats = {
      totalUsers: 1000,
      newUsers: 200,
      topUsers: 50,
      otherUsers: 750,
    };

    axios.get.mockResolvedValue({ data: mockStats });

    const result = await fetchStats();

    expect(result).toEqual(mockStats);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/statics');
  });

  it('handles fetch error', async () => {
    const error = new Error('Failed to fetch stats');
    axios.get.mockRejectedValue(error);

    await expect(fetchStats()).rejects.toThrow('No se pudieron cargar las estadísticas');
  });
});

