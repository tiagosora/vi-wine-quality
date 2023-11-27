import React from 'react';
import banner from '../../assets/wine_banner.png';
import './Home.css'
import paulo from '../../assets/paulo.jpeg';
import tiago from '../../assets/tiago.png';

const Home = () => {
  return (
    <div className="content p-4 shadow-lg rounded-lg bg-white overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="text-center mr-6">
            <h1 className="welcome_text font-bold">Welcome To</h1>
            <h1 className="welcome_text font-bold">Wine Quality</h1>
            <h1 className="welcome_text font-bold">Analysis</h1>
          </div>
          <img src={banner} alt="Banner" className="w-auto h-96"/>
        </div>
        <div className="about_section text-center">
          <h2 className="about_text font-semibold mb-4">About</h2>
          <p>
            This project is related to the first assignment of the Information Visualization course, in which it was, initially, proposed to pick a theme and a dataset.
          </p>
          <p>
            Using the data from the dataset, the students had to apply diverse ways of visualizing the data with appropriate views.
          </p>
        </div>
        <div className='authors'>
          <div className='author pr-20'>
            <div className='author_image'>
                <img src={paulo} />
            </div>
            <div className='text-center'>
                <p className='author_name'>Paulo Pinto</p>
                <p>paulonkjnpinto02@ua.pt</p>
            </div>
          </div>
          <div className='author'>
            <div className='author_image'>
                <img src={tiago} />
            </div>
            <div className='text-center'>
                <p className='author_name'>Tiago Carvalho</p>
                <p>tiagogcarvalho@ua.pt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
