
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import { UserRole } from './types';

// Pages
import { Landing, Auth, Contact, Ministries, About, Events } from './pages/Public';
import { Dashboard, Sermons, LiveStream, Giving, MemberProfile, PrayerRequest } from './pages/Member';
import { AdminDashboard } from './pages/Admin';

type Theme = 'light' | 'dark' | 'system';

interface MainLayoutProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Layout component to wrap pages that should have Navbar and Footer
const MainLayout: React.FC<MainLayoutProps> = ({ role, setRole, theme, setTheme }) => {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar role={role} setRole={setRole} theme={theme} setTheme={setTheme} />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-[#111521] border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 text-sm">
           <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                  {/* Brand Column */}
                  <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 flex items-center justify-center rounded bg-primary text-white">
                           <span className="material-symbols-outlined text-2xl">church</span>
                        </div>
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">CACC</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                         Christ's Ambassadors Celebration Centre. A place of worship, fellowship, and growth. Raising Ambassadors for Christ in this generation.
                      </p>
                      <div className="flex gap-4">
                         <a href="#" className="size-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">public</span>
                         </a>
                         <a href="#" className="size-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-red-600 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">smart_display</span>
                         </a>
                         <a href="#" className="size-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-pink-600 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">photo_camera</span>
                         </a>
                      </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                     <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Quick Links</h3>
                     <ul className="space-y-4">
                        {[
                          { l: 'About Us', p: '/about' },
                          { l: 'Our Ministries', p: '/ministries' },
                          { l: 'Sermons', p: '/sermons' },
                          { l: 'Events', p: '/events' },
                          { l: 'Give', p: '/give' },
                          { l: 'Contact Us', p: '/contact' },
                        ].map((link, i) => (
                           <li key={i}>
                              <Link to={link.p} className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors flex items-center gap-2">
                                 <span className="material-symbols-outlined text-xs">chevron_right</span> {link.l}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* Service Times */}
                  <div>
                     <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Service Times</h3>
                     <div className="space-y-6">
                        <div className="flex gap-4">
                           <div className="size-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-xl">schedule</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Sunday Service</h4>
                              <p className="text-slate-500 dark:text-slate-400 text-sm">9:00 AM (First Service)</p>
                              <p className="text-slate-500 dark:text-slate-400 text-sm">11:00 AM (Second Service)</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="size-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-xl">schedule</span>
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Wednesday Bible Study</h4>
                              <p className="text-slate-500 dark:text-slate-400 text-sm">6:30 PM (Midweek Service)</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Visit Us */}
                  <div>
                     <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Visit Us</h3>
                     <ul className="space-y-6">
                        <li className="flex gap-4">
                           <span className="material-symbols-outlined text-primary shrink-0">location_on</span>
                           <span className="text-slate-500 dark:text-slate-400">Kibabii Diploma Road,<br/>Adjacent to Marell Academy,<br/>Bungoma, Kenya</span>
                        </li>
                        <li className="flex gap-4">
                           <span className="material-symbols-outlined text-primary shrink-0">call</span>
                           <span className="text-slate-500 dark:text-slate-400">+254 759 277 874</span>
                        </li>
                        <li className="flex gap-4">
                           <span className="material-symbols-outlined text-primary shrink-0">mail</span>
                           <span className="text-slate-500 dark:text-slate-400">cacchurchbg@gmail.com</span>
                        </li>
                     </ul>
                  </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 text-xs">
                 <p>&copy; 2024 Christ's Ambassadors Celebration Centre. All rights reserved.</p>
                 <div className="flex gap-6">
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
                 </div>
              </div>
           </div>
      </footer>
      <AIAssistant />
    </div>
  );
};

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* Auth Page without Layout */}
        <Route path="/auth" element={<Auth setRole={setRole} />} />

        {/* Admin Route - SEPARATE FROM MAIN LAYOUT TO REMOVE HEADER */}
        <Route path="/admin" element={role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/auth" />} />
        
        {/* Main Application with Layout (Navbar + Footer) */}
        <Route element={<MainLayout role={role} setRole={setRole} theme={theme} setTheme={setTheme} />}>
            <Route path="/" element={<Landing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ministries" element={<Ministries />} />
            <Route path="/events" element={<Events />} />
            <Route path="/give" element={<Giving />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={role !== UserRole.GUEST ? <Dashboard /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={role !== UserRole.GUEST ? <MemberProfile /> : <Navigate to="/auth" />} />
            <Route path="/prayer" element={role !== UserRole.GUEST ? <PrayerRequest /> : <Navigate to="/auth" />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/live" element={<LiveStream role={role} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
