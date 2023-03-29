import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
      user: process.env.gmail_username,
      pass: process.env.gmail_password,
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

export default async (req, res) => {
  console.log('post...');
  const {to, subject, text, html } = req.body;
  const mailData = {
      from: process.env.gmail_username,
      to: to,
      subject: subject,
      text: text,
      html: html,
  };

  transporter.sendMail(mailData, (error, info) => {
      if (error) {
          console.log(error);
          res.status(500).send(error);
      }
      res.status(200).send({ message: "Mail send", message_id: info.messageId });
  });
}
