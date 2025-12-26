
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

export const AdminDashboard: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#F8F9FC] font-sans text-slate-800">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50">
            {/* Logo */}
            <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100">
                <div className="size-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                    <span className="material-symbols-outlined">church</span>
                </div>
                <div>
                    <h1 className="font-bold text-sm leading-tight text-slate-900">CACC Admin</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Celebration Centre</p>
                </div>
            </div>

            {/* Menu */}
            <div className="p-4 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                <div>
                    <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Overview</h3>
                    <nav className="space-y-1">
                        <MenuItem icon="dashboard" label="Dashboard" active />
                    </nav>
                </div>
                
                <div>
                    <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Management</h3>
                    <nav className="space-y-1">
                        <MenuItem icon="church" label="Services" />
                        <MenuItem icon="article" label="Content (CMS)" />
                        <MenuItem icon="calendar_month" label="Events" />
                        <MenuItem icon="groups" label="People" />
                        <MenuItem icon="payments" label="Finance" />
                    </nav>
                </div>
            </div>

            {/* Bottom */}
            <div className="p-4 border-t border-slate-100 space-y-1">
                <MenuItem icon="settings" label="Settings" />
                <MenuItem icon="logout" label="Logout" />
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 overflow-y-auto h-full flex flex-col">
            {/* Top Header - Title & Controls */}
            <header className="flex justify-between items-start mb-8">
                {/* Title Section (Restored) */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Ministry Overview</h2>
                    <p className="text-sm text-slate-500">Welcome back, Pastor. Here's your ministry snapshot.</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 relative z-40">
                    {/* Search */}
                    <button className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition" title="Search">
                        <span className="material-symbols-outlined">search</span>
                        <span className="text-xs font-bold hidden sm:inline">Search</span>
                    </button>

                    {/* Notifications */}
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <div 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 cursor-pointer p-1 pr-3 hover:bg-white rounded-full transition border border-transparent hover:border-slate-100"
                        >
                            <div className="size-9 rounded-full bg-indigo-100 border-2 border-white shadow-sm overflow-hidden">
                                <img src="https://i.pravatar.cc/150?u=pastor" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-xs font-bold text-slate-900 leading-none">Pastor Daniel</p>
                                <p className="text-[10px] text-slate-500 leading-none mt-0.5">Admin</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
                        </div>

                        {isProfileOpen && (
                            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in-up">
                                <div className="px-4 py-3 border-b border-slate-50 mb-1 md:hidden">
                                    <p className="text-sm font-bold text-slate-900">Pastor Daniel</p>
                                    <p className="text-xs text-slate-500">Senior Administrator</p>
                                </div>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-3 transition">
                                    <span className="material-symbols-outlined text-[18px]">person</span> My Profile
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-3 transition">
                                    <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                                </button>
                                <div className="h-px bg-slate-50 my-1"></div>
                                <button 
                                    onClick={() => navigate('/auth')}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Quick Actions */}
            <div className="flex gap-4 mb-8">
                <ActionBtn icon="add_circle" label="Plan Service" primary />
                <ActionBtn icon="upload_file" label="Upload Media" />
                <ActionBtn icon="calendar_add_on" label="Create Event" />
                <ActionBtn icon="attach_money" label="Record Giving" />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <StatCard icon="groups" label="Avg. Attendance" value="1,240" trend="+5%" trendUp />
                <StatCard icon="savings" label="Monthly Tithe" value="$42,500" trend="+12%" trendUp />
                <StatCard icon="confirmation_number" label="Event Registrations" value="148" badge="Active" />
                <StatCard icon="play_circle" label="Sermon Views" value="3.2k" trend="+24%" trendUp />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-12 gap-6 mb-8">
                {/* Next Service */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-3">
                            <div className="size-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">church</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Next Service</h3>
                                <p className="text-xs text-slate-500">Sunday, Oct 29</p>
                            </div>
                        </div>
                        <button className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100">Manage</button>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                            <span className="text-slate-400 font-medium uppercase text-xs tracking-wider">Theme</span>
                            <span className="font-bold text-slate-900">Walking in Dominion</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                            <span className="text-slate-400 font-medium uppercase text-xs tracking-wider">Preacher</span>
                            <span className="font-bold text-slate-900">Pastor Daniel</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-slate-500">Volunteer Roster</span>
                            <span className="text-orange-500">85% Filled</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[85%] rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-orange-600 text-xs font-bold bg-orange-50 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-sm">warning</span> 2 Ushering roles needed
                    </div>
                </div>

                {/* Content CMS */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-3">
                            <div className="size-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">rss_feed</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Content (CMS)</h3>
                                <p className="text-xs text-slate-500">Recent Activity</p>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-blue-600 hover:underline">Library</button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer">
                            <div className="size-8 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm border border-slate-100"><span className="material-symbols-outlined text-sm">mic</span></div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-900">Sunday Sermon</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Processing • Audio</p>
                            </div>
                            <div className="size-2 rounded-full bg-yellow-400"></div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer">
                            <div className="size-8 bg-white rounded-lg flex items-center justify-center text-green-500 shadow-sm border border-slate-100"><span className="material-symbols-outlined text-sm">description</span></div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-900">Weekly Bulletin</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Published • PDF</p>
                            </div>
                            <div className="size-2 rounded-full bg-green-500"></div>
                        </div>
                    </div>

                    <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">add</span> Upload New Content
                    </button>
                </div>

                {/* Live Stream */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-1 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden mb-4 group">
                        <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 transition duration-700 group-hover:scale-105" alt="Live Stream Thumbnail" />
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1.5">
                            <div className="size-1.5 rounded-full bg-red-500 animate-pulse"></div> OFFLINE
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="size-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white cursor-pointer hover:scale-110 transition hover:bg-white/30">
                                <span className="material-symbols-outlined filled">play_arrow</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 pb-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-slate-900">Live Service Stream</h3>
                                <p className="text-xs text-slate-500">Scheduled: Sunday, 9:00 AM</p>
                            </div>
                            <button className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"><span className="material-symbols-outlined text-sm">settings</span></button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-700">Go Live</span>
                            <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer hover:bg-slate-300 transition-colors">
                                <div className="absolute left-1 top-1 size-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-12 gap-6">
                {/* Analytics */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Attendance Trends</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-3xl font-black text-slate-900">850</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">avg. per service</span>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded ml-2">+2.5%</span>
                            </div>
                        </div>
                        <div className="flex gap-1 bg-slate-50 p-1 rounded-lg">
                            {['30 Days', '90 Days', 'Year'].map((t, i) => (
                                <button key={t} className={`px-3 py-1 text-xs font-bold rounded-md transition ${i === 0 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    {/* SVG Chart */}
                    <div className="h-48 w-full flex items-end">
                        <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible preserve-3d" style={{vectorEffect: 'non-scaling-stroke'}}>
                            <path d="M0,25 Q10,28 20,20 T40,15 T60,22 T80,10 T100,18" fill="none" stroke="#4F46E5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            <path d="M0,25 Q10,28 20,20 T40,15 T60,22 T80,10 T100,18 V30 H0 Z" fill="url(#gradient)" stroke="none" opacity="0.1" />
                            <defs>
                                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#4F46E5" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900">Upcoming Events</h3>
                        <button className="text-xs font-bold text-blue-600 hover:underline">Calendar</button>
                    </div>
                    <div className="space-y-4">
                        <EventItem date="29" month="OCT" title="Sunday Service" time="9:00 AM - 11:30 AM" />
                        <EventItem date="01" month="NOV" title="Youth Bible Study" time="6:30 PM - 8:00 PM" color="text-purple-600 bg-purple-50" />
                        <EventItem date="05" month="NOV" title="Community Outreach" time="8:00 AM - 2:00 PM" color="text-orange-600 bg-orange-50" />
                    </div>
                </div>
            </div>

            {/* Dashboard Footer */}
            <div className="mt-auto pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
                <div>
                    &copy; {new Date().getFullYear()} CACC Organization System.
                </div>
                <div className="flex items-center gap-6">
                    <span>System v2.1.0</span>
                    <span className="flex items-center gap-1">
                        Powered by <span className="font-bold text-slate-500">Generexcom</span>
                    </span>
                </div>
            </div>
        </main>
    </div>
  );
};

// --- Helpers for AdminDashboard ---

const MenuItem: React.FC<{ icon: string, label: string, active?: boolean }> = ({ icon, label, active }) => (
    <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${active ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
        <span className={`material-symbols-outlined text-[20px] ${active ? 'filled' : ''}`}>{icon}</span>
        {label}
    </button>
);

const ActionBtn: React.FC<{ icon: string, label: string, primary?: boolean }> = ({ icon, label, primary }) => (
    <button className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all ${primary ? 'bg-[#4F46E5] text-white hover:bg-[#4338ca]' : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'}`}>
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        {label}
    </button>
);

const StatCard: React.FC<{ icon: string, label: string, value: string, trend?: string, trendUp?: boolean, badge?: string, col?: string, bg?: string }> = ({ icon, label, value, trend, trendUp, badge, col, bg }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-lg ${bg || 'bg-slate-50'} ${col || 'text-slate-600'}`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            {trend && (
                <span className={`text-xs font-bold flex items-center gap-1 ${trendUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-1.5 py-0.5 rounded`}>
                    <span className="material-symbols-outlined text-xs">{trendUp ? 'trending_up' : 'trending_down'}</span> {trend}
                </span>
            )}
            {badge && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {badge}
                </span>
            )}
        </div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-900">{value}</h3>
    </div>
);

const EventItem: React.FC<{ date: string, month: string, title: string, time: string, color?: string }> = ({ date, month, title, time, color }) => (
    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer group">
        <div className={`size-12 rounded-lg flex flex-col items-center justify-center shrink-0 ${color || 'bg-blue-50 text-blue-600'}`}>
            <span className="text-[10px] font-bold uppercase">{month}</span>
            <span className="text-lg font-black leading-none">{date}</span>
        </div>
        <div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">{title}</h4>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <span className="material-symbols-outlined text-xs">schedule</span> {time}
            </div>
        </div>
        <button className="ml-auto text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
    </div>
);
