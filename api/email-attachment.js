import nodemailer from 'nodemailer';
//import { base64Image } from './../base64image.js';
import dotenv from 'dotenv';
import multiparty from 'multiparty';
import fs from 'fs';

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
    //const {to, subject, text, html, upload } = req.body;
    //console.log(attachments);
    const form = new multiparty.Form();
    let myFiles = [];
    form.parse(req, async (err, fields, files) => {
        const {to, subject, text, html } = fields;

        for (const file of files.upload) {
            //console.log(file);
            const source = fs.readFileSync(file.path);
            const fileName = file.originalFilename;
            const sourceBase64 = source.toString('base64');
            myFiles.push({
                filename: fileName,
                content: sourceBase64,
                encoding: 'base64'
            });
        }

        const mailData = {
            from: process.env.gmail_username,
            to: to[0],
            subject: subject[0],
            //text: text[0],
            html: html[0],
            attachments: myFiles
        };

        transporter.sendMail(mailData, (error, info) => {
            if (error) {
                return console.log(error);
            }
            res.status(200).send({ message: "Mail send", message_id: info.messageId });
        });

    });

    /*
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
                content: base64Image,
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

    */
}
