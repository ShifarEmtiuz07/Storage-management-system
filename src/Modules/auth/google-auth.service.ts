// google-auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GoogleAuthService {
  async getGoogleOAuthUrl(): Promise<string> {
    const rootUrl = 'change your root url here'; 
    const options = {
      redirect_uri:'change your root uri here',     // process.env.GOOGLE_REDIRECT_URI
     client_id: 'change your client_id',                    //process.env.GOOGLE_CLIENT_ID
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };

    const params = new URLSearchParams(options);
    return `${rootUrl}?${params.toString()}`;
  }

  async getTokens(code: string) {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: 'change your client_id',
      client_secret: 'change your client_secret',
      redirect_uri: 'change your redirect uri', 
      grant_type: 'authorization_code',
    };

    const response = await axios.post(url, values, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  async getGoogleUserInfo(access_token: string) {
    const res = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return res.data;
  }

  async loginWithGoogle(code: string) {
    try {
      const { access_token } = await this.getTokens(code);
      const googleUser = await this.getGoogleUserInfo(access_token);

      // Simulate find or create user from DB (you should connect DB here)
      const user = {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      };

      // Sign your own JWT
      const token = jwt.sign(user,'change your jwt_secret' , { expiresIn: '7d' });  //process.env.JWT_SECRET

      return { user, token };
    } catch (err) {
      throw new UnauthorizedException('Google login failed');
    }
  }
}
