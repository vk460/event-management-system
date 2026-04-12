import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F7] font-sans">
      <Header />
      <div className="flex flex-1 pt-0">
         <Sidebar />
         <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8 ml-72">
           {children}
         </main>
      </div>
    </div>
  );
};

export default Layout;
