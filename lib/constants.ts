export const NAVIGATION_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Users',
    href: '/users',
    icon: 'Users',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: 'BarChart3',
  },
  {
    label: 'Content',
    href: '/content',
    icon: 'FileText',
  },
  {
    label: 'AI Assistant',
    href: '/ai',
    icon: 'Bot',
  },
]

export const DUMMY_STATS = [
  { label: 'Total Revenue', value: '$12,459.50', change: '+12.5%', trend: 'up' },
  { label: 'Active Users', value: '3,284', change: '+4.2%', trend: 'up' },
  { label: 'Conversions', value: '456', change: '-2.1%', trend: 'down' },
  { label: 'Growth Rate', value: '8.2%', change: '+1.8%', trend: 'up' },
]

export const DUMMY_USERS = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Admin', status: 'active', joinDate: '2024-01-15' },
  { id: 2, name: 'Mike Chen', email: 'mike@example.com', role: 'Manager', status: 'active', joinDate: '2024-02-20' },
  { id: 3, name: 'Emma Davis', email: 'emma@example.com', role: 'User', status: 'inactive', joinDate: '2024-03-10' },
  { id: 4, name: 'James Wilson', email: 'james@example.com', role: 'User', status: 'active', joinDate: '2024-03-15' },
]

export const DUMMY_ACTIVITY = [
  { id: 1, user: 'Sarah Johnson', action: 'Updated dashboard settings', timestamp: '2 hours ago' },
  { id: 2, user: 'Mike Chen', action: 'Added 5 new users to system', timestamp: '4 hours ago' },
  { id: 3, user: 'Emma Davis', action: 'Generated monthly report', timestamp: '1 day ago' },
  { id: 4, user: 'James Wilson', action: 'Exported analytics data', timestamp: '2 days ago' },
]

export const MOTION_DURATION = {
  FAST: 0.15,
  NORMAL: 0.3,
  SLOW: 0.5,
}

export const SOUND_VOLUME = 0.15 // Subtle volume level

export const ANIMATION_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'
