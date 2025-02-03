import React from 'react';
import Link from 'next/link';  // Importa il Link da Next.js


const Header = ({ title, subtitle }) => {
  return (
    <div className='indexhead'>
      <h1><Link href="/">{title}</Link></h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default Header;