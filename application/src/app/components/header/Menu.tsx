import Link from 'next/link';
import React from 'react';

const Menu: React.FC = () => {
  return (
    <div className='fo'>
      <ul className="flex flex-wrap justify-center sm:justify-start">
        <li className="mr-4">
          <Link href='/' className="text-gray-600 hover:text-gray-800">Home</Link>
        </li>
        <li className="mr-4">
          <Link href='/about-us' className="text-gray-600 hover:text-gray-800">About us</Link>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
