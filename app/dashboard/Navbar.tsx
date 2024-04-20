import React, { useState, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu'; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [activeLink, setActiveLink] = useState('');
  const options = ["Dashboard", "Profile", "Exam Registration", "Course Details"];
  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  return (
    <>
      <div className="bg-white">
        <div className="container mx-auto">
          <div>
            <div className="w-[250px] text-lg font-normal px-8 py-48 space-y-10 h-full shadow-2xl shadow-slate-200 bg-white absolute top-[60px] border-2 left-0 sm:block hidden">
              {options.map((option, index) => {
                const path = `/${option.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <div key={index} className={`cursor-pointer hover:text-dseublue  ${path === activeLink ? 'text-dseublue ' : ''}`}>
                    <a href={path}>
                      {option}
                    </a>
                  </div>
                );
              })}
            </div>
            <div className="sm:hidden block">
              <MenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)} /> 
              {isMenuOpen && ( 
                <div className="flex flex-row items-center space-x-4 bg-white p-4 shadow-lg absolute top-[60px] left-0 right-0 z-20">
                  {options.map((option, index) => {
                    const path = `/${option.toLowerCase().replace(/\s+/g, '-')}`;
                    return (
                      <a
                        key={index}
                        href={path}
                        className={`cursor-pointer hover:text-dseublue ${path === activeLink ? 'text-dseublue' : ''}`}
                      >
                        {option}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
