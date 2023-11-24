import React from 'react';
import barChart from '../../assets/barchart.png';

const Sidebar = ({ onSelect }) => {
  const views = [
    { name: "View 1", img: barChart },
    { name: "View 2", img: barChart },
    { name: "View 3", img: barChart }
    // Add more views as needed, with respective images
  ];

  return (
    <div className="w-64 text-black flex flex-col">
      <div className="text-xl font-semibold p-4 border-b border-gray-700">
        Wine Quality
        <br />
        Analysis
      </div>
      {views.map((view, index) => (
        <button
          key={index}
          className="flex items-center py-2 px-4 text-left hover:bg-gray-200 transition-colors duration-300"
          onClick={() => onSelect(view.name)}
        >
          <img src={view.img} alt={`${view.name} Chart`} className="w-6 h-6 mr-2"/>
          {view.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
