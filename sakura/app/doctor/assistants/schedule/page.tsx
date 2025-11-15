export default function AssistantSchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Assistant Schedule Management</h1>
            <p className="text-gray-600 mt-2">Manage assistant shifts and schedules</p>
          </div>
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            + Add Shift
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Widget */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendar</h2>
            <p className="text-gray-500">Calendar widget coming soon...</p>
          </div>

          {/* Assistants List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Assistants</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <span className="text-gray-800">Assistant Name</span>
                </div>
                <input type="checkbox" className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Weekly Schedule</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border rounded">Day</button>
                <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded">Week</button>
                <button className="px-3 py-1 text-sm border rounded">Month</button>
              </div>
            </div>
            <p className="text-gray-500">Schedule timeline coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}


