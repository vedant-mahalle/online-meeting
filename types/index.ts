export interface Participant {
  id: string
  name: string
  isAudioMuted: boolean
  isVideoOff: boolean
}

export interface ChatMessage {
  id: string
  text: string
  sender: string
  timestamp: Date
  meetingId: string
}
