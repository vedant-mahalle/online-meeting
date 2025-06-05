"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Video, MessageCircle, Share2 } from "lucide-react"

export default function HomePage() {
  const [meetingId, setMeetingId] = useState("")
  const router = useRouter()

  const generateMeetingId = () => {
    const id = Math.random().toString(36).substring(2, 15)
    setMeetingId(id)
  }

  const joinMeeting = () => {
    if (meetingId.trim()) {
      router.push(`/meeting/${meetingId}`)
    }
  }

  const startNewMeeting = () => {
    const id = Math.random().toString(36).substring(2, 15)
    router.push(`/meeting/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to MeetSpace</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with others through high-quality video calls, screen sharing, and real-time chat
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <button
              onClick={startNewMeeting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Video className="w-5 h-5" />
              Start New Meeting
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or join with ID</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter meeting ID"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && joinMeeting()}
                />
                <button
                  onClick={generateMeetingId}
                  className="px-4 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Generate random ID"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={joinMeeting}
                disabled={!meetingId.trim()}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Join Meeting
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">HD Video Calls</h3>
            <p className="text-gray-600">Crystal clear video and audio with multiple participants</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Screen Sharing</h3>
            <p className="text-gray-600">Share your screen with one click for presentations</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-600">Stay connected with instant messaging during calls</p>
          </div>
        </div>
      </div>
    </div>
  )
}
