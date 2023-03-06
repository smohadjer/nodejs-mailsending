const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const image = require('./base64image.js');

const app = express();
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();

const port = process.env.PORT || 5000;

app.use('/v1', route);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: process.env.gmail_username,
        pass: process.env.gmail_password,
    },
    secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

route.post('/text-mail', (req, res) => {
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
            return console.log(error);
        }
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
    });
});


route.post('/attachments-mail', (req, res) => {
    const {to, subject, text, html } = req.body;
    const mailData = {
        from: process.env.gmail_username,
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments: [
            {   // file on disk as an attachment
                filename: 'nodemailer.png',
                path: 'nodemailer.png'
            },
            {   // file on disk as an attachment
                filename: 'text_file.txt',
                path: 'text_file.txt'
            },
            {   // encoded string as an attachment
                filename: 'cat.jpg',
                content: image.base64Image,
                encoding: 'base64'
            }
        ]
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
    });
});
