import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';

export const fetchUsersPaginated = async ({ page, limit, query, sort, order }) => {
  try {
    const params = {
      _page: page,
      _limit: limit,
    };

    if (query) params.q = query;
    if (sort) params._sort = sort;
    if (order) params._order = order;

    const response = await axios.get(`${API_URL}/users`, { params });

    return {
      users: response.data,
      total: Number(response.headers['x-total-count']) || 0,
    };
  } catch (error) {
    logger.error('Error fetching users', error);
    throw new Error('No se pudieron cargar los usuarios');
  }
};

export const createUser = async (newUser) => {
  try {
    const { data } = await axios.post(`${API_URL}/users`, newUser);
    return data;
  } catch (error) {
    logger.error('Error creating user', error);
    throw new Error('No se pudo crear el usuario');
  }
};

export const updateUser = async ({ id, updates }) => {
  try {
    const { data } = await axios.put(`${API_URL}/users/${id}`, updates);
    return data;
  } catch (error) {
    logger.error('Error updating user', error);
    throw new Error('No se pudo actualizar el usuario');
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
    return id;
  } catch (error) {
    logger.error('Error deleting user', error);
    throw new Error('No se pudo eliminar el usuario');
  }
};
