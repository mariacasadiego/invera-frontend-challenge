import axios from 'axios';
import {
  fetchUsersPaginated,
  createUser,
  updateUser,
  deleteUser,
} from '../userService';

jest.mock('axios');

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsersPaginated', () => {
    it('fetches paginated users successfully', async () => {
      const mockResponse = {
        data: [{ id: 1, name: 'John Doe' }],
        headers: { 'x-total-count': '10' },
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await fetchUsersPaginated({
        page: 1,
        limit: 10,
        query: '',
        sort: '',
        order: '',
      });

      expect(result).toEqual({
        users: mockResponse.data,
        total: 10,
      });
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/users', {
        params: {
          _page: 1,
          _limit: 10,
        },
      });
    });

    it('includes query parameter when provided', async () => {
      const mockResponse = {
        data: [],
        headers: { 'x-total-count': '0' },
      };

      axios.get.mockResolvedValue(mockResponse);

      await fetchUsersPaginated({
        page: 1,
        limit: 10,
        query: 'John',
        sort: '',
        order: '',
      });

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/users', {
        params: {
          _page: 1,
          _limit: 10,
          q: 'John',
        },
      });
    });

    it('includes sort and order parameters when provided', async () => {
      const mockResponse = {
        data: [],
        headers: { 'x-total-count': '0' },
      };

      axios.get.mockResolvedValue(mockResponse);

      await fetchUsersPaginated({
        page: 1,
        limit: 10,
        query: '',
        sort: 'name',
        order: 'asc',
      });

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/users', {
        params: {
          _page: 1,
          _limit: 10,
          _sort: 'name',
          _order: 'asc',
        },
      });
    });

    it('handles missing x-total-count header', async () => {
      const mockResponse = {
        data: [],
        headers: {},
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await fetchUsersPaginated({
        page: 1,
        limit: 10,
        query: '',
        sort: '',
        order: '',
      });

      expect(result.total).toBe(0);
    });
  });

  describe('createUser', () => {
    it('creates a user successfully', async () => {
      const newUser = { name: 'New User', email: 'new@example.com' };
      const mockResponse = { data: { id: 1, ...newUser } };

      axios.post.mockResolvedValue(mockResponse);

      const result = await createUser(newUser);

      expect(result).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/users', newUser);
    });
  });

  describe('updateUser', () => {
    it('updates a user successfully', async () => {
      const updates = { name: 'Updated Name' };
      const mockResponse = { data: { id: 1, ...updates } };

      axios.put.mockResolvedValue(mockResponse);

      const result = await updateUser({ id: 1, updates });

      expect(result).toEqual(mockResponse.data);
      expect(axios.put).toHaveBeenCalledWith('http://localhost:8000/users/1', updates);
    });
  });

  describe('deleteUser', () => {
    it('deletes a user successfully', async () => {
      axios.delete.mockResolvedValue({});

      const result = await deleteUser(1);

      expect(result).toBe(1);
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:8000/users/1');
    });
  });
});

