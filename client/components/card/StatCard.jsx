'use client';

import Image from 'next/image';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';

const StatCard = ({ title, value, iconSrc }) => {
  return (
    <div className="card relative p-5 rounded-md w-full h-[80px] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={iconSrc} alt={title} width={40} height={40} />
        <div>
          <p className="text-sm text-secondary font-bold leading-5">{title}</p>
          <p className="text-xs text-primary font-normal leading-5">{value}</p>
        </div>
      </div>
      <button
        type="button"
        className="text-secondary hover:text-primary transition-colors p-1"
        aria-label="Más opciones"
      >
        <PiDotsThreeVerticalBold size={20} />
      </button>
    </div>
  );
};

export default StatCard;