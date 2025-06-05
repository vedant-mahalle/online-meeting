"use client"

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Phone,
  MessageCircle,
  Users,
  Maximize,
  Copy,
} from "lucide-react"

interface ControlBarProps {
  isAudioMuted: boolean
  isVideoOff: boolean
  isScreenSharing: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onScreenShare: () => void
  onEndCall: () => void
  onToggleChat: () => void
  onToggleParticipants: () => void
  onFullscreen: () => void
  onCopyLink: () => void
  meetingId: string
}

export default function ControlBar({
  isAudioMuted,
  isVideoOff,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onScreenShare,
  onEndCall,
  onToggleChat,
  onToggleParticipants,
  onFullscreen,
  onCopyLink,
  meetingId,
}: ControlBarProps) {
  return (
    <div className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-white text-sm">Meeting ID: {meetingId}</span>
        <button
          onClick={onCopyLink}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title="Copy meeting link"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Audio toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-3 rounded-lg transition-colors ${
            isAudioMuted ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
          title={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video toggle */}
        <button
          onClick={onToggleVideo}
          className={`p-3 rounded-lg transition-colors ${
            isVideoOff ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        {/* Screen share */}
        <button
          onClick={onScreenShare}
          className={`p-3 rounded-lg transition-colors ${
            isScreenSharing ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
          title={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
        </button>

        {/* Chat */}
        <button
          onClick={onToggleChat}
          className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          title="Toggle chat"
        >
          <MessageCircle className="w-5 h-5" />
        </button>

        {/* Participants */}
        <button
          onClick={onToggleParticipants}
          className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          title="Show participants"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={onFullscreen}
          className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          title="Toggle fullscreen"
        >
          <Maximize className="w-5 h-5" />
        </button>

        {/* End call */}
        <button
          onClick={onEndCall}
          className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors ml-4"
          title="End call"
        >
          <Phone className="w-5 h-5 rotate-[135deg]" />
        </button>
      </div>
    </div>
  )
}
