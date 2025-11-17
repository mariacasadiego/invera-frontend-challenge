'use client';

import { useStats } from '@/hooks/useStats';
import StatCard from './StatCard';
import Loader from '../Loader';

const UserStats = () => {
  const { data, isLoading, error } = useStats();

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">Error al cargar estadísticas</p>;

  const stats = [
    {
      title: 'Total Users',
      value: data.totalUsers,
      icon: '/assets/icons/userGroupIcon.svg',
    },
    {
      title: 'New Users',
      value: data.newUsers,
      icon: '/assets/icons/usersIcon.svg',
    },
    {
      title: 'Top Users',
      value: data.topUsers,
      icon: '/assets/icons/heartIcon.svg',
    },
    {
      title: 'Other Users',
      value: data.otherUsers,
      icon: '/assets/icons/dotsIcon.svg',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          iconSrc={stat.icon}
        />
      ))}
    </div>
  );
};

export default UserStats;