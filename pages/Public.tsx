
import React, { useState, useEffect } from 'react';
import { UserRole, Event } from '../types';
import { useNavigate, Link } from 'react-router-dom';

interface AuthProps {
  setRole: (role: UserRole) => void;
}

// --- MOCK DATA FOR EVENTS ---
const UPCOMING_EVENTS: Event[] = [
  { id: '1', title: 'Prophetic Encounter Night', date: '2023-11-03', time: '19:00 - 23:00', location: 'Main Sanctuary', category: 'Worship', image: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?q=80&w=2070&auto=format&fit=crop' },
  { id: '2', title: 'Men\'s Breakfast', date: '2023-11-11', time: '08:00 - 10:00', location: 'Fellowship Hall', category: 'Fellowship', image: 'https://images.unsplash.com/photo-1549492167-9610b8f44d56?q=80&w=2600&auto=format&fit=crop' },
  { id: '3', title: 'Youth Concert: Arise', date: '2023-11-18', time: '16:00 - 20:00', location: 'CACC Auditorium', category: 'Youth', image: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2670&auto=format&fit=crop' },
  { id: '4', title: 'Community Medical Camp', date: '2023-11-25', time: '09:00 - 16:00', location: 'Church Grounds', category: 'Outreach', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop' },
  { id: '5', title: 'Marriage Seminar', date: '2023-12-02', time: '14:00 - 17:00', location: 'Main Sanctuary', category: 'Fellowship', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2669&auto=format&fit=crop' },
  { id: '6', title: 'Christmas Carol Service', date: '2023-12-24', time: '18:00 - 20:00', location: 'Main Sanctuary', category: 'Worship', image: 'https://images.unsplash.com/photo-1512389142860-9c449ded37fd?q=80&w=2670&auto=format&fit=crop' },
];

const RECENT_UPDATES = [
    {
        id: 1,
        title: "Annual Thanksgiving Service Recap",
        category: "Recap",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop",
        excerpt: "What a glorious time in God's presence! Read about the highlights and testimonies from our recent Thanksgiving service."
    },
    {
        id: 2,
        title: "Men's Fellowship Breakfast",
        category: "Upcoming",
        image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2670&auto=format&fit=crop",
        excerpt: "Calling all men to gather early at the tabernacle for breakfast, prayer, and an encouraging word from Pastor David."
    },
    {
        id: 3,
        title: "Mission Trip to Uganda 2024",
        category: "Missions",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop",
        excerpt: "Registration is now open for our annual missionary trip. Be part of the team taking the gospel to the nations."
    }
];

// --- MOCK DATA FOR MINISTRIES ---
const MINISTRY_CATEGORIES = ["All Ministries", "Kids & Youth", "Men", "Women", "Outreach", "Creative Arts"];

const MINISTRIES_DATA = [
  {
    id: 1,
    title: "Worship Ministry",
    category: "Creative Arts",
    image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2670&auto=format&fit=crop",
    description: "Lead the congregation in praise and worship through music, vocals, and technical excellence.",
    leader: { name: "Pastor David", avatar: "https://i.pravatar.cc/150?u=david" }
  },
  {
    id: 2,
    title: "Ushering Team",
    category: "Service",
    image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2670&auto=format&fit=crop",
    description: "Create a welcoming atmosphere for every guest. Help find seats and facilitate the offering.",
    leader: { name: "Sis. Mary", avatar: "https://i.pravatar.cc/150?u=mary" }
  },
  {
    id: 3,
    title: "Children's Church",
    category: "Kids & Youth",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop",
    description: "Nurture the next generation in faith through engaging Bible stories, crafts, and fun activities.",
    leader: { name: "Teacher Sarah", avatar: "https://i.pravatar.cc/150?u=sarah" }
  },
];

const CELL_GROUPS_DATA = [
  {
    id: 1,
    name: "Northside Fellowship",
    schedule: "Meets Tuesdays @ 7:00 PM",
    location: "The Johnson Home",
    distance: "2.3 miles away",
    status: "Open",
    type: "General",
    icon: "groups"
  },
  {
    id: 2,
    name: "Young Adults Connect",
    schedule: "Meets Thursdays @ 6:30 PM",
    location: "Coffee Shop",
    distance: "4.1 miles away",
    status: "Open",
    type: "Youth",
    icon: "local_cafe"
  }
];

// --- LANDING PAGE ---
export const Landing: React.FC = () => {
  return (
    <div className="flex flex-col w-full font-sans bg-background-light dark:bg-background-dark">
      
      {/* 1. New Hero Section with Floating Card */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop" 
            alt="Worship Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00008B]/80 via-[#00008B]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
                <div className="inline-block bg-accent-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-down">
                    Live Now: Sunday Service
                </div>
                <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 drop-shadow-lg">
                    WELCOME TO <br/>CACC
                </h1>
                <p className="text-xl md:text-2xl font-serif italic text-gray-200 mb-10 max-w-xl">
                    "Raising Ambassadors for Christ in this generation."
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link to="/live" className="px-8 py-4 bg-accent-red hover:bg-accent-red-dark text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                        <span className="material-symbols-outlined filled">play_circle</span> Join Live Stream
                    </Link>
                    <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-primary transition flex items-center gap-2">
                        <span className="material-symbols-outlined">location_on</span> Plan a Visit
                    </button>
                </div>
            </div>

            {/* Right/Bottom Floating Card */}
            <div className="relative lg:mt-20">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border-t-8 border-accent-red max-w-md ml-auto animate-fade-in-up">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                        <span className="material-symbols-outlined text-sm">event</span>
                        Annual Leadership 2024
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                        Kingdom Ambition Conference
                    </h2>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        Join us for three days of powerful worship, transformative teaching, and fellowship. Discover your purpose and ignite your passion for the Kingdom.
                    </p>
                    
                    <div className="flex gap-4 mb-8 border-y border-gray-100 dark:border-gray-800 py-4">
                        <div className="text-center">
                            <span className="block text-2xl font-black text-primary">04</span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Days</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-black text-primary">12</span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Hours</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-black text-primary">45</span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Mins</span>
                        </div>
                        <div className="ml-auto text-right">
                             <span className="block text-xs text-gray-400 uppercase font-bold">Speaker</span>
                             <span className="block text-sm font-bold text-slate-900 dark:text-white">Bishop D. Mark</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition">
                            Register Now
                        </button>
                        <button className="px-4 py-3 border border-gray-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Sunday Service Highlights */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
              <div>
                  <p className="text-accent-red font-bold text-xs uppercase tracking-widest mb-2">Join us online or in-person</p>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Sunday Service Highlights</h2>
              </div>
              <Link to="/sermons" className="hidden md:flex text-primary font-bold text-sm items-center gap-1 hover:gap-2 transition-all">
                  Watch Past Services <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                  { title: "Spirit-Filled Worship", img: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=2535&auto=format&fit=crop", tag: "Worship" },
                  { title: "Powerful Teaching", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop", tag: "Word" },
                  { title: "Fellowship & Joy", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop", tag: "Community" }
              ].map((item, i) => (
                  <div key={i} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                          <span className="text-[10px] font-bold uppercase bg-accent-red px-2 py-1 rounded mb-2 inline-block">{item.tag}</span>
                          <h3 className="text-xl font-bold">{item.title}</h3>
                      </div>
                  </div>
              ))}
              
              {/* Call to Action Card */}
              <div className="bg-primary rounded-2xl p-8 flex flex-col items-center justify-center text-center text-white h-80 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="relative z-10">
                      <h3 className="text-2xl font-black mb-2">Join Us This Sunday</h3>
                      <p className="text-blue-100 text-sm mb-6">Welcome home. Service starts at 9:00 AM.</p>
                      <button className="px-6 py-3 bg-white text-primary font-bold rounded-full hover:scale-105 transition shadow-lg">
                          Plan Your Visit
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* 3. Partner With Us (MAINTAINED Kingdom Builders Section) */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
                 <p className="text-accent-red font-bold text-xs uppercase tracking-widest mb-2">Effective Ministry</p>
                 <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Partner With Us</h2>
                 <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Your generosity helps us build God's house and serve our community. See our featured projects below.</p>
            </div>

            {/* Original Kingdom Builders Section Layout reused/wrapped */}
            <div className="bg-primary text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider mb-6 border border-white/20">Kingdom Builders Project</span>
                        <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Help Us Build<br/>The New Sanctuary</h2>
                        <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            We are expanding our capacity to host more souls. Your generous contribution towards the new auditorium will leave a legacy for generations to come.
                        </p>
                        <Link to="/give" className="inline-flex items-center gap-2 bg-accent-red hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg shadow-red-900/20 hover:-translate-y-1">
                            <span className="material-symbols-outlined">volunteer_activism</span> Give to Project
                        </Link>
                    </div>
                    
                    <div className="w-full lg:w-1/3 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-xs font-bold text-blue-200 uppercase mb-1">Total Raised</p>
                                <p className="text-4xl font-black">KES 8.5M</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-blue-200 uppercase mb-1">Target</p>
                                <p className="text-xl font-bold opacity-80">KES 12M</p>
                            </div>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-4 mb-6 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full w-[70%] shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-black/20 p-4 rounded-2xl text-center">
                                 <span className="material-symbols-outlined text-2xl mb-1 text-yellow-400">groups</span>
                                 <p className="text-2xl font-bold">450+</p>
                                 <p className="text-[10px] text-blue-200 uppercase">Donors</p>
                             </div>
                             <div className="bg-black/20 p-4 rounded-2xl text-center">
                                 <span className="material-symbols-outlined text-2xl mb-1 text-purple-400">calendar_month</span>
                                 <p className="text-2xl font-bold">45</p>
                                 <p className="text-[10px] text-blue-200 uppercase">Days Left</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Additional Project Cards below matching screenshot implication */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-bold uppercase w-fit mb-4">Community</span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Community Van</h3>
                      <p className="text-gray-500 text-sm mb-6 flex-1">Providing transportation for the elderly and outreach missions.</p>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-4"><div className="bg-yellow-500 h-2 rounded-full w-[45%]"></div></div>
                      <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">KES 450k / 1M</span>
                          <button className="text-primary font-bold text-sm border border-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition">Give Now</button>
                      </div>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs font-bold uppercase w-fit mb-4">Youth</span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Youth Equipment</h3>
                      <p className="text-gray-500 text-sm mb-6 flex-1">Upgrading the sound and instruments for our next generation.</p>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-4"><div className="bg-purple-500 h-2 rounded-full w-[80%]"></div></div>
                      <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">KES 800k / 1M</span>
                          <button className="text-primary font-bold text-sm border border-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition">Give Now</button>
                      </div>
                 </div>
            </div>
        </div>
      </section>

      {/* 4. Get Involved & Grow (MAINTAINED Section) */}
      <section className="bg-white dark:bg-slate-900 py-24 px-4">
          <div className="max-w-7xl mx-auto text-left mb-12">
               <p className="text-accent-red font-bold text-xs uppercase tracking-widest mb-2">Grow With Us</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Discipleship & <br/>Training Programs</h2>
              <p className="text-gray-500 max-w-xl">Equip yourself with biblical knowledge and leadership skills. We offer courses to help you grow deep roots in your faith walk.</p>
              <Link to="/ministries" className="text-primary font-bold text-sm mt-4 inline-flex items-center gap-1 hover:underline">
                  View All Programs <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </Link>
          </div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                  { title: 'Foundation Class', icon: 'favorite', desc: 'Perfect for new believers understanding the basics of faith.', color: 'text-primary', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { title: 'Leadership Academy', icon: 'school', desc: 'Training for those called to serve and lead within the church ministry.', color: 'text-accent-red', bg: 'bg-red-50 dark:bg-red-900/20' },
                  { title: 'Bible Kids', icon: 'child_care', desc: 'A fun and faith-filled learning environment for ages 4-12.', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                  { title: 'Marriage Seminar', icon: 'diversity_1', desc: 'Practical workshops to strengthen and sweeten marriages continuously.', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' }
              ].map((prog, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 text-left group cursor-pointer h-full flex flex-col">
                      <div className={`size-14 rounded-2xl ${prog.bg} ${prog.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <span className="material-symbols-outlined text-3xl">{prog.icon}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{prog.title}</h3>
                      <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">{prog.desc}</p>
                  </div>
              ))}
          </div>
      </section>

      {/* 5. Recent Updates */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
              <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Recent Updates</h2>
                  <p className="text-gray-500">Stay up to date with what's happening at CACC.</p>
              </div>
              <div className="flex gap-2">
                   <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-full">All</button>
                   <button className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full hover:bg-gray-200">News</button>
                   <button className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full hover:bg-gray-200">Events</button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {RECENT_UPDATES.map(update => (
                  <div key={update.id} className="group cursor-pointer">
                      <div className="rounded-2xl overflow-hidden mb-4 relative aspect-[4/3]">
                          <img src={update.image} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt={update.title} />
                          <div className="absolute top-4 left-4">
                              <span className="bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border border-gray-100">{update.category}</span>
                          </div>
                      </div>
                      <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">May 24, 2024</p>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{update.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{update.excerpt}</p>
                      <button className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                          Read More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                  </div>
              ))}
          </div>
          
          <div className="flex justify-center mt-12 gap-2">
              <button className="size-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <button className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</button>
              <button className="size-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-sm text-gray-500">2</button>
              <button className="size-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-sm text-gray-500">3</button>
              <button className="size-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
      </section>

      {/* 6. Stay Connected (Newsletter) */}
      <section className="px-4 pb-20 max-w-7xl mx-auto">
           <div className="bg-[#00008B] rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                     <span className="material-symbols-outlined text-9xl text-white">mail</span>
                </div>
                <div className="relative z-10 md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Stay Connected</h2>
                    <p className="text-blue-200 text-lg">Subscribe to our weekly newsletter for uplifting messages, event updates, and church news straight to your inbox.</p>
                </div>
                <div className="relative z-10 w-full md:w-auto flex-1 max-w-md">
                     <div className="flex flex-col sm:flex-row gap-3">
                         <input type="email" placeholder="Your email address" className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm" />
                         <button className="px-8 py-4 bg-accent-red hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition whitespace-nowrap">
                             Subscribe
                         </button>
                     </div>
                     <p className="text-xs text-blue-300 mt-3 text-center sm:text-left">We respect your privacy. Unsubscribe at any time.</p>
                </div>
           </div>
      </section>

      {/* 7. Coming Soon (MAINTAINED Upcoming Event Banner) */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
          <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Event Banner" />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="relative z-10 text-center px-4">
               <span className="bg-white text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mb-4 inline-block">Coming Soon</span>
               <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">ANNUAL CONFERENCE 2024</h2>
               <div className="flex justify-center gap-8 mb-8 text-white">
                   <div className="text-center">
                       <p className="text-3xl md:text-5xl font-black">12</p>
                       <p className="text-xs uppercase opacity-70">Days</p>
                   </div>
                   <div className="text-center">
                       <p className="text-3xl md:text-5xl font-black">04</p>
                       <p className="text-xs uppercase opacity-70">Hours</p>
                   </div>
                   <div className="text-center">
                       <p className="text-3xl md:text-5xl font-black">25</p>
                       <p className="text-xs uppercase opacity-70">Mins</p>
                   </div>
               </div>
               <button className="px-8 py-4 bg-accent-red hover:bg-red-600 text-white font-bold rounded-xl shadow-xl transition transform hover:scale-105">
                   Register Now
               </button>
          </div>
      </section>
    </div>
  );
};

export const Events: React.FC = () => {
   return <div className="p-10 text-center">Events Component Placeholder</div>;
};
export const About: React.FC = () => {
    return <div className="p-10 text-center">About Component Placeholder</div>;
};

// --- MINISTRIES PAGE ---
export const Ministries: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All Ministries");

  return (
    <div className="flex flex-col w-full font-sans bg-background-light dark:bg-background-dark pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2670&auto=format&fit=crop" 
            alt="Ministries Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-xl tracking-tight">Connect & Serve</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed text-gray-100 font-medium">
            "For just as each of us has one body with many members, and these members do not all have the same function, so in Christ we, though many, form one body."
            <br/><span className="text-sm opacity-80 mt-2 block font-serif italic">- Romans 12:4-5</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button className="px-8 py-4 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-bold rounded-lg shadow-lg transition transform hover:-translate-y-1">
                Find Your Group
             </button>
             <button className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white font-bold rounded-lg shadow-lg transition">
                Explore Ministries
             </button>
          </div>
        </div>
      </section>

      {/* 2. Explore Our Ministries */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
         <div className="mb-12">
             <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Explore Our Ministries</h2>
             <p className="text-gray-500 mb-8">Find a place to use your gifts and grow in faith.</p>
             
             {/* Filters */}
             <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
                {MINISTRY_CATEGORIES.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${activeCategory === cat ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}
                    >
                        {cat}
                    </button>
                ))}
             </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {MINISTRIES_DATA.map(ministry => (
                 <div key={ministry.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition border border-gray-100 dark:border-gray-700 flex flex-col h-full group">
                     <div className="h-56 overflow-hidden relative">
                         <img src={ministry.image} alt={ministry.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                     </div>
                     <div className="p-6 flex-1 flex flex-col">
                         <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{ministry.title}</h3>
                         <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-wide mb-4">{ministry.category}</p>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1 leading-relaxed">
                             {ministry.description}
                         </p>
                         <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                             <div className="flex items-center gap-2">
                                 <img src={ministry.leader.avatar} className="size-8 rounded-full object-cover" alt={ministry.leader.name} />
                                 <div className="size-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs -ml-4 border-2 border-white dark:border-slate-800">+2</div>
                             </div>
                             <button className="text-[#4F46E5] font-bold text-sm hover:underline">Learn More</button>
                         </div>
                     </div>
                 </div>
             ))}
         </div>
      </section>

      {/* 3. Find a Cell Group */}
      <section className="bg-gray-50 dark:bg-slate-900/50 py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex flex-col lg:flex-row gap-12">
                  
                  {/* Left Content: Search & List */}
                  <div className="lg:w-1/2">
                      <p className="text-[#4F46E5] font-bold text-xs uppercase tracking-widest mb-2">Community Life</p>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Find a Cell Group Near You</h2>
                      <p className="text-gray-500 mb-8 max-w-lg">Life is better together. Join a small group to build lasting friendships, study the Word, and grow in your walk with Christ.</p>
                      
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Search by Location</label>
                          <div className="flex gap-2 mb-4">
                              <div className="relative flex-1">
                                  <input type="text" placeholder="Enter postcode or city..." className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#4F46E5] outline-none dark:text-white" />
                                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                              </div>
                              <button className="bg-[#4F46E5] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#4338ca] transition">Search</button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                              <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700">Northside</button>
                              <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700">City Center</button>
                              <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700">West End</button>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Available Groups</p>
                          {CELL_GROUPS_DATA.map(group => (
                              <div key={group.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#4F46E5] transition group cursor-pointer flex items-center justify-between">
                                  <div className="flex items-start gap-4">
                                      <div className={`size-12 rounded-full ${group.type === 'Youth' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'} flex items-center justify-center shrink-0`}>
                                          <span className="material-symbols-outlined">{group.icon}</span>
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">{group.name}</h4>
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{group.schedule} • {group.location}</p>
                                          <p className="text-xs font-bold text-[#4F46E5] flex items-center gap-1"><span className="material-symbols-outlined text-xs">location_on</span> {group.distance}</p>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] font-bold uppercase mb-3">{group.status}</span>
                                      <button className="block text-sm font-bold text-[#4F46E5] hover:underline">Join</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Right Content: Map Placeholder */}
                  <div className="lg:w-1/2 h-[500px] lg:h-auto min-h-[500px] bg-gray-200 rounded-3xl relative overflow-hidden shadow-inner">
                      {/* Simulated Map Background */}
                      <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center">
                          <div className="text-gray-300 font-black text-6xl tracking-widest select-none">MAP VIEW</div>
                      </div>
                      
                      {/* Simulated Pins */}
                      <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition">
                          <div className="size-10 bg-[#4F46E5] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white">
                              <span className="material-symbols-outlined text-sm">home</span>
                          </div>
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition">
                          <div className="size-12 bg-[#4F46E5] rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white animate-bounce">
                              <span className="material-symbols-outlined">groups</span>
                          </div>
                          {/* Map Popup Card */}
                          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-48 bg-white p-3 rounded-lg shadow-xl text-center pointer-events-none">
                              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Can't find a group near you?</p>
                              <a href="#" className="text-xs font-bold text-[#4F46E5]">Start a new group</a>
                              <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white transform rotate-45"></div>
                          </div>
                      </div>

                      <div className="absolute bottom-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition">
                          <div className="size-10 bg-[#4F46E5] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white">
                              <span className="material-symbols-outlined text-sm">home</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 4. Testimonial */}
      <section className="py-24 px-4 text-center max-w-4xl mx-auto">
          <span className="material-symbols-outlined text-6xl text-[#4F46E5] opacity-20 mb-6">format_quote</span>
          <h3 className="text-2xl md:text-3xl font-serif italic text-slate-800 dark:text-gray-200 leading-relaxed mb-8">
              “Joining the Ushering Team helped me feel like I truly belonged. It wasn't just about serving; it was about the family I found while doing it.”
          </h3>
          <div className="flex items-center justify-center gap-4">
              <img src="https://i.pravatar.cc/150?u=rebecca" className="size-12 rounded-full object-cover shadow-sm" alt="Rebecca" />
              <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Rebecca Smith</p>
                  <p className="text-xs text-gray-500">Member since 2019</p>
              </div>
          </div>
      </section>
    </div>
  );
};

// --- AUTH COMPONENT ---
export const Auth: React.FC<AuthProps> = ({ setRole }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(UserRole.MEMBER);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
       {/* Background decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-red/5 rounded-full blur-3xl"></div>
       </div>

       <div className="max-w-md w-full space-y-8 relative z-10 bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
          <div className="text-center">
             <div className="mx-auto size-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6">
                <span className="material-symbols-outlined text-4xl">church</span>
             </div>
             <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Join Our Family'}
             </h2>
             <p className="text-gray-500 text-sm">
                {isLogin ? 'Sign in to access your dashboard and community.' : 'Create an account to get started with CACC.'}
             </p>
          </div>

          <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl">
             <button 
               onClick={() => setMethod('email')}
               className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${method === 'email' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Email
             </button>
             <button 
               onClick={() => setMethod('phone')}
               className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${method === 'phone' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Phone
             </button>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
             <div className="space-y-4">
                {!isLogin && (
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">First Name</label>
                         <input type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:text-white outline-none transition" />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Last Name</label>
                         <input type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:text-white outline-none transition" />
                      </div>
                   </div>
                )}

                {method === 'email' ? (
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email Address</label>
                      <input type="email" required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:text-white outline-none transition" placeholder="you@example.com" />
                   </div>
                ) : (
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone Number</label>
                      <input type="tel" required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:text-white outline-none transition" placeholder="+254..." />
                   </div>
                )}

                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Password</label>
                   <input type="password" required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:text-white outline-none transition" placeholder="••••••••" />
                </div>
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center">
                   <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                   <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">Remember me</label>
                </div>
                {isLogin && (
                   <div className="text-sm">
                      <a href="#" className="font-bold text-primary hover:text-primary-dark">Forgot password?</a>
                   </div>
                )}
             </div>

             <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg transition transform hover:-translate-y-1">
                {isLogin ? 'Sign In' : 'Create Account'}
             </button>
          </form>

          <div className="mt-6 text-center">
             <p className="text-sm text-gray-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-primary hover:text-primary-dark">
                   {isLogin ? 'Sign up' : 'Sign in'}
                </button>
             </p>
          </div>
       </div>
    </div>
  );
};

// --- CONTACT COMPONENT ---
export const Contact: React.FC = () => {
    const BRANCHES = [
        { name: 'Nairobi', location: 'CBD, Moi Avenue' },
        { name: 'Bungoma', location: 'Kibabii Diploma Road' },
        { name: 'Nyandarua', location: 'Ol Kalou Town' },
        { name: 'Busia', location: 'Town Center' },
        { name: 'Kakamega', location: 'Mega Mall, 2nd Floor' },
    ];

    const FAQS = [
        { q: 'What time are the services?', a: 'Sunday Services are at 9:00 AM (First Service) and 11:00 AM (Second Service). Midweek service is on Wednesday at 6:30 PM.' },
        { q: 'Is there a children’s church?', a: 'Yes! We have a vibrant Children’s Ministry that runs concurrently with our main services.' },
        { q: 'How can I join a cell group?', a: 'You can join a cell group by visiting the Ministries page or speaking to the Ushers at the information desk.' },
    ];

    return (
        <div className="w-full font-sans bg-background-light dark:bg-background-dark pt-24 pb-20">
             <div className="max-w-7xl mx-auto px-4 md:px-8">
                 <div className="text-center mb-16">
                     <p className="text-accent-red font-bold text-xs uppercase tracking-widest mb-2">Get in Touch</p>
                     <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">We'd Love to Hear From You</h1>
                     <p className="text-gray-500 max-w-2xl mx-auto text-lg">Whether you have a question, a prayer request, or just want to say hello, we are here for you.</p>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                     {/* Contact Info & Form */}
                     <div className="space-y-8">
                         <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                             <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Contact Information</h3>
                             <div className="space-y-6">
                                 <div className="flex items-start gap-4">
                                     <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center shrink-0">
                                         <span className="material-symbols-outlined text-xl">location_on</span>
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-slate-900 dark:text-white text-lg">Main Location</h4>
                                         <p className="text-gray-500 dark:text-gray-400">Kibabii Diploma Road, Adjacent to Marell Academy<br/>Bungoma, Kenya</p>
                                     </div>
                                 </div>
                                 <div className="flex items-start gap-4">
                                     <div className="size-12 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center shrink-0">
                                         <span className="material-symbols-outlined text-xl">call</span>
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-slate-900 dark:text-white text-lg">Phone</h4>
                                         <p className="text-gray-500 dark:text-gray-400">+254 759 277 874</p>
                                         <p className="text-gray-500 dark:text-gray-400 text-sm">Mon-Fri 8am-5pm</p>
                                     </div>
                                 </div>
                                 <div className="flex items-start gap-4">
                                     <div className="size-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center shrink-0">
                                         <span className="material-symbols-outlined text-xl">mail</span>
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-slate-900 dark:text-white text-lg">Email</h4>
                                         <p className="text-gray-500 dark:text-gray-400">cacchurchbg@gmail.com</p>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                                 <h4 className="font-bold text-slate-900 dark:text-white mb-4">Connect on Social Media</h4>
                                 <div className="flex gap-4">
                                     {['public', 'smart_display', 'photo_camera', 'alternate_email'].map((icon, i) => (
                                         <button key={i} className="size-10 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-white hover:bg-primary hover:text-white transition flex items-center justify-center">
                                             <span className="material-symbols-outlined text-lg">{icon}</span>
                                         </button>
                                     ))}
                                 </div>
                             </div>
                         </div>

                         {/* Branches */}
                         <div className="bg-primary text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-10">
                                 <span className="material-symbols-outlined text-9xl">church</span>
                             </div>
                             <h3 className="text-2xl font-black mb-6 relative z-10">Our Branches</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                                 {BRANCHES.map(branch => (
                                     <div key={branch.name} className="flex items-center gap-3">
                                         <span className="material-symbols-outlined text-accent-red text-sm">label_important</span>
                                         <div>
                                             <p className="font-bold text-sm">{branch.name}</p>
                                             <p className="text-[10px] text-blue-200">{branch.location}</p>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     </div>

                     {/* Contact Form */}
                     <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                         <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Send a Message</h3>
                         <form className="space-y-6">
                             <div className="grid grid-cols-2 gap-6">
                                 <div>
                                     <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Name</label>
                                     <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:text-white outline-none" placeholder="Your Name" />
                                 </div>
                                 <div>
                                     <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Email</label>
                                     <input type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:text-white outline-none" placeholder="you@example.com" />
                                 </div>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Subject</label>
                                 <select className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:text-white outline-none">
                                     <option>General Inquiry</option>
                                     <option>Prayer Request</option>
                                     <option>Membership</option>
                                     <option>Feedback</option>
                                 </select>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Message</label>
                                 <textarea rows={5} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:text-white outline-none resize-none" placeholder="How can we help you?"></textarea>
                             </div>
                             <button type="button" className="w-full py-4 bg-accent-red hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition">Send Message</button>
                         </form>
                     </div>
                 </div>

                 {/* Map Placeholder */}
                 <div className="w-full h-96 bg-gray-200 dark:bg-slate-700 rounded-3xl overflow-hidden shadow-inner mb-20 relative">
                     <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.693897711915!2d34.5617!3d0.5694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMzQnMDkuOCJOIDM0wrAzMyw0Mi4xIkU!5e0!3m2!1sen!2ske!4v1634567890000!5m2!1sen!2ske" 
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen 
                        loading="lazy"
                        className="opacity-80 hover:opacity-100 transition duration-500"
                     ></iframe>
                     <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl max-w-xs">
                         <h5 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1"><span className="material-symbols-outlined text-red-500 text-sm">location_on</span> CACC Bungoma</h5>
                         <p className="text-xs text-gray-500 mt-1">Visit us for our Sunday Services.</p>
                     </div>
                 </div>

                 {/* FAQs */}
                 <div className="max-w-3xl mx-auto">
                     <h3 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-8">Frequently Asked Questions</h3>
                     <div className="space-y-4">
                         {FAQS.map((faq, i) => (
                             <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                 <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2 flex items-center gap-2">
                                     <span className="material-symbols-outlined text-primary">help</span> {faq.q}
                                 </h4>
                                 <p className="text-gray-500 dark:text-gray-400 leading-relaxed ml-8">{faq.a}</p>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
        </div>
    );
};
