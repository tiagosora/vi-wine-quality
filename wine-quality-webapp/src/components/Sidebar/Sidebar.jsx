import React from 'react';
import barChart from '../../assets/barchart.png';
import scatterChart from '../../assets/scatterchart.png';
import correlogram from '../../assets/correlogram.png';
import radarChart from '../../assets/radarchart.png';
import logo from '../../assets/wine_logo_nb.png'
import './Sidebar.css'

const Sidebar = ({ onSelect }) => {
  const views = [
    { index: "2", name: "Distribution", img: barChart },
    { index: "3", name: "Influence", img: scatterChart },
    { index: "4", name: "Correlation", img: correlogram },
    { index: "5", name: "Comparison", img: radarChart }
    // Add more views as needed, with respective images
  ];

  return (
    <div className="w-80 text-black flex flex-col overflow-auto">
      <button
        className="home_text text-center font-semibold py-10 mb-10 p-4 border-b border-gray-700 hover:bg-gray-200 transition-colors duration-300 w-full"
        onClick={() => onSelect('1')}
        style={{"color":"#8F1636"}}
      >
        Wine Quality
        <br />
        Analysis
      </button>
      {views.map((view, index) => (
        <button
          key={index}
          className="flex items-center justify-center py-4 text-center hover:bg-gray-200 transition-colors duration-300 w-full"
          onClick={() => onSelect(view.index)}
        >
          <img src={view.img} className="w-20 h-20 mr-2"/>
          {view.name}
        </button>
      ))}
      <div className='logo w-full h-full justify-center'>
        <img src={logo} className="logopng"/>
      </div>
    </div>
  );
};

export default Sidebar;
