import {OAuth2Client} from "google-auth-library"
import dotenv from "dotenv"
import { exchangeCodeForTokens } from "./sample.js"
dotenv.config()
import { redis } from "./server.js"
import jwt from "jsonwebtoken"
import { FRONTEND_URL } from "./constants/constants.js"
export const oauthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID ,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK

)


export const GetUrl = async (req , res)=>{
    try {
        const url =oauthClient.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: [
              'https://www.googleapis.com/auth/userinfo.email',
              'https://www.googleapis.com/auth/userinfo.profile'
            ]
          });
          

        console.log(url)

        res.status(200).json({
            success : true,
            message : url
        })

    


    } catch (error) {
        console.log(`Error in getting the url ${error}`)
        res.status(500).json({
            success :false,
            message : error
        })
    }


}



export const CallBack = async(req ,res)=>{
    try {
        
        const {code} = req.query;

        console.log(code)
        
        if(!code){
            console.warn(`No tokens found `)
            throw new Error(`NO code found `)
        }

        const result = await exchangeCodeForTokens(code)
        console.log(result)
    const {access_token, refresh_token } = result;
            res.cookie("accessToken", access_token, {
                httpOnly : true,
                secure : true,
                maxAge : 1000*60*60*24
            }).cookie("refreshToken", refresh_token, {
                httpOnly : true,
                secure : true,
                maxAge : 1000*60*60*24
            })

            console.log(result.id_token)

            const {sub , email , picture , name } =  jwt.decode(result.id_token)

            await redis.hSet("users", sub, refresh_token)

            console.log(await redis.hGet("users", sub))

            res.redirect(`${FRONTEND_URL}/google?sub=${sub}&email=${email}&picture=${picture}&name=${name}`);



    } catch (error) {
        console.log(`Error in the callback ${error}`)
        res.status(500).json({
            success : false,
            message : error
        })   
    }



}

export const UserLogOut = async (req, res) => {
  try {
    console.log(`User LogOut is running ${req.accessToken}`);
    
    const { sub } = req.body;
    console.log(sub);

    if (!sub) {
      return res.status(400).json({
        success: false,
        message: 'NO proper information',
      });
    }

    const findUser = await redis.hGet('users', sub);
    console.log(`the find users is ${findUser}`);

    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: 'Improper details',
      });
    }

    await oauthClient.revokeToken(req.accessToken);
    await redis.hDel('users', sub);

    return res.status(200).json({
      success: true,
      message: 'user Logout successfully',
    });
  } catch (error) {
    console.log(`ERROR IN LOGGING OUT THE USER ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error in logging out the user, ${error.message}`,
    });
  }
};



