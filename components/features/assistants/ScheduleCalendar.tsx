'use client'

interface ScheduleCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Calendar</h2>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded">‹</button>
          <span className="px-4 py-1 text-gray-700 font-medium">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button className="p-1 hover:bg-gray-100 rounded">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
        {/* Calendar days would go here */}
        <div className="text-center text-gray-500 py-2">Calendar grid coming soon...</div>
      </div>
    </div>
  )
}


