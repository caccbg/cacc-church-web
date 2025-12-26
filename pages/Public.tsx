
import React, { useState, useEffect } from 'react';
import { UserRole, Event } from '../types';
import { useNavigate, Link } from 'react-router-dom';

interface AuthProps {
  setRole: (role: UserRole) => void;
}

// --- MOCK DATA FOR EVENTS ---
const UPCOMING_EVENTS: Event[] = [
  { id: '1', title: 'Mid-Week Deep Dive', date: '2023-10-18', time: '7:00 PM - 8:30 PM', location: 'Fellowship Hall B', category: 'Bible Study', image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2574&auto=format&fit=crop' },
  { id: '2', title: 'Friday Fire Night', date: '2023-10-20', time: '6:30 PM - 9:00 PM', location: 'Youth Center', category: 'Youth', image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2670&auto=format&fit=crop' },
  { id: '3', title: 'Community Food Drive', date: '2023-10-22', time: '1:00 PM - 4:00 PM', location: 'City Park / Main Entrance', category: 'Outreach', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2670&auto=format&fit=crop' },
  { id: '4', title: 'Sunday Celebration', date: '2023-10-27', time: '09:00 AM & 11:30 AM', location: 'Main Sanctuary', category: 'Service', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop' },
  { id: '5', title: 'Volunteers Training', date: '2023-10-28', time: '7:00 PM - 9:00 PM', location: 'Conference Room A', category: 'Leadership', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2684&auto=format&fit=crop' },
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

      {/* 2.5 Recent Sermons (New Section) */}
      <section className="bg-white dark:bg-slate-900 py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-10">
                  <div>
                      <p className="text-accent-red font-bold text-xs uppercase tracking-widest mb-2">Word of God</p>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Recent Sermons</h2>
                  </div>
                  <Link to="/sermons" className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
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

export const Auth: React.FC<AuthProps> = ({ setRole }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [method, setMethod] = useState<'email' | 'phone'>('email');

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate auth
        setRole(UserRole.MEMBER);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
             <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                 <div className="text-center">
                     <div className="mx-auto size-16 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
                         <span className="material-symbols-outlined text-4xl">church</span>
                     </div>
                     <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                         {isLogin ? 'Welcome Back' : 'Join Our Family'}
                     </h2>
                     <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                         {isLogin ? 'Sign in to access your dashboard' : 'Create an account to get started'}
                     </p>
                 </div>

                 <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
                     <button 
                        onClick={() => setMethod('email')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition ${method === 'email' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                         Email
                     </button>
                     <button 
                        onClick={() => setMethod('phone')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition ${method === 'phone' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                         Phone
                     </button>
                 </div>

                 <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                     <div className="rounded-md shadow-sm -space-y-px">
                         {method === 'email' ? (
                             <div>
                                 <label className="sr-only">Email address</label>
                                 <input type="email" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-slate-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-slate-900" placeholder="Email address" />
                             </div>
                         ) : (
                             <div>
                                 <label className="sr-only">Phone Number</label>
                                 <input type="tel" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-slate-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-slate-900" placeholder="+254 7XX XXX XXX" />
                             </div>
                         )}
                         <div>
                             <label className="sr-only">Password</label>
                             <input type="password" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-slate-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-slate-900" placeholder="Password" />
                         </div>
                     </div>

                     <div className="flex items-center justify-between">
                         <div className="flex items-center">
                             <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                             <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Remember me</label>
                         </div>
                         <div className="text-sm">
                             <a href="#" className="font-medium text-primary hover:text-blue-500">Forgot password?</a>
                         </div>
                     </div>

                     <div>
                         <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5">
                             {isLogin ? 'Sign in' : 'Register'}
                         </button>
                     </div>
                 </form>

                 <div className="text-center">
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                         {isLogin ? "Don't have an account? " : "Already have an account? "}
                         <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-primary hover:text-blue-500">
                             {isLogin ? 'Sign up' : 'Sign in'}
                         </button>
                     </p>
                 </div>
                 
                 <div className="mt-6 text-center">
                     <button onClick={() => { setRole(UserRole.ADMIN); navigate('/admin'); }} className="text-xs text-gray-400 hover:text-gray-600 underline">
                         Demo: Login as Admin
                     </button>
                 </div>
             </div>
        </div>
    );
};

export const Contact: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen py-20 px-4 md:px-8 font-sans">
             <div className="max-w-7xl mx-auto">
                 <div className="text-center mb-16">
                     <p className="text-accent-red font-bold text-xs uppercase tracking-widest mb-2">Get in Touch</p>
                     <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">We'd Love to Hear From You</h1>
                     <p className="text-gray-500 text-lg max-w-2xl mx-auto">Whether you have a question, a prayer request, or just want to say hello, we are here for you.</p>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                          <div className="size-14 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                              <span className="material-symbols-outlined text-3xl">location_on</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Visit Us</h3>
                          <p className="text-gray-500 leading-relaxed">Kibabii Diploma Road,<br/>Adjacent to Marell Academy,<br/>Bungoma, Kenya</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                          <div className="size-14 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                              <span className="material-symbols-outlined text-3xl">call</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Call Us</h3>
                          <p className="text-gray-500 mb-2">Mon-Fri from 8am to 5pm</p>
                          <a href="tel:+254759277874" className="text-lg font-black text-slate-900 dark:text-white hover:text-primary transition">+254 759 277 874</a>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                          <div className="size-14 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                              <span className="material-symbols-outlined text-3xl">mail</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email Us</h3>
                          <p className="text-gray-500 mb-2">For general inquiries</p>
                          <a href="mailto:cacchurchbg@gmail.com" className="text-lg font-black text-slate-900 dark:text-white hover:text-primary transition">cacchurchbg@gmail.com</a>
                      </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     {/* Map */}
                     <div className="h-[500px] bg-gray-200 rounded-3xl overflow-hidden relative shadow-lg">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.817951633519!2d34.55837617496664!3d0.5562779994384065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17803f005c10590b%3A0xc3f8e58983870632!2sChrist&#39;s%20Ambassadors%20Celebration%20Centre!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske" 
                            width="100%" 
                            height="100%" 
                            style={{border:0}} 
                            allowFullScreen={true} 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        ></iframe>
                     </div>

                     {/* Form */}
                     <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                         <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Send us a Message</h3>
                         <form className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name</label>
                                     <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none dark:text-white" placeholder="John Doe" />
                                 </div>
                                 <div>
                                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                                     <input type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none dark:text-white" placeholder="john@example.com" />
                                 </div>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
                                 <select className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none dark:text-white">
                                     <option>General Inquiry</option>
                                     <option>Prayer Request</option>
                                     <option>Membership</option>
                                     <option>Counseling</option>
                                 </select>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                                 <textarea rows={5} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none dark:text-white resize-none" placeholder="How can we help you?"></textarea>
                             </div>
                             <button type="submit" className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-1">
                                 Send Message
                             </button>
                         </form>
                     </div>
                 </div>

                 {/* FAQs */}
                 <div className="mt-20 max-w-4xl mx-auto">
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h3>
                     <div className="space-y-4">
                         {[
                             { q: "What time are your services?", a: "Our Sunday services are at 9:00 AM and 11:00 AM. We also have a mid-week service on Wednesdays at 6:30 PM." },
                             { q: "Where are you located?", a: "We are located along Kibabii Diploma Road, adjacent to Marell Academy in Bungoma, Kenya." },
                             { q: "Do you have a children's ministry?", a: "Yes! We have a vibrant Children's Church that runs concurrently with our main services, catering to ages 4-12." },
                             { q: "How can I join a cell group?", a: "You can join a cell group by visiting the 'Ministries' page on our website or contacting our church office." }
                         ].map((faq, i) => (
                             <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                                 <h4 className="font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h4>
                                 <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
        </div>
    );
};

export const Ministries: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen py-20 px-4 md:px-8 font-sans">
             <div className="max-w-7xl mx-auto">
                 <div className="text-center mb-16">
                     <p className="text-accent-red font-bold text-xs uppercase tracking-widest mb-2">Serve & Connect</p>
                     <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Our Ministries</h1>
                     <p className="text-gray-500 text-lg max-w-2xl mx-auto">Find your place to serve, grow, and belong within the CACC family.</p>
                 </div>

                 {/* Category Filter */}
                 <div className="flex flex-wrap justify-center gap-3 mb-12">
                     {MINISTRY_CATEGORIES.map(cat => (
                         <button key={cat} className="px-6 py-2 rounded-full border border-gray-200 dark:border-gray-700 font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition">
                             {cat}
                         </button>
                     ))}
                 </div>

                 {/* Ministries Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                     {MINISTRIES_DATA.map(ministry => (
                         <div key={ministry.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                             <div className="h-48 overflow-hidden relative">
                                 <img src={ministry.image} alt={ministry.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-primary uppercase tracking-wider">
                                     {ministry.category}
                                 </div>
                             </div>
                             <div className="p-8">
                                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{ministry.title}</h3>
                                 <p className="text-gray-500 text-sm leading-relaxed mb-6">{ministry.description}</p>
                                 
                                 <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                                     <div className="flex items-center gap-3">
                                         <img src={ministry.leader.avatar} alt={ministry.leader.name} className="size-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
                                         <div>
                                             <p className="text-[10px] text-gray-400 uppercase font-bold">Leader</p>
                                             <p className="text-xs font-bold text-slate-900 dark:text-white">{ministry.leader.name}</p>
                                         </div>
                                     </div>
                                     <button className="text-primary font-bold text-sm hover:underline">Join Team</button>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>

                 {/* Cell Groups Section */}
                 <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                         <span className="material-symbols-outlined text-[15rem]">groups</span>
                     </div>
                     <div className="relative z-10">
                         <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                             <div>
                                 <p className="text-accent-red font-bold text-xs uppercase tracking-widest mb-2">Life Together</p>
                                 <h2 className="text-3xl md:text-4xl font-black mb-4">Cell Groups</h2>
                                 <p className="text-slate-400 max-w-xl">Small groups are the heartbeat of our church. Connect with others in your neighborhood for fellowship and bible study.</p>
                             </div>
                             <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-gray-100 transition">Find a Group Near You</button>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {CELL_GROUPS_DATA.map(group => (
                                 <div key={group.id} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition cursor-pointer">
                                     <div className="flex justify-between items-start mb-4">
                                         <div className="size-10 rounded-lg bg-accent-red/20 text-accent-red flex items-center justify-center">
                                             <span className="material-symbols-outlined">{group.icon}</span>
                                         </div>
                                         <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase">{group.status}</span>
                                     </div>
                                     <h3 className="text-xl font-bold mb-1">{group.name}</h3>
                                     <p className="text-sm text-slate-400 mb-4">{group.type} • {group.distance}</p>
                                     <div className="space-y-2 text-sm text-slate-300">
                                         <div className="flex items-center gap-2">
                                             <span className="material-symbols-outlined text-base opacity-70">schedule</span> {group.schedule}
                                         </div>
                                         <div className="flex items-center gap-2">
                                             <span className="material-symbols-outlined text-base opacity-70">location_on</span> {group.location}
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
};

export const About: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-950 font-sans">
             
             {/* 1. Hero */}
             <div className="relative h-[600px] flex items-center justify-center text-center px-4">
                 <div className="absolute inset-0">
                     <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop" alt="Worship" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/60"></div>
                 </div>
                 <div className="relative z-10 max-w-4xl mx-auto text-white">
                     <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">Rooted in Faith, <span className="text-blue-400">Growing in Love</span></h1>
                     <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">Discover the heart of Christ's Ambassadors Celebration Centre. A place where everyone is welcome and everyone belongs.</p>
                     <div className="flex justify-center gap-4">
                         <button className="px-8 py-3 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-bold rounded-full transition">Join Us</button>
                         <button className="px-8 py-3 border border-white/30 hover:bg-white/10 text-white font-bold rounded-full transition">Learn More</button>
                     </div>
                 </div>
             </div>

             {/* 2. Mission Vision Values */}
             <div className="py-20 px-4 max-w-7xl mx-auto">
                 <div className="text-center mb-16">
                     <p className="text-[#4F46E5] font-bold text-xs uppercase tracking-widest mb-2">Who We Are</p>
                     <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Mission, Vision & Values</h2>
                     <p className="text-gray-500 max-w-2xl mx-auto">We are driven by a calling to serve God and our community with excellence and integrity.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {[
                         { icon: "church", title: "Our Mission", desc: "To reach the lost through the gospel of Jesus Christ, building a community of faith." },
                         { icon: "public", title: "Our Vision", desc: "To see a global nation impacting generations with truth, grace, and the love of God." },
                         { icon: "favorite", title: "Core Values", desc: "Integrity, Excellence, Love, and Faith serve as the foundation of our walk." },
                         { icon: "handshake", title: "Service", desc: "Dedicated to serving our local and global community with compassionate hearts." }
                     ].map((item, i) => (
                         <div key={i} className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                             <div className="size-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#4F46E5] flex items-center justify-center mb-6">
                                 <span className="material-symbols-outlined">{item.icon}</span>
                             </div>
                             <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h3>
                             <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                         </div>
                     ))}
                 </div>
             </div>

             {/* 3. History Timeline */}
             <div className="py-20 bg-gray-50 dark:bg-slate-900/50">
                 <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div>
                         <p className="text-[#4F46E5] font-bold text-xs uppercase tracking-widest mb-2">Our History</p>
                         <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-10">A Journey of Faith</h2>
                         
                         <div className="space-y-8 relative pl-8 border-l border-gray-200 dark:border-gray-700">
                             {[
                                 { year: "1995 - The Beginning", desc: "Started as a small prayer group in a living room. CACC was founded on the promise of gathering souls for Christ." },
                                 { year: "2008 - First Sanctuary", desc: "After years of renting halls, we dedicated our first permanent building, opening doors for expanded community service." },
                                 { year: "Today - Global Reach", desc: "Today, CACC ministers to thousands locally and globally through online streaming and missions." }
                             ].map((point, i) => (
                                 <div key={i} className="relative">
                                     <div className="absolute -left-[37px] top-1 size-4 rounded-full bg-[#4F46E5] border-4 border-white dark:border-slate-900"></div>
                                     <h4 className="font-bold text-slate-900 dark:text-white mb-2">{point.year}</h4>
                                     <p className="text-gray-500 text-sm leading-relaxed">{point.desc}</p>
                                 </div>
                             ))}
                         </div>
                     </div>
                     <div className="relative">
                         <img src="https://images.unsplash.com/photo-1601142634808-38923eb7c560?q=80&w=2670&auto=format&fit=crop" alt="History" className="rounded-2xl shadow-2xl w-full" />
                     </div>
                 </div>
             </div>

             {/* 4. Leadership */}
             <div className="py-24 px-4 max-w-7xl mx-auto">
                 <div className="text-center mb-16">
                     <p className="text-[#4F46E5] font-bold text-xs uppercase tracking-widest mb-2">Leadership</p>
                     <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Meet Our Shepherds</h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                     {[
                         { name: "Rev. David Omondi", role: "Senior Pastor", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop", desc: "With over 20 years of ministry, Rev. David leads with a heart for teaching truth and creating a world of better tomorrow for the next generation." },
                         { name: "Sarah Williams", role: "Head of Missions", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop", desc: "Sarah oversees our outreach programs, ensuring that the love of Christ reaches the streets and communities that need it most." },
                         { name: "James Carter", role: "Worship Leader", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop", desc: "James leads our worship team with passion, believing that music is a divine instrument, ushering everyone into presence for revival." }
                     ].map((leader, i) => (
                         <div key={i} className="flex flex-col items-center">
                             <div className="size-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
                                 <img src={leader.img} alt={leader.name} className="w-full h-full object-cover" />
                             </div>
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{leader.name}</h3>
                             <p className="text-[#4F46E5] font-bold text-xs uppercase mb-4">{leader.role}</p>
                             <p className="text-gray-500 text-sm leading-relaxed max-w-sm">{leader.desc}</p>
                             <div className="mt-4 text-gray-400 hover:text-primary cursor-pointer"><span className="material-symbols-outlined text-lg">mail</span></div>
                         </div>
                     ))}
                 </div>
             </div>

             {/* 5. What to Expect */}
             <div className="bg-[#4F46E5] py-20 px-4 text-white">
                 <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div>
                         <p className="text-blue-200 font-bold text-xs uppercase tracking-widest mb-2">Visit Us</p>
                         <h2 className="text-3xl md:text-4xl font-black mb-6">What to Expect</h2>
                         <p className="text-blue-100 mb-8 leading-relaxed text-lg">
                             First time visiting? We want your experience to be seamless and enjoyable. 
                             Here is a quick guide to make you feel at home from the moment you arrive.
                         </p>
                         <button className="bg-white text-[#4F46E5] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">Plan Your Visit</button>
                     </div>
                     <div className="space-y-6">
                         {[
                             { icon: "schedule", title: "Service Times", desc: "Sundays at 9:00 AM and 11:00 AM. Wednesdays at 6:30 PM for Midweek Bible Study." },
                             { icon: "child_care", title: "Kids Ministry", desc: "Safe, fun, and biblical learning environments for children aged 6 months to 12 years old." },
                             { icon: "directions_car", title: "Parking", desc: "Ample free parking is available on-site. Follow the signs for 'First Time Guest Parking'." }
                         ].map((item, i) => (
                             <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/10 border border-white/10">
                                 <span className="material-symbols-outlined text-2xl mt-1">{item.icon}</span>
                                 <div>
                                     <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                     <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>

             {/* 6. Stories of Grace (Testimonials) */}
             <div className="py-20 px-4 max-w-7xl mx-auto">
                 <div className="text-center mb-16">
                     <p className="text-[#4F46E5] font-bold text-xs uppercase tracking-widest mb-2">Community Voices</p>
                     <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Stories of Grace</h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                         { text: "CACC has been a sanctuary for my family. The warmth of the people and the depth of the teaching have helped us grow spiritually in ways we never imagined.", author: "Rebecca M.", sub: "Member since 2019", img: "https://i.pravatar.cc/150?u=rebecca" },
                         { text: "I found a community that truly cares. The men's ministry has provided me with accountability and brotherhood that was missing in my life.", author: "John D.", sub: "Member since 2021", img: "https://i.pravatar.cc/150?u=john" }
                     ].map((t, i) => (
                         <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                             <p className="text-gray-600 dark:text-gray-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                             <div className="flex items-center gap-3">
                                 <img src={t.img} alt={t.author} className="size-10 rounded-full" />
                                 <div>
                                     <p className="text-sm font-bold text-slate-900 dark:text-white">{t.author}</p>
                                     <p className="text-xs text-gray-500">{t.sub}</p>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

             {/* 7. Bottom CTA */}
             <div className="py-12 px-4 max-w-4xl mx-auto">
                 <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-700">
                     <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Ready to take the next step?</h2>
                     <p className="text-gray-500 mb-8">Whether you are new to faith or looking for a new church home, there is a place for you here.</p>
                     <div className="flex justify-center gap-4">
                         <button className="px-6 py-3 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition">New Here? Start</button>
                         <button className="px-6 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 text-slate-700 dark:text-white font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition">Contact Us</button>
                     </div>
                 </div>
             </div>
        </div>
    );
};

export const Events: React.FC = () => {
    const [view, setView] = useState<'list' | 'calendar'>('list');

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen py-10 px-4 md:px-8 font-sans">
             <div className="max-w-7xl mx-auto">
                 
                 {/* Header */}
                 <div className="mb-10">
                     <span className="text-[#4F46E5] font-bold text-xs uppercase tracking-widest flex items-center gap-1 mb-2">
                         <span className="size-1.5 rounded-full bg-[#4F46E5]"></span> Community Fellowship
                     </span>
                     <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Upcoming Gatherings</h1>
                     <p className="text-gray-500 dark:text-gray-400">"For where two or three gather in my name, there am I with them." <br/> <span className="text-xs text-gray-400">— Matthew 18:20</span></p>
                 </div>

                 {/* Filters */}
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                     <div className="relative w-full md:w-80">
                         <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                         <input type="text" placeholder="Search events, speakers, or topics..." className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary dark:text-white placeholder-gray-400" />
                     </div>
                     
                     <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                         <button className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-gray-50 whitespace-nowrap">
                             Category: All <span className="material-symbols-outlined text-sm">expand_more</span>
                         </button>
                         <button className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-gray-50 whitespace-nowrap">
                             Month: October <span className="material-symbols-outlined text-sm">expand_more</span>
                         </button>
                         <button className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-gray-50 whitespace-nowrap">
                             Location <span className="material-symbols-outlined text-sm">expand_more</span>
                         </button>
                     </div>

                     <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-lg shrink-0">
                         <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-gray-500'}`}>
                             <span className="material-symbols-outlined text-sm">view_list</span> List
                         </button>
                         <button onClick={() => setView('calendar')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition ${view === 'calendar' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-gray-500'}`}>
                             <span className="material-symbols-outlined text-sm">calendar_month</span> Calendar
                         </button>
                     </div>
                 </div>

                 {/* Featured Event */}
                 <div className="mb-12">
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Featured Event</h3>
                     <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 lg:grid-cols-5">
                         <div className="lg:col-span-3 relative h-64 lg:h-auto group">
                             <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Featured" />
                             <div className="absolute top-4 left-4 bg-white rounded-lg p-2 text-center min-w-[50px] shadow-lg">
                                 <span className="block text-[10px] font-bold text-red-600 uppercase">OCT</span>
                                 <span className="block text-xl font-black text-slate-900 leading-none">15</span>
                             </div>
                             <div className="absolute bottom-4 left-4">
                                 <span className="bg-[#4F46E5] text-white text-[10px] font-bold px-2 py-1 rounded-full">Special Event</span>
                             </div>
                         </div>
                         <div className="lg:col-span-2 p-8 flex flex-col justify-center">
                             <div className="flex items-center gap-2 text-xs font-bold text-[#4F46E5] mb-2 uppercase tracking-wide">
                                 Worship Night • 6:00 PM - 9:00 PM
                             </div>
                             <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Annual Harvest Thanksgiving</h2>
                             <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                                 Join us for an evening of gratitude, music, and testimony as we celebrate God's faithfulness throughout the year. Bring your friends and family!
                             </p>
                             <div className="mt-auto">
                                 <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                                     <span className="material-symbols-outlined text-lg text-[#4F46E5]">location_on</span> Grand Auditorium, CACC Main Campus
                                 </div>
                                 <button className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-bold rounded-lg shadow-md transition flex items-center justify-center gap-2">
                                     Register Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Events Grid */}
                 <div className="mb-8">
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">October Events</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {UPCOMING_EVENTS.map(event => (
                             <div key={event.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition group flex flex-col">
                                 <div className="relative h-48 overflow-hidden">
                                     <img src={event.image} alt={event.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                     <div className="absolute top-3 left-3 bg-white rounded-md p-1.5 text-center min-w-[40px] shadow-sm">
                                         <span className="block text-[9px] font-bold text-red-600 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                         <span className="block text-lg font-black text-slate-900 leading-none">{new Date(event.date).getDate()}</span>
                                     </div>
                                     <div className="absolute bottom-3 left-3">
                                         <span className="bg-black/50 backdrop-blur text-white text-[9px] font-bold px-2 py-1 rounded uppercase">{event.category}</span>
                                     </div>
                                 </div>
                                 <div className="p-5 flex-1 flex flex-col">
                                     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#4F46E5] transition-colors">{event.title}</h3>
                                     
                                     <div className="space-y-2 mt-4 mb-6">
                                         <div className="flex items-center gap-2 text-xs text-gray-500">
                                             <span className="material-symbols-outlined text-[#4F46E5] text-sm">schedule</span> {event.time}
                                         </div>
                                         <div className="flex items-center gap-2 text-xs text-gray-500">
                                             <span className="material-symbols-outlined text-[#4F46E5] text-sm">location_on</span> {event.location}
                                         </div>
                                     </div>

                                     <button className="mt-auto w-full py-2 bg-gray-50 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition">
                                         {event.category === 'Outreach' ? 'Volunteer' : 'View Details'}
                                     </button>
                                 </div>
                             </div>
                         ))}

                         {/* Host Event Card */}
                         <div className="bg-blue-50 dark:bg-slate-800/50 rounded-2xl p-8 border-2 border-dashed border-blue-200 dark:border-gray-700 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                             <div className="size-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-[#4F46E5] shadow-sm mb-4">
                                 <span className="material-symbols-outlined">calendar_add_on</span>
                             </div>
                             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Host an Event?</h3>
                             <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mb-6">Ministry leaders can submit event requests for approval directly through the portal.</p>
                             <button className="text-[#4F46E5] text-xs font-bold hover:underline">Submit Request</button>
                         </div>
                     </div>
                 </div>

                 {/* Pagination */}
                 <div className="flex justify-center mb-16">
                     <div className="flex gap-2">
                         <button className="size-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-400"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                         <button className="size-8 rounded-lg bg-[#4F46E5] text-white font-bold text-xs">1</button>
                         <button className="size-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 font-bold text-xs">2</button>
                         <button className="size-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 font-bold text-xs">3</button>
                         <span className="flex items-center text-gray-400 text-xs">...</span>
                         <button className="size-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                     </div>
                 </div>

                 {/* Newsletter Section Reused */}
                 <div className="bg-[#EFF6FF] dark:bg-slate-800/30 rounded-3xl p-10 md:p-16 text-center">
                     <div className="inline-flex size-12 bg-blue-100 text-[#4F46E5] rounded-xl items-center justify-center mb-6">
                         <span className="material-symbols-outlined text-2xl">mail</span>
                     </div>
                     <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Stay Connected</h2>
                     <p className="text-gray-500 text-sm mb-8 max-w-lg mx-auto">Subscribe to our weekly newsletter to get the latest updates on events, sermons, and community news delivered to your inbox.</p>
                     
                     <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                         <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                         <button className="px-6 py-3 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-bold rounded-lg text-sm shadow-md transition">Subscribe</button>
                     </div>
                     <p className="text-[10px] text-gray-400 mt-4">We respect your privacy. Unsubscribe at any time.</p>
                 </div>
             </div>
        </div>
    );
};
