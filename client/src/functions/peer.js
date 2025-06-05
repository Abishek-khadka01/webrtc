class PeerService {
  peer = null ;
   static createPeer = ()=> {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
    console.log(`Peer instance is created `)
  }

    static createOfferRTC =async  ()=>{
      const offer = await this.peer.createOffer()
      return offer;
    }
  

    static getPeer = ()=>{
      if(!this.peer){
        this.createPeer()
      }
      return this.peer
    }

    static CreateAnswer =async (offer)=>{
      console.log("the offer recieved is ",offer)
      if(offer){
        const answer = await this.peer.createAnswer()
        console.log(`the answer is ${answer}`)
        return answer
      }
    }

      
}

export  default  PeerService
