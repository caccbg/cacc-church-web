
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sermon, UserRole, Announcement, BibleStudyProgress, CellGroup, VolunteerOpportunity, UserProfile, ChatContact, ChatMessage, AppNotification } from '../types';
import { generateText } from '../services/geminiService';
import { getPassage } from '../services/bibleService';
import BibleReader from '../components/BibleReader';

// --- MOCK DATA ---
const MOCK_SERMONS: Sermon[] = [
  { id: '1', title: 'Walking on Water', preacher: 'Pastor Sarah Jenkins', date: 'Oct 17, 2023', category: 'Faith Series', duration: '45:20', thumbnail: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2574&auto=format&fit=crop', description: 'Learning to step out in faith.', videoUrl: '', views: 3200 },
  { id: '2', title: 'Understanding Grace', preacher: 'Pastor John Doe', date: 'Oct 10, 2023', category: 'Faith Series', duration: '38:15', thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2670&auto=format&fit=crop', description: 'A deep dive into unmerited favor.', videoUrl: '', views: 2800 },
  { id: '3', title: 'Kingdom Finance', preacher: 'Bishop David', date: 'Oct 03, 2023', category: 'Finance', duration: '50:10', thumbnail: 'https://images.unsplash.com/photo-1621255776269-e0c158580552?q=80&w=2670&auto=format&fit=crop', description: 'Biblical principles of wealth.', videoUrl: '', views: 5100, progress: 75 },
  { id: '4', title: 'The Art of Prayer', preacher: 'Pastor Sarah Jenkins', date: 'Sep 24, 2023', category: 'Prayer', duration: '42:00', thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop', description: 'How to pray effectively.', videoUrl: '', views: 1500, progress: 30 },
];

const ANNOUNCEMENTS: Announcement[] = [
    { id: '1', title: 'Annual General Meeting', content: 'All members are requested to attend the AGM this Saturday.', date: 'Oct 25', type: 'general' },
    { id: '2', title: 'Change of Venue', content: 'The Youth service has moved to the Main Hall.', date: 'Oct 26', type: 'urgent' },
];

const BIBLE_STUDY: BibleStudyProgress = {
    currentBook: 'Romans',
    currentChapter: 8,
    totalChapters: 365,
    daysCompleted: 298,
    streak: 12
};

const CELL_GROUP: CellGroup = {
    name: 'Berean Family - Bungoma East',
    leader: 'Deacon Paul',
    location: 'Mama Sarah Residence, Marell',
    nextMeeting: 'Wednesday, 6:00 PM',
    assignment: 'Read Romans 12 and prepare to discuss "Living Sacrifice".'
};

const VOLUNTEER_OPS: VolunteerOpportunity[] = [
    { id: '1', role: 'Ushering Team', department: 'Hospitality', date: 'Sunday, Oct 29', spotsLeft: 2 },
    { id: '2', role: 'Camera Operator', department: 'Media', date: 'Sunday, Oct 29', spotsLeft: 1 },
];

const USER_DATA: UserProfile = {
  id: 'u1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+254 712 345 678',
  address: 'Kanduyi, Bungoma',
  avatar: 'https://i.pravatar.cc/150?u=john',
  bio: 'Ambassador for Christ. Member since 2021.',
  role: 'Member',
  joinDate: 'March 2021',
  cellGroup: 'Berean Family - Bungoma East',
  ministries: ['Worship Team'],
  badges: ['Tithe Faithful']
};

const MOCK_CONTACTS: ChatContact[] = [
  { id: 'c1', name: 'Berean Cell Group', avatar: 'https://ui-avatars.com/api/?name=Berean+Group&background=random', lastMessage: 'Deacon Paul: Don\'t forget the meeting tomorrow!', time: '10:30 AM', unread: 3, isGroup: true, online: false },
  { id: 'c2', name: 'Deacon Paul', avatar: 'https://i.pravatar.cc/150?u=paul', lastMessage: 'God bless you brother John.', time: 'Yesterday', unread: 0, isGroup: false, online: true },
];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', senderId: 'c2', text: 'Hello John, how is the family?', time: '10:00 AM', isMe: false },
  { id: 'm2', senderId: 'u1', text: 'We are doing well Deacon, thank you!', time: '10:05 AM', isMe: true },
];

const MOCK_NOTIFS: AppNotification[] = [
  { id: 'n1', title: 'New Sermon Available', message: 'Pastor John just uploaded "Walking in Divine Authority".', time: '2 mins ago', read: false, type: 'info' },
  { id: 'n2', title: 'Volunteer Reminder', message: 'You are scheduled for Ushering this Sunday.', time: '1 hour ago', read: false, type: 'warning' },
  { id: 'n3', title: 'Donation Received', message: 'Your tithe of KES 1,500 has been received.', time: 'Yesterday', read: true, type: 'success' },
];

const LIVE_CHAT_MESSAGES = [
  { id: 1, user: "Brother Mike", msg: "Amen! Such a powerful word.", color: "text-blue-500" },
  { id: 2, user: "Sister Jane", msg: "Greeting from Nairobi. Happy to join!", color: "text-red-500" },
];

// --- HELPER COMPONENTS ---

const DonationAlert: React.FC<{ onClose: () => void, projectName: string, amount: string }> = ({ onClose, projectName, amount }) => (
    <div className="fixed top-24 right-4 z-[60] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-l-4 border-green-500 p-4 animate-fade-in-left max-w-sm">
        <div className="flex justify-between items-start">
            <div className="flex gap-3">
                <div className="bg-green-100 text-green-600 rounded-full p-2 h-fit">
                    <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Donation Received!</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Someone just gave <span className="font-bold text-green-600">{amount}</span> to the <span className="font-bold">{projectName}</span>.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Just now</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined text-sm">close</span></button>
        </div>
    </div>
);

const NotificationPopup: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-16 right-0 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 animate-fade-in-up overflow-hidden">
       <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
          <button className="text-xs text-primary font-bold hover:underline">Mark all as read</button>
       </div>
       <div className="max-h-[400px] overflow-y-auto">
          {MOCK_NOTIFS.length > 0 ? (
            MOCK_NOTIFS.map(notif => (
              <div key={notif.id} className={`p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition cursor-pointer ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                 <div className="flex gap-3">
                    <div className={`size-2 rounded-full mt-2 shrink-0 ${notif.type === 'info' ? 'bg-blue-500' : notif.type === 'warning' ? 'bg-orange-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                       <h4 className={`text-sm font-bold mb-1 ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{notif.title}</h4>
                       <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">{notif.message}</p>
                       <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
                    </div>
                 </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">No new notifications</div>
          )}
       </div>
       <div className="p-2 text-center border-t border-gray-100 dark:border-gray-700">
          <button onClick={onClose} className="text-xs font-bold text-gray-500 hover:text-primary py-2 w-full">Close</button>
       </div>
    </div>
  );
};

const ChatSidebar: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState(MOCK_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, activeChatId]);

  const handleSend = () => {
    if(!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'u1',
      text: input,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isMe: true
    };
    setLocalMessages([...localMessages, newMsg]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
     <div className="fixed top-0 right-0 h-full w-[85vw] md:w-[25vw] min-w-[320px] bg-white dark:bg-slate-900 shadow-2xl z-[70] border-l border-gray-200 dark:border-gray-700 flex flex-col animate-fade-in-right">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-primary text-white">
           <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">forum</span>
              <h3 className="font-bold">Messages</h3>
           </div>
           <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition"><span className="material-symbols-outlined">close</span></button>
        </div>

        {activeChatId ? (
           <div className="flex-1 flex flex-col overflow-hidden">
               <div className="p-3 bg-gray-50 dark:bg-slate-950 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
                  <button onClick={() => setActiveChatId(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full"><span className="material-symbols-outlined">arrow_back</span></button>
                  <div className="flex items-center gap-2">
                     <div className="size-8 rounded-full bg-gray-300 overflow-hidden">
                        <img src={MOCK_CONTACTS.find(c => c.id === activeChatId)?.avatar} className="w-full h-full object-cover" />
                     </div>
                     <span className="font-bold text-sm text-slate-900 dark:text-white">{MOCK_CONTACTS.find(c => c.id === activeChatId)?.name}</span>
                  </div>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5] dark:bg-slate-900/50">
                  {localMessages.map(msg => (
                     <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-2 shadow-sm relative text-sm ${msg.isMe ? 'bg-[#d9fdd3] dark:bg-green-900 text-slate-900 dark:text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none'}`}>
                           {msg.text && <p>{msg.text}</p>}
                           <span className="text-[9px] text-gray-400 block text-right mt-1">{msg.time}</span>
                        </div>
                     </div>
                  ))}
                  <div ref={messagesEndRef} />
               </div>

               <div className="p-3 bg-gray-100 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                   <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 rounded-full border-none px-4 py-2 bg-white dark:bg-slate-800 text-sm focus:ring-1 focus:ring-primary dark:text-white"
                      placeholder="Type a message..."
                   />
                   <button onClick={handleSend} className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition"><span className="material-symbols-outlined text-xl ml-0.5">send</span></button>
               </div>
           </div>
        ) : (
           <div className="flex-1 overflow-y-auto">
               <div className="p-4">
                  <input type="text" placeholder="Search chats..." className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 border-none text-sm focus:ring-1 focus:ring-primary dark:text-white" />
               </div>
               <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {MOCK_CONTACTS.map(contact => (
                      <div key={contact.id} onClick={() => setActiveChatId(contact.id)} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer flex gap-3 transition">
                          <div className="relative">
                              <img src={contact.avatar} className="size-12 rounded-full object-cover" />
                              {contact.online && <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-1">
                                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{contact.name}</h4>
                                  <span className="text-[10px] text-gray-400">{contact.time}</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{contact.lastMessage}</p>
                          </div>
                          {contact.unread > 0 && (
                              <div className="flex items-center">
                                  <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{contact.unread}</span>
                              </div>
                          )}
                      </div>
                  ))}
               </div>
           </div>
        )}
     </div>
  );
};

interface MemberHeaderProps {
  notifications: number;
  onChatClick: () => void;
  onNotifClick: () => void;
  isNotifOpen: boolean;
  onNotifClose: () => void;
}

const MemberHeader: React.FC<MemberHeaderProps> = ({ notifications, onChatClick, onNotifClick, isNotifOpen, onNotifClose }) => {
  const navigate = useNavigate();
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative z-40">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="relative">
                <img src={USER_DATA.avatar} alt="Profile" className="size-14 rounded-full border-2 border-primary p-0.5" />
                <div className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{USER_DATA.firstName} {USER_DATA.lastName}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Member since {USER_DATA.joinDate.split(' ')[1]} • <span className="text-primary font-bold hover:underline">View Profile</span></p>
            </div>
        </div>

        <div className="flex items-center gap-3 relative">
            <button 
                onClick={onChatClick}
                className="relative p-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
                title="Messages"
            >
                <span className="material-symbols-outlined">mail</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative">
                <button 
                    onClick={onNotifClick}
                    className="relative p-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
                    title="Notifications"
                >
                    <span className="material-symbols-outlined">notifications</span>
                    {notifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900">{notifications}</span>
                    )}
                </button>
                <NotificationPopup isOpen={isNotifOpen} onClose={onNotifClose} />
            </div>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <Link to="/give" className="hidden sm:flex px-5 py-2.5 bg-accent-red hover:bg-red-700 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/20 gap-2 items-center">
                <span className="material-symbols-outlined text-lg">volunteer_activism</span> Give
            </Link>
        </div>
    </header>
  );
};

// --- PAGES ---

export const Dashboard: React.FC = () => {
  const [showDonation, setShowDonation] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  useEffect(() => {
      const timer = setTimeout(() => setShowDonation(true), 5000);
      return () => clearTimeout(timer);
  }, []);

  const continueWatching = MOCK_SERMONS.filter(s => s.progress);
  const trendingSermon = MOCK_SERMONS.reduce((prev, current) => (prev.views || 0) > (current.views || 0) ? prev : current);

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 animate-fade-in font-sans">
      {showDonation && <DonationAlert onClose={() => setShowDonation(false)} projectName="New Auditorium" amount="KES 1,500" />}

      <MemberHeader 
         notifications={MOCK_NOTIFS.filter(n => !n.read).length} 
         onChatClick={() => setIsChatOpen(!isChatOpen)} 
         onNotifClick={() => setIsNotifOpen(!isNotifOpen)}
         isNotifOpen={isNotifOpen}
         onNotifClose={() => setIsNotifOpen(false)}
      />

      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="flex flex-col xl:flex-row gap-8">
         <div className="flex-1 space-y-8 min-w-0">
            <section className="relative w-full h-[280px] rounded-3xl overflow-hidden shadow-xl group">
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1510915361408-d5965ce7f59b?q=80&w=2670&auto=format&fit=crop")'}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="animate-pulse size-2 bg-red-500 rounded-full"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-red-400">Live Service</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black mb-4 max-w-lg">Walking in Divine Authority</h2>
                    <p className="text-blue-100 mb-6 max-w-md line-clamp-2">Join Pastor John as he expounds on the authority given to believers.</p>
                    <div className="flex gap-4">
                        <Link to="/live" className="px-6 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition flex items-center gap-2">
                            <span className="material-symbols-outlined filled">play_arrow</span> Watch Now
                        </Link>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="material-symbols-outlined text-8xl">menu_book</span>
                    </div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">book_2</span> Bible Study Plan
                        </h3>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">Day {BIBLE_STUDY.daysCompleted}</span>
                    </div>
                    <div className="mb-4 relative z-10">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Reading</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{BIBLE_STUDY.currentBook} {BIBLE_STUDY.currentChapter}</p>
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-gray-400">Year Progress</span>
                            <span className="text-primary">{Math.round((BIBLE_STUDY.daysCompleted / BIBLE_STUDY.totalChapters) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                            <div className="bg-primary h-2.5 rounded-full transition-all duration-1000" style={{width: `${(BIBLE_STUDY.daysCompleted / BIBLE_STUDY.totalChapters) * 100}%`}}></div>
                        </div>
                        <button className="w-full py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition">Continue Reading</button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-8xl">groups</span>
                    </div>
                    <div className="relative z-10">
                         <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                             <span className="material-symbols-outlined">diversity_3</span> My Cell Group
                         </h3>
                         <p className="text-indigo-200 text-sm font-bold mb-6">{CELL_GROUP.name}</p>
                         
                         <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/10">
                             <div className="flex items-start gap-3">
                                 <span className="material-symbols-outlined text-yellow-400 mt-0.5">assignment</span>
                                 <div>
                                     <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">This Week's Task</p>
                                     <p className="text-sm font-medium leading-snug">{CELL_GROUP.assignment}</p>
                                 </div>
                             </div>
                         </div>
                         
                         <div className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-2">
                                 <span className="material-symbols-outlined text-lg opacity-80">event</span>
                                 <span>{CELL_GROUP.nextMeeting}</span>
                             </div>
                             <button className="px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded shadow hover:bg-gray-100">Details</button>
                         </div>
                    </div>
                </div>
            </div>
         </div>

         <div className="xl:w-[380px] shrink-0 space-y-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-red/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Kingdom Builders</h3>
                <p className="text-xs text-gray-500 mb-6">Featured Project: New Auditorium</p>
                
                <div className="flex justify-center mb-6">
                    <div className="relative size-40">
                        <svg className="size-full" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FF0000" strokeWidth="3" strokeDasharray="65, 100" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">65%</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Raised</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-between text-sm mb-4">
                    <div>
                        <p className="text-gray-400 text-xs">Raised</p>
                        <p className="font-bold text-slate-900 dark:text-white">KES 650k</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400 text-xs">Goal</p>
                        <p className="font-bold text-slate-900 dark:text-white">KES 1M</p>
                    </div>
                </div>
                <Link to="/give" className="block w-full py-3 bg-accent-red hover:bg-red-700 text-white font-bold text-center rounded-xl shadow-lg shadow-red-500/30 transition">Donate Now</Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {[
                    { icon: 'favorite', label: 'Give', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', link: '/give' },
                    { icon: 'front_hand', label: 'Prayer', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', link: '/prayer' },
                    { icon: 'chat', label: 'Messages', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', onclick: () => setIsChatOpen(true) },
                    { icon: 'person', label: 'Profile', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', link: '/profile' },
                ].map((action, idx) => (
                    action.link ? (
                        <Link to={action.link} key={idx} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition shadow-sm group">
                            <div className={`p-2 rounded-lg mb-2 ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-xl">{action.icon}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-gray-300">{action.label}</span>
                        </Link>
                    ) : (
                        <button onClick={action.onclick} key={idx} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition shadow-sm group">
                             <div className={`p-2 rounded-lg mb-2 ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-xl">{action.icon}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-gray-300">{action.label}</span>
                        </button>
                    )
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export const MemberProfile: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(USER_DATA);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, avatar: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 animate-fade-in font-sans">
        <MemberHeader 
            notifications={3} 
            onChatClick={() => setIsChatOpen(!isChatOpen)} 
            onNotifClick={() => setIsNotifOpen(!isNotifOpen)}
            isNotifOpen={isNotifOpen}
            onNotifClose={() => setIsNotifOpen(false)}
        />
        <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary to-blue-600"></div>
                    <div className="relative mt-8 mb-4">
                        <img src={formData.avatar} className="size-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg mx-auto object-cover" />
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-1/2 translate-x-12 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition shadow-md"
                            title="Upload Photo"
                        >
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                        </button>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{formData.firstName} {formData.lastName}</h2>
                    <p className="text-primary font-bold text-sm mb-4">{formData.role}</p>
                    
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {formData.badges.map((badge, i) => (
                            <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-200">
                                {badge}
                            </span>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6 text-left space-y-4">
                         <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                             <span className="material-symbols-outlined text-gray-400">mail</span>
                             <span className="text-sm">{formData.email}</span>
                         </div>
                         <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                             <span className="material-symbols-outlined text-gray-400">call</span>
                             <span className="text-sm">{formData.phone}</span>
                         </div>
                         <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                             <span className="material-symbols-outlined text-gray-400">location_on</span>
                             <span className="text-sm">{formData.address}</span>
                         </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white">Personal Information</h3>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                                <span className="material-symbols-outlined text-sm">edit</span> Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(false)} className="text-gray-500 font-bold text-sm hover:underline">Cancel</button>
                                <button onClick={handleSave} className="text-green-600 font-bold text-sm hover:underline">Save</button>
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">First Name</label>
                            <input 
                                disabled={!isEditing}
                                value={formData.firstName}
                                onChange={e => setFormData({...formData, firstName: e.target.value})}
                                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 disabled:opacity-70 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Last Name</label>
                            <input 
                                disabled={!isEditing}
                                value={formData.lastName}
                                onChange={e => setFormData({...formData, lastName: e.target.value})}
                                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 disabled:opacity-70 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export const Giving: React.FC = () => {
    const [amount, setAmount] = useState('1500');
    const [selectedFund, setSelectedFund] = useState('Tithe');
    const [method, setMethod] = useState('mpesa');

    const funds = [
        { id: 'Tithe', label: 'Tithe', desc: '10% of income', icon: 'percent' },
        { id: 'Offering', label: 'Offering', desc: 'General giving', icon: 'volunteer_activism' },
        { id: 'Building', label: 'Building', desc: 'Church expansion', icon: 'church' },
        { id: 'First Fruits', label: 'First Fruits', desc: 'New year blessing', icon: 'spa' }
    ];

    return (
        <div className="bg-[#F8F9FC] dark:bg-slate-950 min-h-screen py-12 px-4 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Page Title */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Giving & Offerings</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Honor the Lord with your substance.</p>
                </div>

                {/* Quote Block */}
                <div className="bg-[#EBF5FF] dark:bg-blue-900/10 rounded-2xl p-8 mb-12 relative border border-blue-50 dark:border-blue-900/20 text-center">
                     <span className="material-symbols-outlined text-blue-300 dark:text-blue-800 absolute top-4 left-6 text-4xl select-none filled">format_quote</span>
                     <p className="text-primary dark:text-blue-300 font-bold italic leading-relaxed max-w-2xl mx-auto">
                        "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                     </p>
                     <p className="text-primary dark:text-blue-400 text-xs font-bold mt-4 uppercase tracking-[0.2em]">— 2 CORINTHIANS 9:7</p>
                </div>

                {/* Main Giving Form Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    
                    {/* Multi-Step Indicator */}
                    <div className="bg-gray-50 dark:bg-slate-800/50 px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-center">
                        <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase">
                            <div className="flex items-center gap-2 text-green-500">
                                <div className="size-6 rounded-full bg-green-100 flex items-center justify-center"><span className="material-symbols-outlined text-sm">check</span></div>
                                <span>Purpose</span>
                            </div>
                            <div className="h-px w-20 bg-gray-200 dark:bg-gray-700"></div>
                            <div className="flex items-center gap-2 text-primary dark:text-blue-400">
                                <div className="size-7 rounded-full bg-primary dark:bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">2</div>
                                <span>Details</span>
                            </div>
                            <div className="h-px w-20 bg-gray-200 dark:bg-gray-700"></div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <div className="size-7 rounded-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">3</div>
                                <span>Confirm</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Left Content: Form Sections */}
                            <div className="flex-1 space-y-12">
                                
                                {/* 1. Select Fund */}
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="size-6 rounded bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-400 flex items-center justify-center text-xs font-bold shadow-sm">1</span>
                                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Select Fund</h3>
                                        </div>
                                        <button className="text-[10px] font-bold text-gray-400 hover:text-primary underline uppercase tracking-widest">What are these?</button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {funds.map(fund => (
                                            <button 
                                                key={fund.id}
                                                onClick={() => setSelectedFund(fund.id)}
                                                className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center h-36 ${selectedFund === fund.id ? 'border-primary dark:border-blue-500 bg-blue-50/30 dark:bg-blue-900/10' : 'border-gray-50 dark:border-gray-800 hover:border-gray-100 dark:hover:border-gray-700 bg-white dark:bg-slate-800'}`}
                                            >
                                                {selectedFund === fund.id && (
                                                    <div className="absolute top-3 right-3 size-5 rounded-full bg-primary dark:bg-blue-600 text-white flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[14px] filled">check</span>
                                                    </div>
                                                )}
                                                <span className={`material-symbols-outlined text-3xl mb-4 ${selectedFund === fund.id ? 'text-primary dark:text-blue-400' : 'text-gray-400'}`}>{fund.icon}</span>
                                                <p className={`font-black text-xs mb-1 ${selectedFund === fund.id ? 'text-slate-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{fund.label}</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight line-clamp-1">{fund.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Your Gift */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="size-6 rounded bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-400 flex items-center justify-center text-xs font-bold shadow-sm">2</span>
                                        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Your Gift</h3>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Amount (KES)</p>
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="flex-1 w-full relative">
                                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                                <span className="text-gray-400 font-black text-lg">KES</span>
                                            </div>
                                            <input 
                                                type="text" 
                                                value={amount}
                                                onChange={e => setAmount(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl py-6 pl-16 pr-6 text-3xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-primary shadow-inner"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                                            {['500', '1500', '5000', '10,000'].map(val => (
                                                <button 
                                                    key={val} 
                                                    onClick={() => setAmount(val.replace(',', ''))}
                                                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${amount === val.replace(',', '') ? 'bg-primary dark:bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200'}`}
                                                >
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Payment Method */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="size-6 rounded bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-400 flex items-center justify-center text-xs font-bold shadow-sm">3</span>
                                        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Payment Method</h3>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-800/50 p-1.5 rounded-2xl flex gap-2 mb-8 w-fit shadow-inner">
                                        {[
                                            { id: 'mpesa', label: 'M-PESA', icon: 'smartphone' },
                                            { id: 'card', label: 'Card', icon: 'credit_card' },
                                            { id: 'bank', label: 'Bank', icon: 'account_balance' }
                                        ].map(m => (
                                            <button 
                                                key={m.id}
                                                onClick={() => setMethod(m.id)}
                                                className={`px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2.5 transition-all ${method === m.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                <span className={`material-symbols-outlined text-[18px] ${method === m.id ? 'filled text-primary' : ''}`}>{m.icon}</span> {m.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* M-PESA Specific Content */}
                                    {method === 'mpesa' && (
                                        <div className="bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-10 items-center">
                                            <div className="flex-1 w-full space-y-5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">M-PESA Phone Number</label>
                                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                        <span className="material-symbols-outlined text-[12px] filled">bolt</span> INSTANT
                                                    </span>
                                                </div>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">call</span>
                                                    <input 
                                                        type="text" 
                                                        placeholder="07XX XXX XXX" 
                                                        className="w-full bg-white dark:bg-slate-900 border-gray-100 dark:border-gray-700 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-sm"
                                                    />
                                                </div>
                                                <div className="flex gap-4 p-1">
                                                    <div className="size-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                                        <span className="material-symbols-outlined text-[14px] filled">info</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 leading-relaxed font-medium italic">
                                                        You will receive an STK push on your phone. Please unlock your device and enter your M-PESA PIN to complete the transaction.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center space-y-5 py-6 md:border-l border-gray-100 dark:border-gray-800">
                                                <div className="size-20 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border border-gray-50 dark:border-gray-700 animate-bounce">
                                                     <span className="material-symbols-outlined text-gray-300 text-4xl">tap_and_play</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800 dark:text-white">Check your phone</p>
                                                    <p className="text-[10px] text-gray-400 mt-2 max-w-[140px] mx-auto leading-relaxed">A prompt will appear shortly after you click Give Now</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Sidebar: Donor Info */}
                            <div className="lg:w-[300px] space-y-8">
                                <div className="bg-[#F0F7FF] dark:bg-blue-900/10 rounded-[2.5rem] p-8 border border-blue-50 dark:border-blue-900/20 shadow-sm">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-8">Donor Info</p>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="size-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary dark:text-blue-400 font-black shadow-lg border border-blue-50 dark:border-blue-900/20 text-xl">
                                            JD
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white">John Doe</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Member #4023</p>
                                        </div>
                                    </div>
                                    <button className="text-[10px] font-black text-primary dark:text-blue-400 hover:underline uppercase tracking-widest transition-colors">Not you? Switch account</button>
                                </div>
                                
                                <div className="px-6 py-4">
                                     <div className="flex items-start gap-4">
                                         <div className="size-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-300 shrink-0">
                                            <span className="material-symbols-outlined">security</span>
                                         </div>
                                         <div>
                                             <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">Secure Transfer</p>
                                             <p className="text-[9px] text-gray-400 font-medium leading-relaxed">Your payment information is encrypted and never stored on our servers.</p>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 md:px-12 py-10 bg-gray-50/50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
                        <button className="text-sm font-black text-gray-400 hover:text-slate-600 transition-colors uppercase tracking-widest">Cancel</button>
                        <div className="flex flex-col md:flex-row items-center gap-10 w-full md:w-auto">
                            <div className="flex items-center gap-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span className="material-symbols-outlined text-[18px]">lock</span> SSL Secure Payment
                            </div>
                            <button className="w-full md:w-auto px-12 py-5 bg-primary dark:bg-blue-600 hover:bg-primary-dark text-white font-black rounded-2xl shadow-2xl shadow-blue-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-4 text-sm group">
                                Give KES {Number(amount).toLocaleString()} <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export const PrayerRequest: React.FC = () => {
    return (
        <div className="bg-gray-50 dark:bg-slate-900 min-h-screen py-12 px-4 font-sans">
            <div className="max-w-2xl mx-auto">
                 <div className="text-center mb-12">
                     <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Prayer Request</h1>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                     <form className="space-y-6">
                         <button type="submit" className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg">
                             Submit Request
                         </button>
                     </form>
                 </div>
            </div>
        </div>
    );
};

export const Sermons: React.FC = () => {
    return (
        <div className="bg-gray-50 dark:bg-slate-950 min-h-screen py-12 px-4 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Sermon Library</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {MOCK_SERMONS.map(sermon => (
                        <div key={sermon.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-xl transition-all">
                            <img src={sermon.thumbnail} alt={sermon.title} className="w-full aspect-video object-cover" />
                            <div className="p-5">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition">{sermon.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{sermon.preacher}</p>
                                <button className="w-full py-2 bg-gray-50 dark:bg-slate-700 text-slate-700 dark:text-gray-200 text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition">Watch Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const LiveStream: React.FC<{ role: UserRole }> = ({ role }) => {
    const [activeTab, setActiveTab] = useState<'bible' | 'chat' | 'notes'>('chat');
    const [chatInput, setChatInput] = useState('');
    const [hearts, setHearts] = useState(128);

    const handleSendHeart = () => {
      setHearts(prev => prev + 1);
    };

    return (
        <div className="bg-background-off dark:bg-background-dark min-h-screen font-sans flex flex-col">
            <section className="bg-primary dark:bg-slate-900 pt-32 pb-48 px-4 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 size-64 bg-white rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 right-10 size-96 bg-red-600 rounded-full blur-[120px]"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="bg-accent-red px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block animate-pulse">
                         LIVE STREAMING
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">Join Our Worship Service</h1>
                    <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90 leading-relaxed italic">
                        "O worship the Lord in the beauty of holiness: fear before him, all the earth." — Psalm 96:9
                    </p>
                </div>
            </section>

            <section className="px-4 md:px-8 -mt-32 relative z-20 pb-20">
                <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Video Section */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative border-8 border-white dark:border-slate-800">
                            <img 
                                src="https://images.unsplash.com/photo-1510915361408-d5965ce7f59b?q=80&w=2670&auto=format&fit=crop" 
                                className="w-full h-full object-cover opacity-60" 
                                alt="Live Stream" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            
                            {/* Overlay Controls UI */}
                            <div className="absolute top-8 left-8 flex items-center gap-4">
                                <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                                    <span className="size-1.5 bg-white rounded-full animate-ping"></span> LIVE
                                </div>
                                <div className="bg-black/40 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg border border-white/10">
                                    <span className="material-symbols-outlined text-[16px] filled">visibility</span> 1,248 WATCHING
                                </div>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="size-24 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 transition group">
                                    <span className="material-symbols-outlined text-5xl filled ml-1 group-hover:scale-110 transition">play_arrow</span>
                                </button>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-white">
                                <div className="flex items-center gap-4">
                                    <button className="p-2 hover:bg-white/20 rounded-full transition"><span className="material-symbols-outlined filled">volume_up</span></button>
                                    <div className="h-1.5 w-32 bg-white/20 rounded-full overflow-hidden hidden sm:block">
                                        <div className="h-full bg-white w-[70%] rounded-full shadow-[0_0_8px_white]"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="p-2 hover:bg-white/20 rounded-full transition"><span className="material-symbols-outlined">settings</span></button>
                                    <button className="p-2 hover:bg-white/20 rounded-full transition"><span className="material-symbols-outlined">fullscreen</span></button>
                                </div>
                            </div>
                        </div>

                        {/* Video Metadata */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 text-primary dark:text-blue-400 font-black text-xs uppercase tracking-widest mb-4">
                                    <span>Sunday Celebration</span>
                                    <span className="size-1 bg-gray-300 rounded-full"></span>
                                    <span className="text-gray-400">May 24, 2024</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Walking in Divine Authority</h1>
                                <div className="flex items-center gap-4 mb-8">
                                    <img src="https://i.pravatar.cc/150?u=pastor_john" className="size-12 rounded-full border-2 border-primary p-0.5" />
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">Pastor John Doe</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Senior Pastor</p>
                                    </div>
                                </div>
                                <div className="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                    <p>Join us for our Sunday service as we dive deep into the Word of God. Today, Pastor John explores the concept of spiritual authority and how it applies to our daily walk with Christ.</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                                <div className="flex gap-2">
                                    <button onClick={handleSendHeart} className="flex-1 md:flex-none px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 transition shadow-sm">
                                        <span className="material-symbols-outlined text-lg filled">favorite</span> {hearts}
                                    </button>
                                    <button className="flex-1 md:flex-none px-6 py-3 bg-blue-50 dark:bg-blue-900/10 text-primary dark:text-blue-400 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-100 transition shadow-sm">
                                        <span className="material-symbols-outlined text-lg">share</span> SHARE
                                    </button>
                                </div>
                                <button className="w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">volunteer_activism</span> SUPPORT MINISTRY
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 flex flex-col gap-8 h-[calc(100vh-200px)] sticky top-24">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col flex-1">
                            {/* Tabs */}
                            <div className="flex bg-gray-50 dark:bg-slate-900/50 p-2 border-b border-gray-100 dark:border-gray-700">
                                {['Bible', 'Chat', 'Notes'].map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase() as any)}
                                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.toLowerCase() ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-hidden relative">
                                {activeTab === 'bible' && (
                                    <div className="h-full overflow-y-auto no-scrollbar">
                                        <BibleReader />
                                    </div>
                                )}

                                {activeTab === 'chat' && (
                                    <div className="h-full flex flex-col bg-[#F0F2F5] dark:bg-slate-900/50">
                                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                            {LIVE_CHAT_MESSAGES.map(m => (
                                                <div key={m.id} className="flex gap-3 items-start animate-fade-in-up">
                                                    <div className="size-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-xs font-black shadow-sm shrink-0 uppercase border border-gray-100 dark:border-gray-600">
                                                        {m.user[0]}
                                                    </div>
                                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700">
                                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${m.color}`}>{m.user}</p>
                                                        <p className="text-xs text-slate-700 dark:text-gray-300 font-medium">{m.msg}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="text-center py-4">
                                                <span className="bg-gray-200 dark:bg-slate-700 text-[9px] font-bold text-gray-500 dark:text-gray-400 px-2 py-1 rounded uppercase tracking-tighter">Welcome to Live Chat</span>
                                            </div>
                                        </div>
                                        {/* Chat Input */}
                                        <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-gray-700">
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="text" 
                                                    value={chatInput}
                                                    onChange={e => setChatInput(e.target.value)}
                                                    placeholder="Say something nice..." 
                                                    className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-2xl py-3 pl-4 pr-12 text-xs font-bold focus:ring-1 focus:ring-primary shadow-inner dark:text-white"
                                                />
                                                <button className="absolute right-2 p-1.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition shadow-md">
                                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notes' && (
                                    <div className="h-full flex flex-col p-6 space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Sermon Notes</h3>
                                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Download PDF</button>
                                        </div>
                                        <textarea 
                                            placeholder="Write down what God is speaking to your heart..." 
                                            className="flex-1 w-full bg-gray-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-medium leading-relaxed focus:ring-1 focus:ring-primary shadow-inner dark:text-white resize-none"
                                        />
                                        <button className="w-full py-3 bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-gray-300 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-gray-200 transition">Save to My Profile</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Join Us Ad Card */}
                        <div className="bg-gradient-to-br from-[#00008B] to-blue-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                <span className="material-symbols-outlined text-8xl">home</span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-2">Visit Us In-Person</h3>
                                <p className="text-blue-100 text-xs font-medium mb-6 leading-relaxed opacity-80">We'd love to see you this Sunday at our main campus in Bungoma!</p>
                                <button className="bg-white text-primary px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition transform">Plan Your Visit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
