'use client'

import React, { useState } from 'react'
import { AssistantShift } from '@/types/assistants'

interface CreateShiftFormProps {
  onSubmit: (data: Omit<AssistantShift, 'id'>) => void
  onCancel: () => void
  assistants: Array<{ id: string; name: string }>
  clinics: Array<{ id: string; name: string }>
  resources: Array<{ id: string; name: string }>
}

export const CreateShiftForm: React.FC<CreateShiftFormProps> = ({
  onSubmit,
  onCancel,
  assistants,
  clinics,
  resources,
}) => {
  const [formData, setFormData] = useState({
    assistantId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    clinicLocation: '',
    associatedResources: [] as string[],
    recurrence: 'none' as 'none' | 'daily' | 'weekly',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      assistantId: formData.assistantId,
      date: new Date(formData.date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      clinicLocation: formData.clinicLocation,
      associatedResources: formData.associatedResources,
      status: 'scheduled',
      notes: formData.notes,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Appointment Slots</h2>
      <p className="text-gray-600 mb-6">
        Define and manage available time slots for patient appointments.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        {/* Slot Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slot Duration</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            defaultValue="20"
          >
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>

        {/* Start Time & End Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>

        {/* Recurrence */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recurrence</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="recurrence"
                value="none"
                checked={formData.recurrence === 'none'}
                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as any })}
                className="mr-2"
              />
              Does not repeat
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="recurrence"
                value="daily"
                checked={formData.recurrence === 'daily'}
                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as any })}
                className="mr-2"
              />
              Daily
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="recurrence"
                value="weekly"
                checked={formData.recurrence === 'weekly'}
                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as any })}
                className="mr-2"
              />
              Weekly
            </label>
          </div>
        </div>

        {/* Clinic Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Location</label>
          <select
            value={formData.clinicLocation}
            onChange={(e) => setFormData({ ...formData, clinicLocation: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Choose Clinic Name</option>
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Associated Resources */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Associated Resources
          </label>
          <select
            value={formData.associatedResources[0] || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                associatedResources: e.target.value ? [e.target.value] : [],
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select Resource</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Slots
          </button>
        </div>
      </form>
    </div>
  )
}


