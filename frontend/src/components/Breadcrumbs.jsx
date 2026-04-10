import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ paths }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest">
      <Link to="/principal/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home size={14} /> HOME
      </Link>
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-gray-300" />
          {path.link ? (
            <Link to={path.link} className="hover:text-primary transition-colors">
              {path.label}
            </Link>
          ) : (
            <span className="text-gray-900">{path.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
