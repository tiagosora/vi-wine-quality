import React from 'react';
import barChart from '../../assets/barchart.png';

const Sidebar = ({ onSelect }) => {
  const views = [
    { index: "2", name: "Bar Chart", img: barChart },
    { index: "3", name: "ScatterChart", img: barChart },
    { index: "4", name: "Confusion Matrix", img: barChart },
    { index: "5", name: "Radar Chart", img: barChart }
    // Add more views as needed, with respective images
  ];

  return (
    <div className="w-64 text-black flex flex-col">
      <button
        className="text-center text-xl font-semibold py-10 mb-10 p-4 border-b border-gray-700 hover:bg-gray-200 transition-colors duration-300 w-full"
        onClick={() => onSelect('1')}
      >
        Wine Quality
        <br />
        Analysis
      </button>
      {views.map((view, index) => (
        <button
          key={index}
          className="flex items-center justify-center py-10 text-center hover:bg-gray-200 transition-colors duration-300 w-full"
          onClick={() => onSelect(view.index)}
        >
          <img src={view.img} alt={`${view.name} Chart`} className="w-20 h-20 mr-2"/>
          {view.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
