"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

export function useSocket(meetingId: string) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketInstance = io(process.env.NODE_ENV === "production" ? "" : "http://localhost:3000", {
      path: "/api/socket",
    })

    socketInstance.on("connect", () => {
      console.log("Connected to socket server")
      socketInstance.emit("join-room", meetingId)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [meetingId])

  const sendMessage = (message: string) => {
    if (socket) {
      socket.emit("chat-message", {
        text: message,
        meetingId,
        sender: "You",
        timestamp: new Date(),
      })
    }
  }

  return { socket, sendMessage }
}
