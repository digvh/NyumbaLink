// src/components/notification/NotificationBell.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import NotificationPanel from './NotificationPanel';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unread = useNotificationStore((s) => s.notifications.filter((n) => !n.read).length);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </div>
  );
}