import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';

function App() {
  const [selectedView, setSelectedView] = useState('View 1');

  const handleSelectView = (view) => {
    setSelectedView(view);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={handleSelectView} />
      <div className="flex-grow p-8 bg-gray-100">
        {/* Render content based on selected view */}
        {selectedView === 'View 1' && <div className="p-4 shadow-lg rounded-lg bg-white">Content for View 1</div>}
        {selectedView === 'View 2' && <div className="p-4 shadow-lg rounded-lg bg-white">Content for View 2</div>}
        {selectedView === 'View 3' && <div className="p-4 shadow-lg rounded-lg bg-white">Content for View 3</div>}
      </div>
    </div>
  );
}

export default App;
