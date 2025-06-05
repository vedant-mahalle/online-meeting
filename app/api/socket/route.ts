import type { NextRequest } from "next/server"
import { Server as SocketIOServer } from "socket.io"
import { Server as HTTPServer } from "http"

let io: SocketIOServer

export async function GET(req: NextRequest) {
  if (!io) {
    const httpServer = new HTTPServer()
    io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id)

      socket.on("join-room", (meetingId: string) => {
        socket.join(meetingId)
        socket.to(meetingId).emit("user-joined", socket.id)

        // Send current participants list
        const participants = Array.from(io.sockets.adapter.rooms.get(meetingId) || [])
          .filter((id) => id !== socket.id)
          .map((id) => ({
            id,
            name: `Participant ${id.slice(0, 6)}`,
            isAudioMuted: false,
            isVideoOff: false,
          }))

        socket.emit("participants-list", participants)
      })

      socket.on("offer", ({ offer, to }) => {
        socket.to(to).emit("offer", { offer, from: socket.id })
      })

      socket.on("answer", ({ answer, to }) => {
        socket.to(to).emit("answer", { answer, from: socket.id })
      })

      socket.on("ice-candidate", ({ candidate, to }) => {
        socket.to(to).emit("ice-candidate", { candidate, from: socket.id })
      })

      socket.on("chat-message", (message) => {
        io.to(message.meetingId).emit("chat-message", {
          ...message,
          id: Date.now().toString(),
        })
      })

      socket.on("leave-room", (meetingId: string) => {
        socket.leave(meetingId)
        socket.to(meetingId).emit("user-left", socket.id)
      })

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
        // Notify all rooms that this user left
        socket.rooms.forEach((room) => {
          if (room !== socket.id) {
            socket.to(room).emit("user-left", socket.id)
          }
        })
      })
    })
  }

  return new Response("Socket.IO server initialized", { status: 200 })
}
