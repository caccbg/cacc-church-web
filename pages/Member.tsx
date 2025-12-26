
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
            <div className="relative h-screen w-full bg-black overflow-hidden group">
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

export const LiveStream: React.FC<{ role?: UserRole }> = ({ role }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { user: 'John Doe', text: 'Hallelujah!', time: '10:05 AM' },
    { user: 'Jane Smith', text: 'Amen!', time: '10:06 AM' }
  ]);

  const handleSend = () => {
    if(!message.trim()) return;
    setChat([...chat, { user: 'Me', text: message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setMessage('');
  };

  return (
    <div className="bg-black min-h-screen text-white pt-6">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-100px)]">
            {/* Video Player Area */}
            <div className="lg:col-span-3 bg-gray-900 flex flex-col relative">
                <div className="flex-1 bg-black relative flex items-center justify-center group">
                    {/* Placeholder for Video Player */}
                    <img src="https://images.unsplash.com/photo-1510915361408-d5965ce7f59b?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="size-20 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:scale-110 transition shadow-[0_0_40px_rgba(220,38,38,0.6)] animate-pulse">
                             <span className="material-symbols-outlined text-4xl filled">play_arrow</span>
                         </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse">
                        <span className="size-2 bg-white rounded-full"></span> Live
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                        <h1 className="text-3xl font-black mb-2">Walking in Divine Authority</h1>
                        <p className="text-gray-300">Sunday Service • Pastor John Doe</p>
                    </div>
                </div>
            </div>

            {/* Chat Sidebar */}
            <div className="bg-gray-800 border-l border-gray-700 flex flex-col h-full">
                <div className="p-4 border-b border-gray-700 font-bold flex justify-between items-center">
                    <span>Live Chat</span>
                    <span className="text-xs text-green-400 flex items-center gap-1"><span className="size-2 bg-green-500 rounded-full"></span> 248 Online</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {chat.map((c, i) => (
                        <div key={i} className="text-sm">
                            <span className="font-bold text-gray-400 mr-2">{c.user}</span>
                            <span className="text-gray-200">{c.text}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-gray-900 border-t border-gray-700">
                    <div className="flex gap-2 mb-3">
                         <button className="flex-1 py-2 bg-accent-red hover:bg-red-700 rounded text-xs font-bold uppercase tracking-wider">Give Offering</button>
                         <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold uppercase tracking-wider">Prayer Request</button>
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Say something..."
                            className="flex-1 bg-gray-800 border-none rounded px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 text-white"
                        />
                        <button onClick={handleSend} className="p-2 bg-white text-black rounded hover:bg-gray-200"><span className="material-symbols-outlined text-lg">send</span></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export const Giving: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('Tithe');
    const [method, setMethod] = useState('mpesa');

    return (
        <div className="bg-gray-50 dark:bg-slate-900 min-h-screen py-12 px-4 font-sans">
            <div className="max-w-xl mx-auto">
                <div className="text-center mb-10">
                    <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 inline-block">Online Giving</span>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Give Generously</h1>
                    <p className="text-gray-500 dark:text-gray-400">"God loves a cheerful giver." - 2 Corinthians 9:7</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                    {/* Purpose */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">I am giving</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Tithe', 'Offering', 'Project'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`py-3 rounded-xl text-sm font-bold transition ${type === t ? 'bg-primary text-white shadow-lg shadow-blue-500/30' : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Amount (KES)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">KES</span>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00" 
                                className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl text-2xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                            />
                        </div>
                        <div className="flex gap-2 mt-3">
                            {['500', '1000', '2000', '5000'].map(val => (
                                <button key={val} onClick={() => setAmount(val)} className="flex-1 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-xs font-bold text-gray-500 hover:text-primary transition">
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Method */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Method</label>
                        <div className="space-y-3">
                             <div onClick={() => setMethod('mpesa')} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${method === 'mpesa' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'}`}>
                                 <div className="size-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">M</div>
                                 <div className="flex-1">
                                     <h4 className="font-bold text-slate-900 dark:text-white">M-PESA</h4>
                                     <p className="text-xs text-gray-500">Paybill: 247247</p>
                                 </div>
                                 <div className={`size-5 rounded-full border-2 flex items-center justify-center ${method === 'mpesa' ? 'border-green-500' : 'border-gray-300'}`}>
                                     {method === 'mpesa' && <div className="size-2.5 bg-green-500 rounded-full"></div>}
                                 </div>
                             </div>
                             <div onClick={() => setMethod('card')} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${method === 'card' ? 'border-primary bg-blue-50 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'}`}>
                                 <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white"><span className="material-symbols-outlined">credit_card</span></div>
                                 <div className="flex-1">
                                     <h4 className="font-bold text-slate-900 dark:text-white">Card / Bank</h4>
                                     <p className="text-xs text-gray-500">Secure Transfer</p>
                                 </div>
                                 <div className={`size-5 rounded-full border-2 flex items-center justify-center ${method === 'card' ? 'border-primary' : 'border-gray-300'}`}>
                                     {method === 'card' && <div className="size-2.5 bg-primary rounded-full"></div>}
                                 </div>
                             </div>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-1">
                        Give Now
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">lock</span> Secure Payment
                    </p>
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
                     <p className="text-accent-red font-bold text-xs uppercase tracking-widest mb-2">We Stand With You</p>
                     <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Prayer Request</h1>
                     <p className="text-gray-500 dark:text-gray-400 text-lg">"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." - Phil 4:6</p>
                 </div>

                 <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                     <form className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name (Optional)</label>
                                 <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none dark:text-white" placeholder="Keep blank for anonymous" />
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone / Email (Optional)</label>
                                 <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none dark:text-white" placeholder="For follow up" />
                             </div>
                         </div>
                         
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                             <div className="flex flex-wrap gap-2">
                                 {['Healing', 'Family', 'Financial', 'Salvation', 'General'].map(cat => (
                                     <label key={cat} className="cursor-pointer">
                                         <input type="radio" name="category" className="peer sr-only" />
                                         <span className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-sm font-bold text-gray-500 dark:text-gray-400 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition inline-block">
                                             {cat}
                                         </span>
                                     </label>
                                 ))}
                             </div>
                         </div>

                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Prayer Request</label>
                             <textarea rows={6} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none dark:text-white resize-none" placeholder="Share your burden..."></textarea>
                         </div>

                         <div className="flex items-center gap-2">
                             <input type="checkbox" id="private" className="rounded text-primary focus:ring-primary border-gray-300" />
                             <label htmlFor="private" className="text-sm text-gray-600 dark:text-gray-300">Keep this request confidential (Pastors only)</label>
                         </div>

                         <button type="submit" className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-1">
                             Submit Request
                         </button>
                     </form>
                 </div>
            </div>
        </div>
    );
};
