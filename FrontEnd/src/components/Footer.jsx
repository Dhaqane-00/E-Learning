import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';

function Footer() {

  const location = useLocation();
  const hideFooter = location.pathname === "/register" || location.pathname === "/login"


  return (
    <div className={`w-full ${hideFooter ? 'hidden' : ''} bg-bgOne flex justify-center items-center py-4 sm:py-6 border-t border-border `}>


      <ul className='flex gap-4 sm:w-1/5  justify-between items-center text-sm sm:text-sm mx-auto text-gray'>

        <Link to='https://github.com/Dhaqane-00' target='_blank'>
          <div className='flex gap-2 jusc
           items-center'>
            <FaGithub  />
            <h4>Github</h4>
          </div>
        </Link>
        <Link to='#' target='_blank'>
          <div className='flex gap-2 jusc
           items-center'>
            <FaLinkedin  />
            <h4>LinkedIn</h4>
          </div>
        </Link>
        <Link to='mailto:AbdilaahiMowliid@gmail.com' target='_blank'>
          <div className='flex gap-2 jusc
           items-center'>
            <FaEnvelope />
            <h4>Email</h4>
          </div>
        </Link>
      </ul>
    </div>
  );
}

export default Footer;
