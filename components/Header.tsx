import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Logo } from './Logo';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            {/* Logo Marca Principal */}
            <Logo />
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <span className="flex items-center gap-1 hover:text-sky-600 cursor-pointer transition-colors">
              <BarChart3 size={16} /> Metodologias
            </span>
            <span className="hover:text-sky-600 cursor-pointer transition-colors">Sobre</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;