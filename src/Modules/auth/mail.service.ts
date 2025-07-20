import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shifarcls@gmail.com',
      pass: 'nlvt clha kejt jfbi',
    },
  });

  async sendOtpEmail(email: string, otp: string) {
    const mailOptions = {
      from: 'shifarcls@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
