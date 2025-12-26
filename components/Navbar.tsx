
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const Navbar: React.FC<NavbarProps> = ({ role, setRole, theme, setTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-primary dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white';

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full flex flex-col shadow-md">
        {/* Top Bar - Royal Blue */}
        <div className="bg-primary text-white py-2 px-4 md:px-8 lg:px-20 flex justify-between items-center text-xs md:text-sm font-medium">
          <div className="flex items-center gap-4">
             <a href="tel:+254759277874" className="flex items-center gap-1 hover:text-gray-200">
               <span className="material-symbols-outlined text-[16px]">call</span> +254 759 277 874
             </a>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-3 border-r border-white/20 pr-4">
                <a href="#" className="hover:text-gray-200">@cacchurchbg</a>
                <div className="flex gap-2">
                   <span className="material-symbols-outlined text-[16px] cursor-pointer">public</span>
                   <span className="material-symbols-outlined text-[16px] cursor-pointer">ondemand_video</span>
                </div>
             </div>
             <button 
               onClick={() => setIsSearchOpen(true)}
               className="flex items-center gap-1 hover:text-gray-200 transition-colors"
             >
               <span className="material-symbols-outlined text-[18px]">search</span>
               <span className="hidden sm:inline">Search</span>
             </button>
             
             {/* Theme Toggle */}
             <button 
               onClick={cycleTheme}
               className="flex items-center gap-1 hover:text-gray-200 transition-colors ml-2 border-l border-white/20 pl-4"
               title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
             >
                <span className="material-symbols-outlined text-[18px]">
                  {theme === 'light' ? 'light_mode' : theme === 'dark' ? 'dark_mode' : 'contrast'}
                </span>
                <span className="hidden sm:inline capitalize font-bold">{theme}</span>
             </button>
          </div>
        </div>

        {/* Main Nav - White */}
        <div className="bg-white dark:bg-[#111521] border-b border-gray-100 dark:border-gray-800">
          <div className="px-4 md:px-8 lg:px-20 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="size-12 flex items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined text-[28px]">church</span>
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-primary dark:text-white text-xl font-extrabold tracking-tight leading-none">CACC</h2>
                <span className="text-[0.6rem] font-bold text-accent-red uppercase tracking-[0.15em] leading-none mt-1">Celebration Centre</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-8">
                <Link to="/" className={`text-sm font-bold uppercase tracking-wide transition-colors ${isActive('/')}`}>Home</Link>
                <Link to="/about" className={`text-sm font-bold uppercase tracking-wide transition-colors ${isActive('/about')}`}>About</Link>
                <Link to="/ministries" className={`text-sm font-bold uppercase tracking-wide transition-colors ${isActive('/ministries')}`}>Ministries</Link>
                <Link to="/events" className={`text-sm font-bold uppercase tracking-wide transition-colors ${isActive('/events')}`}>Events</Link>
                {role === UserRole.MEMBER && (
                  <>
                     <Link to="/dashboard" className={`text-sm font-bold uppercase tracking-wide transition-colors ${isActive('/dashboard')}`}>Dashboard</Link>
                     <Link to="/live" className="flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all animate-pulse">
                       <span className="material-symbols-outlined text-sm filled">videocam</span> Live
                     </Link>
                  </>
                )}
                <Link to="/give" className={`text-sm font-bold uppercase tracking-wide transition-colors ${isActive('/give')}`}>Give</Link>
              </nav>
              
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-700">
                {role === UserRole.GUEST ? (
                  <Link to="/auth" className="flex items-center justify-center h-10 px-6 rounded-md bg-accent-red hover:bg-accent-red-dark text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all">
                    Login / Join
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{role}</span>
                    <button 
                      onClick={() => setRole(UserRole.GUEST)}
                      className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:text-accent-red transition"
                      title="Logout"
                    >
                      <span className="material-symbols-outlined">logout</span>
                    </button>
                    {role === UserRole.ADMIN && (
                       <Link to="/admin" className="h-10 px-4 rounded-md bg-slate-800 text-white flex items-center gap-2 text-sm font-bold">
                         <span className="material-symbols-outlined text-sm">dashboard</span> Admin
                       </Link>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#111521] border-t border-gray-100 dark:border-gray-800 p-4 absolute top-[115px] w-full shadow-xl z-40 animate-fade-in-down">
             <nav className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800">Home</Link>
              <Link to="/ministries" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800">Ministries</Link>
              <Link to="/events" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800">Events</Link>
              {role === UserRole.MEMBER && (
                <>
                   <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800">Dashboard</Link>
                   <Link to="/live" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-accent-red py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                      <span className="material-symbols-outlined filled">videocam</span> Watch Live
                   </Link>
                </>
              )}
              <Link to="/give" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800">Give</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-800 dark:text-white py-2">Contact</Link>
              
              <div className="mt-4 flex gap-2">
                 {role === UserRole.GUEST ? (
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="w-full h-12 flex items-center justify-center rounded-md bg-primary text-white font-bold">Member Login</Link>
                 ) : (
                    <button onClick={() => {setRole(UserRole.GUEST); setIsMenuOpen(false);}} className="w-full h-12 flex items-center justify-center rounded-md bg-red-50 text-red-600 font-bold border border-red-200">Logout</button>
                 )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Search Popup Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl p-6 m-4">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-primary dark:text-white">Search CACC</h3>
                <button onClick={() => setIsSearchOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition">
                   <span className="material-symbols-outlined">close</span>
                </button>
             </div>
             <div className="relative">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search for sermons, events, or ministries..." 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-lg text-lg focus:ring-2 focus:ring-primary dark:text-white"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">search</span>
             </div>
             <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                   {['Sunday Service', 'Youth Ministry', 'Tithe', 'Prayer Request', 'Conference'].map(tag => (
                      <button key={tag} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-primary hover:text-white transition">
                         {tag}
                      </button>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
