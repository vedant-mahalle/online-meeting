"use client"

import { useEffect, useRef, useState } from "react"
import type { Socket } from "socket.io-client"

export function usePeerConnection(meetingId: string, socket: Socket | null) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map())
  const localStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    initializeMedia()
    return () => {
      cleanup()
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("user-joined", handleUserJoined)
      socket.on("offer", handleOffer)
      socket.on("answer", handleAnswer)
      socket.on("ice-candidate", handleIceCandidate)
      socket.on("user-left", handleUserLeft)

      return () => {
        socket.off("user-joined")
        socket.off("offer")
        socket.off("answer")
        socket.off("ice-candidate")
        socket.off("user-left")
      }
    }
  }, [socket])

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setLocalStream(stream)
      localStreamRef.current = stream
    } catch (error) {
      console.error("Error accessing media devices:", error)
    }
  }

  const createPeerConnection = (peerId: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    })

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: peerId,
        })
      }
    }

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams
      setRemoteStreams((prev) => new Map(prev.set(peerId, remoteStream)))
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current!)
      })
    }

    peersRef.current.set(peerId, peerConnection)
    return peerConnection
  }

  const handleUserJoined = async (peerId: string) => {
    const peerConnection = createPeerConnection(peerId)

    try {
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      if (socket) {
        socket.emit("offer", {
          offer,
          to: peerId,
        })
      }
    } catch (error) {
      console.error("Error creating offer:", error)
    }
  }

  const handleOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
    const peerConnection = createPeerConnection(from)

    try {
      await peerConnection.setRemoteDescription(offer)
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      if (socket) {
        socket.emit("answer", {
          answer,
          to: from,
        })
      }
    } catch (error) {
      console.error("Error handling offer:", error)
    }
  }

  const handleAnswer = async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
    const peerConnection = peersRef.current.get(from)
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(answer)
      } catch (error) {
        console.error("Error handling answer:", error)
      }
    }
  }

  const handleIceCandidate = async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
    const peerConnection = peersRef.current.get(from)
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(candidate)
      } catch (error) {
        console.error("Error handling ICE candidate:", error)
      }
    }
  }

  const handleUserLeft = (peerId: string) => {
    const peerConnection = peersRef.current.get(peerId)
    if (peerConnection) {
      peerConnection.close()
      peersRef.current.delete(peerId)
    }
    setRemoteStreams((prev) => {
      const newMap = new Map(prev)
      newMap.delete(peerId)
      return newMap
    })
  }

  const startCall = () => {
    if (socket) {
      socket.emit("join-room", meetingId)
    }
  }

  const endCall = () => {
    cleanup()
    if (socket) {
      socket.emit("leave-room", meetingId)
    }
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
      }
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
      }
    }
  }

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0]
      peersRef.current.forEach((peerConnection) => {
        const sender = peerConnection.getSenders().find((s) => s.track && s.track.kind === "video")
        if (sender) {
          sender.replaceTrack(videoTrack)
        }
      })

      // Update local stream
      if (localStreamRef.current) {
        const oldVideoTrack = localStreamRef.current.getVideoTracks()[0]
        localStreamRef.current.removeTrack(oldVideoTrack)
        localStreamRef.current.addTrack(videoTrack)
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()))
      }

      videoTrack.onended = () => {
        stopScreenShare()
      }
    } catch (error) {
      console.error("Error starting screen share:", error)
    }
  }

  const stopScreenShare = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
      const videoTrack = videoStream.getVideoTracks()[0]

      // Replace screen share track with camera track
      peersRef.current.forEach((peerConnection) => {
        const sender = peerConnection.getSenders().find((s) => s.track && s.track.kind === "video")
        if (sender) {
          sender.replaceTrack(videoTrack)
        }
      })

      // Update local stream
      if (localStreamRef.current) {
        const oldVideoTrack = localStreamRef.current.getVideoTracks()[0]
        localStreamRef.current.removeTrack(oldVideoTrack)
        localStreamRef.current.addTrack(videoTrack)
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()))
      }
    } catch (error) {
      console.error("Error stopping screen share:", error)
    }
  }

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    peersRef.current.forEach((peerConnection) => {
      peerConnection.close()
    })
    peersRef.current.clear()
    setRemoteStreams(new Map())
  }

  return {
    localStream,
    remoteStreams,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
  }
}
