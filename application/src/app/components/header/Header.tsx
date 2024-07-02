import React from 'react';
import Menu from './Menu';

interface HeaderProps {
  className: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={className}>
      <div className='logo'>Football-ish</div>
      <div className='search-field'>
        <input type='text' placeholder='Search' />
      </div>
      <Menu />
    </header>
  );
};

export default Header;
