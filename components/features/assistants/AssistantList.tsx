'use client'

import React from 'react'
import { Assistant } from '@/types/assistants'

interface AssistantListProps {
  assistants: Assistant[]
  selectedAssistants: string[]
  onToggleSelect: (assistantId: string) => void
}

export const AssistantList: React.FC<AssistantListProps> = ({
  assistants,
  selectedAssistants,
  onToggleSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Assistants</h2>
      <div className="space-y-3">
        {assistants.map((assistant) => (
          <div
            key={assistant.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {assistant.avatar ? (
                <img
                  src={assistant.avatar}
                  alt={assistant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {assistant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-gray-800 font-medium">{assistant.name}</p>
                <p className="text-sm text-gray-500">{assistant.role}</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedAssistants.includes(assistant.id)}
              onChange={() => onToggleSelect(assistant.id)}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

