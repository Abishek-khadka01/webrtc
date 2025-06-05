import React, { useEffect, useRef, useState } from 'react';
import SocketInstance from "../functions/socket";
import { useNavigate, useParams } from 'react-router-dom';
import {
  INIT_CALL,
  INIT_CREATE_OFFER,
  RECEIVE_ANSWER,
  RECIEVE_ICE_CANDIDATE,
  SEND_ANSWER,
  SEND_ICE_CANDIDATE,
  SEND_OFFER,
  RECEIVE_OFFER,
  CALL_ENDED,
  CALL_ENDED_BY_ANOTHER_USER
} from '../constants';
import PeerService from "../functions/peer";

function Call() {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const { id } = useParams();
  const manuallyEnded = useRef(false);
  const socket = SocketInstance.getInstance();
  const peerInstance = PeerService.getPeer();

  const GetUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.onloadedmetadata = () => {
          localVideoRef.current?.play().catch(e => console.error('Local video playback failed:', e));
        };
      }

      // Add tracks to peer instance
      stream.getTracks().forEach(track => {
        peerInstance.addTrack(track, stream);
      });

    } catch (err) {
      console.error("Failed to get user media", err);
      alert("Camera/Microphone access denied");
      navigate('/');
    }
  };

  const CreateCall = async () => {
    try {
      const offer = await PeerService.createOfferRTC();
      await peerInstance.setLocalDescription(offer);
      socket.emit(SEND_OFFER, { offer, id });
    } catch (err) {
      console.error("Create offer failed", err);
    }
  };

  const onOfferReceive = async (offer) => {
    try {
      await peerInstance.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await PeerService.CreateAnswer(offer);
      await peerInstance.setLocalDescription(answer);
      socket.emit(SEND_ANSWER, { answer, id });
    } catch (err) {
      console.error("Handle offer failed", err);
    }
  };

  const setupPeerListeners = () => {
    peerInstance.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit(SEND_ICE_CANDIDATE, { icecandidate: event.candidate, id });
      }
    };

    peerInstance.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) {
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current?.play().catch(e => console.error('Remote video playback failed:', e));
          };
        }
      }
    };
  };

  const endCall = () => {
    SocketInstance.emitEvent(CALL_ENDED, {
      id 
    })
    manuallyEnded.current = true;
    cleanup();
    navigate('/');
  };

  const cleanup = () => {
    localStream?.getTracks().forEach(track => track.stop());
    remoteStream?.getTracks().forEach(track => track.stop());
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (socket.connected) socket.disconnect();
  };

  useEffect(() => {
    SocketInstance.connectSocket();
    GetUserMedia().then(() => {
      setupPeerListeners();
      socket.emit(INIT_CALL, { id });
    });

    const handleBeforeUnload = () => cleanup();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanup();
    };
  }, []);

  useEffect(() => {
    socket.on(INIT_CREATE_OFFER, CreateCall);

    socket.on(RECEIVE_OFFER, async ({ offer }) => {
      await onOfferReceive(offer);
    });

    socket.on(RECEIVE_ANSWER, async ({ answer }) => {
      try {
        await peerInstance.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.error("Set remote answer failed", err);
      }
    });

    socket.on(RECIEVE_ICE_CANDIDATE, async ({ icecandidate }) => {
      try {
        await peerInstance.addIceCandidate(new RTCIceCandidate(icecandidate));
      } catch (err) {
        console.error("Add ICE candidate failed", err);
      }
    });

    socket.on(CALL_ENDED_BY_ANOTHER_USER, ()=>{
        alert(`the call ended by another user`)
        navigate("/")
    })

    return () => {
      socket.off(INIT_CREATE_OFFER);
      socket.off(RECEIVE_OFFER);
      socket.off(RECEIVE_ANSWER);
      socket.off(RECIEVE_ICE_CANDIDATE);
    };
  }, [socket]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>In Call</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '300px', backgroundColor: 'black', borderRadius: '10px' }} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px', backgroundColor: 'black', borderRadius: '10px' }} />
      </div>
      <br />
      <button onClick={endCall} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', borderRadius: '5px' }}>
        End Call
      </button>
    </div>
  );
}

export default Call;
