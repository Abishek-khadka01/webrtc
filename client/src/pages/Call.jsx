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
import useUserStore from '../context/user.context';

function Call() {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const { id } = useParams();
  const manuallyEnded = useRef(false);
  const socket = SocketInstance.getInstance(useUserStore.getState().sub);
  const peerInstance = PeerService.getPeer();
  console.log(useUserStore.getState().sub)

  const GetUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.onloadedmetadata = () => {
          localVideoRef.current.play().catch(e => console.error('Local video playback failed:', e));
        };
      }

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
      console.log("🔔 ontrack event fired", event);
      const [stream] = event.streams;
      if (stream) {
        console.log("✅ Remote stream received");
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play().catch(e => console.error('Remote video playback failed:', e));
          };
        }
      } else {
        console.warn("❌ No remote stream found");
      }
    };
  };

  const endCall = () => {
    SocketInstance.emitEvent(CALL_ENDED, { id });
    manuallyEnded.current = true;
    cleanup();
    navigate('/dashboard');
  };

  const cleanup = () => {
    localStream?.getTracks().forEach(track => track.stop());
    remoteStream?.getTracks().forEach(track => track.stop());
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (socket.connected) socket.disconnect();
  };

  useEffect(() => {
    SocketInstance.connectSocket(useUserStore.getState().sub);
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

    socket.on("connect_error", (error)=>{
      alert(`Login again ${error}`)
      navigate("/login")
      
    })

    socket.on(RECEIVE_OFFER, async ({ offer }) => {
      console.log("📨 Received offer");
      await onOfferReceive(offer);
    });

    socket.on(RECEIVE_ANSWER, async ({ answer }) => {
      console.log("📨 Received answer");
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

    socket.on(CALL_ENDED_BY_ANOTHER_USER, () => {
      alert("The call was ended by the other user.");
      navigate("/dashboard");
    });

    return () => {
      socket.off(INIT_CREATE_OFFER);
      socket.off(RECEIVE_OFFER);
      socket.off(RECEIVE_ANSWER);
      socket.off(RECIEVE_ICE_CANDIDATE);
    };
  }, [socket]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: 'black' }}>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          backgroundColor: 'black'
        }}
      />
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '25%',
          bottom: '20px',
          right: '20px',
          borderRadius: '10px',
          border: '2px solid white',
          backgroundColor: 'black'
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '15px',
        zIndex: 2,
      }}>
        <button style={buttonStyle}>Audio</button>
        <button style={buttonStyle}>Video</button>
        <button style={buttonStyle}>Share Screen</button>
        <button style={{ ...buttonStyle, backgroundColor: '#e74c3c' }} onClick={endCall}>End Call</button>
      </div>
      {/* Debug */}
      {remoteStream ? (
        <p style={debugText}>✅ Remote stream active</p>
      ) : (
        <p style={{ ...debugText, color: 'red' }}>❌ Remote stream missing</p>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '10px 16px',
  backgroundColor: '#2c3e50',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  cursor: 'pointer',
};

const debugText = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  color: 'lime',
  background: 'rgba(0,0,0,0.6)',
  padding: '4px 8px',
  borderRadius: '5px',
  fontSize: '13px',
  zIndex: 3
};

export default Call;
