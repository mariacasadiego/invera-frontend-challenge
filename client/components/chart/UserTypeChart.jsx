'use client';

import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader';
import { fetchUserTypes } from '@/services/statsService';
import {
  RadialBar,
  RadialBarChart,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="chart-tooltip border border-primary rounded-md p-2 text-primary text-xs md:text-sm shadow-lg"
      >
        <p className="font-semibold">
          {payload[0].name}: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const UserTypeChart = () => {
  const { data: userTypesData, isLoading } = useQuery({
    queryKey: ['userTypes'],
    queryFn: fetchUserTypes,
  });

  if (isLoading || !userTypesData) {
    return <Loader />;
  }

  const { totalUsers, distribution } = userTypesData;

  const colors = {
    Organic: '#7B99FF',
    Social: '#C9D7FD',
    Direct: '#28E384',
  };

  const orderedDistributionForChart = [
    distribution.find(d => d.type === 'Direct'),
    distribution.find(d => d.type === 'Social'),
    distribution.find(d => d.type === 'Organic'),
  ].filter(Boolean);

  const orderedDistributionForLegend = [
    distribution.find(d => d.type === 'Organic'),
    distribution.find(d => d.type === 'Social'),
    distribution.find(d => d.type === 'Direct'),
  ].filter(Boolean);

  const angleRange = 270;

  const chartData = orderedDistributionForChart.map((item) => ({
    name: item.type,
    percentage: (item.percentage / 100) * angleRange,
    fill: colors[item.type] || '#7B99FF',
  }));

  const legendData = orderedDistributionForLegend.map((item) => ({
    name: item.type,
    percentage: item.percentage,
    fill: colors[item.type] || '#7B99FF',
  }));

  return (
    <div className="card flex flex-col p-4 sm:p-5 md:p-6 text-primary">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">Estadistics</h3>
      <div className="flex flex-col md:flex-row items-center justify-around gap-4 sm:gap-6 md:gap-8">
        <div className="relative w-full max-w-[180px] sm:max-w-[200px] md:max-w-[210px] h-[180px] sm:h-[200px] md:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="68%"
              outerRadius="100%"
              data={chartData}
              startAngle={180}
              endAngle={-290}
            >
              <Tooltip content={<CustomTooltip />} />
              <RadialBar
                dataKey="percentage"
                background={{ fill: 'var(--border-primary)' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <p className="text-primary text-lg sm:text-xl md:text-2xl font-bold leading-none">
              {Math.floor(totalUsers / 1000)}k
            </p>
            <p className="text-xs sm:text-sm text-secondary">users</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 w-full md:w-auto">
          {legendData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs sm:text-sm w-full min-w-[300px] sm:min-w-[350px] md:min-w-[400px] md:max-w-[400px]"
            >
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-primary whitespace-nowrap">{item.name}</span>
              </div>
              <span className="text-primary whitespace-nowrap flex-shrink-0 ml-auto pl-4">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTypeChart;