import { io } from "socket.io-client";
class SocketInstance {
  static socketInstance = null;

  static connectSocket(sub) {
    if (!this.socketInstance) {
      console.log(`the sub details is ${sub}`)
      this.socketInstance = io("http://localhost:4000", {
        auth:{
          sub
        }
      });
      console.log("Socket connected:", SocketInstance.socketInstance);
    }
  }

  static getInstance(sub) {
    if (!SocketInstance.socketInstance) {
      SocketInstance.connectSocket(sub);
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
