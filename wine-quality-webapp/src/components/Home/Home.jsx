import React from 'react';
import banner from '../../assets/wine_banner.png'; // Update with the path to your image
import './Home.css'

const Home = () => {
  return (
    <div className="p-4 shadow-lg rounded-lg bg-white overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="text-center mr-6">
            <h1 className="welcome_text font-bold">Welcome To</h1>
            <h1 className="welcome_text font-bold">Wine Quality</h1>
            <h1 className="welcome_text font-bold">Analysis</h1>
          </div>
          <img src={banner} alt="Banner" className="w-auto h-96"/>
        </div>
        <div className="px-4 text-center">
          <h2 className="about_text font-semibold mb-4">About</h2>
          <p>
            {/* About section content */}
            Lorem ipsum dolor sit amet,
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
