// google-auth.controller.ts
import { Controller, Get, Query, Res, UnauthorizedException } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { Response } from 'express';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import * as qs from 'qs';
import { JwtService } from '@nestjs/jwt';


@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService, private readonly userService: UsersService,private readonly jwtService: JwtService,) {}

  @Get('login')
  async redirectToGoogle(@Res() res: Response) {
    console.log('got it')
    const url = await this.googleAuthService.getGoogleOAuthUrl();
    console.log(url)
    return res.redirect(url);
  }

  @Get('redirect')
  async googleCallback(@Query('code') code: string,) { //@Res() res: Response
    if (!code) throw new UnauthorizedException('No code provided');

     try {
      // Exchange code for tokens
      const { data: tokenData } = await axios.post(
        'https://oauth2.googleapis.com/token',
        qs.stringify({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: 'http://localhost:3000/api/v1/auth/google/redirect',
          grant_type: 'authorization_code',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const { access_token } = tokenData;

      // Fetch user info
      const { data: googleUser } = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      const user = await this.userService.createGoogleUser({
        id: googleUser.id,
        email: googleUser.email,
        username: googleUser.name,
        picture: googleUser.picture,
      });

      // Sign JWT
      const token = this.jwtService.sign({
        sub: user.id,
        username: user.username
      
      });

     return {message:'Sign up successful',access_token:token};
    } catch (err) {
      console.error('Google login failed:', err.response?.data || err.message);
      throw new UnauthorizedException('Google login failed');
    }

    
  }

  
}
