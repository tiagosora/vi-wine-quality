import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/Home'; // Import the Home component
import './App.css';

function App() {
  const [selectedView, setSelectedView] = useState('1');

  const handleSelectView = (view) => {
    setSelectedView(view);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={handleSelectView} />
      <div className="flex-grow p-8 bg-gray-100 overflow-auto">
        {/* Render content based on selected view */}
        {selectedView === '1' && <Home />}
        {selectedView === '2' && <div className="p-4 shadow-lg rounded-lg bg-white">Content for View 2</div>}
        {selectedView === '3' && <div className="p-4 shadow-lg rounded-lg bg-white">Content for View 3</div>}
        {selectedView === '4' && <div className="p-4 shadow-lg rounded-lg bg-white">Content for View 4</div>}
        {selectedView === '5' && <div className="p-4 shadow-lg rounded-lg bg-white">Content for View 5</div>}
      </div>
    </div>
  );
}

export default App;
