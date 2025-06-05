"use client"

import type { Participant } from "@/types"
import { Mic, MicOff, Video, VideoOff, User, X } from "lucide-react"

interface ParticipantsListProps {
  participants: Participant[]
  onClose: () => void
}

export default function ParticipantsList({ participants, onClose }: ParticipantsListProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Participants ({participants.length + 1})</h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Participants list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {/* Local user */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">You</p>
              <p className="text-sm text-gray-500">Host</p>
            </div>
            <div className="flex gap-1">
              <Mic className="w-4 h-4 text-green-500" />
              <Video className="w-4 h-4 text-green-500" />
            </div>
          </div>

          {/* Remote participants */}
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{participant.name}</p>
                <p className="text-sm text-gray-500">Participant</p>
              </div>
              <div className="flex gap-1">
                {participant.isAudioMuted ? (
                  <MicOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Mic className="w-4 h-4 text-green-500" />
                )}
                {participant.isVideoOff ? (
                  <VideoOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Video className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {participants.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>No other participants</p>
            <p className="text-sm">Share the meeting link to invite others</p>
          </div>
        )}
      </div>
    </div>
  )
}
