import React from 'react';

const SidebarOption = (props) => {
  return (
    <button
      className='flex items-center p-2 transition-colors duration-300 hover:bg-blue-100 rounded-md'
      onClick={props.onClick}
    >
      <img
        className='w-6 h-6 mr-2'
        src={props.image}
        alt='Chart Image'
      />
      <span className='font-medium'>{props.desc}</span>
    </button>
  );
};

export default SidebarOption;
