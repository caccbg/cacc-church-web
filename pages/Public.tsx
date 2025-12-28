
import React, { useState, useEffect } from 'react';
import { UserRole, Event } from '../types';
import { useNavigate, Link } from 'react-router-dom';

interface AuthProps {
  setRole: (role: UserRole) => void;
}

// --- MOCK DATA FOR EVENTS ---
const UPCOMING_EVENTS: (Event & { type: string, description?: string, tag?: string })[] = [
  { id: '1', title: 'Mid-Week Deep Dive', date: '2023-10-18', time: '7:00 PM - 8:30 PM', location: 'Fellowship Hall B', category: 'Bible Study', type: 'Bible Study', image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2574&auto=format&fit=crop', tag: 'BIBLE STUDY' },
  { id: '2', title: 'Friday Fire Night', date: '2023-10-20', time: '6:30 PM - 9:00 PM', location: 'Youth Center', category: 'Youth', type: 'Youth', image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2670&auto=format&fit=crop', tag: 'YOUTH' },
  { id: '3', title: 'Community Food Drive', date: '2023-10-22', time: '1:00 PM - 4:00 PM', location: 'City Park / Main Entrance', category: 'Outreach', type: 'Outreach', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2670&auto=format&fit=crop', tag: 'OUTREACH' },
  { id: '4', title: 'Sunday Celebration', date: '2023-10-27', time: '09:00 AM & 11:30 AM', location: 'Main Sanctuary', category: 'Service', type: 'Service', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop', tag: 'SERVICE' },
  { id: '5', title: 'Volunteers Training', date: '2023-10-28', time: '7:00 PM - 8:30 PM', location: 'Conference Room A', category: 'Leadership', type: 'Leadership', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2684&auto=format&fit=crop', tag: 'LEADERSHIP' },
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

const LATEST_SERMONS = [
  { id: '1', title: 'Walking on Water', preacher: 'Pastor Sarah Jenkins', date: 'Oct 17, 2023', thumbnail: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2574&auto=format&fit=crop' },
  { id: '2', title: 'Understanding Grace', preacher: 'Pastor John Doe', date: 'Oct 10, 2023', thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2670&auto=format&fit=crop' },
  { id: '3', title: 'Kingdom Finance', preacher: 'Bishop David', date: 'Oct 03, 2023', thumbnail: 'https://images.unsplash.com/photo-1621255776269-e0c158580552?q=80&w=2670&auto=format&fit=crop' },
  { id: '4', title: 'The Art of Prayer', preacher: 'Pastor Sarah Jenkins', date: 'Sep 24, 2023', thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop' }
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
    leader: { name: "Pastor David", avatar: "https://i.pravatar.cc/150?u=david" },
    leader2: { name: "Sarah J.", avatar: "https://i.pravatar.cc/150?u=sarah" }
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
    leader: { name: "Teacher Sarah", avatar: "https://i.pravatar.cc/150?u=sarah_t" }
  },
];

const CELL_GROUPS_DATA = [
  {
    id: 1,
    name: "Northside Fellowship",
    schedule: "Meets Tuesdays @ 7:00 PM • The Johnson Home",
    location: "The Johnson Home",
    distance: "2.3 miles away",
    status: "Open",
    type: "General",
    icon: "groups"
  },
  {
    id: 2,
    name: "Young Adults Connect",
    schedule: "Meets Thursdays @ 6:30 PM • Coffee Shop",
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
              <Link to="/sermons" className="hidden md:flex text-primary dark:text-[#8b8bac] font-bold text-sm items-center gap-1 hover:gap-2 transition-all">
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

      {/* 2.5 Recent Sermons (New Section) */}
      <section className="bg-white dark:bg-slate-900 py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-10">
                  <div>
                      <p className="text-accent-red font-bold text-xs uppercase tracking-widest mb-2">Word of God</p>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Recent Sermons</h2>
                  </div>
                  <Link to="/sermons" className="text-primary dark:text-[#8b8bac] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      View All Sermons <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {LATEST_SERMONS.map(sermon => (
                      <div key={sermon.id} className="group cursor-pointer">
                          <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                              <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <span className="material-symbols-outlined text-white text-4xl drop-shadow-lg">play_circle</span>
                              </div>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">{sermon.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{sermon.preacher} • {sermon.date}</p>
                      </div>
                  ))}
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
                          <button className="text-primary dark:text-white font-bold text-sm border border-primary dark:border-white px-4 py-2 rounded-lg hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition">Give Now</button>
                      </div>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs font-bold uppercase w-fit mb-4">Youth</span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Youth Equipment</h3>
                      <p className="text-gray-500 text-sm mb-6 flex-1">Upgrading the sound and instruments for our next generation.</p>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-4"><div className="bg-purple-500 h-2 rounded-full w-[80%]"></div></div>
                      <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">KES 800k / 1M</span>
                          <button className="text-primary dark:text-white font-bold text-sm border border-primary dark:border-white px-4 py-2 rounded-lg hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition">Give Now</button>
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
                      <button className="text-primary dark:text-[#8b8bac] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
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

export const Auth: React.FC<AuthProps> = ({ setRole }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = (role: UserRole) => {
    setRole(role);
    if (role === UserRole.ADMIN) navigate('/admin');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
         <div className="text-center mb-8">
             <div className="size-12 bg-primary text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                 <span className="material-symbols-outlined text-2xl">church</span>
             </div>
             <h2 className="text-2xl font-black text-slate-900 dark:text-white">{isLogin ? 'Welcome Back' : 'Join Our Family'}</h2>
             <p className="text-gray-500 text-sm mt-2">Sign in to access your dashboard and resources.</p>
         </div>
         
         <div className="space-y-4">
             <button onClick={() => handleAuth(UserRole.MEMBER)} className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/20">
                 {isLogin ? 'Sign In as Member' : 'Register as Member'}
             </button>
             <button onClick={() => handleAuth(UserRole.ADMIN)} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition">
                 Admin Access
             </button>
             <button onClick={() => setIsLogin(!isLogin)} className="w-full py-2 text-sm text-gray-500 font-bold hover:text-primary transition">
                 {isLogin ? 'New here? Create account' : 'Already have an account? Login'}
             </button>
         </div>
      </div>
    </div>
  );
};

export const Contact: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqs = [
        { q: "What time are your Sunday services?", a: "We have two services on Sundays: the First Service at 9:00 AM and the Second Service at 11:30 AM. Each service is filled with worship, prayer, and word." },
        { q: "Do you have parking spaces?", a: "Yes, we have ample parking space within our compound. Our ushers and security team will guide you on where to park when you arrive." },
        { q: "How can I join a cell group?", a: "You can find a cell group near you by visiting our Ministries page or contacting the church office. We have many Berean families across Bungoma and beyond." },
        { q: "Is there a children's ministry?", a: "Absolutely! We have a vibrant Children's Church (CACC Kids) that runs concurrently with both Sunday services, catering to children of all ages." }
    ];

    return (
      <div className="bg-background-off dark:bg-background-dark font-sans flex flex-col min-h-screen">
          {/* Header Section */}
          <section className="bg-primary dark:bg-slate-900 pt-32 pb-40 px-4 text-center text-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 size-64 bg-white rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 right-10 size-96 bg-red-600 rounded-full blur-[120px]"></div>
               </div>
               <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 mb-6 inline-block">
                         CONNECT WITH US
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">We'd Love to Hear From You</h1>
                    <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed italic opacity-90">
                         Whether you have a prayer request, a question about our services, or want to join a cell group, our team is here to serve you with the love of Christ.
                    </p>
               </div>
          </section>

          {/* Main Contact Area */}
          <section className="px-4 md:px-8 -mt-24 relative z-20 pb-20">
               <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    {/* Left: Contact Info & Branches */}
                    <div className="lg:w-[380px] shrink-0 space-y-6">
                         {/* Contact Details Card */}
                         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
                              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-8">Contact Details</h3>
                              <div className="space-y-8">
                                   <div className="flex gap-4">
                                        <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center shrink-0">
                                             <span className="material-symbols-outlined text-lg filled">location_on</span>
                                        </div>
                                        <div>
                                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">HEADQUARTERS</p>
                                             <p className="text-sm font-bold text-slate-700 dark:text-gray-300 leading-relaxed">Kibabii Diploma Road, Adjacent to Marell Academy, Bungoma, Kenya</p>
                                        </div>
                                   </div>
                                   <div className="flex gap-4">
                                        <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center shrink-0">
                                             <span className="material-symbols-outlined text-lg filled">call</span>
                                        </div>
                                        <div>
                                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CALL US</p>
                                             <p className="text-sm font-bold text-slate-700 dark:text-gray-300">+254 759 277 874</p>
                                        </div>
                                   </div>
                                   <div className="flex gap-4">
                                        <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center shrink-0">
                                             <span className="material-symbols-outlined text-lg filled">mail</span>
                                        </div>
                                        <div>
                                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">EMAIL US</p>
                                             <p className="text-sm font-bold text-slate-700 dark:text-gray-300">cacchurchbg@gmail.com</p>
                                        </div>
                                   </div>
                              </div>
                              <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-700">
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Social Media</p>
                                   <div className="flex gap-3">
                                        <a href="#" className="size-10 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-gray-100 dark:border-gray-600"><span className="material-symbols-outlined text-lg">public</span></a>
                                        <a href="#" className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-gray-300 flex items-center gap-2 border border-gray-100 dark:border-gray-600">@cacchurchbg</a>
                                   </div>
                              </div>
                         </div>

                         {/* Branches Card */}
                         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-8">
                                   <div className="size-8 rounded-lg bg-red-50 text-accent-red flex items-center justify-center"><span className="material-symbols-outlined text-sm filled">church</span></div>
                                   <h3 className="text-lg font-black text-slate-900 dark:text-white">Our Branches</h3>
                              </div>
                              <div className="space-y-3">
                                   {['Nairobi', 'Bungoma (HQ)', 'Nyandarua', 'Busia', 'Kakamega'].map(branch => (
                                        <div key={branch} className={`p-4 rounded-2xl flex items-center justify-between text-sm font-bold transition-all ${branch.includes('HQ') ? 'bg-primary/5 text-primary border border-primary/10' : 'text-slate-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                                             <div className="flex items-center gap-3">
                                                  <span className={`material-symbols-outlined text-xs ${branch.includes('HQ') ? 'filled text-primary' : 'text-red-500'}`}>fiber_manual_record</span>
                                                  {branch}
                                             </div>
                                             {branch.includes('HQ') && <span className="material-symbols-outlined text-sm">chevron_right</span>}
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>

                    {/* Right: Message Form */}
                    <div className="flex-1 bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
                         <div className="mb-10">
                              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Send us a Message</h3>
                              <p className="text-sm font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest"><span className="material-symbols-outlined text-green-500 text-sm filled">schedule</span> We typically reply within 24 hours.</p>
                         </div>
                         
                         <form className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">FIRST NAME</label>
                                        <input type="text" placeholder="e.g. John" className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-primary shadow-inner" />
                                   </div>
                                   <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">LAST NAME</label>
                                        <input type="text" placeholder="e.g. Doe" className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-primary shadow-inner" />
                                   </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">EMAIL ADDRESS</label>
                                        <input type="email" placeholder="john@example.com" className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-primary shadow-inner" />
                                   </div>
                                   <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">PHONE NUMBER</label>
                                        <input type="text" placeholder="+254..." className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-primary shadow-inner" />
                                   </div>
                              </div>
                              <div>
                                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">SUBJECT</label>
                                   <div className="relative">
                                        <select className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-xl py-4 pl-6 pr-12 text-sm font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-primary shadow-inner appearance-none">
                                             <option>General Inquiry</option>
                                             <option>Prayer Request</option>
                                             <option>Membership</option>
                                             <option>Giving / Donations</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                                   </div>
                              </div>
                              <div>
                                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">MESSAGE</label>
                                   <textarea rows={6} placeholder="How can we help you today?" className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-xl py-4 px-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-primary shadow-inner resize-none"></textarea>
                              </div>

                              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                                   <p className="text-[10px] text-gray-400 font-medium italic leading-relaxed max-w-xs">Your information is safe and handled according to our privacy policy.</p>
                                   <button type="submit" className="w-full md:w-auto px-12 py-4 bg-accent-red hover:bg-accent-red-dark text-white font-black rounded-xl shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2">
                                        Send Message <span className="material-symbols-outlined text-[20px]">send</span>
                                   </button>
                              </div>
                         </form>
                    </div>
               </div>
          </section>

          {/* Support Banner Section */}
          <section className="px-4 md:px-8 mb-24">
               <div className="max-w-7xl mx-auto bg-primary dark:bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                         <div className="size-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8">
                              <span className="material-symbols-outlined text-3xl filled">diversity_3</span>
                         </div>
                         <h2 className="text-3xl md:text-5xl font-black mb-6">Need Prayer or Pastoral Support?</h2>
                         <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-12 opacity-90">
                              We believe in the power of prayer. Our dedicated pastoral team is ready to stand with you, in faith, for your breakthrough.
                         </p>
                         <div className="flex flex-wrap justify-center gap-4">
                              <button className="px-8 py-4 bg-white text-primary font-black rounded-xl shadow-lg hover:bg-gray-100 transition-all flex items-center gap-3">
                                   <span className="material-symbols-outlined text-[20px] filled">call</span> Call Pastoral Line
                              </button>
                              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-xl shadow-lg hover:bg-white/20 transition-all flex items-center gap-3">
                                   <span className="material-symbols-outlined text-[20px]">send_time_extension</span> Submit Prayer Request
                              </button>
                         </div>
                    </div>
               </div>
          </section>

          {/* FAQ Section */}
          <section className="px-4 md:px-8 mb-24">
               <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                         <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                         <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Common questions about visiting CACC Bungoma</p>
                    </div>
                    
                    <div className="space-y-4">
                         {faqs.map((faq, idx) => (
                              <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                                   <button 
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                   >
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{faq.q}</span>
                                        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>expand_more</span>
                                   </button>
                                   <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="p-6 pt-0 border-t border-gray-50 dark:border-gray-700">
                                             <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                                  {faq.a}
                                             </p>
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>
          </section>

          {/* Map Area */}
          <section className="relative h-[500px] bg-slate-200 dark:bg-slate-800 overflow-hidden">
               {/* Mock Map Placeholder */}
               <div className="absolute inset-0 bg-[#f0f0f0] dark:bg-[#1e2330]" style={{backgroundImage: 'radial-gradient(#d1d5db 0.5px, transparent 0.5px)', backgroundSize: '30px 30px'}}></div>
               
               <div className="container mx-auto px-4 h-full relative">
                    {/* Floating Info Box on Map */}
                    <div className="absolute top-1/2 left-4 md:left-20 -translate-y-1/2 z-10">
                         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 max-w-xs animate-fade-in-left">
                              <div className="flex items-center gap-2 mb-4">
                                   <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                                   <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">OPEN FOR WORSHIP</span>
                              </div>
                              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">CACC Bungoma HQ</h4>
                              <p className="text-xs text-gray-400 font-medium mb-6">Kibabii Diploma Road, Bungoma, Kenya</p>
                              <button className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
                                   Get Directions <span className="material-symbols-outlined text-sm">arrow_forward</span>
                              </button>
                         </div>
                    </div>
                    
                    {/* Map Marker Pin */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                         <div className="relative">
                              <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping"></div>
                              <div className="size-10 bg-primary rounded-full shadow-xl border-4 border-white dark:border-slate-800 flex items-center justify-center text-white relative z-10">
                                   <span className="material-symbols-outlined text-xl filled">church</span>
                              </div>
                         </div>
                    </div>
               </div>

               {/* View larger map link */}
               <div className="absolute bottom-4 left-4 z-10">
                    <button className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 border border-gray-100 shadow-sm">View larger map</button>
               </div>
          </section>
      </div>
    );
};

export const Ministries: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState("All Ministries");

    return (
        <div className="bg-white dark:bg-background-dark font-sans flex flex-col">
             {/* 1. Hero Section */}
             <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Hero" />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">Connect & Serve</h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium">
                        "For just as each of us has one body with many members, and these members do not all have the same function, so in Christ we, though many, form one body."
                        <span className="block mt-4 text-sm opacity-70">— Romans 12:4-5</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-xl transition-all">Find Your Group</button>
                        <button className="px-8 py-3 bg-transparent border-2 border-white/50 text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-all">Explore Ministries</button>
                    </div>
                </div>
             </section>

             {/* 2. Explore Our Ministries */}
             <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
                  <div className="mb-12">
                       <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Explore Our Ministries</h2>
                       <p className="text-gray-500 text-lg">Find a place to use your gifts and grow in faith.</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex overflow-x-auto gap-3 pb-8 no-scrollbar">
                       {MINISTRY_CATEGORIES.map(cat => (
                           <button 
                             key={cat} 
                             onClick={() => setActiveFilter(cat)}
                             className={`px-6 py-2.5 rounded-full border transition-all whitespace-nowrap font-bold text-sm ${activeFilter === cat ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary'}`}
                           >
                               {cat}
                           </button>
                       ))}
                  </div>

                  {/* Ministries Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {MINISTRIES_DATA.map(min => (
                           <div key={min.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-xl transition-all duration-300">
                               <div className="h-60 overflow-hidden relative">
                                   <img src={min.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt={min.title} />
                                   <div className="absolute top-4 left-4">
                                       <span className="bg-white/90 backdrop-blur px-3 py-1 rounded text-[10px] font-black uppercase text-primary tracking-wider shadow-sm">{min.category}</span>
                                   </div>
                               </div>
                               <div className="p-8">
                                   <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{min.title}</h3>
                                   <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">{min.description}</p>
                                   
                                   <div className="flex items-center justify-between">
                                        <div className="flex -space-x-3">
                                             <img src={min.leader.avatar} className="size-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" alt="Leader" />
                                             {min.leader2 && <img src={min.leader2.avatar} className="size-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" alt="Leader" />}
                                        </div>
                                        <button className="text-primary font-black text-sm hover:underline flex items-center gap-1">Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
                                   </div>
                               </div>
                           </div>
                       ))}
                  </div>
             </section>

             {/* 3. Community Life - Find Cell Group */}
             <section className="bg-gray-50 dark:bg-slate-900/50 py-24 px-4 md:px-8">
                  <div className="max-w-7xl mx-auto">
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                            {/* Left: Search & List */}
                            <div>
                                 <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 inline-block">COMMUNITY LIFE</span>
                                 <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Find a Cell Group Near You</h2>
                                 <p className="text-gray-500 text-lg mb-10 max-w-lg">Life is better together. Join a small group to build lasting friendships, study the Word, and grow in your walk with Christ.</p>
                                 
                                 <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-10">
                                      <p className="text-xs font-bold text-gray-400 uppercase mb-3">Search by location</p>
                                      <div className="flex flex-col sm:flex-row gap-3">
                                           <div className="relative flex-1">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                                <input type="text" placeholder="Enter postcode or City..." className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm dark:text-white" />
                                           </div>
                                           <button className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-dark transition">Search</button>
                                      </div>
                                      <div className="flex flex-wrap gap-2 mt-4">
                                           {["Northside", "City Center", "West End"].map(loc => (
                                               <button key={loc} className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-slate-700 text-[10px] font-bold text-gray-500 dark:text-gray-300 hover:bg-gray-200 transition">{loc}</button>
                                           ))}
                                      </div>
                                 </div>

                                 <div className="space-y-4">
                                      <p className="text-xs font-bold text-gray-400 uppercase mb-4">AVAILABLE GROUPS</p>
                                      {CELL_GROUPS_DATA.map(group => (
                                          <div key={group.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-gray-700 hover:border-primary transition duration-300 shadow-sm">
                                               <div className="flex gap-4 items-center">
                                                    <div className={`size-12 rounded-xl flex items-center justify-center ${group.type === 'Youth' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-primary'}`}>
                                                         <span className="material-symbols-outlined">{group.icon}</span>
                                                    </div>
                                                    <div>
                                                         <h4 className="font-bold text-slate-900 dark:text-white">{group.name}</h4>
                                                         <p className="text-xs text-gray-500 mt-0.5">{group.schedule}</p>
                                                         <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-xs">location_on</span> {group.distance}</p>
                                                    </div>
                                               </div>
                                               <div className="flex flex-col items-end gap-3">
                                                    <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded uppercase">{group.status}</span>
                                                    <button className="text-primary font-black text-sm hover:underline">JOIN</button>
                                               </div>
                                          </div>
                                      ))}
                                 </div>
                            </div>

                            {/* Right: Map Visualization */}
                            <div className="relative">
                                 <div className="aspect-square w-full bg-gray-200 dark:bg-slate-800 rounded-[3rem] overflow-hidden shadow-2xl relative border-8 border-white dark:border-slate-800">
                                      {/* Mock Map Background */}
                                      <div className="absolute inset-0 bg-[#e5e5f7] dark:bg-[#1a202c] opacity-30" style={{backgroundImage: 'radial-gradient(#444cf7 0.5px, transparent 0.5px)', backgroundSize: '24px 24px'}}></div>
                                      
                                      {/* Map Pins */}
                                      <div className="absolute top-[30%] left-[20%] animate-bounce">
                                           <div className="bg-primary text-white p-2 rounded-full shadow-xl flex items-center justify-center border-2 border-white">
                                                <span className="material-symbols-outlined text-sm filled">home</span>
                                           </div>
                                      </div>
                                      <div className="absolute top-[50%] left-[60%] animate-bounce delay-200">
                                           <div className="bg-primary text-white p-2 rounded-full shadow-xl flex items-center justify-center border-2 border-white">
                                                <span className="material-symbols-outlined text-sm filled">home</span>
                                           </div>
                                      </div>
                                      <div className="absolute top-[70%] left-[80%] animate-bounce delay-500">
                                           <div className="bg-primary text-white p-2 rounded-full shadow-xl flex items-center justify-center border-2 border-white">
                                                <span className="material-symbols-outlined text-sm filled">home</span>
                                           </div>
                                      </div>

                                      {/* Map UI Elements */}
                                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                           <span className="text-gray-400 font-bold opacity-20 text-4xl">MAP VIEW</span>
                                      </div>

                                      {/* Start New Group Card */}
                                      <div className="absolute bottom-10 left-10 right-10">
                                           <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl flex items-center justify-between border border-white/50">
                                                <div>
                                                     <p className="text-xs font-bold text-slate-800">Can't find a group near you?</p>
                                                     <button className="text-primary font-black text-xs hover:underline">Start a new group</button>
                                                </div>
                                                <div className="size-8 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                                                     <span className="material-symbols-outlined text-sm">add</span>
                                                </div>
                                           </div>
                                      </div>
                                 </div>
                            </div>
                       </div>
                  </div>
             </section>

             {/* 4. Testimonial Section */}
             <section className="py-32 px-4 md:px-8 text-center bg-white dark:bg-background-dark">
                  <div className="max-w-4xl mx-auto">
                       <span className="material-symbols-outlined text-6xl text-blue-100 dark:text-slate-800 mb-8 filled">format_quote</span>
                       <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-12 leading-relaxed italic">
                           "Joining the Ushering Team helped me feel like I truly belonged. It wasn't just about serving; it was about the family I found while doing it."
                       </h2>
                       <div className="flex flex-col items-center gap-4">
                            <img src="https://i.pravatar.cc/150?u=rebecca_smith" className="size-20 rounded-full border-4 border-white shadow-xl" alt="Rebecca Smith" />
                            <div>
                                 <h4 className="font-black text-lg text-slate-900 dark:text-white">Rebecca Smith</h4>
                                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Member since 2018</p>
                            </div>
                       </div>
                  </div>
             </section>
        </div>
    );
};

export const About: React.FC = () => {
    return (
        <div className="font-sans flex flex-col bg-white dark:bg-background-dark">
            {/* HERO SECTION */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1510915361408-d5965ce7f59b?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Worship"/>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                        Rooted in Faith, <br/><span className="text-blue-400">Growing in Love</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-serif text-gray-200 mb-10 drop-shadow-lg max-w-2xl mx-auto">
                        Discover the heart of Christ's Ambassadors Celebration Centre, a place where everyone is welcome and everyone belongs.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/auth" className="px-8 py-4 bg-primary text-white font-bold rounded-md shadow-xl hover:bg-primary-dark transition-all uppercase tracking-widest text-sm">Sign Up Today</Link>
                        <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold rounded-md hover:bg-white hover:text-primary transition-all uppercase tracking-widest text-sm">Visit Our Site</button>
                    </div>
                </div>
            </section>

            {/* MISSION VISION VALUES */}
            <section className="py-24 px-4 bg-gray-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-primary dark:text-blue-400 font-bold text-xs uppercase tracking-widest mb-2 inline-block">Who We Are</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Mission, Vision & Values</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto mb-16 leading-relaxed">
                        We are driven by a passion to serve God and our community with excellence and integrity.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Our Mission', icon: 'church', desc: 'To reconcile men to God through the gospel of Jesus Christ, building a community of faith.' },
                            { title: 'Our Vision', icon: 'public', desc: 'To be a global voice impacting generations with truth, grace, and the love of God.' },
                            { title: 'Core Values', icon: 'favorite', desc: 'Integrity, Excellence, Love, and Faith are the pillars of the work we do.' },
                            { title: 'Service', icon: 'volunteer_activism', desc: 'Dedicated to serving our local and global community with compassion and purpose.' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
                                <div className="size-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-400 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* OUR HISTORY */}
            <section className="py-24 px-4 max-w-7xl mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-12">
                        <div>
                            <span className="text-primary dark:text-blue-400 font-bold text-xs uppercase tracking-widest mb-2 inline-block">Our History</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">A Journey of Faith</h2>
                        </div>
                        
                        <div className="space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-blue-100 dark:bg-slate-800"></div>
                            
                            {[
                                { year: '1991 - The Beginning', desc: 'Started as a small prayer group in a living room, CACC was founded on the promise of gathering souls for Christ.' },
                                { year: '2008 - First Sanctuary', desc: 'After years of renting halls, we dedicated our first permanent building, opening doors for expanded community service.' },
                                { year: 'Today - Global Reach', desc: 'Today, CACC ministers to thousands locally and globally through live streaming and missions.' }
                            ].map((milestone, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 size-3 rounded-full bg-primary border-4 border-white dark:border-slate-900 z-10"></div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{milestone.year}</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed max-w-md">{milestone.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="relative">
                        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl rotate-3">
                             <img src="https://images.unsplash.com/photo-1544928147-7972fc53599e?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Historical moment" />
                             <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                        </div>
                        <div className="absolute -bottom-8 -left-8 aspect-square w-48 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-2xl -rotate-6 hidden md:block">
                             <img src="https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover rounded-2xl" alt="Congregation" />
                        </div>
                    </div>
                </div>
            </section>

            {/* LEADERSHIP */}
            <section className="py-24 px-4 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-primary dark:text-blue-400 font-bold text-xs uppercase tracking-widest mb-2 inline-block">Leadership</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-16">Meet Our Shepherds</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { name: 'Rev. David Ombwa', role: 'Senior Pastor', img: 'https://i.pravatar.cc/300?u=ombwa', bio: 'With over 20 years of ministry, Rev. David leads with a heart for soul-winning and a passion for word of God in reaching the next generation.' },
                            { name: 'Sarah Williams', role: 'Head of Missions', img: 'https://i.pravatar.cc/300?u=sarahw', bio: 'Sarah oversees our outreach programs, ensuring that the love of Christ reaches the street and communities that need it most.' },
                            { name: 'James Carter', role: 'Associate Pastor', img: 'https://i.pravatar.cc/300?u=carter', bio: 'James leads the worship team and discipleship, believing that our worship transcends songs, and is a primarily a lifestyle of sacrifice.' }
                        ].map((pastor, i) => (
                            <div key={i} className="group p-8 rounded-[2rem] bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 shadow-sm hover:shadow-2xl border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                                <div className="size-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-white dark:border-slate-700 shadow-lg">
                                    <img src={pastor.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={pastor.name}/>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{pastor.name}</h3>
                                <p className="text-primary dark:text-blue-400 font-bold text-xs uppercase tracking-widest mb-4">{pastor.role}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-8">{pastor.bio}</p>
                                <div className="flex justify-center gap-4 text-gray-400">
                                    <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">public</span></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHAT TO EXPECT */}
            <section className="bg-primary py-24 px-4 text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-blue-300 font-bold text-xs uppercase tracking-widest mb-4 inline-block">VISIT US</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">What to Expect</h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-lg leading-relaxed">
                            First time visiting a new church can be intimidating. Here is the quick guide to make your first visit seamless and enjoyable.
                        </p>
                        <button className="px-8 py-4 bg-white text-primary font-bold rounded-md shadow-xl hover:bg-gray-100 transition-all uppercase tracking-widest text-sm">Plan Your Visit</button>
                    </div>
                    
                    <div className="space-y-6">
                        {[
                            { title: 'Service Times', icon: 'schedule', text: 'Sundays at 9:00 AM and 11:30 AM. Wednesday mid-week @ 6:00 PM for Word & Prayer.' },
                            { title: 'Kids Ministry', icon: 'child_care', text: 'Safe, fun, and biblical based environments for children aged 6 months to 12 years old.' },
                            { title: 'Parking', icon: 'local_parking', text: 'Ample free parking is available on-site. Follow the signs for "First Time Guest Parking".' }
                        ].map((card, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex items-start gap-6 group hover:bg-white/20 transition-all">
                                <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-white">{card.icon}</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">{card.title}</h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">{card.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STORIES OF GRACE */}
            <section className="py-24 px-4 bg-gray-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-primary dark:text-blue-400 font-bold text-xs uppercase tracking-widest mb-2 inline-block">COMMUNITY VOICES</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-16">Stories of Grace</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { name: 'Rebecca M.', role: 'Worship Leader', text: 'CACC has been a sanctuary for my family. The warmth of the people and the depth of the teaching have helped us grow spiritually in ways we never imagined.', avatar: 'https://i.pravatar.cc/150?u=rebecca' },
                            { name: 'John D.', role: 'Active Volunteer', text: 'Found a community that truly cares. The media ministry has provided me with a way to serve and use my talent to help help spread my city with faith.', avatar: 'https://i.pravatar.cc/150?u=johnd' }
                        ].map((story, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-left relative">
                                <span className="absolute top-8 left-8 text-6xl text-blue-100 dark:text-slate-700 font-serif leading-none">"</span>
                                <p className="text-gray-500 dark:text-gray-300 text-lg italic leading-relaxed mb-8 relative z-10 font-serif">
                                    {story.text}
                                </p>
                                <div className="flex items-center gap-4">
                                    <img src={story.avatar} className="size-12 rounded-full object-cover" alt={story.name}/>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{story.name}</h4>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{story.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 px-4">
                 <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl border border-gray-100 dark:border-gray-700">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Ready to take the next step?</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-lg mx-auto">
                        Whether you are new to faith or looking for a new church home, there is a place for you here.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/events" className="px-10 py-4 bg-primary text-white font-bold rounded-md shadow-xl hover:bg-primary-dark transition-all flex items-center gap-2">
                             Plan Your Visit <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                        <Link to="/contact" className="px-10 py-4 bg-transparent text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 font-bold rounded-md hover:bg-gray-50 transition-all">Contact Us</Link>
                    </div>
                 </div>
            </section>
        </div>
    );
};

export const Events: React.FC = () => {
    return (
        <div className="bg-background-off dark:bg-background-dark font-sans flex flex-col pb-20">
             {/* 1. Header Section */}
             <section className="relative pt-24 pb-16 px-4 md:px-8">
                  <div className="max-w-7xl mx-auto">
                       <span className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4 inline-block flex items-center gap-2">
                           <span className="w-8 h-px bg-primary"></span> COMMUNITY FELLOWSHIP
                       </span>
                       <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">Upcoming Gatherings</h1>
                       <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed italic">
                           "For where two or three gather in my name, there am I with them."
                           <span className="block mt-2 text-sm opacity-60 not-italic">— Matthew 18:20</span>
                       </p>
                  </div>
             </section>

             {/* 2. Filter Bar */}
             <section className="px-4 md:px-8 mb-12">
                  <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-4">
                       <div className="relative flex-1 w-full">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input type="text" placeholder="Search events, speakers, or topics..." className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border-none rounded-xl text-sm dark:text-white focus:ring-1 focus:ring-primary" />
                       </div>
                       <div className="flex gap-2 w-full md:w-auto">
                            <select className="bg-gray-50 dark:bg-slate-900 border-none rounded-xl text-xs font-bold text-gray-500 dark:text-gray-300 py-3 pl-4 pr-10 focus:ring-1 focus:ring-primary w-full">
                                 <option>Category: All</option>
                            </select>
                            <select className="bg-gray-50 dark:bg-slate-900 border-none rounded-xl text-xs font-bold text-gray-500 dark:text-gray-300 py-3 pl-4 pr-10 focus:ring-1 focus:ring-primary w-full">
                                 <option>Month: October</option>
                            </select>
                            <select className="bg-gray-50 dark:bg-slate-900 border-none rounded-xl text-xs font-bold text-gray-500 dark:text-gray-300 py-3 pl-4 pr-10 focus:ring-1 focus:ring-primary w-full">
                                 <option>Location</option>
                            </select>
                       </div>
                       <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-xl w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">list</span> List
                            </button>
                            <button className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 hover:bg-white/50 dark:hover:bg-slate-600 transition rounded-lg">
                                <span className="material-symbols-outlined text-[18px]">calendar_month</span> Calendar
                            </button>
                       </div>
                  </div>
             </section>

             {/* 3. Featured Event */}
             <section className="px-4 md:px-8 mb-16">
                  <div className="max-w-7xl mx-auto">
                       <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Featured Event</h2>
                       <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 lg:grid-cols-12">
                            {/* Image Part */}
                            <div className="lg:col-span-5 relative h-80 lg:h-auto">
                                 <img src="https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Featured" />
                                 <div className="absolute top-6 left-6 bg-white rounded-2xl p-3 shadow-lg flex flex-col items-center min-w-[64px]">
                                      <span className="text-[10px] font-black text-gray-400 uppercase">OCT</span>
                                      <span className="text-3xl font-black text-primary leading-none">15</span>
                                 </div>
                                 <div className="absolute bottom-6 left-6">
                                      <span className="bg-primary/90 backdrop-blur text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                           <span className="material-symbols-outlined text-sm filled text-yellow-400">star</span> Special Event
                                      </span>
                                 </div>
                            </div>
                            {/* Content Part */}
                            <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                                 <div className="flex items-center gap-2 text-xs font-black text-primary mb-4">
                                      <span>Worship Night</span>
                                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                      <span className="text-gray-400">6:00 PM - 8:30 PM</span>
                                 </div>
                                 <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Annual Harvest Thanksgiving</h3>
                                 <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 leading-relaxed">
                                      Join us for an evening of gratitude, music, and testimony as we celebrate God's faithfulness throughout the year. Bring your friends and family!
                                 </p>
                                 <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100 dark:border-gray-700">
                                      <div className="flex items-center gap-3 text-gray-500">
                                           <span className="material-symbols-outlined text-primary">location_on</span>
                                           <span className="text-sm font-bold">Grand Auditorium, CACC Main Campus</span>
                                      </div>
                                      <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                                           Register Now <span className="material-symbols-outlined">arrow_forward</span>
                                      </button>
                                 </div>
                            </div>
                       </div>
                  </div>
             </section>

             {/* 4. Events Grid */}
             <section className="px-4 md:px-8 mb-20">
                  <div className="max-w-7xl mx-auto">
                       <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">October Events</h2>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {UPCOMING_EVENTS.map(event => (
                                <div key={event.id} className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-xl transition-all duration-300 flex flex-col">
                                     <div className="relative h-56 overflow-hidden">
                                          <img src={event.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt={event.title} />
                                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-xl p-2 min-w-[50px] flex flex-col items-center shadow-md">
                                               <span className="text-[8px] font-black text-gray-400 uppercase">OCT</span>
                                               <span className="text-xl font-black text-primary leading-none">{event.date.split('-')[2]}</span>
                                          </div>
                                          <div className="absolute bottom-4 left-4">
                                               <span className="bg-black/40 backdrop-blur px-2 py-1 rounded text-[9px] font-bold text-white uppercase tracking-wider">{event.tag}</span>
                                          </div>
                                     </div>
                                     <div className="p-8 flex-1 flex flex-col">
                                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">{event.title}</h3>
                                          <div className="space-y-3 mb-8 text-gray-500 dark:text-gray-400">
                                               <div className="flex items-center gap-2 text-xs font-bold">
                                                    <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                                                    {event.time}
                                               </div>
                                               <div className="flex items-center gap-2 text-xs font-bold">
                                                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                                    {event.location}
                                               </div>
                                          </div>
                                          <button className={`w-full py-3.5 rounded-xl font-black text-sm transition-all border ${
                                              event.id === '1' ? 'bg-background-off text-slate-900 border-transparent hover:bg-gray-200' :
                                              event.id === '2' ? 'bg-primary/5 text-primary border-primary/20 hover:bg-primary hover:text-white' :
                                              event.id === '3' ? 'bg-background-off text-slate-900 border-transparent hover:bg-gray-200' :
                                              'bg-primary text-white border-primary hover:bg-primary-dark shadow-md'
                                          }`}>
                                              {event.id === '1' ? 'View Details' : event.id === '2' ? 'RSVP' : event.id === '3' ? 'Volunteer' : 'Register'}
                                          </button>
                                     </div>
                                </div>
                            ))}
                            
                            {/* Host an Event Card */}
                            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center group hover:border-primary transition-colors">
                                 <div className="size-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                      <span className="material-symbols-outlined text-3xl">add_calendar</span>
                                 </div>
                                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Host an Event?</h3>
                                 <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-[200px]">Ministry leaders can submit event requests for approval.</p>
                                 <button className="text-primary font-black text-sm hover:underline">Submit Request</button>
                            </div>
                       </div>

                       {/* Pagination */}
                       <div className="flex justify-center mt-16 gap-2">
                            <button className="size-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition"><span className="material-symbols-outlined">chevron_left</span></button>
                            <button className="size-10 rounded-full bg-primary text-white font-black text-sm shadow-lg shadow-blue-500/20">1</button>
                            <button className="size-10 rounded-full border border-gray-200 dark:border-gray-700 font-black text-sm text-gray-500 hover:text-primary hover:border-primary transition">2</button>
                            <button className="size-10 rounded-full border border-gray-200 dark:border-gray-700 font-black text-sm text-gray-500 hover:text-primary hover:border-primary transition">3</button>
                            <button className="size-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition"><span className="material-symbols-outlined">chevron_right</span></button>
                       </div>
                  </div>
             </section>

             {/* 5. Stay Connected (Redesigned) */}
             <section className="px-4 md:px-8">
                  <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                       <div className="size-12 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-2xl">mail</span>
                       </div>
                       <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Stay Connected</h2>
                       <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 max-w-lg mx-auto">Subscribe to our weekly newsletter to get the latest updates on events, sermons, and community news delivered to your inbox.</p>
                       <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input type="email" placeholder="Enter your email address" className="flex-1 px-6 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-700 text-sm focus:ring-1 focus:ring-primary outline-none" />
                            <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-black rounded-xl shadow-lg transition whitespace-nowrap">Subscribe</button>
                       </div>
                       <p className="text-[10px] text-gray-400 mt-4 uppercase font-bold">We respect your privacy. Unsubscribe at any time.</p>
                  </div>
             </section>
        </div>
    );
};
