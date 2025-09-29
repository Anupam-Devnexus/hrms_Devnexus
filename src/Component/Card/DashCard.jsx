import React from 'react';

const DashCard = ({ title, value, description, icon: Icon, borderColor = 'border-blue-400' }) => {
  return (
    <div className={`flex flex-col justify-between border-l-4 ${borderColor} bg-white shadow p-4 rounded-md`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{value}</h2>
        {Icon && <Icon className="text-gray-400 w-6 h-6" />}
      </div>
      <p className="text-gray-500 mt-2">{title}</p>
      {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
    </div>
  );
};

export default DashCard;
