
import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {createClient} from "redis"
import http from "http"
import { Server } from "socket.io";
import cors from "cors"
import { CallBack, GetUrl, UserLogOut } from "./user.controller.js";
import {oauthClient} from "./user.controller.js"
const app = express();
import cookieParser from "cookie-parser"
const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin :"*"
  }
}); 

  const MapUidAndUserId = new Map()

app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials : true
}));

app.use(cookieParser())
export const redis = createClient({
  url: 'redis://localhost:6379',
});


redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});


redis.on('connect', () => {
  console.log('Redis connected successfully');
});

(async () => {
  try {
    await redis.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();





oauthClient.on("tokens", (token)=>{
  // do the operations in the oauthclient to save the details 
  if(token.access_token){
    console.log(token.access_token)
  }
})



app.get("/", GetUrl)
app.get("/google/callback", CallBack)
app.post("/", AuthMiddleware,  UserLogOut);
import { INIT_CALL,
     INIT_CREATE_OFFER,
      RECEIVE_OFFER, 
      SEND_ANSWER
      , SEND_OFFER,
       RECEIVE_ANSWER,
        SEND_ICE_CANDIDATE,
         RECIEVE_ICE_CANDIDATE,
          CALL_ENDED,
           CALL_ENDED_BY_ANOTHER_USER 
        } from "./constants/constants.js";
import { AuthMiddleware } from "./user.middleware.js"


        io.use(async (socket, next) => {
          console.log(`IO Middleware is running`);
          const { sub } = socket.handshake.auth;
        
          console.log(`the sub details is ${sub}`);
          const findDetails = await redis.hGet("users", sub);
          console.log(findDetails);
        
          if (!findDetails) {
            return next(new Error(`Error in finding if the user is logged in`));
          }
        
          next();
        });
        



io.on("connection", (socket)=>{
  console.log(`User is connected successfully ${socket.id} `)

  socket.on(INIT_CALL, (message)=>{
    console.log(`Call is initialized`)
      console.log(message)
      socket.join(message.id)
      console.log(`Joined to socket id `)
      
      if(!MapUidAndUserId.get(message.id)){
         MapUidAndUserId.set(message.id,socket.id)
        console.log(`Added to the mapusers`)
        
        return ;
          
      }
      socket.to(MapUidAndUserId.get(message.id)).emit(INIT_CREATE_OFFER, {
        from : socket.id 
      })
  })


  socket.on(SEND_OFFER, (message)=>{
    
    console.log(`Send Offer is triggered ${message}`)

    socket.to(message.id).emit(RECEIVE_OFFER, {
      offer : message.offer,
    })
  })

  socket.on(SEND_ANSWER, (message)=>{
    console.log(`the answer was received ${message.answer}`)
    socket.to(message.id).emit(RECEIVE_ANSWER, {
      answer : message.answer
    })
  })

  socket.on(SEND_ICE_CANDIDATE, (message)=>{
    console.log(`the send ice candidate recieved ${message.icecandidate}`)
    socket.to(message.id).emit(RECIEVE_ICE_CANDIDATE,{
      icecandidate: message.icecandidate
    })
  })


  socket.on(CALL_ENDED, (message)=>{
        console.log(`Call ended mesage recieved `)
        socket.to(message.id).emit(CALL_ENDED_BY_ANOTHER_USER)
  })
}

)


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export {io}
