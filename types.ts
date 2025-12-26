
export enum UserRole {
  GUEST = 'GUEST',
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN'
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  thumbnail: string;
  duration: string;
  category: string;
  videoUrl?: string;
  description?: string;
  views?: number;
  progress?: number; // 0-100 for continue watching
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'urgent' | 'general' | 'celebration';
}

export interface BibleStudyProgress {
  currentBook: string;
  currentChapter: number;
  totalChapters: number; // for the year plan
  daysCompleted: number;
  streak: number;
}

export interface CellGroup {
  name: string;
  leader: string;
  location: string;
  nextMeeting: string;
  assignment: string;
}

export interface VolunteerOpportunity {
  id: string;
  role: string;
  department: string;
  date: string;
  spotsLeft: number;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  bio: string;
  role: string;
  joinDate: string;
  cellGroup: string;
  ministries: string[];
  badges: string[];
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isGroup: boolean;
  online: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isMe: boolean;
  attachment?: { type: 'image' | 'file'; url: string; name: string };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}
