import axios from 'axios';

 export const exchangeCodeForTokens = async (code) => {
  try {
    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK, 
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error('Failed to exchange code for tokens:', error.response?.data || error.message);
    throw new Error('Token exchange failed');
  }
};
