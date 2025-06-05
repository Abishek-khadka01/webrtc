import { io } from "socket.io-client";

class SocketInstance {
  static socketInstance = null;

  static connectSocket() {
    if (!this.socketInstance) {
      this.socketInstance = io("http://localhost:4000");
      console.log("Socket connected:", SocketInstance.socketInstance);
    }
  }

  static getInstance() {
    if (!SocketInstance.socketInstance) {
      SocketInstance.connectSocket();
    }
    return SocketInstance.socketInstance;
  }

  static emitEvent(eventName, message) {
    console.log(this.socketInstance)
    
    
    if (this.socketInstance) {
      this.socketInstance.emit(eventName, message);
    } else {
      console.warn("Socket not connected. Cannot emit:", eventName);
    }
  }
}

export default SocketInstance;
