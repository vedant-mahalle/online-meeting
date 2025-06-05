"use client"

import type { RefObject } from "react"
import type { Participant } from "@/types"
import { Mic, MicOff, Video, VideoOff, User } from "lucide-react"

interface VideoGridProps {
  localVideoRef: RefObject<HTMLVideoElement>
  remoteStreams: Map<string, MediaStream>
  isVideoOff: boolean
  participants: Participant[]
}

export default function VideoGrid({ localVideoRef, remoteStreams, isVideoOff, participants }: VideoGridProps) {
  const totalParticipants = participants.length + 1 // +1 for local user

  const getGridClass = () => {
    if (totalParticipants === 1) return "grid-cols-1"
    if (totalParticipants === 2) return "grid-cols-1 md:grid-cols-2"
    if (totalParticipants <= 4) return "grid-cols-2"
    if (totalParticipants <= 6) return "grid-cols-2 md:grid-cols-3"
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  }

  return (
    <div className="flex-1 p-4">
      <div className={`grid ${getGridClass()} gap-4 h-full`}>
        {/* Local video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          {!isVideoOff ? (
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="bg-gray-700 rounded-full p-4">
                <User className="w-12 h-12 text-gray-300" />
              </div>
            </div>
          )}

          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 rounded px-2 py-1">
            <span className="text-white text-sm">You</span>
          </div>

          <div className="absolute bottom-2 right-2 flex gap-1">
            {isVideoOff ? <VideoOff className="w-4 h-4 text-red-400" /> : <Video className="w-4 h-4 text-green-400" />}
          </div>
        </div>

        {/* Remote videos */}
        {Array.from(remoteStreams.entries()).map(([peerId, stream]) => {
          const participant = participants.find((p) => p.id === peerId)
          return (
            <div key={peerId} className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                ref={(video) => {
                  if (video) video.srcObject = stream
                }}
              />

              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 rounded px-2 py-1">
                <span className="text-white text-sm">{participant?.name || "Participant"}</span>
              </div>

              <div className="absolute bottom-2 right-2 flex gap-1">
                {participant?.isAudioMuted ? (
                  <MicOff className="w-4 h-4 text-red-400" />
                ) : (
                  <Mic className="w-4 h-4 text-green-400" />
                )}
                {participant?.isVideoOff ? (
                  <VideoOff className="w-4 h-4 text-red-400" />
                ) : (
                  <Video className="w-4 h-4 text-green-400" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
