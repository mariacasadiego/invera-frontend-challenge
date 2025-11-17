import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';

export const fetchStats = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/statics`);
    return data;
  } catch (error) {
    logger.error('Error fetching stats', error);
    throw new Error('No se pudieron cargar las estadísticas');
  }
};

export const fetchUserTypes = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/userTypes`);
    return data;
  } catch (error) {
    logger.error('Error fetching user types', error);
    throw new Error('No se pudieron cargar los tipos de usuario');
  }
};
