// src/components/booking/AvailabilityCalendar.tsx
'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';
import {
  sameDay,
  isDateInPast,
  toDateKey,
} from '@/lib/booking';

interface AvailabilityCalendarProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onChange: (checkIn: Date | null, checkOut: Date | null) => void;
  /** Set of "YYYY-MM-DD" strings that are already booked */
  bookedDates: Set<string>;
  /** Min nights (default 1) */
  minNights?: number;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AvailabilityCalendar({
  checkIn,
  checkOut,
  onChange,
  bookedDates,
  minNights = 1,
}: AvailabilityCalendarProps) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const days = useMemo(() => buildMonthGrid(month), [month]);

  const handleClick = (date: Date) => {
    if (isDateInPast(date)) return;
    if (bookedDates.has(toDateKey(date))) return;

    // Start new selection
    if (!checkIn || (checkIn && checkOut)) {
      onChange(date, null);
      return;
    }

    // Selecting check-out
    if (checkIn && !checkOut) {
      if (date <= checkIn) {
        // Restart selection
        onChange(date, null);
        return;
      }
      // Check min nights
      const diffDays = Math.round(
        (date.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays < minNights) {
        // Ignore too-short selection
        return;
      }
      onChange(checkIn, date);
    }
  };

  const isSelected = (date: Date): boolean => {
    if (checkIn && sameDay(date, checkIn)) return true;
    if (checkOut && sameDay(date, checkOut)) return true;
    return false;
  };

  const isInRange = (date: Date): boolean => {
    if (!checkIn || !checkOut) return false;
    return date > checkIn && date < checkOut;
  };

  const isBooked = (date: Date): boolean => bookedDates.has(toDateKey(date));

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="font-bold text-gray-900 dark:text-white">
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </div>
        <button
          type="button"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold text-gray-500 dark:text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const past = isDateInPast(date);
          const booked = isBooked(date);
          const disabled = past || booked;
          const selected = isSelected(date);
          const inRange = isInRange(date);
          const today = sameDay(date, new Date());

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => handleClick(date)}
              disabled={disabled}
              className={cn(
                'aspect-square rounded-xl text-sm font-medium transition flex items-center justify-center relative',
                disabled &&
                  'text-gray-300 dark:text-gray-700 cursor-not-allowed line-through',
                !disabled && !selected && !inRange &&
                  'text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40',
                inRange && 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200',
                selected &&
                  'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30',
                today && !selected && 'ring-1 ring-indigo-400'
              )}
              aria-label={date.toDateString()}
            >
              {date.getDate()}
              {booked && !past && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gradient-to-br from-indigo-500 to-purple-500" />
          Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-indigo-100 dark:bg-indigo-950/60" />
          In range
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-400" />
          Booked
        </span>
      </div>
    </div>
  );
}

function buildMonthGrid(month: Date): (Date | null)[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d));
  // Pad to a multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}