'use client';

import Header from '@/components/header/Header';
import UserStats from '@/components/Card/UserStats';
import UserTypeChart from '@/components/chart/UserTypeChart';
import UserTable from '@/components/table/UserTable';

const HomePage = () => {
  return (
    <main className="p-6">
      <div className="flex flex-col gap-8">
        <Header />
        <UserStats />
        <div className="flex flex-col gap-6">
          <UserTypeChart />
          <UserTable />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
