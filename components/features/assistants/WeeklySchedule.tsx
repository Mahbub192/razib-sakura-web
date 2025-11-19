'use client'

import { AssistantShift } from '@/types/assistants'

interface WeeklyScheduleProps {
  shifts: AssistantShift[]
  viewMode: 'day' | 'week' | 'month'
  onViewChange: (mode: 'day' | 'week' | 'month') => void
  selectedDate: Date
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  shifts,
  viewMode,
  onViewChange,
  selectedDate,
}) => {
  const hours = Array.from({ length: 9 }, (_, i) => i + 9) // 9 AM to 5 PM

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Weekly Schedule</h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2">
          {(['day', 'week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewChange(mode)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === mode
                  ? 'bg-primary-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 border rounded-lg overflow-hidden">
        <div className="flex">
          {/* Time column */}
          <div className="w-20 border-r">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b flex items-start justify-end pr-2 pt-1"
              >
                <span className="text-xs text-gray-500">
                  {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </span>
              </div>
            ))}
          </div>

          {/* Schedule grid */}
          <div className="flex-1">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-l"
              >
                {/* Shift blocks would be rendered here */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


