import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/notificationStore';
import { Bell, Check, Trash2, ChevronLeft, Filter } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import ThemeToggle from '../components/ThemeToggle';

export default function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, unread
  const { notifications, unreadCount, getNotifications, markAsRead, markAllAsRead, deleteNotification, clearReadNotifications, loading } = useNotificationStore();

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = () => {
    getNotifications(filter === 'unread');
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleClearRead = async () => {
    await clearReadNotifications();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'challenge_received':
      case 'challenge_accepted':
      case 'challenge_rejected':
        return '⚔️';
      case 'match_result':
        return '🏆';
      case 'contest_starting':
      case 'contest_reminder':
        return '🎯';
      case 'admin_challenge':
        return '📢';
      case 'achievement':
        return '🏅';
      case 'friend_request':
        return '👥';
      case 'daily_challenge':
        return '📅';
      default:
        return '🔔';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-slate-400">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationBell />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'unread'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm"
              >
                <Check className="w-4 h-4" />
                Mark all read
              </button>
            )}
            <button
              onClick={handleClearRead}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-slate-400">
              {filter === 'unread' ? "You're all caught up!" : 'Notifications will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`glass border rounded-lg p-4 hover:border-indigo-500 transition cursor-pointer group ${
                  !notification.isRead ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-3xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        !notification.isRead ? 'text-white' : 'text-slate-300'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                    <p className="text-slate-400 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {formatTime(notification.createdAt)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        className="p-2 hover:bg-slate-700 rounded-lg transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

