'use client';

import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

// Type for icon component props
interface IconProps {
  className?: string;
  [key: string]: any;
}

// Helper to create Solar icon components
const createSolarIcon = (iconName: string, defaultSize = 'size-4') => {
  return ({ className, ...props }: IconProps) => (
    <Icon
      icon={`solar:${iconName}`}
      className={cn(defaultSize, className)}
      {...props}
    />
  );
};

export const Icons = {
  // === CORE NAVIGATION ===
  dashboard: createSolarIcon('widget-2-bold-duotone'),
  LayoutDashboard: createSolarIcon('widget-2-bold-duotone'),
  logo: createSolarIcon('medal-star-bold-duotone', 'size-6 text-primary'),
  login: createSolarIcon('login-3-bold-duotone'),
  logout: createSolarIcon('logout-2-bold-duotone'),
  home: createSolarIcon('home-2-bold-duotone'),

  // === USER & PROFILE ===
  user: createSolarIcon('user-rounded-bold-duotone'),
  User: createSolarIcon('user-rounded-bold-duotone'),
  user2: createSolarIcon('user-circle-bold-duotone'),
  Users: createSolarIcon('users-group-rounded-bold-duotone'),
  UserCheck: createSolarIcon('user-check-rounded-bold-duotone'),
  UserPlus: createSolarIcon('user-plus-bold-duotone'),
  UserMinus: createSolarIcon('user-minus-bold-duotone'),
  UserCog: createSolarIcon('user-id-bold-duotone'),
  userPen: createSolarIcon('user-hand-up-bold-duotone'),
  employee: createSolarIcon('user-cross-bold-duotone'),

  // === EDUCATION ===
  GraduationCap: createSolarIcon('square-academic-cap-bold-duotone'),
  BookOpen: createSolarIcon('book-2-bold-duotone'),
  Book: createSolarIcon('book-bold-duotone'),
  Bookmark: createSolarIcon('bookmark-bold-duotone'),
  Library: createSolarIcon('library-bold-duotone'),
  Pencil: createSolarIcon('pen-bold-duotone'),
  PenTool: createSolarIcon('pen-2-bold-duotone'),
  ClipboardList: createSolarIcon('clipboard-list-bold-duotone'),
  ClipboardCheck: createSolarIcon('clipboard-check-bold-duotone'),
  Award: createSolarIcon('medal-ribbons-star-bold-duotone'),
  Medal: createSolarIcon('medal-star-bold-duotone'),
  Target: createSolarIcon('target-bold-duotone'),

  // === CALENDAR & TIME ===
  Calendar: createSolarIcon('calendar-date-bold-duotone'),
  CalendarDays: createSolarIcon('calendar-bold-duotone'),
  CalendarCheck: createSolarIcon('calendar-mark-bold-duotone'),
  CalendarPlus: createSolarIcon('calendar-add-bold-duotone'),
  CalendarMinus: createSolarIcon('calendar-minus-bold-duotone'),
  Clock: createSolarIcon('clock-circle-bold-duotone'),
  Timer: createSolarIcon('stopwatch-bold-duotone'),
  Alarm: createSolarIcon('alarm-bold-duotone'),
  History: createSolarIcon('history-bold-duotone'),

  // === ANALYTICS & CHARTS ===
  BarChart2: createSolarIcon('chart-square-bold-duotone'),
  BarChart3: createSolarIcon('chart-2-bold-duotone'),
  LineChart: createSolarIcon('graph-up-bold-duotone'),
  PieChart: createSolarIcon('pie-chart-2-bold-duotone'),
  TrendingUp: createSolarIcon('graph-up-bold-duotone'),
  TrendingDown: createSolarIcon('graph-down-bold-duotone'),
  Activity: createSolarIcon('pulse-bold-duotone'),

  // === DOCUMENTS & FILES ===
  File: createSolarIcon('document-bold-duotone'),
  FileText: createSolarIcon('document-text-bold-duotone'),
  FilePlus: createSolarIcon('document-add-bold-duotone'),
  FileCheck: createSolarIcon('document-bold-duotone'),
  Folder: createSolarIcon('folder-bold-duotone'),
  FolderOpen: createSolarIcon('folder-open-bold-duotone'),
  FolderPlus: createSolarIcon('folder-add-bold-duotone'),
  Receipt: createSolarIcon('receipt-bold-duotone'),
  post: createSolarIcon('document-text-bold-duotone'),
  page: createSolarIcon('document-bold-duotone'),

  // === FINANCE ===
  DollarSign: createSolarIcon('dollar-bold-duotone'),
  Wallet: createSolarIcon('wallet-bold-duotone'),
  CreditCard: createSolarIcon('card-2-bold-duotone'),
  billing: createSolarIcon('card-2-bold-duotone'),
  BanknoteIcon: createSolarIcon('banknote-bold-duotone'),
  Coins: createSolarIcon('hand-money-bold-duotone'),

  // === COMMUNICATION ===
  Mail: createSolarIcon('letter-bold-duotone'),
  MailOpen: createSolarIcon('letter-opened-bold-duotone'),
  Send: createSolarIcon('plain-bold-duotone'),
  MessageCircle: createSolarIcon('chat-round-dots-bold-duotone'),
  MessageSquare: createSolarIcon('chat-square-bold-duotone'),
  Phone: createSolarIcon('phone-bold-duotone'),
  PhoneCall: createSolarIcon('phone-calling-bold-duotone'),
  Video: createSolarIcon('video-frame-bold-duotone'),
  Mic: createSolarIcon('microphone-bold-duotone'),
  MicOff: createSolarIcon('microphone-bold-duotone'),

  // === ALERTS & NOTIFICATIONS ===
  Bell: createSolarIcon('bell-bing-bold-duotone'),
  BellOff: createSolarIcon('bell-off-bold-duotone'),
  BellRing: createSolarIcon('bell-bold-duotone'),
  AlertCircle: createSolarIcon('danger-circle-bold-duotone'),
  AlertTriangle: createSolarIcon('danger-triangle-bold-duotone'),
  warning: createSolarIcon('danger-triangle-bold-duotone'),
  Info: createSolarIcon('info-circle-bold-duotone'),

  // === ACTIONS ===
  Plus: createSolarIcon('add-circle-bold-duotone'),
  add: createSolarIcon('add-circle-bold-duotone'),
  Minus: createSolarIcon('minus-circle-bold-duotone'),
  X: createSolarIcon('close-circle-bold-duotone'),
  close: createSolarIcon('close-circle-bold-duotone'),
  Check: createSolarIcon('check-circle-bold-duotone'),
  check: createSolarIcon('check-circle-bold-duotone'),
  CheckCircle: createSolarIcon('check-circle-bold-duotone'),
  CheckCircle2: createSolarIcon('check-circle-bold-duotone'),
  XCircle: createSolarIcon('close-circle-bold-duotone'),
  Edit: createSolarIcon('pen-2-bold-duotone'),
  Edit2: createSolarIcon('pen-2-bold-duotone'),
  Trash: createSolarIcon('trash-bin-trash-bold-duotone'),
  trash: createSolarIcon('trash-bin-trash-bold-duotone'),
  Trash2: createSolarIcon('trash-bin-trash-bold-duotone'),
  Save: createSolarIcon('diskette-bold-duotone'),
  Download: createSolarIcon('download-bold-duotone'),
  Upload: createSolarIcon('upload-bold-duotone'),
  Share: createSolarIcon('share-bold-duotone'),
  Share2: createSolarIcon('share-bold-duotone'),
  Copy: createSolarIcon('copy-bold-duotone'),
  Clipboard: createSolarIcon('clipboard-bold-duotone'),
  Refresh: createSolarIcon('refresh-bold-duotone'),
  RefreshCw: createSolarIcon('refresh-bold-duotone'),
  RotateCw: createSolarIcon('restart-bold-duotone'),

  // === NAVIGATION ===
  chevronLeft: createSolarIcon('alt-arrow-left-bold-duotone'),
  chevronRight: createSolarIcon('alt-arrow-right-bold-duotone'),
  chevronUp: createSolarIcon('alt-arrow-up-bold-duotone'),
  chevronDown: createSolarIcon('alt-arrow-down-bold-duotone'),
  ChevronLeft: createSolarIcon('alt-arrow-left-bold-duotone'),
  ChevronRight: createSolarIcon('alt-arrow-right-bold-duotone'),
  ChevronUp: createSolarIcon('alt-arrow-up-bold-duotone'),
  ChevronDown: createSolarIcon('alt-arrow-down-bold-duotone'),
  ArrowLeft: createSolarIcon('arrow-left-bold-duotone'),
  ArrowRight: createSolarIcon('arrow-right-bold-duotone'),
  arrowRight: createSolarIcon('arrow-right-bold-duotone'),
  ArrowUp: createSolarIcon('arrow-up-bold-duotone'),
  ArrowDown: createSolarIcon('arrow-down-bold-duotone'),
  ArrowUpRight: createSolarIcon('arrow-right-up-bold-duotone'),
  ArrowDownRight: createSolarIcon('arrow-right-down-bold-duotone'),
  ExternalLink: createSolarIcon('square-arrow-right-up-bold-duotone'),
  Link: createSolarIcon('link-bold-duotone'),
  Link2: createSolarIcon('link-minimalistic-2-bold-duotone'),

  // === UI ELEMENTS ===
  Menu: createSolarIcon('hamburger-menu-bold-duotone'),
  MoreHorizontal: createSolarIcon('menu-dots-bold'),
  MoreVertical: createSolarIcon('menu-dots-bold'),
  ellipsis: createSolarIcon('menu-dots-bold'),
  Grid: createSolarIcon('widget-4-bold-duotone'),
  List: createSolarIcon('list-bold-duotone'),
  Table: createSolarIcon('align-vertical-spacing-bold-duotone'),
  Columns: createSolarIcon('align-horizontal-spacing-bold-duotone'),
  Layers: createSolarIcon('layers-bold-duotone'),
  Layout: createSolarIcon('widget-2-bold-duotone'),
  Sidebar: createSolarIcon('siderbar-bold-duotone'),
  PanelLeft: createSolarIcon('siderbar-bold-duotone'),
  PanelRight: createSolarIcon('siderbar-bold-duotone'),
  Maximize: createSolarIcon('maximize-bold-duotone'),
  Minimize: createSolarIcon('minimize-bold-duotone'),

  // === SEARCH & FILTER ===
  Search: createSolarIcon('magnifer-bold-duotone'),
  Filter: createSolarIcon('filter-bold-duotone'),
  SortAsc: createSolarIcon('sort-from-top-to-bottom-bold-duotone'),
  SortDesc: createSolarIcon('sort-from-bottom-to-top-bold-duotone'),

  // === SECURITY ===
  Lock: createSolarIcon('lock-password-bold-duotone'),
  Unlock: createSolarIcon('lock-unlocked-bold-duotone'),
  Key: createSolarIcon('key-bold-duotone'),
  Shield: createSolarIcon('shield-keyhole-bold-duotone'),
  ShieldCheck: createSolarIcon('shield-check-bold-duotone'),
  ShieldAlert: createSolarIcon('shield-warning-bold-duotone'),
  Eye: createSolarIcon('eye-bold-duotone'),
  EyeOff: createSolarIcon('eye-closed-bold-duotone'),

  // === SETTINGS ===
  settings: createSolarIcon('settings-minimalistic-bold-duotone'),
  Settings: createSolarIcon('settings-minimalistic-bold-duotone'),
  Settings2: createSolarIcon('settings-bold-duotone'),
  Cog: createSolarIcon('settings-bold-duotone'),
  Sliders: createSolarIcon('tuning-2-bold-duotone'),

  // === MEDIA ===
  Image: createSolarIcon('gallery-bold-duotone'),
  media: createSolarIcon('gallery-bold-duotone'),
  Camera: createSolarIcon('camera-bold-duotone'),
  Film: createSolarIcon('video-frame-bold-duotone'),
  Music: createSolarIcon('music-note-bold-duotone'),
  Play: createSolarIcon('play-bold-duotone'),
  Pause: createSolarIcon('pause-bold-duotone'),
  Stop: createSolarIcon('stop-bold-duotone'),

  // === WEATHER & THEME ===
  sun: createSolarIcon('sun-2-bold-duotone'),
  Sun: createSolarIcon('sun-2-bold-duotone'),
  moon: createSolarIcon('moon-bold-duotone'),
  Moon: createSolarIcon('moon-bold-duotone'),
  Cloud: createSolarIcon('cloud-bold-duotone'),

  // === BUILDINGS & LOCATIONS ===
  Building: createSolarIcon('buildings-2-bold-duotone'),
  Building2: createSolarIcon('buildings-3-bold-duotone'),
  Home: createSolarIcon('home-2-bold-duotone'),
  MapPin: createSolarIcon('map-point-bold-duotone'),
  Map: createSolarIcon('map-bold-duotone'),
  Globe: createSolarIcon('globe-bold-duotone'),

  // === MISC ===
  help: createSolarIcon('help-bold-duotone'),
  HelpCircle: createSolarIcon('question-circle-bold-duotone'),
  Lightbulb: createSolarIcon('lightbulb-bold-duotone'),
  Zap: createSolarIcon('bolt-bold-duotone'),
  Star: createSolarIcon('star-bold-duotone'),
  Heart: createSolarIcon('heart-bold-duotone'),
  ThumbsUp: createSolarIcon('like-bold-duotone'),
  ThumbsDown: createSolarIcon('dislike-bold-duotone'),
  Flag: createSolarIcon('flag-bold-duotone'),
  Tag: createSolarIcon('tag-bold-duotone'),
  Hash: createSolarIcon('hashtag-bold-duotone'),
  AtSign: createSolarIcon('at-bold-duotone'),
  Percent: createSolarIcon('percent-bold-duotone'),

  // === PRODUCT & SHOPPING ===
  product: createSolarIcon('bag-2-bold-duotone'),
  ShoppingCart: createSolarIcon('cart-large-bold-duotone'),
  Package: createSolarIcon('box-bold-duotone'),
  Gift: createSolarIcon('gift-bold-duotone'),

  // === DEVICES & TECH ===
  Monitor: createSolarIcon('monitor-bold-duotone'),
  Laptop: createSolarIcon('laptop-bold-duotone'),
  Smartphone: createSolarIcon('smartphone-bold-duotone'),
  Tablet: createSolarIcon('tablet-bold-duotone'),
  Printer: createSolarIcon('printer-bold-duotone'),
  Wifi: createSolarIcon('wifi-bold-duotone'),
  WifiOff: createSolarIcon('wifi-off-bold-duotone'),
  Bluetooth: createSolarIcon('bluetooth-bold-duotone'),
  Plug: createSolarIcon('plug-circle-bold-duotone'),

  // === SUPPORT ===
  HeadphonesIcon: createSolarIcon('headphones-round-bold-duotone'),
  Headphones: createSolarIcon('headphones-round-bold-duotone'),
  LifeBuoy: createSolarIcon('life-buoy-bold-duotone'),

  // === KANBAN & PROJECT ===
  kanban: createSolarIcon('kanban-bold-duotone'),
  Kanban: createSolarIcon('kanban-bold-duotone'),
  Trello: createSolarIcon('kanban-bold-duotone'),

  // === SPINNER & LOADING ===
  spinner: ({ className, ...props }: IconProps) => (
    <Icon
      icon='solar:refresh-bold-duotone'
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  ),
  Loader: ({ className, ...props }: IconProps) => (
    <Icon
      icon='solar:refresh-bold-duotone'
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  ),
  Loader2: ({ className, ...props }: IconProps) => (
    <Icon
      icon='solar:refresh-bold-duotone'
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  ),

  // === SOCIAL ===
  github: createSolarIcon('code-bold-duotone'),
  Google: createSolarIcon('global-bold-duotone'),
  Twitter: createSolarIcon('global-bold-duotone'),
  Facebook: createSolarIcon('global-bold-duotone'),
  LinkedIn: createSolarIcon('global-bold-duotone'),

  // === CLASSROOM & EDUCATION SPECIFIC ===
  Classroom: createSolarIcon('presentation-graph-bold-duotone'),
  Whiteboard: createSolarIcon('presentation-graph-bold-duotone'),
  Presentation: createSolarIcon('presentation-graph-bold-duotone'),
  Assignment: createSolarIcon('clipboard-text-bold-duotone'),
  Quiz: createSolarIcon('clipboard-check-bold-duotone'),
  Exam: createSolarIcon('document-text-bold-duotone'),
  Grade: createSolarIcon('medal-star-bold-duotone'),
  Attendance: createSolarIcon('calendar-mark-bold-duotone'),
  Schedule: createSolarIcon('calendar-date-bold-duotone'),
  Timetable: createSolarIcon('calendar-bold-duotone'),
  Lesson: createSolarIcon('book-bookmark-bold-duotone'),
  Subject: createSolarIcon('notebook-bold-duotone'),
  Course: createSolarIcon('notebook-bookmark-bold-duotone'),

  // === DYNAMIC ICON HELPER ===
  // Use this when you need to render an icon by string name
  Dynamic: ({ name, className, ...props }: IconProps & { name: string }) => (
    <Icon
      icon={`solar:${name}`}
      className={cn('size-4', className)}
      {...props}
    />
  )
};

// Export type for use in other components
export type IconName = keyof typeof Icons;

// Export the Icon component from iconify for direct use
export { Icon } from '@iconify/react';
