

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
  firstName: 'Sarah',
  lastName: 'Jenkins',
  email: 'sarah.jenkins@example.com',
  phone: '+254 712 345 678',
  address: 'Kanduyi, Bungoma',
  avatar: 'https://i.pravatar.cc/150?u=sarah',
  bio: 'Lover of God. Passionate about worship and community service.',
  role: 'Member',
  joinDate: 'March 2021',
  cellGroup: 'Berean Family - Bungoma East',
  ministries: ['Worship Team', 'Hospitality'],
  badges: ['Tithe Faithful', 'Volunteer Star', 'Bible Scholar']
};

const MOCK_CONTACTS: ChatContact[] = [
  { id: 'c1', name: 'Berean Cell Group', avatar: 'https://ui-avatars.com/api/?name=Berean+Group&background=random', lastMessage: 'Deacon Paul: Don\'t forget the meeting tomorrow!', time: '10:30 AM', unread: 3, isGroup: true, online: false },
  { id: 'c2', name: 'Deacon Paul', avatar: 'https://i.pravatar.cc/150?u=paul', lastMessage: 'God bless you sister Sarah.', time: 'Yesterday', unread: 0, isGroup: false, online: true },
  { id: 'c3', name: 'Mary Kate', avatar: 'https://i.pravatar.cc/150?u=mary', lastMessage: 'Are you coming for practice?', time: 'Yesterday', unread: 1, isGroup: false, online: false },
];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', senderId: 'c2', text: 'Hello Sarah, how is the family?', time: '10:00 AM', isMe: false },
  { id: 'm2', senderId: 'u1', text: 'We are doing well Deacon, thank you for asking!', time: '10:05 AM', isMe: true },
  { id: 'm3', senderId: 'c2', text: 'Great to hear. See you at cell group.', time: '10:10 AM', isMe: false },
];

const MOCK_NOTIFS: AppNotification[] = [
  { id: 'n1', title: 'New Sermon Available', message: 'Pastor John just uploaded "Walking in Divine Authority".', time: '2 mins ago', read: false, type: 'info' },
  { id: 'n2', title: 'Volunteer Reminder', message: 'You are scheduled for Ushering this Sunday.', time: '1 hour ago', read: false, type: 'warning' },
  { id: 'n3', title: 'Donation Received', message: 'Your tithe of KES 5,000 has been received.', time: 'Yesterday', read: true, type: 'success' },
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

const RichMessageText: React.FC<{ text: string, isMe: boolean }> = ({ text, isMe }) => {
    const [popup, setPopup] = useState<{x: number, y: number, content: string, title: string} | null>(null);
    const [loadingRef, setLoadingRef] = useState<string | null>(null);

    const parts = [];
    let lastIndex = 0;
    let match;
    // Regex matches formats like "John 3:16", "1 Peter 5:7", "Genesis 1:1-5"
    const regex = /\b((?:[123]\s)?[A-Z][a-z]+)\s+(\d+:\d+(?:-\d+)?)\b/g;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        const book = match[1];
        const verse = match[2];
        const fullRef = `${book} ${verse}`;
        
        parts.push(
            <button 
                key={match.index}
                onClick={async (e) => {
                    e.stopPropagation();
                    if (popup && popup.title === fullRef) {
                        setPopup(null);
                        return;
                    }
                    
                    setLoadingRef(fullRef);
                    const rect = e.currentTarget.getBoundingClientRect();
                    try {
                        // Cast verse to any because getPassage API implementation supports "chapter:verse" string
                        const data = await getPassage(book, verse as any);
                        setPopup({
                            x: rect.left,
                            y: rect.top,
                            title: data.reference,
                            content: data.text
                        });
                    } catch (err) {
                        console.error("Failed to load verse", err);
                    } finally {
                        setLoadingRef(null);
                    }
                }}
                className={`font-bold underline decoration-dotted hover:decoration-solid inline-flex items-center gap-0.5 mx-0.5 ${isMe ? 'text-white' : 'text-primary dark:text-blue-400'} ${loadingRef === fullRef ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
            >
                {fullRef} 
                {loadingRef === fullRef && <span className="size-2 border-2 border-current border-t-transparent rounded-full animate-spin"></span>}
            </button>
        );
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return (
        <>
            <p>{parts}</p>
            {popup && (
                <div 
                    className="fixed z-[150] bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-64 md:w-72 animate-fade-in-up"
                    style={{ top: popup.y - 12, left: Math.min(popup.x, window.innerWidth - 300), transform: 'translateY(-100%)' }}
                >
                    <div className="flex justify-between items-start mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                        <h4 className="font-bold text-sm text-primary dark:text-blue-400 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">menu_book</span> {popup.title}
                        </h4>
                        <button onClick={() => setPopup(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed font-serif">
                        "{popup.content.replace(/\n/g, ' ')}"
                    </p>
                    {/* Tooltip Arrow */}
                    <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-white dark:bg-slate-800 border-b border-r border-gray-200 dark:border-gray-700 transform rotate-45"></div>
                </div>
            )}
        </>
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

  const handleAttach = () => {
     const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'u1',
      text: '',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isMe: true,
      attachment: { type: 'image', url: 'https://source.unsplash.com/random/300x200', name: 'shared_photo.jpg' }
    };
    setLocalMessages([...localMessages, newMsg]);
  };

  if (!isOpen) return null;

  return (
     <div className="fixed top-0 right-0 h-full w-[85vw] md:w-[25vw] min-w-[320px] bg-white dark:bg-slate-900 shadow-2xl z-[70] border-l border-gray-200 dark:border-gray-700 flex flex-col animate-fade-in-right">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-primary text-white">
           <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">forum</span>
              <h3 className="font-bold">Messages</h3>
           </div>
           <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition"><span className="material-symbols-outlined">close</span></button>
        </div>

        {activeChatId ? (
           // Chat View
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
                           {msg.attachment && (
                              <div className="mb-2 rounded overflow-hidden">
                                 <img src="https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2670&auto=format&fit=crop" className="w-full h-32 object-cover" alt="Attachment" />
                                 <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">attachment</span> {msg.attachment.name}</div>
                              </div>
                           )}
                           {msg.text && <p>{msg.text}</p>}
                           <span className="text-[9px] text-gray-400 block text-right mt-1">{msg.time}</span>
                        </div>
                     </div>
                  ))}
                  <div ref={messagesEndRef} />
               </div>

               <div className="p-3 bg-gray-100 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                   <button onClick={handleAttach} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-white transition"><span className="material-symbols-outlined text-xl">attach_file</span></button>
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
           // Contact List
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

export const MemberProfile: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(USER_DATA);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
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
            {/* Profile Sidebar */}
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

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">diversity_3</span> Cell Group
                    </h3>
                    <p className="font-bold text-lg mb-1">{formData.cellGroup}</p>
                    <p className="text-indigo-200 text-sm mb-6">Leader: {CELL_GROUP.leader}</p>
                    <button onClick={() => setIsChatOpen(true)} className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">forum</span> Chat with Group
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
                {/* Personal Info Form */}
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
                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bio</label>
                             <textarea 
                                disabled={!isEditing}
                                value={formData.bio}
                                onChange={e => setFormData({...formData, bio: e.target.value})}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 disabled:opacity-70 dark:text-white"
                             />
                        </div>
                    </div>
                </div>

                {/* Ministry Involvement */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6">Ministry Involvement</h3>
                    <div className="flex flex-wrap gap-4">
                        {formData.ministries.map((min, i) => (
                             <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-gray-700">
                                 <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                     <span className="material-symbols-outlined">volunteer_activism</span>
                                 </div>
                                 <span className="font-bold text-slate-800 dark:text-white">{min}</span>
                             </div>
                        ))}
                        <button className="flex items-center gap-2 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:border-primary hover:text-primary transition font-bold">
                             <span className="material-symbols-outlined">add</span> Join New Ministry
                        </button>
                    </div>
                </div>

                {/* Settings & Preferences */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6">Account Settings</h3>
                    <div className="space-y-4">
                         <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                             <div className="flex items-center gap-3">
                                 <span className="material-symbols-outlined text-gray-500">notifications</span>
                                 <span className="font-bold text-slate-700 dark:text-gray-200">Email Notifications</span>
                             </div>
                             <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-green-400" />
                                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer checked:bg-green-400"></label>
                            </div>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                             <div className="flex items-center gap-3">
                                 <span className="material-symbols-outlined text-gray-500">lock</span>
                                 <span className="font-bold text-slate-700 dark:text-gray-200">Change Password</span>
                             </div>
                             <button className="text-primary font-bold text-sm">Update</button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDonation, setShowDonation] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Simulate a donation coming in
  useEffect(() => {
      const timer = setTimeout(() => setShowDonation(true), 5000);
      return () => clearTimeout(timer);
  }, []);

  const continueWatching = MOCK_SERMONS.filter(s => s.progress);
  const trendingSermon = MOCK_SERMONS.reduce((prev, current) => (prev.views || 0) > (current.views || 0) ? prev : current);

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 animate-fade-in font-sans">
      {showDonation && <DonationAlert onClose={() => setShowDonation(false)} projectName="New Auditorium" amount="KES 5,000" />}

      {/* Reusable Header */}
      <MemberHeader 
         notifications={MOCK_NOTIFS.filter(n => !n.read).length} 
         onChatClick={() => setIsChatOpen(!isChatOpen)} 
         onNotifClick={() => setIsNotifOpen(!isNotifOpen)}
         isNotifOpen={isNotifOpen}
         onNotifClose={() => setIsNotifOpen(false)}
      />

      {/* Drawers */}
      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="flex flex-col xl:flex-row gap-8">
         {/* LEFT COLUMN (MAIN CONTENT) */}
         <div className="flex-1 space-y-8 min-w-0">
            
            {/* Live Now Hero */}
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

            {/* Bible Study & Cell Group Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bible Study Tracker */}
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

                {/* Cell Group Hub */}
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

            {/* Continue Watching & Announcements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Sermon Sliders (Col 1 & 2) */}
                 <div className="md:col-span-2 space-y-6">
                     {/* Recently Viewed */}
                     {continueWatching.length > 0 && (
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                             <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                 <span className="material-symbols-outlined text-orange-500">history</span> Continue Watching
                             </h3>
                             <div className="space-y-4">
                                 {continueWatching.map(s => (
                                     <div key={s.id} className="flex gap-4 group cursor-pointer">
                                         <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0">
                                             <img src={s.thumbnail} className="w-full h-full object-cover" />
                                             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                 <span className="material-symbols-outlined text-white">play_circle</span>
                                             </div>
                                             <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                                                 <div className="h-full bg-red-500" style={{width: `${s.progress}%`}}></div>
                                             </div>
                                         </div>
                                         <div>
                                             <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary transition">{s.title}</h4>
                                             <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{s.preacher}</p>
                                             <p className="text-[10px] font-bold text-orange-500">{s.progress}% Completed</p>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     )}

                     {/* Most Watched */}
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                         <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                 <span className="material-symbols-outlined text-red-500">trending_up</span> Trending Now
                             </h3>
                         </div>
                         <div className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
                             <img src={trendingSermon.thumbnail} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                             <div className="absolute bottom-4 left-4 text-white">
                                 <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded inline-block mb-2">Most Watched</div>
                                 <h4 className="font-bold text-lg">{trendingSermon.title}</h4>
                                 <p className="text-xs text-gray-300">{trendingSermon.views?.toLocaleString()} Views</p>
                             </div>
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                 <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30">
                                     <span className="material-symbols-outlined text-white text-3xl filled">play_arrow</span>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Internal Announcements (Col 3) */}
                 <div className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-900/30">
                     <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                         <span className="material-symbols-outlined text-yellow-600">campaign</span> Church News
                     </h3>
                     <div className="space-y-4">
                         {ANNOUNCEMENTS.map(ann => (
                             <div key={ann.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                 <div className="flex justify-between items-start mb-2">
                                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${ann.type === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{ann.type}</span>
                                     <span className="text-[10px] text-gray-400 font-bold">{ann.date}</span>
                                 </div>
                                 <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{ann.title}</h4>
                                 <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{ann.content}</p>
                             </div>
                         ))}
                     </div>
                 </div>
            </div>
            
            {/* Volunteer Opportunities */}
            <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                         <span className="material-symbols-outlined text-green-600">volunteer_activism</span> Volunteer to Serve
                     </h3>
                     <button className="text-primary text-sm font-bold hover:underline">View All</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {VOLUNTEER_OPS.map(vol => (
                         <div key={vol.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex justify-between items-center hover:border-primary transition group">
                             <div>
                                 <h4 className="font-bold text-slate-900 dark:text-white">{vol.role}</h4>
                                 <p className="text-xs text-gray-500">{vol.department} • {vol.date}</p>
                                 <p className="text-xs font-bold text-green-600 mt-1">{vol.spotsLeft} spots left</p>
                             </div>
                             <button className="px-4 py-2 bg-gray-50 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold rounded-lg group-hover:bg-primary group-hover:text-white transition">Sign Up</button>
                         </div>
                     ))}
                 </div>
            </section>
         </div>

         {/* RIGHT COLUMN (SIDEBAR) */}
         <div className="xl:w-[380px] shrink-0 space-y-8">
            
            {/* Fundraising Widget */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-red/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Kingdom Builders</h3>
                <p className="text-xs text-gray-500 mb-6">Featured Project: New Auditorium</p>
                
                <div className="flex justify-center mb-6">
                    <div className="relative size-40">
                        <svg className="size-full" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FF0000" strokeWidth="3" strokeDasharray="65, 100" className="animate-[spin_1s_ease-out_reverse]" />
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

            {/* Quick Actions Grid (Moved to Sidebar for cleaner layout) */}
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

            {/* Upcoming Events List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                     <span className="material-symbols-outlined text-blue-600">calendar_month</span> Events
                  </h3>
                  <Link to="/events" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
               </div>
               
               <div className="space-y-6">
                  {[
                     { d: '27', m: 'OCT', title: 'Worship Night', time: '7:00 PM' },
                     { d: '30', m: 'OCT', title: 'Outreach', time: '9:00 AM' },
                     { d: '03', m: 'NOV', title: 'New Members', time: '12:30 PM' },
                  ].map((evt, idx) => (
                     <div key={idx} className="flex gap-4 items-center group cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 p-2 -mx-2 rounded-lg transition">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                           <span className="text-[9px] font-bold uppercase">{evt.m}</span>
                           <span className="text-lg font-black leading-none">{evt.d}</span>
                        </div>
                        <div>
                           <h4 className="font-bold text-sm text-slate-900 dark:text-white">{evt.title}</h4>
                           <span className="text-xs text-gray-500 dark:text-gray-400">{evt.time}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Verse of the Day */}
            <div className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-primary/30">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <div className="size-32 rounded-full bg-white blur-2xl"></div>
               </div>
               <div className="relative z-10">
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-3">Verse of the Day</p>
                  <p className="text-lg font-serif italic leading-relaxed mb-4">
                     "For I know the plans I have for you," declares the Lord...
                  </p>
                  <div className="flex items-center gap-2">
                     <div className="h-[1px] w-6 bg-blue-300"></div>
                     <p className="text-xs font-bold">Jeremiah 29:11</p>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

// --- SERMONS PAGE & COMPONENTS ---

const FEATURED_MESSAGE = {
    title: "Walking in Divine Purpose",
    preacher: "Pastor David",
    scripture: "Romans 8:28",
    description: "Discover how God orchestrates every event in your life for a greater purpose. Join us as we explore the depth of His promise and learn to trust His timing in every season.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop"
};

const SERMON_CATEGORIES = ["All Messages", "Sunday Service", "Bible Study", "Youth Ministry", "Prayer & Worship", "Conferences"];

const RECENT_UPLOADS = [
    { id: 1, title: "The Power of Persistent Prayer", preacher: "Pastor Sarah", series: "Sunday Service", duration: "42:23", img: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop", desc: "Pastor Sarah explores the biblical foundations of prayer and how it changes things." },
    { id: 2, title: "Understanding Grace", preacher: "Rev. Michael", series: "Bible Study", duration: "36:15", img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2670&auto=format&fit=crop", desc: "A deep dive into the concept of grace in the New Testament and its application today." },
    { id: 3, title: "Worship Night Highlights", preacher: "Worship Team", series: "Prayer & Worship", duration: "1:12:08", img: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2670&auto=format&fit=crop", desc: "An evening of deep worship and intercession led by the CACC Worship Team." },
    { id: 4, title: "Stepping Out in Faith", preacher: "Pastor David", series: "Sunday Service", duration: "45:10", img: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2574&auto=format&fit=crop", desc: "Learning to step out in faith even when the path ahead isn't clear." },
];

const SERIES_LIST = [
    { id: 1, title: "The Book of Acts", episodes: 12, img: "https://images.unsplash.com/photo-1529321044792-949d1f03e61e?q=80&w=2670&auto=format&fit=crop", desc: "The birth of the early church and the power of the Spirit." },
    { id: 2, title: "Kingdom Finance", episodes: 4, img: "https://images.unsplash.com/photo-1621255776269-e0c158580552?q=80&w=2670&auto=format&fit=crop", desc: "Biblical principles for stewardship and generosity." },
    { id: 3, title: "Family Matters", episodes: 8, img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2670&auto=format&fit=crop", desc: "Building strong, God-centered relationships at home." },
];

const AUDIO_LIBRARY = [
    { id: 1, title: "The Heart of Worship", preacher: "Pastor David", ref: "Romans 12:1", date: "Oct 01", duration: "35m" },
    { id: 2, title: "Overcoming Fear", preacher: "Pastor Sarah", ref: "2 Timothy 1:7", date: "Sep 24", duration: "42m" },
    { id: 3, title: "Building a Legacy", preacher: "Rev. Michael", ref: "Proverbs 13:22", date: "Sep 17", duration: "50m" },
];

export const Sermons: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState("All Messages");
    const [currentAudio, setCurrentAudio] = useState<any | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playAudio = (track: any) => {
        setCurrentAudio(track);
        setIsPlaying(true);
    };

    return (
        <div className="bg-[#F3F4F6] dark:bg-slate-900 min-h-screen pb-32 font-sans relative">
            
            {/* Hero Section */}
            <div className="relative h-[500px] w-full bg-black overflow-hidden group">
                <img src={FEATURED_MESSAGE.image} className="w-full h-full object-cover opacity-80 transition duration-1000 group-hover:scale-105" alt="Hero" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
                
                <div className="absolute inset-0 max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center">
                    <div className="max-w-2xl">
                        <span className="bg-primary text-white text-xs font-bold uppercase px-3 py-1 rounded-md mb-4 inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] filled">star</span> Featured Message
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight drop-shadow-lg">{FEATURED_MESSAGE.title}</h1>
                        <p className="text-gray-300 font-bold mb-6 text-lg">This Week's Message | {FEATURED_MESSAGE.preacher} | {FEATURED_MESSAGE.scripture}</p>
                        <p className="text-gray-300 mb-8 leading-relaxed max-w-lg">{FEATURED_MESSAGE.description}</p>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-8 py-3 bg-[#4F46E5] hover:bg-[#4338ca] text-white font-bold rounded-lg shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition hover:-translate-y-0.5">
                                <span className="material-symbols-outlined filled">play_arrow</span> Watch Now
                            </button>
                            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/20 font-bold rounded-lg flex items-center gap-2 transition">
                                <span className="material-symbols-outlined">headphones</span> Listen Audio
                            </button>
                            <button className="px-6 py-3 bg-transparent hover:bg-white/10 text-white border border-white/20 font-bold rounded-lg flex items-center gap-2 transition">
                                <span className="material-symbols-outlined">download</span> Notes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-10">
                
                {/* Categories */}
                <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar mb-8">
                    {SERMON_CATEGORIES.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap shadow-sm border transition-all ${activeCategory === cat ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-300 border-white dark:border-gray-700 hover:bg-gray-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Recent Uploads */}
                <div className="mb-12">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recent Uploads</h2>
                        <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">View Archive <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {RECENT_UPLOADS.map(upload => (
                            <div key={upload.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-md transition">
                                <div className="relative aspect-video">
                                    <img src={upload.img} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{upload.duration}</span>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="size-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white border border-white/30 cursor-pointer hover:scale-110 transition">
                                            <span className="material-symbols-outlined filled text-2xl">play_arrow</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">{upload.title}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">{upload.preacher} • {upload.series}</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined text-lg">more_vert</span></button>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-2 leading-relaxed">{upload.desc}</p>
                                    
                                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                                        <button className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-gray-300 hover:text-primary"><span className="material-symbols-outlined text-sm">favorite</span> Like</button>
                                        <button className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-gray-300 hover:text-primary"><span className="material-symbols-outlined text-sm">share</span> Share</button>
                                        <button 
                                            onClick={() => playAudio(upload)}
                                            className="ml-auto flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded hover:bg-primary hover:text-white transition"
                                        >
                                            <span className="material-symbols-outlined text-sm">headphones</span> Listen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sermon Series */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Sermon Series</h2>
                        <div className="flex gap-2">
                            <button className="size-8 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 text-gray-600"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                            <button className="size-8 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 text-gray-600"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {SERIES_LIST.map(series => (
                            <div key={series.id} className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-md">
                                <img src={series.img} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">{series.episodes} Episodes</span>
                                </div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-2xl font-black text-white mb-2">{series.title}</h3>
                                    <p className="text-gray-300 text-xs line-clamp-2">{series.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audio Library */}
                <div className="mb-20">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Audio Library</h2>
                        <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">View All Audio <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {AUDIO_LIBRARY.map((track, idx) => (
                            <div key={track.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition cursor-pointer group ${idx !== AUDIO_LIBRARY.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                                <button 
                                    onClick={() => playAudio(track)}
                                    className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition"
                                >
                                    <span className="material-symbols-outlined filled">play_arrow</span>
                                </button>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{track.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{track.preacher} • <span className="text-primary">{track.ref}</span></p>
                                </div>
                                <div className="flex items-center gap-6 text-xs font-bold text-gray-400">
                                    <span className="hidden sm:inline items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> {track.date}</span>
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {track.duration}</span>
                                    <button className="hover:text-primary transition"><span className="material-symbols-outlined text-lg">download</span></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Persistent Sticky Player */}
            {currentAudio && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 px-4 py-3 animate-fade-in-up">
                    <div className="max-w-7xl mx-auto flex items-center gap-4 md:gap-8">
                        {/* Track Info */}
                        <div className="flex items-center gap-4 min-w-0 w-1/3 md:w-1/4">
                            <div className="size-12 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden shrink-0 relative group cursor-pointer">
                                <img src={currentAudio.img || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop"} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <span className="material-symbols-outlined text-white text-lg">open_in_full</span>
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{currentAudio.title}</h4>
                                <p className="text-xs text-gray-500 truncate">{currentAudio.preacher}</p>
                            </div>
                        </div>

                        {/* Controls & Progress */}
                        <div className="flex-1 flex flex-col items-center justify-center max-w-xl">
                             <div className="flex items-center gap-6 mb-1">
                                 <button className="text-gray-400 hover:text-primary transition"><span className="material-symbols-outlined text-lg">shuffle</span></button>
                                 <button className="text-slate-700 dark:text-white hover:text-primary transition"><span className="material-symbols-outlined filled">skip_previous</span></button>
                                 <button 
                                     onClick={() => setIsPlaying(!isPlaying)}
                                     className="size-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition shadow-md"
                                 >
                                     <span className="material-symbols-outlined filled text-xl">{isPlaying ? 'pause' : 'play_arrow'}</span>
                                 </button>
                                 <button className="text-slate-700 dark:text-white hover:text-primary transition"><span className="material-symbols-outlined filled">skip_next</span></button>
                                 <button className="text-gray-400 hover:text-primary transition"><span className="material-symbols-outlined text-lg">repeat</span></button>
                             </div>
                             <div className="w-full flex items-center gap-3 text-[10px] font-bold text-gray-400">
                                 <span>12:45</span>
                                 <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer group">
                                     <div className="absolute top-0 left-0 h-full w-[35%] bg-primary rounded-full group-hover:bg-primary-dark"></div>
                                     <div className="absolute top-1/2 left-[35%] -translate-y-1/2 size-2.5 bg-primary rounded-full shadow scale-0 group-hover:scale-100 transition-transform"></div>
                                 </div>
                                 <span>45:20</span>
                             </div>
                        </div>

                        {/* Volume & Options */}
                        <div className="hidden md:flex items-center gap-4 w-1/4 justify-end">
                            <button className="text-gray-400 hover:text-slate-700 dark:hover:text-white transition"><span className="material-symbols-outlined text-lg">queue_music</span></button>
                            <div className="flex items-center gap-2 w-24">
                                <span className="material-symbols-outlined text-gray-400 text-lg">volume_up</span>
                                <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer">
                                    <div className="h-full w-[70%] bg-gray-400 dark:bg-gray-500 rounded-full hover:bg-primary transition"></div>
                                </div>
                            </div>
                            <button onClick={() => setCurrentAudio(null)} className="text-gray-400 hover:text-red-500 transition ml-2"><span className="material-symbols-outlined">close</span></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const LiveStream: React.FC<{role: UserRole}> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'bible'>('chat');
  const [messages, setMessages] = useState([
      {u: 'Sarah Jenkins', m: 'Watching from London! Excited for the word today.', avatar: 'https://i.pravatar.cc/150?u=sarah', time: '10:42 AM'},
      {u: 'David Okon', m: 'Amen! 🙏 Hallelujah!', avatar: 'https://i.pravatar.cc/150?u=david', time: '10:43 AM'},
      {u: 'Mary Kate', m: 'The sound is perfect today. Thank you media team!', avatar: 'https://i.pravatar.cc/150?u=mary', time: '10:44 AM'},
      {u: 'James Lu', m: 'Greetings from Singapore 🇸🇬', avatar: 'https://i.pravatar.cc/150?u=james', time: '10:45 AM'},
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const isGuest = role === UserRole.GUEST;

  const handleSendMessage = () => {
      if(!inputMsg.trim()) return;
      if (isGuest) {
          alert('Please login to chat with the community!');
          return;
      }
      setMessages([...messages, { u: 'You', m: inputMsg, avatar: 'https://i.pravatar.cc/150?u=you', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      setInputMsg('');
      setTimeout(() => {
          chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-8 animate-fade-in font-sans">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
             {/* Video Player */}
             <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group">
                <img src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Stream Background" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                
                {/* Top Controls */}
                <div className="absolute top-6 left-6 flex items-center gap-3">
                   <div className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-2 animate-pulse shadow-lg">
                      <div className="size-2 bg-white rounded-full"></div> LIVE
                   </div>
                   <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-2 border border-white/10">
                      <span className="material-symbols-outlined text-[14px]">visibility</span> 1,245
                   </div>
                </div>
                
                <div className="absolute top-6 right-6 flex gap-3 text-white">
                   <button className="bg-black/40 p-2 rounded-md hover:bg-black/60 transition"><span className="material-symbols-outlined">cast</span></button>
                   <button className="bg-black/40 p-2 rounded-md hover:bg-black/60 transition"><span className="material-symbols-outlined">picture_in_picture_alt</span></button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                   <div className="w-full bg-gray-600 h-1.5 rounded-full mb-4 cursor-pointer overflow-hidden">
                      <div className="bg-red-600 h-full w-[85%] relative">
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-red-600 rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"></div>
                      </div>
                   </div>
                   <div className="flex justify-between items-center text-white">
                      <div className="flex items-center gap-6">
                         <button className="hover:text-red-500 transition"><span className="material-symbols-outlined filled">pause</span></button>
                         <button className="hover:text-red-500 transition"><span className="material-symbols-outlined">volume_up</span></button>
                         <span className="text-xs font-mono font-bold opacity-80">01:12:45 / <span className="text-red-500">LIVE</span></span>
                      </div>
                      <div className="flex items-center gap-4">
                         <button className="hover:text-gray-300 transition"><span className="material-symbols-outlined">settings</span></button>
                         <button className="hover:text-gray-300 transition"><span className="material-symbols-outlined">fullscreen</span></button>
                      </div>
                   </div>
                </div>
             </div>

             {/* Title & Actions */}
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                   <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 leading-tight">Walking in Divine Authority - Sunday Service</h1>
                   <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                         <img src="https://i.pravatar.cc/150?u=pastor" className="size-6 rounded-full" alt="Pastor" />
                         <span className="font-bold text-slate-700 dark:text-slate-300">Pastor John Doe</span>
                      </div>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <div className="flex items-center gap-1">
                         <span className="material-symbols-outlined text-[16px]">calendar_today</span> October 24, 2023
                      </div>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <div className="flex items-center gap-1">
                         <span className="material-symbols-outlined text-[16px] text-primary">location_on</span> Main Sanctuary
                      </div>
                   </div>
                </div>
                <div className="flex gap-3 shrink-0">
                   <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition">
                      <span className="material-symbols-outlined text-[18px]">share</span> Share
                   </button>
                   <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition">
                      <span className="material-symbols-outlined text-[18px]">volunteer_activism</span> Prayer
                   </button>
                   <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 rounded-lg font-bold text-sm hover:bg-blue-100 flex items-center gap-2 transition">
                      <span className="material-symbols-outlined text-[18px] filled">favorite</span> Save
                   </button>
                </div>
             </div>

             {/* Description & Resources */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-4">
                   <p>Welcome to our Sunday Celebration Service! Today, we are diving deep into the topic of spiritual authority. Join us as we explore scripture and learn how to walk confidently in the promises God has given us.</p>
                   <p>If this is your first time joining us, we would love to connect with you. Please fill out the Connect Card using the button above.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                   <h3 className="font-bold text-slate-900 dark:text-white mb-4">Series Resources</h3>
                   <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-primary cursor-pointer transition">
                         <span className="material-symbols-outlined text-primary">download</span> Sermon Notes (PDF)
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-primary cursor-pointer transition">
                         <span className="material-symbols-outlined text-primary">menu_book</span> Bible Reading Plan
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-primary cursor-pointer transition">
                         <span className="material-symbols-outlined text-primary">podcasts</span> Podcast Episode
                      </li>
                   </ul>
                </div>
             </div>

             {/* Coming Up Next */}
             <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Coming Up Next</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:border-primary/30 transition cursor-pointer">
                      <div className="size-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center shrink-0">
                         <span className="material-symbols-outlined">event</span>
                      </div>
                      <div>
                         <p className="text-xs font-bold text-gray-400 uppercase">Wed, 7:00 PM</p>
                         <h4 className="font-bold text-slate-900 dark:text-white">Bible Study</h4>
                      </div>
                   </div>
                   <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:border-primary/30 transition cursor-pointer">
                      <div className="size-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center shrink-0">
                         <span className="material-symbols-outlined">groups</span>
                      </div>
                      <div>
                         <p className="text-xs font-bold text-gray-400 uppercase">Fri, 6:00 PM</p>
                         <h4 className="font-bold text-slate-900 dark:text-white">Youth Night</h4>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Interactive Sidebar Column */}
          <div className="flex flex-col h-[750px] bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
             {/* Tabs */}
             <div className="flex border-b border-gray-100 dark:border-gray-700">
                {['Chat', 'Notes', 'Bible'].map(tab => (
                   <button 
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase() as any)}
                      className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === tab.toLowerCase() ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                   >
                      {tab}
                      {activeTab === tab.toLowerCase() && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary mx-4 rounded-t-full"></div>}
                   </button>
                ))}
             </div>

             {/* Tab Content */}
             <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-slate-900/50">
                {activeTab === 'chat' ? (
                   <>
                      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={chatContainerRef}>
                         {/* Pinned Message */}
                         <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3 shadow-sm">
                            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-md">
                               <span className="material-symbols-outlined text-sm">church</span>
                            </div>
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-primary">CACC Team</span>
                                  <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Admin</span>
                               </div>
                               <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                  Welcome to CACC Online! 👋 Let us know where you are watching from in the chat below!
                               </p>
                            </div>
                         </div>

                         {/* Chat Messages */}
                         {messages.map((msg, idx) => (
                            <div key={idx} className="flex gap-3 items-start animate-fade-in-up">
                               <img src={msg.avatar} className="size-8 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm shrink-0" alt={msg.u} />
                               <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-0.5">
                                     <span className="text-xs font-bold text-slate-900 dark:text-white">{msg.u}</span>
                                     <span className="text-[10px] text-gray-400">{msg.time}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug bg-white dark:bg-slate-800 p-2.5 rounded-lg rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700 inline-block">
                                     {msg.m}
                                  </p>
                               </div>
                            </div>
                         ))}
                         
                         {/* Floating Reactions */}
                         <div className="flex justify-end gap-1 pr-4 opacity-80">
                            <span className="animate-bounce delay-100 text-lg">🔥</span>
                            <span className="animate-bounce delay-300 text-lg">🙏</span>
                            <span className="animate-bounce delay-700 text-lg text-red-500">❤️</span>
                         </div>
                      </div>

                      {/* Support Card */}
                      <div className="px-4 pb-2">
                         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 p-3 rounded-xl border border-blue-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                               <div className="size-10 rounded-lg bg-primary text-white flex items-center justify-center shadow-md">
                                  <span className="material-symbols-outlined">volunteer_activism</span>
                               </div>
                               <div>
                                  <p className="text-xs font-bold text-slate-900 dark:text-white">Support the Ministry</p>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Secure & simple giving</p>
                               </div>
                            </div>
                            <Link to="/give" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition shadow-md">
                               Give Offering
                            </Link>
                         </div>
                      </div>

                      {/* Input Area */}
                      <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-gray-700">
                         {isGuest && (
                             <div className="mb-2 text-center text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-1 rounded">Login to participate in chat</div>
                         )}
                         <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 rounded-full px-2 py-1 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                            <input 
                               type="text" 
                               placeholder={isGuest ? "Login to chat..." : "Type a message..."}
                               value={inputMsg}
                               disabled={isGuest}
                               onChange={(e) => setInputMsg(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                               className="flex-1 bg-transparent border-none text-sm px-3 py-2 focus:ring-0 text-slate-900 dark:text-white placeholder-gray-400 disabled:opacity-50"
                            />
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition"><span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span></button>
                            <button onClick={handleSendMessage} disabled={isGuest} className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full transition disabled:opacity-50">
                               <span className="material-symbols-outlined text-[20px] ml-0.5">send</span>
                            </button>
                         </div>
                      </div>
                   </>
                ) : activeTab === 'notes' ? (
                   <div className="flex-1 p-6 flex flex-col bg-yellow-50/50 dark:bg-slate-900 relative">
                      {isGuest && (
                          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center text-center p-6">
                              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl">
                                  <span className="material-symbols-outlined text-4xl text-yellow-500 mb-2">lock</span>
                                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Member Feature</h3>
                                  <p className="text-sm text-gray-500 mb-4">Please log in to take and save personal sermon notes.</p>
                                  <Link to="/auth" className="block w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition">Login Now</Link>
                              </div>
                          </div>
                      )}
                      <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Private Notes</h3>
                      <textarea 
                         className="flex-1 bg-transparent border-none resize-none focus:ring-0 text-slate-700 dark:text-slate-300 text-sm leading-relaxed p-0 placeholder-gray-400"
                         placeholder="Take notes during the sermon..."
                      ></textarea>
                      <button className="mt-4 w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 transition flex items-center justify-center gap-2">
                         <span className="material-symbols-outlined text-[18px]">download</span> Export to PDF
                      </button>
                   </div>
                ) : (
                   <div className="flex-1 flex flex-col h-full">
                      <BibleReader />
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

const PastorChatSession: React.FC<{ pastor: any, onClose: () => void }> = ({ pastor, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            senderId: 'u1',
            text: input,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            isMe: true
        };
        setMessages(prev => [...prev, newMsg]);
        setInput('');

        // Simulate reply
        setTimeout(() => {
            const reply: ChatMessage = {
                id: (Date.now() + 1).toString(),
                senderId: 'p1',
                text: "Thank you for reaching out. I am praying with you right now. Remember Philippians 4:6 - be anxious for nothing.",
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                isMe: false
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="relative">
                        <img src={pastor.img} className="size-10 rounded-full object-cover" />
                        <div className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-slate-900 ${pastor.status === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{pastor.name}</h3>
                        <p className="text-xs text-gray-500">{pastor.role} • {pastor.status}</p>
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950">
                <div className="text-center text-xs text-gray-400 my-4">
                    This conversation is private and confidential.
                </div>
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-20">
                        <p>Start a conversation with {pastor.name}</p>
                    </div>
                )}
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm text-sm ${msg.isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'}`}>
                            <RichMessageText text={msg.text} isMe={msg.isMe} />
                            <p className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-blue-200' : 'text-gray-400'}`}>{msg.time}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined text-2xl">add_circle</span></button>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..." 
                    className="flex-1 bg-gray-100 dark:bg-slate-800 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-primary dark:text-white"
                />
                <button onClick={handleSend} className="bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition shadow-md flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">send</span>
                </button>
            </div>
        </div>
    );
};

export const Giving: React.FC = () => {
  const [selectedFund, setSelectedFund] = useState('Tithe');
  const [amount, setAmount] = useState('1500');
  const [paymentMethod, setPaymentMethod] = useState('M-PESA');
  const [showSuccess, setShowSuccess] = useState(false);

  if (showSuccess) {
      return (
          <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in text-center font-sans">
              <div className="size-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-5xl">check_circle</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Giving Successful!</h2>
              <p className="text-gray-500 text-lg mb-8">
                  Thank you for your generosity. Your giving of <span className="font-bold text-slate-900 dark:text-white">KES {amount}</span> towards <span className="font-bold text-slate-900 dark:text-white">{selectedFund}</span> has been received.
              </p>
              <button onClick={() => {setShowSuccess(false);}} className="px-8 py-3 bg-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition">
                  Give Again
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in font-sans">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Giving & Offerings</h1>
            <p className="text-gray-500">Honor the Lord with your substance.</p>
        </div>

        {/* Quote */}
        <div className="bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-200 p-6 rounded-2xl mb-10 text-center text-sm font-medium border border-blue-100 dark:border-blue-800">
            <div className="inline-block mb-1"><span className="material-symbols-outlined text-xl rotate-180">format_quote</span></div>
            <p className="italic font-serif leading-relaxed mb-2">"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."</p>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">— 2 Corinthians 9:7</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center items-center gap-4 mb-10 text-xs font-bold uppercase tracking-wider text-gray-400">
            <div className="flex items-center gap-2 text-green-500">
                <span className="size-6 rounded-full bg-green-100 flex items-center justify-center"><span className="material-symbols-outlined text-sm">check</span></span>
                Purpose
            </div>
            <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center gap-2 text-[#4F46E5]">
                <span className="size-6 rounded-full bg-[#4F46E5] text-white flex items-center justify-center">2</span>
                Details
            </div>
            <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center gap-2">
                <span className="size-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center">3</span>
                Confirm
            </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-10 space-y-10">
            
            {/* Section 1: Fund Selection */}
            <div>
                <div className="flex justify-between items-end mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="bg-blue-100 dark:bg-blue-900 text-[#4F46E5] dark:text-blue-300 size-6 rounded flex items-center justify-center text-xs">1</span> Select Fund
                    </h3>
                    <button className="text-xs text-gray-400 underline hover:text-[#4F46E5]">What are these?</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: 'Tithe', icon: 'percent', sub: '10% of Income' },
                        { id: 'Offering', icon: 'volunteer_activism', sub: 'General giving' },
                        { id: 'Building', icon: 'foundation', sub: 'Church expansion' },
                        { id: 'First Fruits', icon: 'potted_plant', sub: 'New year blessing' }
                    ].map(fund => (
                        <div 
                            key={fund.id}
                            onClick={() => setSelectedFund(fund.id)}
                            className={`p-4 rounded-xl border-2 transition cursor-pointer relative ${selectedFund === fund.id ? 'border-[#4F46E5] bg-blue-50 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'}`}
                        >
                            {selectedFund === fund.id && (
                                <div className="absolute top-2 right-2 text-[#4F46E5]"><span className="material-symbols-outlined text-sm filled">check_circle</span></div>
                            )}
                            <div className={`mb-3 size-8 rounded-lg flex items-center justify-center ${selectedFund === fund.id ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500'}`}>
                                <span className="material-symbols-outlined text-lg">{fund.icon}</span>
                            </div>
                            <p className={`font-bold text-sm mb-0.5 ${selectedFund === fund.id ? 'text-[#4F46E5]' : 'text-slate-900 dark:text-white'}`}>{fund.id}</p>
                            <p className="text-[10px] text-gray-400">{fund.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 2: Amount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <span className="bg-blue-100 dark:bg-blue-900 text-[#4F46E5] dark:text-blue-300 size-6 rounded flex items-center justify-center text-xs">2</span> Your Gift
                    </h3>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Amount (KES)</p>
                    <div className="relative mb-4">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">KES</span>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-14 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-slate-900 border-none text-2xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4F46E5]"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['500', '1500', '5,000', '10,000'].map(val => (
                            <button 
                                key={val} 
                                onClick={() => setAmount(val.replace(',',''))}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${amount === val.replace(',','') ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-white dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Donor Info Card */}
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Donor Info</p>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
                            JD
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">John Doe</p>
                            <p className="text-xs text-gray-500">Member #4823</p>
                        </div>
                    </div>
                    <button className="text-xs text-[#4F46E5] font-bold hover:underline">Not you? Switch account</button>
                </div>
            </div>

            {/* Section 3: Payment Method */}
            <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 dark:bg-blue-900 text-[#4F46E5] dark:text-blue-300 size-6 rounded flex items-center justify-center text-xs">3</span> Payment Method
                </h3>
                
                <div className="flex gap-4 mb-6">
                    {['M-PESA', 'Card', 'Bank'].map(method => (
                        <button 
                            key={method} 
                            onClick={() => setPaymentMethod(method)}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border transition ${paymentMethod === method ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white bg-transparent' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-400 hover:bg-gray-100'}`}
                        >
                            <span className="material-symbols-outlined text-lg">{method === 'M-PESA' ? 'smartphone' : method === 'Card' ? 'credit_card' : 'account_balance'}</span>
                            {method}
                        </button>
                    ))}
                </div>

                {paymentMethod === 'M-PESA' && (
                    <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-8 items-center animate-fade-in">
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">M-PESA Phone Number</label>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><span className="material-symbols-outlined text-[10px] filled">bolt</span> Instant</span>
                            </div>
                            <div className="relative mb-4">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">call</span>
                                <input type="tel" placeholder="07XX XXX XXX" className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                            </div>
                            <div className="flex gap-2 items-start">
                                <span className="material-symbols-outlined text-[#4F46E5] text-sm mt-0.5">info</span>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    You will receive an STK push on your phone. Please unlock your device and enter your M-PESA PIN to complete the transaction.
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0 text-center">
                            <div className="size-16 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mx-auto mb-2 text-gray-400 animate-pulse border border-gray-100 dark:border-gray-700">
                                <span className="material-symbols-outlined text-3xl">perm_device_information</span>
                            </div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Check your phone</p>
                            <p className="text-[10px] text-gray-400 max-w-[150px]">A prompt will appear shortly after you click Give Now.</p>
                        </div>
                    </div>
                )}

                {paymentMethod === 'Card' && (
                    <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-100 dark:border-gray-700 animate-fade-in">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Enter Card Details</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Card Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">credit_card</span>
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Expiry</label>
                                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">CVV</label>
                                    <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Cardholder Name</label>
                                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                            </div>
                        </div>
                    </div>
                )}

                {paymentMethod === 'Bank' && (
                    <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-100 dark:border-gray-700 animate-fade-in space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">account_balance</span> Church Bank Details
                            </h4>
                            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                                    <span className="text-gray-400">Bank</span>
                                    <span className="font-bold">NCBA Bank-Bungoma Branch</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                                    <span className="text-gray-400">Account Name</span>
                                    <span className="font-bold text-right">Christ's Ambassadors celebration Center Church Bungoma</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                                    <span className="text-gray-400">Account Number</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold font-mono text-primary">611785001235</span>
                                        <button className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-[14px]">content_copy</span></button>
                                    </div>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                                    <span className="text-gray-400">SWIFT/BIC</span>
                                    <span className="font-bold">CBAFKEN0213</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Local</span>
                                    <span className="font-bold">07.213</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Transaction Reference</label>
                            <input type="text" placeholder="Enter bank reference code..." className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                            <p className="text-[10px] text-orange-500 mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">info</span>
                                Bank transfers are confirmed manually (24-48hrs).
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <button className="text-sm font-bold text-gray-500 hover:text-slate-900 dark:hover:text-white transition">Cancel</button>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] uppercase font-bold">
                        <span className="material-symbols-outlined text-sm">lock</span> SSL Secure Payment
                    </div>
                    <button 
                        onClick={() => setShowSuccess(true)}
                        className="bg-[#4F46E5] hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition flex items-center gap-2"
                    >
                        Give KES {amount} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>

        </div>
        
        {/* Simple Page Dots for Bottom aesthetics (like screenshot) */}
        <div className="flex justify-center gap-4 mt-8">
            <div className="w-8 h-8 rounded bg-gray-200"></div>
            <div className="w-8 h-8 rounded bg-gray-200"></div>
            <div className="w-8 h-8 rounded bg-gray-200"></div>
        </div>
        
        <div className="mt-12 text-center text-xs text-gray-400">
            <p>&copy; 2024 Christ's Ambassadors Celebration Centre. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
                <a href="#" className="hover:text-gray-600">Privacy Policy</a>
                <a href="#" className="hover:text-gray-600">Terms of Service</a>
            </div>
        </div>
    </div>
  );
};

export const PrayerRequest: React.FC = () => {
    const [requestType, setRequestType] = useState('General');
    const [isPrivate, setIsPrivate] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
             <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in text-center font-sans">
                  <div className="size-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="material-symbols-outlined text-5xl">volunteer_activism</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Request Received</h2>
                  <p className="text-gray-500 text-lg mb-8">
                      We are standing in faith with you. Your prayer request has been sent to our intercessory team.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg transition">
                      Send Another Request
                  </button>
             </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in font-sans">
             <div className="text-center mb-10">
                 <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Prayer Request</h1>
                 <p className="text-gray-500">"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." — Philippians 4:6</p>
             </div>

             <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                 <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                         <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Request Type</label>
                         <div className="flex flex-wrap gap-2">
                             {['General', 'Healing', 'Family', 'Financial', 'Salvation', 'Thanksgiving'].map(type => (
                                 <button 
                                     key={type}
                                     type="button"
                                     onClick={() => setRequestType(type)}
                                     className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${requestType === type ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}
                                 >
                                     {type}
                                 </button>
                             ))}
                         </div>
                     </div>

                     <div>
                         <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Your Prayer Need</label>
                         <textarea 
                            rows={6} 
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary dark:text-white outline-none resize-none"
                            placeholder="Share your prayer request here..."
                         ></textarea>
                     </div>

                     <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                         <input 
                            type="checkbox" 
                            id="private"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="size-5 text-primary rounded focus:ring-primary border-gray-300" 
                         />
                         <div>
                             <label htmlFor="private" className="font-bold text-sm text-slate-900 dark:text-white cursor-pointer select-none">Keep this private</label>
                             <p className="text-xs text-gray-500">Only the pastoral team will see this request.</p>
                         </div>
                     </div>

                     <button type="submit" className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                         <span className="material-symbols-outlined">send</span> Submit Request
                     </button>
                 </form>
             </div>
        </div>
    );
};
