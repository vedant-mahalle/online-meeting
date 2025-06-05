"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import VideoGrid from "./VideoGrid"
import ChatPanel from "./ChatPanel"
import ControlBar from "./ControlBar"
import ParticipantsList from "./ParticipantsList"
import { usePeerConnection } from "@/hooks/usePeerConnection"
import { useSocket } from "@/hooks/useSocket"
import type { Participant } from "@/types"

interface MeetingRoomProps {
  meetingId: string
}

export default function MeetingRoom({ meetingId }: MeetingRoomProps) {
  const router = useRouter()
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const localVideoRef = useRef<HTMLVideoElement>(null)

  const { socket, sendMessage } = useSocket(meetingId)
  const {
    localStream,
    remoteStreams,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
  } = usePeerConnection(meetingId, socket)

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (socket) {
      socket.on("participant-joined", (participant: Participant) => {
        setParticipants((prev) => [...prev, participant])
      })

      socket.on("participant-left", (participantId: string) => {
        setParticipants((prev) => prev.filter((p) => p.id !== participantId))
      })

      socket.on("participants-list", (participantsList: Participant[]) => {
        setParticipants(participantsList)
      })

      socket.on("chat-message", (message: any) => {
        setMessages((prev) => [...prev, message])
      })

      return () => {
        socket.off("participant-joined")
        socket.off("participant-left")
        socket.off("participants-list")
        socket.off("chat-message")
      }
    }
  }, [socket])

  const handleToggleAudio = () => {
    toggleAudio()
    setIsAudioMuted(!isAudioMuted)
  }

  const handleToggleVideo = () => {
    toggleVideo()
    setIsVideoOff(!isVideoOff)
  }

  const handleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare()
      setIsScreenSharing(false)
    } else {
      startScreenShare()
      setIsScreenSharing(true)
    }
  }

  const handleEndCall = () => {
    endCall()
    router.push("/")
  }

  const handleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/meeting/${meetingId}`
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 flex">
        {/* Main video area */}
        <div className="flex-1 flex flex-col">
          <VideoGrid
            localVideoRef={localVideoRef}
            remoteStreams={remoteStreams}
            isVideoOff={isVideoOff}
            participants={participants}
          />

          <ControlBar
            isAudioMuted={isAudioMuted}
            isVideoOff={isVideoOff}
            isScreenSharing={isScreenSharing}
            onToggleAudio={handleToggleAudio}
            onToggleVideo={handleToggleVideo}
            onScreenShare={handleScreenShare}
            onEndCall={handleEndCall}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
            onFullscreen={handleFullscreen}
            onCopyLink={copyMeetingLink}
            meetingId={meetingId}
          />
        </div>

        {/* Sidebar panels */}
        {isChatOpen && (
          <ChatPanel messages={messages} onSendMessage={sendMessage} onClose={() => setIsChatOpen(false)} />
        )}

        {isParticipantsOpen && (
          <ParticipantsList participants={participants} onClose={() => setIsParticipantsOpen(false)} />
        )}
      </div>
    </div>
  )
}
